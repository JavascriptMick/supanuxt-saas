import Stripe from 'stripe';
import UserAccountService from '~~/lib/services/user.account.service';
import prisma_client from '~~/prisma/prisma.client';

const config = useRuntimeConfig();
const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2022-11-15' });

export default defineEventHandler(async (event) => {
  const stripeSignature = getRequestHeader(event, 'stripe-signature');
  if(!stripeSignature){
    throw createError({ statusCode: 400, statusMessage: 'Webhook Error: No stripe signature in header' });
  }

  const rawBody = await readRawBody(event)
  if(!rawBody){
    throw createError({ statusCode: 400, statusMessage: 'Webhook Error: No body' });
  }
  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, stripeSignature, config.stripeEndpointSecret);
  }
  catch (err) {
    console.log(err);
    throw createError({ statusCode: 400, statusMessage: `Webhook Error` }); // ${(err as Error).message}
  }

  console.log(`****** Web Hook Recieved (${stripeEvent.type}) ******`);
  
  if(stripeEvent.type && stripeEvent.type.startsWith('customer.subscription')){
    let subscription  = stripeEvent.data.object as Stripe.Subscription;

    const userService = new UserAccountService(prisma_client);
    
    let current_period_ends: Date = new Date(subscription.current_period_end * 1000);
    current_period_ends.setDate(current_period_ends.getDate() + config.subscriptionGraceDays);

    console.log(`updating stripe sub details subscription.current_period_end:${subscription.current_period_end}, subscription.id:${subscription.id}`);
    userService.updateStripeSubscriptionDetailsForAccount(subscription.customer.toString(), subscription.id, current_period_ends)
  }
  return `handled ${stripeEvent.type}.`;
});
import Stripe from 'stripe';
import AccountService from '~~/lib/services/account.service';

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
    throw createError({ statusCode: 400, statusMessage: `Error validating Webhook Event` });
  }

  if(stripeEvent.type && stripeEvent.type.startsWith('customer.subscription')){
    console.log(`****** Web Hook Recieved (${stripeEvent.type}) ******`);

    let subscription  = stripeEvent.data.object as Stripe.Subscription;
    if(subscription.status == 'active'){
      const sub_item = subscription.items.data.find(item => item?.object && item?.object == 'subscription_item')
      
      const stripe_product_id = sub_item?.plan.product?.toString(); // TODO - is the product ever a product object and in that case should I check for deleted?
      if(!stripe_product_id){
        throw createError({ statusCode: 400, statusMessage: `Error validating Webhook Event` });
      }
  
      const accountService = new AccountService();
      
      let current_period_ends: Date = new Date(subscription.current_period_end * 1000);
      current_period_ends.setDate(current_period_ends.getDate() + config.subscriptionGraceDays);
  
      console.log(`updating stripe sub details subscription.current_period_end:${subscription.current_period_end}, subscription.id:${subscription.id}, stripe_product_id:${stripe_product_id}`);
      accountService.updateStripeSubscriptionDetailsForAccount(subscription.customer.toString(), subscription.id, current_period_ends, stripe_product_id);
    }
  }
  return `handled ${stripeEvent.type}.`;
});
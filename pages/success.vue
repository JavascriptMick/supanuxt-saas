<script setup lang="ts">
import Stripe from 'stripe';
const config = useRuntimeConfig();
const stripe = new Stripe(config.stripeSecretKey, { apiVersion: '2022-11-15' });
const route = useRoute();
let customer:  Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>
try{
  const session = await stripe.checkout.sessions.retrieve(route?.query?.session_id as string);
  customer = await stripe.customers.retrieve(session?.customer as string);
} catch(e) {
  console.log(`Error ${e}`)
}
</script>

<template>
  <div>
    <p>
      <span v-if="!customer.deleted">We appreciate your business {{customer.name}}!</span>
      <span v-if="customer.deleted">It appears your stripe customer information has been deleted!</span>
    </p>
    <p>Checkout our reasonable <NuxtLink to="/pricing">Pricing</NuxtLink></p>
  </div>
</template>
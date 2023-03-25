<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  const store = useAppStore();
  const { activeMembership } = storeToRefs(store);
  const config = useRuntimeConfig();

  function formatDate(date: Date | undefined){
    if(!date){ return ""; }
    return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
  }
</script>
<template>
  <div>
    <h3>Account</h3>
    <p>Name: {{ activeMembership?.account.name }}</p>
    <p>Current Period Ends: {{ formatDate(activeMembership?.account.current_period_ends) }}</p>
    <p>Permitted Features: {{ activeMembership?.account.features }}</p>
    <p>Maximum Notes: {{ activeMembership?.account.max_notes }}</p>
    <p>Maximum Members: {{ activeMembership?.account.max_members }}</p>
    <p>Access Level: {{ activeMembership?.access }}</p>
    <p>Plan: {{ activeMembership?.account.plan_name }}</p>
    
    <template v-if="config.public.debugMode">
      <p>******* Debug *******</p>
      <p>Account ID: {{ activeMembership?.account.id }}</p>
      <p>Plan Id: {{ activeMembership?.account.plan_id }}</p>
      <p>Stripe Subscription Id: {{ activeMembership?.account.stripe_subscription_id }}</p>
      <p>Stripe Customer Id: {{ activeMembership?.account.stripe_customer_id }}</p>
      <p>Membership Id: {{ activeMembership?.id }}</p>
      <p>User Id: {{ activeMembership?.user_id }}</p>
    </template>
  </div>
</template>

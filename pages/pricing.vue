<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ACCOUNT_ACCESS } from '@prisma/client';

  const store = useAppStore()
  const { activeMembership } = storeToRefs(store);

</script>
<template>
  <div>
    <h3>Pricing</h3>
    <div>
      <label for="submit">Free Trial (1 Month)</label>
      <NuxtLink to="/dashboard">Continue to Dashboard</NuxtLink>
    </div>

    <form action="/create-checkout-session" method="POST">
      <label for="submit">Individual Plan, Normal Price</label>
      <input type="hidden" name="price_id" value="price_1MpOiwJfLn4RhYiLqfy6U8ZR" />
      <input type="hidden" name="account_id" :value="activeMembership?.account_id" />
      
      <button type="submit" :disabled="!activeMembership || (activeMembership.access !== ACCOUNT_ACCESS.OWNER && activeMembership.access !== ACCOUNT_ACCESS.ADMIN)">Checkout</button>
    </form>

    <form action="/create-checkout-session" method="POST">
      <label for="submit">Team Plan, Normal Price</label>
      <input type="hidden" name="price_id" value="price_1MpOjtJfLn4RhYiLsjzAso90" />
      <input type="hidden" name="account_id" :value="activeMembership?.account_id" />

      <button type="submit" :disabled="!activeMembership || (activeMembership.access !== ACCOUNT_ACCESS.OWNER && activeMembership.access !== ACCOUNT_ACCESS.ADMIN)">Checkout</button>
    </form>
  </div>
</template>

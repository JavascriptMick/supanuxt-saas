<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ACCOUNT_ACCESS } from '@prisma/client';

  const store = useAppStore()
  const { activeMembership } = storeToRefs(store);

</script>
<template>
  <div>
    <h3>Pricing</h3>
    <form action="/create-checkout-session" method="POST">
      <label for="submit">Individual Plan, Normal Price</label>
      <input type="hidden" name="price_id" value="price_1MfaKVJfLn4RhYiLgruKo89E" />
      <input type="hidden" name="account_id" :value="activeMembership?.account_id" />
      
      <button type="submit" :disabled="!activeMembership || (activeMembership.access !== ACCOUNT_ACCESS.OWNER && activeMembership.access !== ACCOUNT_ACCESS.ADMIN)">Checkout</button>
    </form>

    <form action="/create-checkout-session" method="POST">
      <label for="submit">Team Plan, Normal Price</label>
      <input type="hidden" name="price_id" value="price_1MfaM6JfLn4RhYiLPdr1OTDS" />
      <input type="hidden" name="account_id" :value="activeMembership?.account_id" />

      <button type="submit" :disabled="!activeMembership || (activeMembership.access !== ACCOUNT_ACCESS.OWNER && activeMembership.access !== ACCOUNT_ACCESS.ADMIN)">Checkout</button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ACCOUNT_ACCESS } from '@prisma/client';

  const accountStore = useAccountStore()
  const { activeMembership } = storeToRefs(accountStore);

  onMounted(async () => {
    await accountStore.init();
  });
</script>
<template>
  <div>
    <h3>Pricing</h3>
    <p>Current Plan: {{ activeMembership?.account.plan_name }}</p>
    <div>
      <label for="submit">Free Trial (1 Month)</label>
      <ul>
        <li>10 Notes</li>
        <li>Single User</li>
      </ul>
      <NuxtLink v-if="activeMembership && (activeMembership?.account.plan_name === 'Free Trial')" to="/dashboard">&nbsp;Continue to Dashboard</NuxtLink>
    </div>

    <form action="/create-checkout-session" method="POST">
      <label for="submit">Individual Plan, Normal Price</label>
      <ul>
        <li>100 Notes</li>
        <li>Single User</li>
      </ul>

      <input type="hidden" name="price_id" value="price_1MpOiwJfLn4RhYiLqfy6U8ZR" />
      <input type="hidden" name="account_id" :value="activeMembership?.account_id" />
      
      <span v-if="!activeMembership">&nbsp;<NuxtLink to="/signup">Sign Up</NuxtLink>&nbsp;</span>
      <button type="submit" v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access !== ACCOUNT_ACCESS.ADMIN) && (activeMembership?.account.plan_name !== 'Individual Plan')">Checkout</button>
    </form>

    <form action="/create-checkout-session" method="POST">
      <label for="submit">Team Plan, Normal Price</label>
      <ul>
        <li>200 Notes</li>
        <li>Up to 10 Team Members</li>
      </ul>

      <input type="hidden" name="price_id" value="price_1MpOjtJfLn4RhYiLsjzAso90" />
      <input type="hidden" name="account_id" :value="activeMembership?.account_id" />

      <span v-if="!activeMembership">&nbsp;<NuxtLink to="/signup">Sign Up</NuxtLink>&nbsp;</span>
      <button type="submit" v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN) && (activeMembership?.account.plan_name !== 'Team Plan')">Checkout</button>
    </form>
  </div>
</template>

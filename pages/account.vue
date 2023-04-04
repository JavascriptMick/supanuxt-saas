<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ACCOUNT_ACCESS } from '@prisma/client';

  const authStore = useAuthStore();
  const { activeMembership } = storeToRefs(authStore);
  const accountStore = useAccountStore();
  const { activeAccountMembers } = storeToRefs(accountStore)

  const config = useRuntimeConfig();
  const newAccountName = ref("");

  watchEffect(async () => {
    if (activeMembership.value) {
      await accountStore.getActiveAccountMembers();
    }
  })

  function formatDate(date: Date | undefined){
    if(!date){ return ""; }
    return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
  }
</script>
<template>
  <div>
    <h3>Account</h3>
    <p>Name: {{ activeMembership?.account.name }} <span v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access !== ACCOUNT_ACCESS.ADMIN)"><input v-model="newAccountName" placeholder="Enter New Name"/><button @click.prevent="accountStore.changeAccountName(newAccountName)">Change Name</button></span></p>
    <p>Current Period Ends: {{ formatDate(activeMembership?.account.current_period_ends) }}</p>
    <p>Permitted Features: {{ activeMembership?.account.features }}</p>
    <p>Maximum Notes: {{ activeMembership?.account.max_notes }}</p>
    <p>Maximum Members: {{ activeMembership?.account.max_members }}</p>
    <p>Access Level: {{ activeMembership?.access }}</p>
    <p>Plan: {{ activeMembership?.account.plan_name }}</p>

    <h4>Members</h4>
    <ul>
      <li v-for="accountMember in activeAccountMembers">{{ accountMember.user.display_name }}</li>
    </ul>
    
    <template v-if="config.public.debugMode">
      <p>******* Debug *******</p>
      <p>Account ID: {{ activeMembership?.account.id }}</p>
      <p>Plan Id: {{ activeMembership?.account.plan_id }}</p>
      <p>Stripe Subscription Id: {{ activeMembership?.account.stripe_subscription_id }}</p>
      <p>Stripe Customer Id: {{ activeMembership?.account.stripe_customer_id }}</p>
      <p>Membership Id: {{ activeMembership?.id }}</p>
      <p>User Id: {{ activeMembership?.user_id }}</p>
    </template>

    <button @click.prevent="accountStore.changeAccountPlan(2)">Change active Account Plan to 2</button>
    <button @click.prevent="accountStore.joinUserToAccount(4)">Join user 4 to active account</button>
    <button @click.prevent="accountStore.changeUserAccessWithinAccount(4, 'OWNER')">Change user 4 access within account 5 to OWNER (SHOULD FAIL)</button>
    <button @click.prevent="accountStore.changeUserAccessWithinAccount(4, 'ADMIN')">Change user 4 access within account 5 to ADMIN</button>
    <button @click.prevent="accountStore.claimOwnershipOfAccount()">Claim Ownership of current account for current user</button>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ACCOUNT_ACCESS } from '@prisma/client';

  const authStore = useAuthStore();
  const { activeMembership } = storeToRefs(authStore);
  const accountStore = useAccountStore();
  const { activeAccountMembers } = storeToRefs(accountStore)

  const config = useRuntimeConfig();
  const newAccountName = ref("");

  onMounted(async () => {
    await authStore.initUser();
  });
  
  watchEffect(async () => {
    if (activeMembership.value) {
      await accountStore.getActiveAccountMembers();
    }
  })

  function formatDate(date: Date | undefined){
    if(!date){ return ""; }
    return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
  }

  function joinURL(){
    return `${config.public.siteRootUrl}/join/${activeMembership.value?.account.join_password}`;
  }

</script>
<template>
  <div>
    <h3>Account</h3>
    <p>Name: {{ activeMembership?.account.name }}&nbsp;<span v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN)"><input v-model="newAccountName" placeholder="Enter New Name"/><button @click.prevent="accountStore.changeAccountName(newAccountName)">Change Name</button></span></p>
    <p>Current Period Ends: {{ formatDate(activeMembership?.account.current_period_ends) }}</p>
    <p>Permitted Features: {{ activeMembership?.account.features }}</p>
    <p>Maximum Notes: {{ activeMembership?.account.max_notes }}</p>
    <p>Maximum Members: {{ activeMembership?.account.max_members }}</p>
    <p>Access Level: {{ activeMembership?.access }} <span v-if="activeMembership && activeMembership.access === ACCOUNT_ACCESS.ADMIN"><button @click.prevent="accountStore.claimOwnershipOfAccount()">Claim Ownership of Account</button></span></p>
    <p>Plan: {{ activeMembership?.account.plan_name }}</p>
    <p>Join Link: <pre>{{ joinURL() }}</pre>&nbsp;<span v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN)"><button @click.prevent="accountStore.rotateJoinPassword()">Generate New Join Link</button></span></p>

    <h4>Members</h4>
    <ul>
      <li v-for="accountMember in activeAccountMembers">
        {{ accountMember.user.display_name }}
        ({{ accountMember.user.email }})
        [{{ accountMember.access }}]
        <span v-if="accountMember.pending">(pending)</span>
        <span v-if="accountMember.pending && activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN)"><button @click.prevent="accountStore.acceptPendingMembership(accountMember.id)">Accept Pending Membership</button></span>
        <span v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN) && accountMember.access === ACCOUNT_ACCESS.READ_ONLY"><button @click.prevent="accountStore.changeUserAccessWithinAccount(accountMember.user.id, ACCOUNT_ACCESS.READ_WRITE)">Promote to Read/Write</button></span>
        <span v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN) && accountMember.access === ACCOUNT_ACCESS.READ_WRITE"><button @click.prevent="accountStore.changeUserAccessWithinAccount(accountMember.user.id, ACCOUNT_ACCESS.ADMIN)">Promote to Admin</button></span>
      </li>
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

    
    
  </div>
</template>

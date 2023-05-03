<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ACCOUNT_ACCESS } from '~~/prisma/account-access-enum';

  const accountStore = useAccountStore();
  const { activeMembership, activeAccountMembers } = storeToRefs(accountStore)

  const config = useRuntimeConfig();
  const newAccountName = ref("");

  onMounted(async () => {
    await accountStore.init();
    await accountStore.getActiveAccountMembers();
  });

  function formatDate(date: Date | undefined) {
    if (!date) { return ""; }
    return new Intl.DateTimeFormat('default', { dateStyle: 'long' }).format(date);
  }

  function joinURL() {
    return `${config.public.siteRootUrl}/join/${activeMembership.value?.account.join_password}`;
  }
</script>
<template>
  <div class="container mx-auto p-6">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-4">Account Information
      </h2>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex gap-4 items-center">
        <span class="font-bold w-32">Account Name:</span>
        <span>{{ activeMembership?.account.name }}</span>
        <template
          v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN)">
          <input v-model="newAccountName" type="text" class="p-2 border border-gray-400 rounded w-1/3"
            placeholder="Enter new name">
          <button @click.prevent="accountStore.changeAccountName(newAccountName)"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Change Name</button>
        </template>
      </div>

      <div class="flex gap-4 items-center">
        <span class="font-bold w-32">Current Period Ends:</span>
        <span>{{ formatDate(activeMembership?.account.current_period_ends) }}</span>
      </div>

      <div class="flex gap-4 items-center">
        <span class="font-bold w-32">Permitted Features:</span>
        <div class="flex flex-wrap gap-2">
          <span v-for="feature in activeMembership?.account.features"
            class="bg-gray-200 text-gray-700 font-semibold py-1 px-2 rounded-full">{{ feature }}</span>
        </div>
      </div>

      <div class="flex gap-4 items-center">
        <span class="font-bold w-32">Maximum Notes:</span>
        <span>{{ activeMembership?.account.max_notes }}</span>
      </div>

      <div class="flex gap-4 items-center">
        <span class="font-bold w-32">Maximum Members:</span>
        <span>{{ activeMembership?.account.max_members }}</span>
      </div>

      <div class="flex gap-4 items-center">
        <span class="font-bold w-32">Access Level:</span>
        <span class="bg-green-500 text-white font-semibold py-1 px-2 rounded-full">{{ activeMembership?.access }}</span>
        <button @click.prevent="accountStore.claimOwnershipOfAccount()"
          v-if="activeMembership && activeMembership.access === ACCOUNT_ACCESS.ADMIN "
          class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
          Claim Ownership
        </button>
      </div>

      <div class="flex gap-4 items-center">
        <span class="font-bold w-32">Plan:</span>
        <span>{{ activeMembership?.account.plan_name }}</span>
      </div>

      <div class="flex gap-4 items-center">
        <span class="font-bold w-32">Join Link:</span>
        <div class="flex gap-2 items-center">
          <input disabled type="text" class="p-2 border border-gray-400 rounded w-full" :value="joinURL()">
          <button @click.prevent="accountStore.rotateJoinPassword()"
            v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN)"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">ReGen</button>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-lg font-bold">Members</h2>
        <div class="flex flex-col gap-2">
          <div v-for="accountMember in activeAccountMembers" class="flex gap-4 items-center">
            <span>{{ accountMember.user.display_name }}</span>
            <span class="bg-green-500 text-white font-semibold py-1 px-2 rounded-full">{{ accountMember.access }}</span>
            <span class="text-gray-500">({{ accountMember.user.email }})</span>
            <button @click.prevent="accountStore.acceptPendingMembership(accountMember.id)"
              v-if="accountMember.pending && activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN)"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
              Accept Pending Membership
            </button>
            <button @click.prevent="accountStore.rejectPendingMembership(accountMember.id)"
              v-if="accountMember.pending && activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN)"
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
              Reject Pending Membership
            </button>
            <button @click.prevent="accountStore.changeUserAccessWithinAccount(accountMember.user.id, ACCOUNT_ACCESS.READ_WRITE)"
              v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.OWNER || activeMembership.access === ACCOUNT_ACCESS.ADMIN) && accountMember.access === ACCOUNT_ACCESS.READ_ONLY && !accountMember.pending"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
              Promote to Read/Write
            </button>
            <button @click.prevent="accountStore.changeUserAccessWithinAccount(accountMember.user.id, ACCOUNT_ACCESS.ADMIN)"
              v-if="activeMembership && activeMembership.access === ACCOUNT_ACCESS.OWNER && accountMember.access === ACCOUNT_ACCESS.READ_WRITE && !accountMember.pending"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
              Promote to Admin
            </button>
            <button @click.prevent="accountStore.deleteMembership(accountMember.id)"
              v-if="activeMembership && activeMembership.access === ACCOUNT_ACCESS.OWNER && accountMember.access !== ACCOUNT_ACCESS.OWNER && !accountMember.pending"
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
              Remove
            </button>
          </div>
        </div>
      </div>
  </div>
</div></template>

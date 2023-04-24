<script setup lang="ts">
  import { AccountWithMembers } from '~~/lib/services/service.types';

  const route = useRoute();
  const { join_password }: { join_password?: string } = route.params;

  const accountStore = useAccountStore();

  const { $client } = useNuxtApp();
  // this could probably be an elegant destructure here but I lost patience
  let account: AccountWithMembers | undefined;
  if (join_password) {
    const result = await $client.account.getAccountByJoinPassword.useQuery({ join_password });
    account = result.data.value?.account;
  }

  const { data: dbUser } = await $client.auth.getDBUser.useQuery();

  async function doJoin() {
    if (account) {
      await accountStore.joinUserToAccountPending(account.id);
      navigateTo('/dashboard', {replace: true})
    } else {
      console.log(`Unable to Join`)
    }
  }
</script>
<template>
  <div class="py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <h2 class="text-3xl font-extrabold text-gray-900">Request to Join {{ account?.name }}</h2>
      <template v-if="dbUser?.dbUser">
        <p class="mt-2 text-sm text-gray-500">
          Click below to request to Join the team. 
          Your request to join will remain as 'Pending' 
          untill the team administrators complete their review.</p>
          <p class="mt-2 text-sm text-gray-500">
          If your requeste is approved, you will become a member of the team and 
          will be able to switch to the team account at any time in order to share
          the benefits of the team plan.
        </p>
        <div class="mt-6">
          <button @click.prevent="doJoin()" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                            shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Join
          </button>
        </div>
      </template>
      <template v-else>
        <p class="m-5 text-sm text-gray-500">Only signed in users can join a team.  Please either Signup or Signin and then return to this page using the join link.</p>
        <button @click.prevent="navigateTo('/signup')" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                            shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign Up
        </button>
        <div class="m-10"></div>
        <button @click.prevent="navigateTo('/signin')" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                            shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign In
        </button>
      </template>
    </div>
  </div>
</template>

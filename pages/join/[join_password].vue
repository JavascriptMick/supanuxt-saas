<script setup lang="ts">
  import { AccountWithMembers } from '~~/lib/services/service.types';

  const route = useRoute();
  const {join_password} : {join_password?: string} = route.params;

  const { $client } = useNuxtApp();

  // this could probably be an elegant destructure here but I lost patience
  let account: AccountWithMembers | undefined;
  if(join_password){
    const result = await $client.account.getAccountByJoinPassword.useQuery({join_password});
    account = result.data.value?.account;
  }

  const { data: dbUser } = await $client.auth.getDBUser.useQuery();

  async function doJoin(){
    if(dbUser.value?.dbUser && account){
      await $client.account.joinUserToAccountPending.useQuery({account_id: account.id, user_id: dbUser.value.dbUser.id});
    } else {
      console.log(`Unable to Join`)
    }
  }
</script>
<template>
  <div>
    <div v-if="account">
      <h3>Join {{ account?.name }}</h3>
      
      <div v-if="dbUser?.dbUser">
        <button @click.prevent="doJoin()">Join</button>
      </div>
      <div v-else>
        <NuxtLink to="/signup">Sign up to Join team</NuxtLink>
        <p>or</p>
        <NuxtLink to="/signin">Sign in to Join team</NuxtLink>
      </div>
    </div>
    <div v-else>
      <h3>This does not appear to be a valid Join Link.  Please ask a Team administrator to re-generate and resend the Join link.</h3>
    </div>
  </div>
</template>

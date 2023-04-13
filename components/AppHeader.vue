<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const supabase = useSupabaseAuthClient();
  const user = useSupabaseUser();
  const accountStore = useAccountStore()
  const { dbUser, activeAccountId } = storeToRefs(accountStore);

  onMounted(async () => {
    await accountStore.init()
  });

  async function signout() {
    await supabase.auth.signOut();
    if(accountStore){
      accountStore.signout();
    }
    navigateTo('/', {replace: true});
  }
</script>

<template>
  <div>
    <h3>Nuxt 3 Boilerplate - To the Moon!</h3>
    <div>
      <span v-if="!user"><NuxtLink to="/">Nuxt 3 Boilerplate</NuxtLink>&nbsp;|&nbsp;</span>
      <span><NuxtLink to="/pricing">Pricing</NuxtLink></span>
      <span v-if="user">&nbsp;|&nbsp;<NuxtLink to="/dashboard">Dashboard</NuxtLink></span>
      <span v-if="user">&nbsp;|&nbsp;<NuxtLink to="/account">Account</NuxtLink></span>
      <span v-if="!user">&nbsp;|&nbsp;<NuxtLink to="/signin">Sign In</NuxtLink></span>
      <span v-if="user">&nbsp;|&nbsp;<a href="#" @click.prevent="signout()">Sign out</a></span>
      <span v-if="user">&nbsp;|&nbsp;logged in as: {{ user.email }}</span>
    </div>

    <!-- Account Switching -->
    <p v-if="dbUser?.memberships && dbUser?.memberships.length > 1">
      <span>Switch Account.. </span>
      <button :disabled="membership.pending" v-for="membership in dbUser?.memberships" @click="accountStore.changeActiveAccount(membership.account_id)">
        {{ membership.account.name }}
        <span v-if="membership.pending">(pending)</span>
        <span v-if="membership.account_id === activeAccountId">*</span>
      </button>
    </p>
    <hr>
  </div>
</template>

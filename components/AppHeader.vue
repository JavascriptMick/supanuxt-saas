<script setup lang="ts">
  import {  MembershipWithAccount } from '~~/lib/services/user.account.service';
  import { storeToRefs } from 'pinia';

  const supabase = useSupabaseAuthClient();
  const user = useSupabaseUser();
  const authStore = useAuthStore()
  const { activeMembership } = storeToRefs(authStore);

  const { $client } = useNuxtApp();

  const { data: dbUser } = await $client.auth.getDBUser.useQuery();

  onMounted(async () => {
    await authStore.initUser();
  });

  async function signout() {
    await supabase.auth.signOut();
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
    <p v-if="(dbUser?.dbUser?.memberships) && (dbUser.dbUser.memberships.length > 1)">
      <span>Switch Account.. </span>
      <button v-for="membership in dbUser?.dbUser.memberships" @click="authStore.changeActiveMembership(((membership as unknown) as MembershipWithAccount))"> <!-- This cast is infuriating -->
        {{ membership.account.name }}
        <span v-if="membership.account_id === activeMembership?.account_id">*</span>
      </button>
    </p>
    <hr>
  </div>
</template>

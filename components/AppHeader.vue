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
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li v-if="user"><NuxtLink to="/dashboard">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/pricing">Pricing</NuxtLink></li>
          <li v-if="!user"><NuxtLink to="/signin">Sign In</NuxtLink></li>
        </ul>
      </div>
      <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">Nuxt3 SAAS Boilerplate</NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li v-if="user"><NuxtLink to="/dashboard">Dashboard</NuxtLink></li>
        <li><NuxtLink to="/pricing">Pricing</NuxtLink></li>
        <li v-if="!user"><NuxtLink to="/signin">Sign In</NuxtLink></li>
      </ul>
    </div>
    <div class="navbar-end" v-if="user">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">

            <img :src="user.user_metadata.avatar_url" />
          </div>
        </label>
        <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
          <li v-if="user">{{ user.email }}</li>
          <li><NuxtLink to="/account">Account</NuxtLink></li>
          <li><a href="#" @click.prevent="signout()">logout</a></li>
          <template v-if="dbUser?.memberships && dbUser?.memberships.length > 1">
          <li>Switch Account</li>
          <li v-for="membership in dbUser?.memberships" :disabled="membership.pending">
            <a v-if="membership.account_id !== activeAccountId" href="#" @click="accountStore.changeActiveAccount(membership.account_id)">{{ membership.account.name }}<span v-if="membership.pending">(pending)</span></a>
          </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

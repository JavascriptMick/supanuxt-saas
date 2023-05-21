<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const supabase = useSupabaseAuthClient();
  const user = useSupabaseUser();
  const accountStore = useAccountStore()
  const { dbUser, activeAccountId } = storeToRefs(accountStore);
  const notifyStore = useNotifyStore();
  const { notifications } = storeToRefs(notifyStore);

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
    <div class="toast toast-end toast-top">
      <div v-for="notification in notifications" :class="notification.type">
        <div>
          <button 
            @click.prevent="notifyStore.removeNotification(notification)"
            type="button" 
            class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" 
            aria-label="Close">
            <span class="sr-only">Close</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
          <span>&nbsp;{{notification.message}}</span>
        </div>
      </div>
    </div>
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
        <li v-if="!user"><NuxtLink to="/signup">Start for free</NuxtLink></li>
        <li v-if="!user"><a title="github" href="https://github.com/JavascriptMick/nuxt3-boilerplate"><Icon name="mdi:github"/></a></li>
      </ul>
    </div>
    <div class="navbar-end" v-if="user">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img v-if="user.user_metadata.avatar_url" :src="user.user_metadata.avatar_url" alt="avatar image"/>
            <img v-else src="~/assets/images/avatar.svg" alt="default avatar image"/>
          </div>
        </label>
        <ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
          <li v-if="user">{{ user.email }}</li>
          <li><NuxtLink to="/account">Account</NuxtLink></li>
          <li><a href="#" @click.prevent="signout()">Signout</a></li>
          <template v-if="dbUser?.memberships && dbUser?.memberships.length > 1">
          <li>Switch Account</li>
          <li v-for="membership in dbUser?.memberships">
            <a v-if="membership.account_id !== activeAccountId  && !membership.pending"  href="#" @click="accountStore.changeActiveAccount(membership.account_id)">{{ membership.account.name }}</a>
            <span v-if="membership.pending">{{ membership.account.name }} (pending)</span>
          </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const supabase = useSupabaseAuthClient();
const user = useSupabaseUser();
const store = useAppStore()
const { activeMembership } = storeToRefs(store);

const { $client } = useNuxtApp();

const { data: dbUser } = await $client.userAccount.getDBUser.useQuery();

async function signout() {
  await supabase.auth.signOut();
  navigateTo('/', {replace: true});
}
</script>

<template>
  <div>
    <h3>Nuxt 3 Boilerplate - AppHeader</h3>
    <div v-if="user">logged in as: {{ user.email }}: <button @click="signout()">Sign Out</button></div>
    <div v-if="!user">Not Logged in</div>
    <button v-for="membership in dbUser?.dbUser.memberships" @click="store.changeActiveMembership(membership)">{{ membership.account_id }}<span v-if="membership.account_id === activeMembership?.account_id">*</span></button>
    <hr>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseAuthClient();
const user = useSupabaseUser();
const theAppState = appState();

const { $client } = useNuxtApp();

const { data: dbUser } = await $client.userAccount.getDBUser.useQuery();

if(!theAppState.value.activeMembership && dbUser.value?.dbUser.memberships && dbUser.value?.dbUser.memberships.length > 0) {
  const defaultMembership = dbUser.value?.dbUser.memberships[0];
  theAppState.value.activeMembership = defaultMembership;
}

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
    <button v-for="membership in dbUser?.dbUser.memberships" @click="theAppState.activeMembership = membership">{{ membership.account_id }}</button>
    <p>Active ->{{ theAppState.activeMembership?.account_id }}</p>
    <hr>
  </div>
</template>

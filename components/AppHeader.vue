<script setup lang="ts">
const supabase = useSupabaseAuthClient();
const user = useSupabaseUser();

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
    <hr>
  </div>
</template>

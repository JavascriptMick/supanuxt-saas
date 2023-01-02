<script setup lang="ts">
const supabase = useSupabaseAuthClient();
const user = await useSupabaseUser();
const email = (user.value)?user.value.email:null;

async function signout() {
  const { error } = await supabase.auth.signOut()
  navigateTo('/');
}
</script>

<template>
  <div>
    <h3>Authenticated Header</h3>
    <div v-if="email">logged in as: {{ email }}: <button @click="signout()">Sign Out</button></div>
    <div v-if="!email">Not Logged in</div>
    <hr>
    <slot />
    <hr>
    <h4>Authenticated Footer</h4>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
  });

  const supabase = useSupabaseAuthClient();

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    navigateTo('dashboard'); // This doesn't work, it navigates prior to the login handshake completing and then the handshake lands on the index page and ignores the middleware.
  }
</script>

<template>
  <div>
    Login
    <button @click="signInWithGoogle()">Sign In with Google</button>
  </div>
</template>

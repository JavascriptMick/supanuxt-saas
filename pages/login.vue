<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
  });

  const supabase = useSupabaseAuthClient();

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }
</script>

<template>
  <div>
    Login
    <button @click="signInWithGoogle()">Sign In with Google</button>
  </div>
</template>

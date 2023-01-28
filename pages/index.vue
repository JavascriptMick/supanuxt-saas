<script setup lang="ts">
  const user = useSupabaseUser()
  const supabase = useSupabaseClient();
  watchEffect(() => {
    if (user.value) {
      navigateTo('/dashboard', {replace: true})
    }
  })
</script>
<template>
  <div>
    <h3>Index</h3>
    <button @click="supabase.auth.signInWithOAuth({provider: 'google'})">Sign In with Google</button>
  </div>
</template>

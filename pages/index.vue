<script setup lang="ts">
  const user = useSupabaseUser()
  const supabase = useSupabaseAuthClient();
  watchEffect(() => {
    if (user.value) {
      navigateTo('/dashboard', {replace: true})
    }
  })
</script>
<template>
  <div>
    <h3>Index</h3>
    <button @click="supabase.auth.signInWithOAuth({provider: 'google'})">Connect with Google</button>
  </div>
</template>

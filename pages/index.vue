<script setup lang="ts">
  const user = useSupabaseUser()
  watchEffect(() => {
    if (user.value) {
      navigateTo('/dashboard', {replace: true})
    }
  })
</script>
<template>
  <div>
    <h3>Index</h3>
    Nuxt 3 (SAAS) Boilerplate is very nice, why don't you <NuxtLink to="/signup">Get Started</NuxtLink>
  </div>
</template>

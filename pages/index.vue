<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
  });

  //horrible horrible kludge from https://github.com/nuxt-modules/supabase/issues/28#issuecomment-1353070523
  const user = useSupabaseUser();
  watchEffect(async () => {
    if (user.value) await navigateTo("dashboard");
  });  
</script>
<template>
  <div>
    <h3>Index</h3>
    <NuxtLink to="/login">Login</NuxtLink>
  </div>
</template>

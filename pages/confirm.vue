<script setup lang="ts">
  const user = useSupabaseUser();
  watch(
    user,
    () => {
      if (user.value) {
        return navigateTo('/dashboard');
      }
    },
    { immediate: true }
  );
</script>
<template>
  <div>Logging you in...</div>
</template>

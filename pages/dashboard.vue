<script setup lang="ts">
  const user = await useSupabaseUser();
  definePageMeta({
    middleware: ['auth'],
  });
</script>
<template>
  <div>
    <h3>{{ user?.user_metadata.full_name }}'s Dashboard</h3>
    <div>Stuff</div>
  </div>
</template>

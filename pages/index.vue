<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});
</script>
<template>
  <div>
    <h3>Index</h3>
    <NuxtLink to="/login">Login</NuxtLink>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
    layout: "authenticated",
  });
</script>
<template>
  <div>
    <h3>Dashboard</h3>
  </div>
</template>

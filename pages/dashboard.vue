<script setup lang="ts">
  const user = await useSupabaseUser();
  definePageMeta({
    middleware: ['auth'],
  });

  const notes = await $fetch('/api/notes')  
</script>
<template>
  <div>
    <h3>{{ user?.user_metadata.full_name }}'s Dashboard</h3>
    <p v-for="note in notes">{{ note.note_text }}</p><!-- TODO - wtf.. typing-->
    <div>Stuff</div>
  </div>
</template>

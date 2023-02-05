<script setup lang="ts">
  const user = await useSupabaseUser();
  definePageMeta({
    middleware: ['auth'],
  });

  const { $client } = useNuxtApp()
  const { data: notes } = await $client.notes.useQuery({ text: 'client' })
  
</script>
<template>
  <div>
    <h3>{{ user?.user_metadata.full_name }}'s Notes Dashboard</h3>
    <p v-for="note in notes?.notes">{{ note.note_text }}</p>
  </div>
</template>

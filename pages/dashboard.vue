<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  definePageMeta({
    middleware: ['auth'],
  });

  const notesStore = useNotesStore();
  const { notes } = storeToRefs(notesStore);  // ensure the notes list is reactive

  onMounted(async () => {
    await notesStore.fetchNotesForCurrentUser();
  });  
</script>
<template>
  <div>
    <h3>Notes Dashboard</h3>
    <p v-for="note in notes">{{ note.note_text }}</p>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  definePageMeta({
    middleware: ['auth'],
  });

  const notesStore = useNotesStore();
  const { notes } = storeToRefs(notesStore);  // ensure the notes list is reactive
  const newNoteText = ref('')

  async function addNote(){
    await notesStore.createNote(newNoteText.value)
    newNoteText.value = '';
  }

  onMounted(async () => {
    await notesStore.fetchNotesForCurrentUser();
  });  
</script>
<template>
  <div>
    <h3>Notes Dashboard</h3>
    <p v-for="note in notes">{{ note.note_text }} <button @click.prevent="notesStore.deleteNote(note.id)">-</button></p>
    <p><input v-model="newNoteText"/><button @click.prevent="addNote()">Add</button></p>
  </div>
</template>

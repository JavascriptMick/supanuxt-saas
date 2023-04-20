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
  <div class="flex flex-col">
    <h1 class="text-primary text-2xl">Notes Dashboard</h1>

    <div class="flex flex-wrap">
      <div class="card w-96 bg-base-100 shadow-xl" v-for="note in notes">
        <div class="card-body">
          <p>{{ note.note_text }}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm" @click.prevent="notesStore.deleteNote(note.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div class="p-500">
      <input type="text" class="input w-full max-w-xs" placeholder="Enter a Note" v-model="newNoteText"/>
      <button @click.prevent="addNote()" class="btn btn-primary">Add</button>
    </div>
  </div>
</template>

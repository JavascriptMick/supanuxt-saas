<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ACCOUNT_ACCESS } from '@prisma/client';

  definePageMeta({
    middleware: ['auth'],
  });

  const accountStore = useAccountStore();
  const { activeMembership } = storeToRefs(accountStore)  
  const notesStore = useNotesStore();
  const { notes } = storeToRefs(notesStore);  // ensure the notes list is reactive
  const newNoteText = ref('')

  async function addNote(){
    await notesStore.createNote(newNoteText.value)
    newNoteText.value = '';
  }

  onMounted(async () => {
    await accountStore.init();
    await notesStore.fetchNotesForCurrentUser();
  });  
</script>
<template>
  <div class="flex flex-col items-center max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-4">Notes Dashboard</h2>
    </div>
    
    <div class="w-full max-w-md mb-8">
      <div v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.READ_WRITE || activeMembership.access === ACCOUNT_ACCESS.ADMIN || activeMembership.access === ACCOUNT_ACCESS.OWNER)" class="flex flex-row">
        <input v-model="newNoteText" type="text" class="w-full rounded-l-md py-2 px-4 border-gray-400 border-2 focus:outline-none focus:border-blue-500" placeholder="Add a note...">
        <button @click.prevent="addNote()" type="button"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline-blue">
          Add
        </button>
      </div>
    </div>

    <div class="w-full max-w-md">
      <div v-for="note in notes" class="bg-white rounded-lg shadow-lg text-center px-6 py-8 md:mx-4 md:my-4">
        <p class="text-gray-600 mb-4">{{ note.note_text }}</p>
        <button @click.prevent="notesStore.deleteNote(note.id)" 
          v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.ADMIN || activeMembership.access === ACCOUNT_ACCESS.OWNER)"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

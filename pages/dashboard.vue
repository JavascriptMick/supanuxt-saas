<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ACCOUNT_ACCESS } from '~~/prisma/account-access-enum';

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

  async function genNote(){
    const genNoteText = await notesStore.generateAINoteFromPrompt(newNoteText.value)
    newNoteText.value = genNoteText;
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
    
    <div v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.READ_WRITE || activeMembership.access === ACCOUNT_ACCESS.ADMIN || activeMembership.access === ACCOUNT_ACCESS.OWNER)" class="w-full max-w-md mx-auto mb-3">
      <textarea v-model="newNoteText" type="text" class="w-full rounded-l-md py-2 px-4 border-gray-400 border-2 focus:outline-none focus:border-blue-500" rows="5" placeholder="Add a note..."/>
      <div class="flex justify-evenly">
        <button @click.prevent="addNote()" type="button"
          class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
          Add
        </button>
        <button v-if="activeMembership.account.features.includes('SPECIAL_FEATURE')"  @click.prevent="genNote()" type="button"
          class="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
          Gen
          <Icon name="mdi:magic" class="h-6 w-6"/>
        </button>
      </div>
    </div>

    <div class="w-full max-w-md">
      <div v-for="note in notes" class="bg-white rounded-lg shadow-lg text-center px-6 py-8 md:mx-4 md:my-4">
        <p class="text-gray-600 mb-4">{{ note.note_text }}</p>
        <button @click.prevent="notesStore.deleteNote(note.id)" 
          v-if="activeMembership && (activeMembership.access === ACCOUNT_ACCESS.ADMIN || activeMembership.access === ACCOUNT_ACCESS.OWNER)"
          class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

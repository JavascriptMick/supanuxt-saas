import { Note } from ".prisma/client"
import { defineStore } from "pinia"

import { useAuthStore } from './auth.store'

interface State {
  notes: Note[]
}

export const useNotesStore = defineStore('notes', {
  state: (): State => {
    return {
      notes: [],
    }
  },
  actions: {
    async fetchNotesForCurrentUser() {
      const authStore = useAuthStore();

      if(!authStore.activeMembership) { return; }

      const { $client } = useNuxtApp();
      const { notes } = await $client.notes.getForCurrentUser.query({account_id: authStore.activeMembership.account_id});
      if(notes){
        this.notes = notes;
      }  
    },
  }
});

import { Note } from ".prisma/client"
import { defineStore } from "pinia"

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
      const { $client } = useNuxtApp();
      const { notes } = await $client.notes.getForCurrentUser.query();
      if(notes){
        this.notes = notes;
      }  
    },
  }
});

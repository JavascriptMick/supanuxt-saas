import { Membership, Note, User } from ".prisma/client"
import { defineStore } from "pinia"
export type DBUser = User & { memberships: Membership[]; }

interface State {
  dbUser?: DBUser
  activeMembership: Membership | null
  notes: Note[]
}

export const useAppStore = defineStore('app', {
  state: (): State => {
    return {
      notes: [],
      activeMembership: null
    }
  },
  actions: {
    async initUser() {
      const { $client } = useNuxtApp();
      const { data: dbUser } = await $client.userAccount.getDBUser.useQuery();
      if(dbUser.value?.dbUser){
        this.dbUser = dbUser.value.dbUser;
        if(dbUser.value.dbUser.memberships.length > 0){
          this.activeMembership = dbUser.value.dbUser.memberships[0];
          await this.fetchNotesForCurrentUser();
        }
      }
    },
    async fetchNotesForCurrentUser() {
      if(!this.activeMembership) {
        return; 
      }

      const { $client } = useNuxtApp();
      const { data: foundNotes } = await $client.notes.getForCurrentUser.useQuery({account_id: this.activeMembership.account_id});
      if(foundNotes.value?.notes){
        this.notes = foundNotes.value.notes;
      }  
    },
    async changeActiveMembership(membership: Membership) {
      if(membership !== this.activeMembership){
        this.activeMembership = membership;
        await this.fetchNotesForCurrentUser();
      }
    }, 
  }
});

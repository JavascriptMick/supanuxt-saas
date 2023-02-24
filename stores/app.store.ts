import { ACCOUNT_ACCESS, Note } from ".prisma/client"
import { defineStore } from "pinia"
import { FullDBUser, MembershipWithAccount } from "~~/lib/services/user.account.service"

interface State {
  dbUser?: FullDBUser
  activeMembership: MembershipWithAccount | null
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
      if(!this.activeMembership) { return; }

      const { $client } = useNuxtApp();
      const { data: foundNotes } = await $client.notes.getForCurrentUser.useQuery({account_id: this.activeMembership.account_id});
      if(foundNotes.value?.notes){
        this.notes = foundNotes.value.notes;
      }  
    },
    async changeActiveMembership(membership: MembershipWithAccount) {
      if(membership !== this.activeMembership){
        this.activeMembership = membership;
        await this.fetchNotesForCurrentUser();
      }
    },
    async changeAccountPlan(plan_id: number){
      if(!this.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: account } = await $client.userAccount.changeAccountPlan.useQuery({account_id: this.activeMembership.account_id, plan_id});
      if(account.value?.account){
        this.activeMembership.account = account.value.account;
      }
    },
    async joinUserToAccount(user_id: number){
      if(!this.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: membership } = await $client.userAccount.joinUserToAccount.useQuery({account_id: this.activeMembership.account_id, user_id});
      if(membership.value?.membership){
        this.activeMembership = membership.value.membership;
      }
    },
    async changeUserAccessWithinAccount(user_id: number, access: ACCOUNT_ACCESS){
      if(!this.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: membership } = await $client.userAccount.changeUserAccessWithinAccount.useQuery({account_id: this.activeMembership.account_id, user_id, access});
      if(membership.value?.membership){
        this.activeMembership = membership.value.membership;
      }
    },
    async claimOwnershipOfAccount(){
      if(!this.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: membership } = await $client.userAccount.claimOwnershipOfAccount.useQuery({account_id: this.activeMembership.account_id});
      if(membership.value?.membership){
        this.activeMembership = membership.value.membership;
      }
    }
  }
});

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
      if(!this.dbUser || !this.activeMembership){
        const { $client } = useNuxtApp();
        const { dbUser } = await $client.userAccount.getDBUser.query();

        if(dbUser){
          this.dbUser = dbUser;
          if(dbUser.memberships.length > 0){
            this.activeMembership = dbUser.memberships[0];
            await this.fetchNotesForCurrentUser();
          }
        }
      }
    },
    async fetchNotesForCurrentUser() {
      if(!this.activeMembership) { return; }

      const { $client } = useNuxtApp();
      const { notes } = await $client.notes.getForCurrentUser.query({account_id: this.activeMembership.account_id});
      if(notes){
        this.notes = notes;
      }  
    },
    async changeActiveMembership(membership: MembershipWithAccount) {
      if(membership !== this.activeMembership){
        this.activeMembership = membership;
        await this.fetchNotesForCurrentUser();
      }
    },
    async changeAccountName(new_name: string){
      if(!this.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: account } = await $client.userAccount.changeAccountName.useQuery({account_id: this.activeMembership.account_id, new_name});
      if(account.value?.account){
        this.activeMembership.account = account.value.account;
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

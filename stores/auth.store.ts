import { defineStore } from "pinia"
import { FullDBUser, MembershipWithAccount } from "~~/lib/services/service.types";

interface State {
  dbUser?: FullDBUser
  activeMembership: MembershipWithAccount | null
}

export const useAuthStore = defineStore('auth', {
  state: (): State => {
    return {
      activeMembership: null
    }
  },
  actions: {
    async initUser() {
      if(!this.dbUser || !this.activeMembership){
        const { $client } = useNuxtApp();
        const { dbUser } = await $client.auth.getDBUser.query();

        if(dbUser){
          this.dbUser = dbUser;
          const activeMemberships = dbUser.memberships.filter(m => !m.pending)
          if(activeMemberships.length > 0){
            this.activeMembership = activeMemberships[0];
          }
        }
      }
    },
    async changeActiveMembership(membership: MembershipWithAccount) {
      if(membership !== this.activeMembership){
        this.activeMembership = membership;
      }
    },
  }
});

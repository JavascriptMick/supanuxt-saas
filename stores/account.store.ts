import { ACCOUNT_ACCESS } from '~~/prisma/account-access-enum';
import { defineStore } from "pinia"
import { FullDBUser, MembershipWithUser } from "~~/lib/services/service.types";

/*
This store manages User and Account state including the ActiveAccount
It is used in the Account administration page and the header due to it's account switching features.

Note) Other pages don't need this state as the dbUser and activeAccount are available on the TRPC Context 
so that other routers can use them to filter results to the active user and account transparently.

[State Map]

(supabase) user -> dbUser                       <-- this.dbUser
                     |
                     |
  membership-----membership------membership*    <-- this.dbUser.memberships (*this.activeMembership)
       |             |               |
    account       account         acccount**    <--**(id=this.activeAccountId)
                                     |
                   membership-----membership------membership     <-- this.activeAccountMembers
                       |             |               |
                    account       account        acccount*
*/
interface State {
  dbUser: FullDBUser | null,
  activeAccountId: number | null,
  activeAccountMembers: MembershipWithUser[]
}

export const useAccountStore = defineStore('account', {
  state: (): State => {
    return {
      dbUser: null,
      activeAccountId: null,
      activeAccountMembers: [],
    }
  },
  getters: {
    activeMembership: (state) => state.dbUser?.memberships.find(m => m.account_id === state.activeAccountId)
  },
  actions: {
    async init(){
      const { $client } = useNuxtApp();
      if(!this.dbUser){
        const { dbUser } = await $client.auth.getDBUser.query();
        if(dbUser){
          this.dbUser = dbUser;
        }
      }
      if(!this.activeAccountId){
        const { activeAccountId } = await $client.account.getActiveAccountId.query();
        if(activeAccountId){
          this.activeAccountId = activeAccountId;
        }
      }
    },
    signout(){
      this.dbUser = null;
      this.activeAccountId = null;
      this.activeAccountMembers = [];
    },
    async getActiveAccountMembers(){
      if(this.activeMembership && (this.activeMembership.access === ACCOUNT_ACCESS.ADMIN || this.activeMembership.access === ACCOUNT_ACCESS.OWNER)){
        const { $client } = useNuxtApp();
        const { data: memberships } = await $client.account.getAccountMembers.useQuery();
        if(memberships.value?.memberships){
          this.activeAccountMembers = memberships.value?.memberships;
        }
      }
    },
    async changeActiveAccount(account_id: number){
      const { $client } = useNuxtApp();
      await $client.account.changeActiveAccount.mutate({account_id}); // sets active account on context for other routers and sets the preference in a cookie
      
      this.activeAccountId = account_id;    // because this is used as a trigger to some other components, NEEDS TO BE AFTER THE MUTATE CALL
      await this.getActiveAccountMembers(); // these relate to the active account and need to ber re-fetched
    },
    async changeAccountName(new_name: string){
      if(!this.activeMembership){ return; }
      const { $client } = useNuxtApp();
      const { account } = await $client.account.changeAccountName.mutate({ new_name });
      if(account){
        this.activeMembership.account.name = account.name;
      }
    },
    async acceptPendingMembership(membership_id: number){
      const { $client } = useNuxtApp();
      const { data: membership } = await $client.account.acceptPendingMembership.useQuery({ membership_id });
      
      if(membership.value && membership.value.membership?.pending === false){
        for(const m of this.activeAccountMembers){
          if(m.id === membership_id){
            m.pending = false;
          }
        }
      }
    },
    async rejectPendingMembership(membership_id: number){
      const { $client } = useNuxtApp();
      const { data: membership } = await $client.account.rejectPendingMembership.useQuery({ membership_id });
      
      if(membership.value){
        this.activeAccountMembers = this.activeAccountMembers.filter(m => m.id !== membership_id);
      }
    },
    async deleteMembership(membership_id: number){
      const { $client } = useNuxtApp();
      const { data: membership } = await $client.account.deleteMembership.useQuery({ membership_id });
      
      if(membership.value){
        this.activeAccountMembers = this.activeAccountMembers.filter(m => m.id !== membership_id);
      }
    },
    async rotateJoinPassword(){
      const { $client } = useNuxtApp();
      const { account } = await $client.account.rotateJoinPassword.mutate();
      if(account && this.activeMembership){
        this.activeMembership.account = account;
      }
    },
    async joinUserToAccountPending(account_id: number){
      if(!this.dbUser) { return; }
      const { $client } = useNuxtApp();
      const { membership } = await $client.account.joinUserToAccountPending.mutate({account_id, user_id: this.dbUser.id});
      if(membership && this.activeMembership){
        this.dbUser?.memberships.push(membership);
      }
    },
    async changeUserAccessWithinAccount(user_id: number, access: ACCOUNT_ACCESS){
      const { $client } = useNuxtApp();
      const { membership } = await $client.account.changeUserAccessWithinAccount.mutate({ user_id, access });
      if(membership){
        for(const m of this.activeAccountMembers){
          if(m.id === membership.id){
            m.access = membership.access;
          }
        }
      }
    },
    async claimOwnershipOfAccount(){
      const { $client } = useNuxtApp();
      const { memberships } = await $client.account.claimOwnershipOfAccount.mutate();
      if(memberships){
        this.activeAccountMembers = memberships;
        this.activeMembership!.access = ACCOUNT_ACCESS.OWNER
      }
    }
  }
});

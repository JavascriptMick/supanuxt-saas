import { ACCOUNT_ACCESS } from ".prisma/client"
import { defineStore } from "pinia"
import { MembershipWithUser } from "~~/lib/services/user.account.service"

import { useAuthStore } from './auth.store'

interface State {
  activeAccountMembers: MembershipWithUser[]
}

export const useAccountStore = defineStore('account', {
  state: (): State => {
    return {
      activeAccountMembers: [],
    }
  },
  actions: {
    async getActiveAccountMembers(){
      const authStore = useAuthStore();
      if(!authStore.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: members } = await $client.account.getAccountMembers.useQuery({account_id: authStore.activeMembership.account_id});
      if(members.value?.memberships){
        this.activeAccountMembers = members.value?.memberships;
      }
    },
    async changeAccountName(new_name: string){
      const authStore = useAuthStore();
      if(!authStore.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: account } = await $client.account.changeAccountName.useQuery({account_id: authStore.activeMembership.account_id, new_name});
      if(account.value?.account){
        authStore.activeMembership.account = account.value.account;
      }
    },
    async changeAccountPlan(plan_id: number){
      const authStore = useAuthStore();
      if(!authStore.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: account } = await $client.account.changeAccountPlan.useQuery({account_id: authStore.activeMembership.account_id, plan_id});
      if(account.value?.account){
        authStore.activeMembership.account = account.value.account;
      }
    },
    async joinUserToAccount(user_id: number){
      const authStore = useAuthStore();
      if(!authStore.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: membership } = await $client.account.joinUserToAccount.useQuery({account_id: authStore.activeMembership.account_id, user_id});
      if(membership.value?.membership){
        authStore.activeMembership = membership.value.membership;
      }
    },
    async changeUserAccessWithinAccount(user_id: number, access: ACCOUNT_ACCESS){
      const authStore = useAuthStore();
      if(!authStore.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: membership } = await $client.account.changeUserAccessWithinAccount.useQuery({account_id: authStore.activeMembership.account_id, user_id, access});
      if(membership.value?.membership){
        authStore.activeMembership = membership.value.membership;
      }
    },
    async claimOwnershipOfAccount(){
      const authStore = useAuthStore();
      if(!authStore.activeMembership) { return; }
      const { $client } = useNuxtApp();
      const { data: membership } = await $client.account.claimOwnershipOfAccount.useQuery({account_id: authStore.activeMembership.account_id});
      if(membership.value?.membership){
        authStore.activeMembership = membership.value.membership;
      }
    }
  }
});

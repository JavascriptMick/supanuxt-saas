import { ACCOUNT_ACCESS } from '~~/prisma/account-access-enum';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  FullDBUser,
  MembershipWithUser
} from '~~/lib/services/service.types';

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
export const useAccountStore = defineStore('account', () => {
  const dbUser = ref<FullDBUser | null>(null);
  const activeAccountId = ref<number | null>(null);
  const activeAccountMembers = ref<MembershipWithUser[]>([]);
  const activeMembership = computed(() =>
    dbUser?.value?.memberships.find(m => m.account_id === activeAccountId.value)
  );

  const init = async () => {
    const { $client } = useNuxtApp();
    if (!dbUser.value) {
      const { dbUser: _dbUser } = await $client.auth.getDBUser.query();
      if (_dbUser) {
        dbUser.value = _dbUser;
      }
    }
    if (!activeAccountId.value) {
      const { activeAccountId: _activeAccountId } =
        await $client.account.getActiveAccountId.query();
      if (_activeAccountId) {
        activeAccountId.value = _activeAccountId;
      }
    }
  };

  const signout = () => {
    dbUser.value = null;
    activeAccountId.value = null;
    activeAccountMembers.value = [];
  };

  const getActiveAccountMembers = async () => {
    if (
      activeMembership.value &&
      (activeMembership.value.access === ACCOUNT_ACCESS.ADMIN ||
        activeMembership.value.access === ACCOUNT_ACCESS.OWNER)
    ) {
      const { $client } = useNuxtApp();
      const { data: memberships } =
        await $client.account.getAccountMembers.useQuery();
      if (memberships.value?.memberships) {
        activeAccountMembers.value = memberships.value?.memberships;
      }
    }
  };

  const changeActiveAccount = async (account_id: number) => {
    const { $client } = useNuxtApp();
    await $client.account.changeActiveAccount.mutate({ account_id }); // sets active account on context for other routers and sets the preference in a cookie

    activeAccountId.value = account_id; // because this is used as a trigger to some other components, NEEDS TO BE AFTER THE MUTATE CALL
    await getActiveAccountMembers(); // these relate to the active account and need to ber re-fetched
  };

  const changeAccountName = async (new_name: string) => {
    if (!activeMembership.value) {
      return;
    }
    const { $client } = useNuxtApp();
    const { account } = await $client.account.changeAccountName.mutate({
      new_name
    });
    if (account) {
      activeMembership.value.account.name = account.name;
    }
  };

  const acceptPendingMembership = async (membership_id: number) => {
    const { $client } = useNuxtApp();
    const { data: membership } =
      await $client.account.acceptPendingMembership.useQuery({
        membership_id
      });

    if (membership.value && membership.value.membership?.pending === false) {
      for (const m of activeAccountMembers.value) {
        if (m.id === membership_id) {
          m.pending = false;
        }
      }
    }
  };

  const rejectPendingMembership = async (membership_id: number) => {
    const { $client } = useNuxtApp();
    const { data: membership } =
      await $client.account.rejectPendingMembership.useQuery({
        membership_id
      });

    if (membership.value) {
      activeAccountMembers.value = activeAccountMembers.value.filter(
        m => m.id !== membership_id
      );
    }
  };

  const deleteMembership = async (membership_id: number) => {
    const { $client } = useNuxtApp();
    const { data: membership } =
      await $client.account.deleteMembership.useQuery({ membership_id });

    if (membership.value) {
      activeAccountMembers.value = activeAccountMembers.value.filter(
        m => m.id !== membership_id
      );
    }
  };

  const rotateJoinPassword = async () => {
    const { $client } = useNuxtApp();
    const { account } = await $client.account.rotateJoinPassword.mutate();
    if (account && activeMembership.value) {
      activeMembership.value.account = account;
    }
  };

  const joinUserToAccountPending = async (account_id: number) => {
    if (!dbUser.value) {
      return;
    }
    const { $client } = useNuxtApp();
    const { membership } =
      await $client.account.joinUserToAccountPending.mutate({
        account_id,
        user_id: dbUser.value.id
      });
    if (membership && activeMembership.value) {
      dbUser?.value?.memberships.push(membership);
    }
  };

  const changeUserAccessWithinAccount = async (
    user_id: number,
    access: ACCOUNT_ACCESS
  ) => {
    const { $client } = useNuxtApp();
    const { membership } =
      await $client.account.changeUserAccessWithinAccount.mutate({
        user_id,
        access
      });
    if (membership) {
      for (const m of activeAccountMembers.value) {
        if (m.id === membership.id) {
          m.access = membership.access;
        }
      }
    }
  };

  const claimOwnershipOfAccount = async () => {
    const { $client } = useNuxtApp();
    const { memberships } =
      await $client.account.claimOwnershipOfAccount.mutate();
    if (memberships) {
      activeAccountMembers.value = memberships;
      activeMembership.value!.access = ACCOUNT_ACCESS.OWNER;
    }
  };

  return {
    dbUser,
    activeAccountId,
    activeAccountMembers,
    activeMembership,
    init,
    signout,
    getActiveAccountMembers,
    changeActiveAccount,
    changeAccountName,
    acceptPendingMembership,
    rejectPendingMembership,
    deleteMembership,
    rotateJoinPassword,
    joinUserToAccountPending,
    changeUserAccessWithinAccount,
    claimOwnershipOfAccount
  };
});

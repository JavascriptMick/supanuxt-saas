import { describe, expect, afterEach, beforeEach, it, vi } from 'vitest';
import { useAccountStore } from '../stores/account.store';
import { setActivePinia, createPinia } from 'pinia';

import type { FullDBUser } from '~/lib/services/service.types';

const fakeInitAccountStoreAdmin = (accountStore: any) => {
  const dbUser: FullDBUser = {
    id: 1,
    name: 'John Doe',
    memberships: [
      { account_id: 1, access: 'ADMIN' },
      { account_id: 2, access: 'READ_ONLY' }
    ]
  } as any;
  accountStore.dbUser = dbUser;
  accountStore.activeAccountId = 1;
};

describe('Account Store', async () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize the store', async () => {
    // stub the useNuxtApp function with a mock client
    vi.stubGlobal('useNuxtApp', () => ({
      $client: {
        auth: {
          getDBUser: {
            query: () => ({
              dbUser: {
                id: 1,
                name: 'John Doe',
                memberships: []
              }
            })
          }
        },
        account: {
          getActiveAccountId: {
            query: () => ({ activeAccountId: 1 })
          }
        }
      }
    }));

    const accountStore = useAccountStore();

    // method under test
    await accountStore.init();

    expect(accountStore.dbUser).toEqual({
      id: 1,
      name: 'John Doe',
      memberships: []
    });

    expect(accountStore.activeAccountId).toEqual(1);
  });

  it('should get active account members', async () => {
    // stub the useNuxtApp function with a mock client
    vi.stubGlobal('useNuxtApp', () => ({
      $client: {
        account: {
          getAccountMembers: {
            useQuery: () => ({
              data: { value: { memberships: [new Object() as any] } }
            })
          }
        }
      }
    }));

    const accountStore = useAccountStore();
    fakeInitAccountStoreAdmin(accountStore);

    // method under test
    await accountStore.getActiveAccountMembers();

    expect(accountStore.activeAccountMembers.length).toEqual(1);
  });

  it('should get an active membership', async () => {
    const accountStore = useAccountStore();
    fakeInitAccountStoreAdmin(accountStore);

    expect(accountStore.activeMembership).toEqual({
      account_id: 1,
      access: 'ADMIN'
    });
  });

  it('should signout', async () => {
    const accountStore = useAccountStore();
    fakeInitAccountStoreAdmin(accountStore);

    await accountStore.signout();

    expect(accountStore.dbUser).toBeNull();
    expect(accountStore.activeAccountId).toBeNull();
    expect(accountStore.activeAccountMembers.length).toEqual(0);
  });
});

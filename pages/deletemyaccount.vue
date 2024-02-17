<script setup lang="ts">
  const supabase = useSupabaseClient();
  const accountStore = useAccountStore();

  onMounted(async () => {
    await accountStore.init();
  });

  async function deleteAccount() {
    await supabase.auth.signOut();
    if (accountStore) {
      accountStore.signout();
    }
    navigateTo('/', { replace: true });
  }
</script>
<template>
  <div class="prose lg:prose-xl m-5">
    <h1>Account Deletion</h1>
    <p>
      We're sorry to see you go! By clicking the button below, you will initiate
      the account deletion process, which will result in the permanent removal
      of all your account information stored by SupaNuxt SaaS and associated
      service providers. Please be aware that this action is irreversible and
      all subscriptions associated with your account will be terminated. Once
      your account is deleted, you will lose access to all the features and
      benefits of SupaNuxt SaaS.
    </p>

    <h2>Important Notes:</h2>
    <ol>
      <li>
        <strong>Account Deletion Process:</strong> By clicking the "Delete My
        Account" button below, your account and all associated data will be
        immediately marked for deletion. The actual removal of your information
        may take some time to complete, depending on the size and complexity of
        your account.
      </li>
      <li>
        <strong>Subscriptions:</strong> Please note that the termination of your
        account will also result in the cancellation of any active subscriptions
        you have with SupaNuxt SaaS. You will no longer be billed for these
        services, and access to premium features will be discontinued
        immediately.
      </li>
      <li>
        <strong>Data Recovery:</strong> Once your account is deleted, it will
        not be possible to recover any of your account information, including
        personal details, saved preferences, and usage history. Please ensure
        that you have backed up any essential data before proceeding with the
        account deletion process.
      </li>
    </ol>

    <button
      @click="deleteAccount()"
      class="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
      <span class="flex items-center justify-center space-x-2">
        <span>Delete My Account</span>
      </span>
    </button>
  </div>
</template>

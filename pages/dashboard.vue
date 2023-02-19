<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  definePageMeta({
    middleware: ['auth'],
  });

  const { $client } = useNuxtApp();

  const store = useAppStore();
  const { notes } = storeToRefs(store);  // ensure the notes list is reactive

  onMounted(async () => {
    await store.initUser();
  })

  async function joinUserToAccount(){
    const { data: membership } = await $client.userAccount.joinUserToAccount.useQuery();
    console.log(`added membership on current account: ${JSON.stringify(membership)}`);
  }

  async function changeUserAccessWithinAccount(){
    const { data: membership } = await $client.userAccount.changeUserAccessWithinAccount.useQuery();
    console.log(`updated membership on current account: ${JSON.stringify(membership)}`);
  }

  async function claimOwnershipOfAccount(){
    const { data: membership } = await $client.userAccount.claimOwnershipOfAccount.useQuery();
    console.log(`updated membership on current account: ${JSON.stringify(membership)}`);
  }
</script>
<template>
  <div>
    <h3>Notes Dashboard</h3>
    <p v-for="note in notes">{{ note.note_text }}</p>

    <button @click.prevent="store.changeAccountPlan(2)">Change Account Plan to 2</button>
    <button @click.prevent="joinUserToAccount()">Join user to account</button>
    <button @click.prevent="changeUserAccessWithinAccount()">Change user access within account</button>
    <button @click.prevent="claimOwnershipOfAccount()">Claim Account Ownership</button>
  </div>
</template>

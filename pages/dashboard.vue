<script setup lang="ts">
  const user = await useSupabaseUser();
  definePageMeta({
    middleware: ['auth'],
  });

  const { $client } = useNuxtApp();
  const { data: notes } = await $client.notes.getForCurrentUser.useQuery();

  async function changeAccountPlan(){
    const { data: account } = await $client.userAccount.changeAccountPlan.useQuery();
    console.log(`account with updated plan: ${JSON.stringify(account)}`);
  }

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
    <h3>{{ user?.user_metadata.full_name }}'s Notes Dashboard</h3>
    <p v-for="note in notes?.notes">{{ note.note_text }}</p>

    <button @click.prevent="changeAccountPlan()">Change Account Plan</button>
    <button @click.prevent="joinUserToAccount()">Join user to account</button>
    <button @click.prevent="changeUserAccessWithinAccount()">Change user access within account</button>
    <button @click.prevent="claimOwnershipOfAccount()">Claim Account Ownership</button>
  </div>
</template>

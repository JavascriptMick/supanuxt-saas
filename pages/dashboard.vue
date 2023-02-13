<script setup lang="ts">
  const user = await useSupabaseUser();
  definePageMeta({
    middleware: ['auth'],
  });

  const { $client } = useNuxtApp();

  const theAppState = appState();
  watch(theAppState.value, (newAppState) => {
    if(newAppState.activeMembership){
      const { data: foundNotes } = $client.notes.getForCurrentUser.useQuery({account_id: newAppState.activeMembership.account_id});
      if(foundNotes.value?.notes){
        theAppState.value.notes = foundNotes.value.notes;
      }
    }
  }); 

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
    <p v-for="note in theAppState.notes">{{ note.note_text }}</p>

    <button @click.prevent="changeAccountPlan()">Change Account Plan</button>
    <button @click.prevent="joinUserToAccount()">Join user to account</button>
    <button @click.prevent="changeUserAccessWithinAccount()">Change user access within account</button>
    <button @click.prevent="claimOwnershipOfAccount()">Claim Account Ownership</button>
    <p>Active ->{{ theAppState.activeMembership?.account_id }}</p>
  </div>
</template>

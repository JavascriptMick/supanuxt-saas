<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  definePageMeta({
    middleware: ['auth'],
  });

  const store = useAppStore();
  const { notes } = storeToRefs(store);  // ensure the notes list is reactive

  onMounted(async () => {
    await store.initUser();
  })
</script>
<template>
  <div>
    <h3>Notes Dashboard</h3>
    <p v-for="note in notes">{{ note.note_text }}</p>

    <button @click.prevent="store.changeAccountPlan(2)">Change active Account Plan to 2</button>
    <button @click.prevent="store.joinUserToAccount(4)">Join user 4 to active account</button>
    <button @click.prevent="store.changeUserAccessWithinAccount(4, 'OWNER')">Change user 4 access within account 5 to OWNER (SHOULD FAIL)</button>
    <button @click.prevent="store.changeUserAccessWithinAccount(4, 'ADMIN')">Change user 4 access within account 5 to ADMIN</button>
    <button @click.prevent="store.claimOwnershipOfAccount()">Claim Ownership of current account for current user</button>
  </div>
</template>

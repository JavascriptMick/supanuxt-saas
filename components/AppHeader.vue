<script setup lang="ts">
import {  MembershipWithAccount } from '~~/lib/services/user.account.service';
import { storeToRefs } from 'pinia';

const supabase = useSupabaseAuthClient();
const user = useSupabaseUser();
const store = useAppStore()
const { activeMembership } = storeToRefs(store);

const { $client } = useNuxtApp();

const { data: dbUser } = await $client.userAccount.getDBUser.useQuery();

async function signout() {
  await supabase.auth.signOut();
  navigateTo('/', {replace: true});
}
</script>

<template>
  <div>
    <h3>Nuxt 3 Boilerplate - AppHeader</h3>
    <!-- logged in & sign out -->
    <div v-if="user">logged in as: {{ user.email }}: <button @click="signout()">Sign Out</button></div>
    <div v-if="!user">Not Logged in</div>

    <!-- Account Switching -->
    <p v-if="(dbUser?.dbUser?.memberships) && (dbUser.dbUser.memberships.length > 0)">
      <span>Switch Account.. </span>
      <button v-for="membership in dbUser?.dbUser.memberships" @click="store.changeActiveMembership(((membership as unknown) as MembershipWithAccount))"> <!-- This cast is infuriating -->
        {{ membership.account.name }}
        <span v-if="membership.account_id === activeMembership?.account_id">*</span>
      </button>
    </p>
    <hr>
  </div>
</template>

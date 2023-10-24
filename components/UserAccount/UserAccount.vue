<script setup lang="ts">
  const props = defineProps({
    user: {
      type: Object,
      required: true
    }
  });
  const { user } = props;
</script>

<template>
  <div class="navbar-end">
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img
            v-if="user.user_metadata?.avatar_url"
            :src="user.user_metadata.avatar_url"
            alt="avatar image" />
          <img
            v-else
            src="~/assets/images/avatar.svg"
            alt="default avatar image" />
        </div>
      </label>
      <ul
        tabindex="0"
        class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
        <li v-if="user">{{ user.email }}</li>
        <li><NuxtLink to="/account">Account</NuxtLink></li>
        <li><UserAccountSignout /></li>
        <UserAccountSwitch />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  const user = useSupabaseUser();
</script>

<template>
  <div class="navbar bg-base-100">
    <Notifications />
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li v-if="user"><NuxtLink to="/dashboard">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/pricing">Pricing</NuxtLink></li>
          <li v-if="!user"><NuxtLink to="/signin">Sign In</NuxtLink></li>
        </ul>
      </div>
      <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">
        SupaNuxt SAAS
      </NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li v-if="user"><NuxtLink to="/dashboard">Dashboard</NuxtLink></li>
        <li><NuxtLink to="/pricing">Pricing</NuxtLink></li>
        <li v-if="!user"><NuxtLink to="/signin">Sign In</NuxtLink></li>
        <li v-if="!user"><NuxtLink to="/signup">Start for free</NuxtLink></li>
        <li v-if="!user">
          <a
            title="github"
            href="https://github.com/JavascriptMick/supanuxt-saas">
            <Icon name="mdi:github" />
          </a>
        </li>
      </ul>
    </div>
    <UserAccount v-if="user" :user="user" />
  </div>
</template>

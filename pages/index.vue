<script setup lang="ts">
const user = useSupabaseUser()
  watchEffect(() => {
    if (user.value) {
      navigateTo('/dashboard', {replace: true})
    }
  })
</script>
<template>
  <div class="container mx-auto m-5">
    <!-- Hero section -->
    <section class="bg-gray-100 py-20">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div class="m-5">
            <h1 class="text-5xl font-bold mb-4">
              Build Your Next SAAS Faster
            </h1>
            <p class="text-gray-700 text-lg mb-8">
              With Nuxt 3 SAAS Boilerplate, you can easily get started building your
              next web application. Our pre-configured tech stack and
              industry leading features make it easy to get up and running in no time. Look! this guy is working so fast,
              his hands are just a blur.. you could be this fast.
            </p>
            <NuxtLink to="/signup" class="inline-block py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Get Started</NuxtLink>
          </div>
          <div>
            <img src="~/assets/images/saas_landing_main.jpeg"
              alt="Hero Image" />
          </div>
        </div>
      </div>
    </section>

    <section class="py-12">
    <div class="container px-4 mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-center md:justify-between mb-8">
          <h2 class="text-3xl font-bold mb-4 md:mb-0">Tech Stack</h2>
        </div>
        <div class="flex flex-col md:flex-row items-center mb-16">

          <div class="md:w-full">
            <ul class="grid grid-cols-3 gap-10 list-none">
              <li>
                <Icon name="skill-icons:nuxtjs-dark" class="h-12 w-12 mb-2" />
                <h3 class="text-xl font-medium text-gray-900">Nuxt 3</h3>
                <p class="mt-2 text-base text-gray-500">The Progressive Vue.js Framework</p>
              </li>
              <li>
                <Icon name="skill-icons:supabase-dark" class="h-12 w-12 mb-2" />
                <h3 class="text-xl font-medium text-gray-900">Supabase</h3>
                <p class="mt-2 text-base text-gray-500">Auth including OAuth + Postgresql instance</p>
              </li>
              <li>
                <Icon name="skill-icons:postgresql-dark" class="h-12 w-12 mb-2" />
                <h3 class="text-xl font-medium text-gray-900">PostgreSQL</h3>
                <p class="mt-2 text-base text-gray-500">Relational Database</p>
              </li>
              <li>
                <Icon name="logos:prisma" class="h-12 w-12 mb-2" />
                <h3 class="text-xl font-medium text-gray-900">Prisma</h3>
                <p class="mt-2 text-base text-gray-500">Schema management + Strongly typed client</p>
              </li>
              <li>
                <Icon name="simple-icons:trpc" class="h-12 w-12 mb-2" />
                <h3 class="text-xl font-medium text-gray-900">TRPC</h3>
                <p class="mt-2 text-base text-gray-500">Server/Client communication with Strong types, SSR compatible</p>
              </li>
              <li>
                <Icon name="skill-icons:vuejs-dark" class="h-12 w-12 mb-2" />
                <h3 class="text-xl font-medium text-gray-900">Pinia</h3>
                <p class="mt-2 text-base text-gray-500">State Store</p>
              </li>
              <li>
                <Icon name="logos:stripe" class="h-12 w-12 mb-2" />
                <h3 class="text-xl font-medium text-gray-900">Stripe</h3>
                <p class="mt-2 text-base text-gray-500">Payments including Webhook integration</p>
              </li>
              <li>
                <Icon name="skill-icons:tailwindcss-dark" class="h-12 w-12 mb-2" />
                <h3 class="text-xl font-medium text-gray-900">Tailwind</h3>
                <p class="mt-2 text-base text-gray-500">A utility-first CSS framework</p>
              </li>
              <li>
                <Icon name="skill-icons:vuejs-dark" class="h-12 w-12 mb-2" />
                <h3 class="text-xl font-medium text-gray-900">Vue.js</h3>
                <p class="mt-2 text-base text-gray-500">The Progressive JavaScript Framework</p>
              </li>
              <li>
                <Icon name="logos:openai-icon" class="h-12 w-12 mb-2" />
                <h3 class="text-xl font-medium text-gray-900">OpenAI</h3>
                <p class="mt-2 text-base text-gray-500">AI Completions including Note generation from prompt</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col md:flex-row items-center justify-center md:justify-between mb-8">
          <h2 class="text-3xl font-bold mb-4 md:mb-0">Features</h2>
        </div>
        <!-- User Management (text left) -->
        <div class="flex flex-col md:flex-row-reverse items-center mb-16">
          <div class="md:w-1/2 md:ml-8 mb-8 md:mb-0">
            <img src="~/assets/images/landing_user_management.jpeg" alt="User Management"
              class="w-full rounded-lg shadow-lg mb-4 md:mb-0 md:ml-4">
          </div>
          <div class="md:w-1/2">
            <h3 class="text-xl font-bold mb-4">User Management</h3>
            <p class="mb-4">Our Nuxt 3 SAAS Boilerplate project includes robust user management features, including
              authentication with social login (oauth) or email/password, management of user roles and permissions, and
              multi-user/team accounts that permit multiple users to share plan features including a team administration
              facility and user roles within team. This is a great feature for businesses or community groups who want to
              share the cost of the plan.</p>
          </div>
        </div>
        <!-- DB Schema (text right)-->
        <div class="flex flex-col md:flex-row items-center mb-16">
          <div class="md:w-1/2 md:mr-8 mb-8 md:mb-0">
            <img src="~/assets/images/landing_db_schema_management.jpeg" alt="DB Schema Management"
              class="w-full rounded-lg shadow-lg mb-4 md:mb-0 md:mr-4">
          </div>
          <div class="md:w-1/2">
            <h3 class="text-xl font-bold mb-4">DB Schema Management</h3>
            <p class="mb-4">We use Prisma for schema management to make sure you can easily
              manage and keep track of your database schema.  We also utilise Prisma based strong types which, with some help from TRPC, penetrate the entire stack all 
              the way to the web front end.  This ensures that you can move fast with your feature development, alter schema and have those
              type changes instantly available and validated everywhere.</p>
          </div>
        </div>
        <!-- Config (text left) -->
        <div class="flex flex-col md:flex-row-reverse items-center mb-16">
          <div class="md:w-1/2 md:ml-8 mb-8 md:mb-0">
            <img src="~/assets/images/landing_config_environment.jpeg" alt="Config and Environment"
              class="w-full rounded-lg shadow-lg mb-4 md:mb-0 md:ml-4">
          </div>
          <div class="md:w-1/2">
            <h3 class="text-xl font-bold mb-4">Config and Environment</h3>
            <p class="mb-4">Nuxt 3 SAAS Boilerplate includes an approach to config and environment 
              management that enables customisation and management of api keys.</p>
          </div>
        </div>
        <!-- State Management (text right)-->
        <div class="flex flex-col md:flex-row items-center mb-16">
          <div class="md:w-1/2 md:mr-8 mb-8 md:mb-0">
            <img src="~/assets/images/landing_state_management.jpeg" alt="State Management"
              class="w-full rounded-lg shadow-lg mb-4 md:mb-0 md:mr-4">
          </div>
          <div class="md:w-1/2">
            <h3 class="text-xl font-bold mb-4">State Management</h3>
            <p class="mb-4">Nuxt 3 SAAS Boilerplate includes multi modal state management that supports both Single Page Application (SPA) 
              pages such as dashboards and Server Side Rendered (SSR) style pages for public content that are crawlable by Search 
              engines like google and facilitate excellent Search Engine Optimisation (SEO).</p>
          </div>
        </div>
        <!-- Stripe (text left) -->
        <div class="flex flex-col md:flex-row-reverse items-center mb-16">
          <div class="md:w-1/2 md:ml-8 mb-8 md:mb-0">
            <img src="~/assets/images/landing_stripe_integration.jpeg" alt="Stripe Integration"
              class="w-full rounded-lg shadow-lg mb-4 md:mb-0 md:ml-4">
          </div>
          <div class="md:w-1/2">
            <h3 class="text-xl font-bold mb-4">Stripe Integration</h3>
            <p class="mb-4">Nuxt 3 SAAS Boilerplate includes Stripe integration for subscription payments including 
              Subscription based support for multi pricing and multiple plans.</p>
          </div>
        </div>
        <!-- Tailwind (text right)-->
        <div class="flex flex-col md:flex-row items-center mb-16">
          <div class="md:w-1/2 md:mr-8 mb-8 md:mb-0">
            <img src="~/assets/images/landing_style_system.jpeg" alt="Style System"
              class="w-full rounded-lg shadow-lg mb-4 md:mb-0 md:mr-4">
          </div>
          <div class="md:w-1/2">
            <h3 class="text-xl font-bold mb-4">Style System</h3>
            <p class="mb-4">Nuxt 3 SAAS Boilerplate includes Tailwind integration for site styling including a themable UI components with daisyUI</p>
          </div>
        </div>
      </div>
    </section>
  </div></template>

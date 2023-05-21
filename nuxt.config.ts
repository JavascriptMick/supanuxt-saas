// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: true,
  build: {
    transpile: ['trpc-nuxt']
  },
  typescript: {
    shim: false
  },
  modules: ['@nuxtjs/supabase', '@pinia/nuxt', '@nuxtjs/tailwindcss', 'nuxt-icon'],
  imports: {
    dirs: ['./stores'],
  },
  app:{
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Nuxt 3 SAAS Boilerplate',
    },
  },
  runtimeConfig:{
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeEndpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
    subscriptionGraceDays: 3,
    initialPlanName: 'Free Trial',
    initialPlanActiveMonths: 1,
    openAIKey: process.env.OPENAI_API_KEY,
    public: {
      debugMode: true,
      siteRootUrl: process.env.URL || 'http://localhost:3000', // URL env variable is provided by netlify by default
    }
  }
})

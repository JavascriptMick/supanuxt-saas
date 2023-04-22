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
  runtimeConfig:{
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeEndpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
    stripeCallbackUrl: process.env.STRIPE_CALLBACK_URL,
    subscriptionGraceDays: 3,
    initialPlanName: 'Free Trial',
    initialPlanActiveMonths: 1,
    public: {
      debugMode: true,
      siteRootUrl: 'http://localhost:3000',
    }
  }
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: true,
  build: {
    transpile: ['trpc-nuxt']
  },
  typescript: {
    shim: false
  },
  modules: ['@nuxtjs/supabase', '@pinia/nuxt'],
  imports: {
    dirs: ['./stores'],
  },
  runtimeConfig:{
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeEndpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
    subscriptionGraceDays: 3,
    trialPlanName: '3 Month Trial',
    public: {
      debugMode: true,
    }
  }
})

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
    stripeCallbackUrl: process.env.STRIPE_CALLBACK_URL,
    subscriptionGraceDays: 3,
    initialPlanName: '3 Month Trial',
    initialPlanActiveMonths: 3,
    public: {
      debugMode: true,
    }
  }
})

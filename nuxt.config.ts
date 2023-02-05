// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['trpc-nuxt']
  },
  typescript: {
    shim: false
  },
  modules: ['@nuxtjs/supabase'],
})

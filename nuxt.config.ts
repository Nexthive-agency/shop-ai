// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils'],
  runtimeConfig: {
    // Server-only: Nuxt reads MIDTRANS_SERVER_KEY from .env automatically
    midtransServerKey: '',
    // Public: exposed to frontend via useRuntimeConfig().public
    public: {
      midtransClientKey: ''
    }
  },
  vite: {
    server: {
      allowedHosts: true
    }
  }
})


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  components: [
    { path: '~/shared/ui', pathPrefix: false },
    { path: '~/widgets', pathPrefix: false },
    { path: '~/features', pathPrefix: false },
  ],

  // Auto-import composables z FSD
  imports: {
    dirs: [
      'shared/lib',
      'shared/api',
      'entities/**/model',
      'entities/**/api'
    ]
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt'
  ],

  shadcn: {
    prefix: '',
    componentDir: './shared/ui'
  },

  tailwindcss: {
    cssPath: '~/app/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },

  compatibilityDate: '2024-08-25'
})

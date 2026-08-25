import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  })
  
  const options = { queryClient }

  nuxtApp.vueApp.use(VueQueryPlugin, options)
  
  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      // Opcjonalnie: hydracja stanu dla SSR (vue-query hydration)
    })
  }
})

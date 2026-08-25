export const apiClient = $fetch.create({
  baseURL: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000',
  credentials: 'omit',
  
  onRequest({ options }) {
    options.headers = {
      ...options.headers,
      'Accept': 'application/json',
    }
  },

  onResponseError({ response }) {
    // Zostanie rozbudowane o przekierowania na '/login' w przypadku 401 Unauthorized
    if (response.status === 401) {
      console.warn('Unauthorized request. Redirecting...')
    }
    
  }
})

// Typy pomocnicze
export type ApiResponse<T> = {
  data: T
  message?: string
}

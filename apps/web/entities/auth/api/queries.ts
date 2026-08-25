import { useMutation } from '@tanstack/vue-query'
import { apiClient } from '~/shared/api/client'
import { useAuthStore, type User } from '../model/store'
import { useRouter } from 'vue-router'

export function useLoginMutation() {
  const store = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await apiClient<User>('/auth/login', {
        method: 'POST',
        body: credentials,
      })
    },
    onSuccess: (user) => {
      // Aktualizujemy stan UI (Pinia)
      store.setUser(user)
      // Przekierowujemy na dashboard
      router.push('/')
    },
    onError: (error) => {
      console.error('Błąd logowania:', error)
      // W prawdziwym kodzie odpalamy tu np. Toast notification "Invalid credentials"
    }
  })
}

export function useLogoutMutation() {
  const store = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      return await apiClient('/auth/logout', { method: 'POST' })
    },
    onSuccess: () => {
      store.logout()
      router.push('/login')
    }
  })
}

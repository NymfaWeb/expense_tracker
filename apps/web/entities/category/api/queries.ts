import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { apiClient } from '~/shared/api/client'

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  userId: string | null
}

const CATEGORIES_QUERY_KEY = 'categories'

export function useCategoriesQuery() {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: async () => {
      return await apiClient<Category[]>('/categories')
    },
  })
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newCategory: { name: string; color?: string; icon?: string }) => {
      return await apiClient<Category>('/categories', {
        method: 'POST',
        body: newCategory,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] })
    },
  })
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient(`/categories/${id}`, {
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] })
    },
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { apiClient } from '~/shared/api/client'
import type { Expense, CreateExpensePayload } from '../model/types'
import { useExpenseStore } from '../model/store'

const EXPENSES_QUERY_KEY = 'expenses'

export function useExpensesQuery() {
  const store = useExpenseStore()

  return useQuery({
    // Cache invalidation base on filters (Vue reactivity)
    queryKey: [EXPENSES_QUERY_KEY, store.filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (store.filters.type !== 'all') params.append('type', store.filters.type)
      if (store.filters.dateRange.start) params.append('start', store.filters.dateRange.start)
      if (store.filters.dateRange.end) params.append('end', store.filters.dateRange.end)

      return await apiClient<Expense[]>(`/expenses?${params.toString()}`)
    },
  })
}

// POST: Dodawanie nowego wydatku
export function useCreateExpenseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newExpense: CreateExpensePayload) => {
      return await apiClient<Expense>('/expenses', {
        method: 'POST',
        body: newExpense,
      })
    },
    // Optymistyczne aktualizacje lub invalidation cache po sukcesie
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['expenses-summary'] })
    },
  })
}

// PUT: Aktualizacja wydatku
export function useUpdateExpenseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<CreateExpensePayload> & { id: string }) => {
      return await apiClient<Expense>(`/expenses/${id}`, {
        method: 'PUT',
        body: updateData,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['expenses-summary'] })
    },
  })
}

// DELETE: Usuwanie wydatku
export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient(`/expenses/${id}`, {
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['expenses-summary'] })
    },
  })
}

// GET: Pobieranie zoptymalizowanego podsumowania
export function useExpenseSummaryQuery() {
  return useQuery({
    queryKey: ['expenses-summary'],
    queryFn: async () => {
      return await apiClient<{ totalExpenses: number; activeSubscriptions: number }>(
        '/expenses/summary',
      )
    },
  })
}

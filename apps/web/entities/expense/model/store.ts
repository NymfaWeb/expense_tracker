import { defineStore } from 'pinia'

type ExpenseTypeFilter = 'all' | 'private' | 'business'

interface ExpenseFilters {
  type: ExpenseTypeFilter
  dateRange: {
    start: string | null
    end: string | null
  }
}

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    filters: {
      type: 'all' as ExpenseTypeFilter,
      dateRange: {
        start: null,
        end: null
      }
    } as ExpenseFilters,
    
    isAddExpenseModalOpen: false,
  }),
  
  actions: {
    setFilterType(type: ExpenseTypeFilter) {
      this.filters.type = type
    },
    setDateRange(start: string, end: string) {
      this.filters.dateRange = { start, end }
    },
    toggleAddExpenseModal() {
      this.isAddExpenseModalOpen = !this.isAddExpenseModalOpen
    }
  }
})

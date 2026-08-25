export interface Category {
  id: string
  name: string
  color: string | null
  icon: string | null
}

export interface Expense {
  id: string
  amount: number
  currency: string
  expenseDate: string // YYYY-MM-DD
  title: string
  description: string | null
  isBusiness: boolean
  categoryId: string
  category?: Category
  createdAt: string
  updatedAt: string
}

export type CreateExpensePayload = Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'category'>
export type UpdateExpensePayload = Partial<CreateExpensePayload>

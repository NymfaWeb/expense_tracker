<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useExpensesQuery, useDeleteExpenseMutation } from '~/entities/expense/api/queries'
  import { useExpenseStore } from '~/entities/expense/model/store'
  import { formatCurrency } from '~/shared/lib/formatters'
  import { Trash2, Edit, Loader2, Calendar } from 'lucide-vue-next'
  import AddExpenseModal from '~/features/expense/ui/AddExpenseModal.vue'

  const store = useExpenseStore()
  const { data: expensesResponse, isPending } = useExpensesQuery()
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpenseMutation()

  const expenses = computed(() => expensesResponse.value?.data ?? [])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id)
    }
  }

  const handleEdit = (expense: any) => {
    store.toggleAddExpenseModal(expense)
  }
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2
          class="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#2dd4bf] to-[#2dd4bf] bg-clip-text text-transparent"
        >
          Transactions
        </h2>
        <p class="text-muted-foreground mt-1">Manage your full history of expenses and income.</p>
      </div>
      <Button
        @click="store.toggleAddExpenseModal()"
        variant="default"
        class="bg-[#2dd4bf] hover:bg-teal-500 text-white"
      >
        Add Transaction
      </Button>
    </div>

    <!-- Filtry -->
    <Card class="p-4 bg-card/40 backdrop-blur-sm border-white/10 flex flex-wrap gap-4 items-center">
      <div class="flex items-center space-x-2">
        <label for="filter-type" class="text-sm font-medium">Type:</label>
        <select
          id="filter-type"
          v-model="store.filters.type"
          class="text-sm bg-background border border-input rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="all">All</option>
          <option value="private">Private</option>
          <option value="business">Business</option>
        </select>
      </div>
      <div class="flex items-center space-x-2">
        <label for="filter-start" class="text-sm font-medium">Date Range:</label>
        <input
          id="filter-start"
          type="date"
          v-model="store.filters.dateRange.start"
          aria-label="Start date"
          class="text-sm bg-background border border-input rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <span class="text-muted-foreground">-</span>
        <input
          id="filter-end"
          type="date"
          v-model="store.filters.dateRange.end"
          aria-label="End date"
          class="text-sm bg-background border border-input rounded-md px-3 py-1.5 focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>
    </Card>

    <Card class="bg-card/40 backdrop-blur-sm border-white/10 overflow-hidden">
      <div v-if="isPending" class="flex items-center justify-center py-20 opacity-50">
        <Loader2 class="h-10 w-10 animate-spin text-primary" />
      </div>

      <div v-else-if="expenses.length === 0" class="text-center py-12 text-muted-foreground">
        No transactions found matching your filters.
      </div>

      <div v-else class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Date
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Title
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Category
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Type
              </th>
              <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                Amount
              </th>
              <th class="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr
              v-for="exp in expenses"
              :key="exp.id"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <td class="p-4 align-middle">{{ exp.expenseDate }}</td>
              <td class="p-4 align-middle font-medium">{{ exp.title }}</td>
              <td class="p-4 align-middle">
                <span
                  class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  :style="{
                    backgroundColor: (exp.category?.color || '#808080') + '20',
                    color: exp.category?.color || '#808080',
                    borderColor: (exp.category?.color || '#808080') + '40',
                  }"
                >
                  {{ exp.category?.name || 'Uncategorized' }}
                </span>
              </td>
              <td class="p-4 align-middle">
                {{ exp.isBusiness ? 'Business' : 'Private' }}
              </td>
              <td
                class="p-4 align-middle text-right font-bold"
                :class="exp.isBusiness ? 'text-[#2dd4bf]' : 'text-rose-400'"
              >
                -{{ exp.amount }} PLN
              </td>
              <td class="p-4 align-middle text-right flex items-center justify-end gap-2">
                <button
                  @click="handleEdit(exp)"
                  aria-label="Edit expense"
                  class="p-2 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button
                  @click="handleDelete(exp.id)"
                  :disabled="isDeleting"
                  aria-label="Delete expense"
                  class="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-destructive"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <AddExpenseModal />
  </div>
</template>

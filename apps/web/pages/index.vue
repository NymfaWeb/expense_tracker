<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, Activity, Loader2 } from 'lucide-vue-next'
import { useExpenseStore } from '~/entities/expense/model/store'
import AddExpenseModal from '~/features/expense/ui/AddExpenseModal.vue'
import { useExpensesQuery, useExpenseSummaryQuery } from '~/entities/expense/api/queries'

const expenseStore = useExpenseStore()

const { data: expensesResponse, isPending } = useExpensesQuery()
// Pobieramy zoptymalizowane podsumowanie z serwera
const { data: summaryResponse, isPending: isPendingSummary } = useExpenseSummaryQuery()

const expenses = computed(() => expensesResponse.value?.data ?? [])

// Pobierane z bazy Drizzle agregaty
const totalExpenses = computed(() => summaryResponse.value?.data?.totalExpenses ?? 0)
const activeSubscriptions = computed(() => summaryResponse.value?.data?.activeSubscriptions ?? 0)

const totalBalance = computed(() => 15000 - totalExpenses.value)

const recentTransactions = computed(() => {
  // Bierzemy najnowsze 5
  return [...expenses.value].sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime()).slice(0, 5)
})

const formatCurrency = (amount: number | string) => {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(parseFloat(amount as any))
}
</script>

<template>
  <div class="space-y-8 relative">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p class="text-muted-foreground mt-1">Here's an overview of your finances this month.</p>
      </div>
      <Button @click="expenseStore.toggleAddExpenseModal()" variant="default" class="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
        Add Expense
      </Button>
    </div>

    <!-- Spinner podczas wczytywania (isPending z Vue Query) -->
    <div v-if="isPending || isPendingSummary" class="flex flex-col items-center justify-center py-20 opacity-50">
      <Loader2 class="h-10 w-10 animate-spin text-primary mb-4" />
      <p class="text-muted-foreground text-sm font-medium">Fetching real-time data...</p>
    </div>

    <template v-else>
      <!-- Summary Cards -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card class="p-6 bg-card/40 backdrop-blur-sm border-white/10 hover:bg-card/60 transition-colors">
          <div class="flex items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium text-muted-foreground">Total Balance</h3>
            <Wallet class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="mt-2">
            <div class="text-2xl font-bold">{{ formatCurrency(totalBalance) }}</div>
            <p class="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              Virtual Initial Budget: 15 000 PLN
            </p>
          </div>
        </Card>

        <Card class="p-6 bg-card/40 backdrop-blur-sm border-white/10 hover:bg-card/60 transition-colors">
          <div class="flex items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium text-muted-foreground">Total Income</h3>
            <ArrowUpRight class="h-4 w-4 text-emerald-500" />
          </div>
          <div class="mt-2">
            <div class="text-2xl font-bold">Mocked Data</div>
            <p class="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span class="text-emerald-500 flex items-center"><ArrowUpRight class="h-3 w-3 mr-1" /> +12%</span> from last month
            </p>
          </div>
        </Card>

        <Card class="p-6 bg-card/40 backdrop-blur-sm border-white/10 hover:bg-card/60 transition-colors">
          <div class="flex items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium text-muted-foreground">Total Expenses</h3>
            <ArrowDownRight class="h-4 w-4 text-rose-500" />
          </div>
          <div class="mt-2">
            <div class="text-2xl font-bold">{{ formatCurrency(totalExpenses) }}</div>
            <p class="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span class="text-rose-500 flex items-center"><ArrowUpRight class="h-3 w-3 mr-1" /> Dynamic</span> based on DB
            </p>
          </div>
        </Card>

        <Card class="p-6 bg-card/40 backdrop-blur-sm border-white/10 hover:bg-card/60 transition-colors">
          <div class="flex items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium text-muted-foreground">Active Subscriptions</h3>
            <Activity class="h-4 w-4 text-indigo-400" />
          </div>
          <div class="mt-2">
            <div class="text-2xl font-bold">{{ activeSubscriptions }}</div>
            <p class="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span>Identified in titles</span>
            </p>
          </div>
        </Card>
      </div>

      <!-- Charts & Tables Area -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card class="col-span-4 p-6 bg-card/40 backdrop-blur-sm border-white/10">
          <div class="flex flex-col space-y-1.5 pb-4">
            <h3 class="font-semibold leading-none tracking-tight">Overview</h3>
            <p class="text-sm text-muted-foreground">Monthly expense distribution.</p>
          </div>
          <div class="h-[300px] w-full rounded-md bg-muted/20 flex items-center justify-center border border-dashed border-muted">
            <span class="text-muted-foreground text-sm">Chart Placeholder</span>
          </div>
        </Card>
        
        <Card class="col-span-3 p-6 bg-card/40 backdrop-blur-sm border-white/10 overflow-hidden flex flex-col">
          <div class="flex flex-col space-y-1.5 pb-4">
            <h3 class="font-semibold leading-none tracking-tight">Recent Transactions</h3>
            <p class="text-sm text-muted-foreground">Your latest {{ recentTransactions.length }} expenses.</p>
          </div>
          <div class="space-y-4 flex-1 overflow-y-auto pr-2">
            <div v-if="recentTransactions.length === 0" class="text-center text-muted-foreground py-8">
              No transactions yet. Click "Add Expense" to start!
            </div>
            
            <div class="flex items-center gap-4" v-for="expense in recentTransactions" :key="expense.id">
              <div class="h-10 w-10 rounded-full flex items-center justify-center" :class="expense.isBusiness ? 'bg-indigo-500/20 text-indigo-400' : 'bg-primary/20 text-primary'">
                <DollarSign class="h-5 w-5" />
              </div>
              <div class="flex-1 space-y-1 min-w-0">
                <p class="text-sm font-medium leading-none truncate">{{ expense.title }}</p>
                <p class="text-xs text-muted-foreground truncate">{{ expense.expenseDate }} • {{ expense.isBusiness ? 'Business' : 'Private' }}</p>
              </div>
              <div class="font-medium text-sm tabular-nums whitespace-nowrap">-{{ formatCurrency(expense.amount) }}</div>
            </div>
          </div>
        </Card>
      </div>
    </template>

    <!-- Ukryty Modal Dodawania -->
    <AddExpenseModal />
  </div>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent } from 'vue'
  import { useExpensesQuery } from '~/entities/expense/api/queries'
  import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
  } from 'chart.js'
  import { Loader2 } from 'lucide-vue-next'

  const Pie = defineAsyncComponent(() => import('vue-chartjs').then((m) => m.Pie))
  const Bar = defineAsyncComponent(() => import('vue-chartjs').then((m) => m.Bar))

  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

  const { data: expensesResponse, isPending } = useExpensesQuery()
  const expenses = computed(() => expensesResponse.value?.data ?? [])

  // Prepare Pie Chart data (Expenses by Category)
  const pieChartData = computed(() => {
    const categoryMap = new Map<string, { value: number; color: string }>()

    expenses.value.forEach((exp) => {
      if (exp.isBusiness) return // Optionally exclude business, or include all
      const catName = exp.category?.name || 'Uncategorized'
      const catColor = exp.category?.color || '#808080'
      const current = categoryMap.get(catName) || { value: 0, color: catColor }
      categoryMap.set(catName, { value: current.value + Number(exp.amount), color: catColor })
    })

    return {
      labels: Array.from(categoryMap.keys()),
      datasets: [
        {
          backgroundColor: Array.from(categoryMap.values()).map((v) => v.color),
          data: Array.from(categoryMap.values()).map((v) => v.value),
        },
      ],
    }
  })

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: '#94a3b8' },
      },
    },
  }

  // Prepare Bar Chart data (Expenses by Date - simplified to last 7 days or unique dates)
  const barChartData = computed(() => {
    const dateMap = new Map<string, number>()

    expenses.value.forEach((exp) => {
      const current = dateMap.get(exp.expenseDate) || 0
      dateMap.set(exp.expenseDate, current + Number(exp.amount))
    })

    // Sort dates
    const sortedDates = Array.from(dateMap.keys()).sort()

    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Daily Expenses',
          backgroundColor: '#6366f1',
          data: sortedDates.map((date) => dateMap.get(date)!),
        },
      ],
    }
  })

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
    },
  }
</script>

<template>
  <div class="space-y-6 h-full flex flex-col">
    <div>
      <h2
        class="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#2dd4bf] to-[#2dd4bf] bg-clip-text text-transparent"
      >
        Analytics
      </h2>
      <p class="text-muted-foreground mt-1">Visualize your spending patterns.</p>
    </div>

    <div v-if="isPending" class="flex flex-col items-center justify-center py-20 opacity-50 flex-1">
      <Loader2 class="h-10 w-10 animate-spin text-primary mb-4" />
      <p class="text-muted-foreground text-sm font-medium">Analyzing data...</p>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 flex-1">
      <Card class="p-6 bg-card/40 backdrop-blur-sm border-white/10 flex flex-col">
        <h3 class="text-lg font-semibold mb-4">Expenses by Category</h3>
        <div class="flex-1 relative min-h-[300px]">
          <Pie
            v-if="pieChartData.labels.length > 0"
            :data="pieChartData"
            :options="pieChartOptions"
          />
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center text-muted-foreground"
          >
            Not enough data to display.
          </div>
        </div>
      </Card>

      <Card class="p-6 bg-card/40 backdrop-blur-sm border-white/10 flex flex-col">
        <h3 class="text-lg font-semibold mb-4">Daily Spending</h3>
        <div class="flex-1 relative min-h-[300px]">
          <Bar
            v-if="barChartData.labels.length > 0"
            :data="barChartData"
            :options="barChartOptions"
          />
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center text-muted-foreground"
          >
            Not enough data to display.
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

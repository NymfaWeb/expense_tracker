<script setup lang="ts">
  import { Home, PieChart, CreditCard, Settings, LogOut, Loader2 } from 'lucide-vue-next'
  import { useLogoutMutation } from '~/entities/auth/api/queries'

  const { mutate: logout, isPending } = useLogoutMutation()
</script>

<template>
  <aside class="hidden w-64 flex-col border-r bg-card/50 backdrop-blur-xl transition-all md:flex">
    <div class="flex h-16 items-center border-b px-6">
      <span
        class="bg-gradient-to-r from-[#2dd4bf] to-teal-200 bg-clip-text text-xl font-bold text-transparent"
        >FinTrack Pro</span
      >
    </div>

    <nav aria-label="Main Navigation" class="flex-1 space-y-2 p-4">
      <NuxtLink
        to="/"
        active-class="bg-primary/10 text-primary"
        class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <Home class="h-5 w-5" />
        Dashboard
      </NuxtLink>

      <NuxtLink
        to="/analytics"
        active-class="bg-primary/10 text-primary"
        class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <PieChart class="h-5 w-5" />
        Analytics
      </NuxtLink>

      <NuxtLink
        to="/transactions"
        active-class="bg-primary/10 text-primary"
        class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <CreditCard class="h-5 w-5" />
        Transactions
      </NuxtLink>

      <NuxtLink
        to="/settings"
        active-class="bg-primary/10 text-primary"
        class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <Settings class="h-5 w-5" />
        Settings
      </NuxtLink>
    </nav>

    <button
      @click="logout()"
      :disabled="isPending"
      class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Loader2 v-if="isPending" class="h-5 w-5 animate-spin" />
      <LogOut v-else class="h-5 w-5" />
      <span>{{ isPending ? 'Signing out...' : 'Logout' }}</span>
    </button>
  </aside>
</template>

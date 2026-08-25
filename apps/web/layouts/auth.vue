<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-background dark relative overflow-hidden">
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]"></div>
    
    <div class="z-10 w-full max-w-md p-6">
      <div class="flex flex-col items-center mb-8">
        <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg mb-4">
          <span class="text-xl font-bold">NE</span>
        </div>
        <h1 class="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Nymfa Expense</h1>
        <p class="text-sm text-muted-foreground mt-2 text-center">Manage your finances with enterprise-grade security</p>
      </div>
      
      <!-- Miejsce na formularz (NuxtPage) -->
      <NuxtPage />
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell, Search, Menu } from 'lucide-vue-next'
</script>

<template>
  <header class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md">
    <button class="md:hidden p-2 text-muted-foreground hover:bg-accent rounded-md">
      <Menu class="h-5 w-5" />
    </button>
    
    <div class="flex flex-1 items-center gap-4">
      <div class="relative hidden sm:block w-full max-w-md">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search transactions..." 
          class="h-10 w-full rounded-full border border-input bg-background/50 pl-10 pr-4 text-sm ring-offset-background transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>
    </div>
    
    <div class="flex items-center gap-4">
      <button class="relative p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full transition-colors">
        <Bell class="h-5 w-5" />
        <span class="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background"></span>
      </button>
      
      <div class="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-sm">
        U
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  title?: string
  description?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

function close() {
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition 
      enter-active-class="transition-opacity duration-200 ease" 
      leave-active-class="transition-opacity duration-200 ease" 
      enter-from-class="opacity-0" 
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" @click="close"></div>
    </Transition>
    <Transition 
      enter-active-class="transition-all duration-200 ease-out" 
      leave-active-class="transition-all duration-200 ease-out" 
      enter-from-class="opacity-0 -translate-y-[45%] scale-95" 
      leave-to-class="opacity-0 -translate-y-[45%] scale-95"
    >
      <div v-if="open" class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 v-if="title" class="text-lg font-semibold leading-none tracking-tight">{{ title }}</h2>
          <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
        </div>
        
        <slot />
        
        <button @click="close" class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>


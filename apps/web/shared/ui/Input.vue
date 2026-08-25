<script setup lang="ts">
import { computed } from 'vue'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const props = defineProps<{
  class?: ClassValue
  modelValue?: string | number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const computedClass = computed(() => twMerge(clsx('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', props.class)))
</script>

<template>
  <input 
    :class="computedClass" 
    :value="modelValue" 
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" 
    v-bind="$attrs" 
  />
</template>

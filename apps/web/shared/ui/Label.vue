<script setup lang="ts">
import { computed } from 'vue'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const props = defineProps<{ class?: ClassValue }>()

const computedClass = computed(() => {
  return twMerge(clsx('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', props.class))
})
</script>

<template>
  <label :class="computedClass" v-bind="$attrs">
    <slot />
  </label>
</template>

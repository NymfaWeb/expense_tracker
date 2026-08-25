<script setup lang="ts">
import { computed } from 'vue'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const props = defineProps<{
  class?: ClassValue
}>()

const computedClass = computed(() => twMerge(clsx('rounded-xl border bg-card text-card-foreground shadow-sm', props.class)))
</script>

<template>
  <div :class="computedClass" v-bind="$attrs">
    <slot />
  </div>
</template>

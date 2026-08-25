<script setup lang="ts">
import LoginForm from '~/features/auth/ui/LoginForm.vue'

definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <div class="w-full">
    <LoginForm />
  </div>
</template>

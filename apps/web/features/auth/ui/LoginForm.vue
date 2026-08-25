<script setup lang="ts">
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useLoginMutation } from '~/entities/auth/api/queries'

const email = ref('')
const password = ref('')
const { mutate: login, isPending, isError } = useLoginMutation()

const handleSubmit = () => {
  if (!email.value || !password.value) return
  login({ email: email.value, password: password.value })
}
</script>

<template>
  <Card class="w-full bg-card/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden relative">
    <div class="absolute inset-0 bg-gradient-to-br from-[#2dd4bf]/5 to-[#2dd4bf]/10 pointer-events-none"></div>
    
    <div class="p-8 relative z-10">
      <div class="space-y-1 mb-8 text-center">
        <h2 class="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p class="text-sm text-muted-foreground">Enter your credentials to access your account</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="name@example.com" 
            required 
            class="bg-background/50 border-white/10 focus:border-[#2dd4bf] transition-colors"
          />
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label for="password">Password</Label>
            <a href="#" class="text-xs text-[#2dd4bf] hover:text-[#2dd4bf]/80 transition-colors">Forgot password?</a>
          </div>
          <Input 
            id="password" 
            v-model="password" 
            type="password" 
            required
            class="bg-background/50 border-white/10 focus:border-[#2dd4bf] transition-colors" 
          />
        </div>

        <div v-if="isError" class="text-sm text-destructive font-medium p-3 bg-destructive/10 rounded-md border border-destructive/20">
          Invalid email or password. Please try again.
        </div>

        <Button 
          type="submit" 
          class="w-full bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-black transition-all shadow-lg shadow-[#2dd4bf]/20 mt-2"
          :disabled="isPending"
        >
          <Loader2 v-if="isPending" class="mr-2 h-4 w-4 animate-spin" />
          {{ isPending ? 'Signing in...' : 'Sign In' }}
        </Button>
      </form>
    </div>
    
    <div class="border-t border-white/10 p-6 bg-black/20 text-center relative z-10">
      <p class="text-sm text-muted-foreground">
        Don't have an account? 
        <a href="#" class="text-[#2dd4bf] hover:text-[#2dd4bf]/80 font-medium transition-colors">Create one</a>
      </p>
    </div>
  </Card>
</template>

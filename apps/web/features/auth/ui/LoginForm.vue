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
  <Card class="w-full bg-zinc-950/70 backdrop-blur-2xl border-white/20 shadow-2xl overflow-hidden relative">
    <div class="absolute inset-0 bg-gradient-to-br from-[#2dd4bf]/10 to-[#2dd4bf]/5 pointer-events-none"></div>
    
    <div class="p-8 sm:p-10 relative z-10">
      <div class="space-y-2 mb-10 text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
        <p class="text-zinc-400">Enter your credentials to access your account</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-2">
          <Label for="email" class="text-zinc-200">Email</Label>
          <Input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="name@example.com" 
            required 
            class="bg-black/50 border-white/20 text-white placeholder:text-zinc-500 focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf]/50 transition-all h-11"
          />
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label for="password" class="text-zinc-200">Password</Label>
            <a href="#" class="text-sm text-[#2dd4bf] hover:text-[#2dd4bf]/80 transition-colors font-medium">Forgot password?</a>
          </div>
          <Input 
            id="password" 
            v-model="password" 
            type="password" 
            required
            class="bg-black/50 border-white/20 text-white focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf]/50 transition-all h-11" 
          />
        </div>

        <div v-if="isError" class="text-sm text-destructive font-medium p-3 bg-destructive/10 rounded-md border border-destructive/20">
          Invalid email or password. Please try again.
        </div>

        <Button 
          type="submit" 
          class="w-full bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-black font-semibold transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] mt-4 h-11 text-base rounded-lg"
          :disabled="isPending"
        >
          <Loader2 v-if="isPending" class="mr-2 h-4 w-4 animate-spin" />
          {{ isPending ? 'Signing in...' : 'Sign In' }}
        </Button>
      </form>
    </div>
    
    <div class="border-t border-white/10 p-6 bg-black/40 text-center relative z-10">
      <p class="text-zinc-400">
        Don't have an account? 
        <a href="#" class="text-[#2dd4bf] hover:text-[#2dd4bf]/80 font-semibold transition-colors">Create one</a>
      </p>
    </div>
  </Card>
</template>

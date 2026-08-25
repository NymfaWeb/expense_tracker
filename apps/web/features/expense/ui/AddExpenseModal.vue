<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Loader2, BriefcaseBusiness, User as UserIcon } from 'lucide-vue-next'
import { useExpenseStore } from '~/entities/expense/model/store'
import { useCreateExpenseMutation } from '~/entities/expense/api/queries'

const store = useExpenseStore()
const { isAddExpenseModalOpen } = storeToRefs(store)

const { mutate: createExpense, isPending } = useCreateExpenseMutation()

const form = ref({
  title: '',
  amount: '',
  expenseDate: new Date().toISOString().split('T')[0],
  isBusiness: false,
})

function submitForm() {
  createExpense(
    {
      title: form.value.title,
      amount: parseFloat(form.value.amount),
      expenseDate: form.value.expenseDate,
      isBusiness: form.value.isBusiness,
    },
    {
      onSuccess: () => {
        form.value = {
          title: '',
          amount: '',
          expenseDate: new Date().toISOString().split('T')[0],
          isBusiness: false,
        }
        store.toggleAddExpenseModal()
      }
    }
  )
}
</script>

<template>
  <Dialog 
    v-model:open="isAddExpenseModalOpen" 
    title="Add New Expense" 
    description="Enter the details of your new transaction here."
  >
    <form @submit.prevent="submitForm" class="space-y-6 pt-4">
      <div class="space-y-2">
        <Label for="title">Title</Label>
        <Input 
          id="title" 
          v-model="form.title" 
          placeholder="e.g. Weekly Groceries" 
          required 
          class="bg-background/50 border-white/10"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="amount">Amount (PLN)</Label>
          <Input 
            id="amount" 
            v-model="form.amount" 
            type="number" 
            step="0.01" 
            min="0.01" 
            placeholder="0.00" 
            required 
            class="bg-background/50 border-white/10"
          />
        </div>
        <div class="space-y-2">
          <Label for="date">Date</Label>
          <Input 
            id="date" 
            v-model="form.expenseDate" 
            type="date" 
            required 
            class="bg-background/50 border-white/10"
          />
        </div>
      </div>

      <div class="space-y-3 pt-2">
        <Label>Transaction Type</Label>
        <div class="grid grid-cols-2 gap-3">
          <div 
            @click="form.isBusiness = false"
            class="flex items-center justify-center gap-2 p-3 rounded-md border cursor-pointer transition-all"
            :class="!form.isBusiness ? 'bg-primary/20 border-primary text-primary' : 'border-white/10 text-muted-foreground hover:bg-muted/50'"
          >
            <UserIcon class="h-4 w-4" />
            <span class="text-sm font-medium">Private</span>
          </div>
          <div 
            @click="form.isBusiness = true"
            class="flex items-center justify-center gap-2 p-3 rounded-md border cursor-pointer transition-all"
            :class="form.isBusiness ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'border-white/10 text-muted-foreground hover:bg-muted/50'"
          >
            <BriefcaseBusiness class="h-4 w-4" />
            <span class="text-sm font-medium">Business</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <Button 
          type="button" 
          variant="ghost" 
          class="mr-2" 
          @click="store.toggleAddExpenseModal()"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white"
          :disabled="isPending"
        >
          <Loader2 v-if="isPending" class="mr-2 h-4 w-4 animate-spin" />
          {{ isPending ? 'Saving...' : 'Save Expense' }}
        </Button>
      </div>
    </form>
  </Dialog>
</template>

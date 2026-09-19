<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { Loader2, BriefcaseBusiness, User as UserIcon } from 'lucide-vue-next'
  import { useExpenseStore } from '~/entities/expense/model/store'
  import {
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
  } from '~/entities/expense/api/queries'
  import { useCategoriesQuery } from '~/entities/category/api/queries'

  const store = useExpenseStore()
  const { isAddExpenseModalOpen, editingExpense } = storeToRefs(store)

  const { mutate: createExpense, isPending: isCreating } = useCreateExpenseMutation()
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpenseMutation()

  const isPending = computed(() => isCreating.value || isUpdating.value)
  const isEditMode = computed(() => !!editingExpense.value)

  const { data: categoriesResponse } = useCategoriesQuery()
  const categories = computed(() => categoriesResponse.value?.data ?? [])

  const form = ref({
    title: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    isBusiness: false,
    categoryId: '',
  })

  // Obserwuj zmiany trybu edycji, by uzupełnić formularz
  watch(editingExpense, (newVal) => {
    if (newVal) {
      form.value = {
        title: newVal.title,
        amount: newVal.amount,
        expenseDate: newVal.expenseDate,
        isBusiness: newVal.isBusiness,
        categoryId: newVal.category?.id || '',
      }
    } else {
      form.value = {
        title: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        isBusiness: false,
        categoryId: '',
      }
    }
  })

  function submitForm() {
    const payload = {
      title: form.value.title,
      amount: parseFloat(form.value.amount),
      expenseDate: form.value.expenseDate,
      isBusiness: form.value.isBusiness,
      categoryId: form.value.categoryId || undefined,
    }

    if (isEditMode.value) {
      updateExpense(
        { id: editingExpense.value.id, ...payload },
        { onSuccess: () => store.toggleAddExpenseModal() },
      )
    } else {
      createExpense(payload, { onSuccess: () => store.toggleAddExpenseModal() })
    }
  }
</script>

<template>
  <Dialog
    v-model:open="isAddExpenseModalOpen"
    :title="isEditMode ? 'Edit Expense' : 'Add New Expense'"
    :description="
      isEditMode
        ? 'Update your transaction details here.'
        : 'Enter the details of your new transaction here.'
    "
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
        <Label for="category">Category</Label>
        <select
          id="category"
          v-model="form.categoryId"
          class="w-full bg-background/50 border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="" disabled>Select a category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="space-y-3 pt-2">
        <Label id="transaction-type-label">Transaction Type</Label>
        <div
          class="grid grid-cols-2 gap-3"
          role="radiogroup"
          aria-labelledby="transaction-type-label"
        >
          <div
            @click="form.isBusiness = false"
            @keydown.enter.prevent="form.isBusiness = false"
            @keydown.space.prevent="form.isBusiness = false"
            tabindex="0"
            role="radio"
            :aria-checked="!form.isBusiness"
            class="flex items-center justify-center gap-2 p-3 rounded-md border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            :class="
              !form.isBusiness
                ? 'bg-primary/20 border-primary text-primary'
                : 'border-white/10 text-muted-foreground hover:bg-muted/50'
            "
          >
            <UserIcon class="h-4 w-4" />
            <span class="text-sm font-medium">Private</span>
          </div>
          <div
            @click="form.isBusiness = true"
            @keydown.enter.prevent="form.isBusiness = true"
            @keydown.space.prevent="form.isBusiness = true"
            tabindex="0"
            role="radio"
            :aria-checked="form.isBusiness"
            class="flex items-center justify-center gap-2 p-3 rounded-md border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]"
            :class="
              form.isBusiness
                ? 'bg-teal-500/20 border-[#2dd4bf] text-[#2dd4bf]'
                : 'border-white/10 text-muted-foreground hover:bg-muted/50'
            "
          >
            <BriefcaseBusiness class="h-4 w-4" />
            <span class="text-sm font-medium">Business</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <Button type="button" variant="ghost" class="mr-2" @click="store.toggleAddExpenseModal()">
          Cancel
        </Button>
        <Button
          type="submit"
          class="bg-[#2dd4bf] hover:bg-teal-500 text-white"
          :disabled="isPending"
        >
          <Loader2 v-if="isPending" class="mr-2 h-4 w-4 animate-spin" />
          {{ isPending ? 'Saving...' : isEditMode ? 'Update Expense' : 'Save Expense' }}
        </Button>
      </div>
    </form>
  </Dialog>
</template>

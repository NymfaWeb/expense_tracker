<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useDark, useToggle } from '@vueuse/core'
  import {
    useCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
  } from '~/entities/category/api/queries'
  import { Trash2, Loader2, Plus } from 'lucide-vue-next'

  const { data: categoriesResponse, isPending } = useCategoriesQuery()
  const categories = computed(() => categoriesResponse.value?.data ?? [])

  const { mutate: createCategory, isPending: isCreating } = useCreateCategoryMutation()
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategoryMutation()

  const newCategory = ref({
    name: '',
    color: '#6366f1',
  })

  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  const handleAddCategory = () => {
    if (!newCategory.value.name.trim()) return
    createCategory(
      {
        name: newCategory.value.name,
        color: newCategory.value.color,
      },
      {
        onSuccess: () => {
          newCategory.value.name = ''
          newCategory.value.color = '#6366f1'
        },
      },
    )
  }

  const handleDeleteCategory = (id: string, isDefault: boolean) => {
    if (isDefault) {
      alert('You cannot delete default categories.')
      return
    }
    if (confirm('Are you sure you want to delete this custom category?')) {
      deleteCategory(id)
    }
  }
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2
        class="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#2dd4bf] to-[#2dd4bf] bg-clip-text text-transparent"
      >
        Settings
      </h2>
      <p class="text-muted-foreground mt-1">Manage your application preferences and categories.</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Categories Management -->
      <Card class="p-6 bg-card/40 backdrop-blur-sm border-white/10">
        <div class="mb-4">
          <h3 class="text-lg font-semibold leading-none tracking-tight">Expense Categories</h3>
          <p class="text-sm text-muted-foreground mt-1">Manage categories for your transactions.</p>
        </div>

        <form @submit.prevent="handleAddCategory" class="flex gap-3 mb-6">
          <div class="flex-1">
            <label for="new-cat-name" class="sr-only">Category name</label>
            <input
              id="new-cat-name"
              v-model="newCategory.name"
              type="text"
              placeholder="Category name..."
              class="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div class="w-16">
            <label for="new-cat-color" class="sr-only">Category color</label>
            <input
              id="new-cat-color"
              v-model="newCategory.color"
              type="color"
              aria-label="Category color"
              class="w-full h-10 p-1 bg-background border border-input rounded-md cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <Button
            type="submit"
            :disabled="isCreating"
            class="bg-[#2dd4bf] hover:bg-teal-500 text-white shrink-0"
          >
            <Loader2 v-if="isCreating" class="h-4 w-4 mr-2 animate-spin" />
            <Plus v-else class="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>

        <div v-if="isPending" class="flex items-center justify-center py-10 opacity-50">
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50"
          >
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: cat.color }"></div>
              <span class="font-medium text-sm">{{ cat.name }}</span>
              <span
                v-if="!cat.userId"
                class="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                >Default</span
              >
            </div>
            <button
              v-if="cat.userId"
              @click="handleDeleteCategory(cat.id, !cat.userId)"
              :disabled="isDeleting"
              aria-label="Delete category"
              class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-destructive"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      <!-- Preferences -->
      <Card class="p-6 bg-card/40 backdrop-blur-sm border-white/10">
        <div class="mb-4">
          <h3 class="text-lg font-semibold leading-none tracking-tight">Preferences</h3>
          <p class="text-sm text-muted-foreground mt-1">Application wide settings.</p>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium" id="dark-mode-label">Dark Mode</span>
            <button
              role="switch"
              :aria-checked="isDark"
              aria-labelledby="dark-mode-label"
              @click="toggleDark()"
              class="w-11 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              :class="isDark ? 'bg-primary' : 'bg-muted'"
            >
              <div
                class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"
                :class="isDark ? 'translate-x-5' : 'translate-x-0'"
              ></div>
            </button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    include: [
      'features/**/*.test.ts',
      'entities/**/*.test.ts',
      'shared/**/*.test.ts',
      'widgets/**/*.test.ts'
    ]
  }
})

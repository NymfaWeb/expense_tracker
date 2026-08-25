import { test, expect } from '@playwright/test';

test.describe('Expense Tracker Flow', () => {
  test('should login, view dashboard and add a new expense', async ({ page }) => {
    await page.goto('/');

    // Poczekaj na przekierowanie do logowania
    await expect(page).toHaveURL(/.*\/login/);

    // 2. Logowanie
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'secretpassword'); // wpisz tu prawdziwe testowe, z jakim postawiles backend
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible();

    await page.click('button:has-text("Add Expense")');
    await expect(page.locator('h2', { hasText: 'Add New Expense' })).toBeVisible();

    const expenseTitle = `E2E Playwright Coffee ${Date.now()}`;
    await page.fill('input#title', expenseTitle);
    await page.fill('input#amount', '25.50');
    // Ustawienie daty
    await page.fill('input#date', '2024-01-10');
    // Wybierz Business
    await page.click('text=Business');
    
    // Zapisz
    await page.click('button[type="submit"]:has-text("Save")');

    await expect(page.locator('h2', { hasText: 'Add New Expense' })).toBeHidden();

    await expect(page.locator(`text=${expenseTitle}`)).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

// Using serial mode because we want each test to build on the previous one (CRUD)
test.describe.serial('Companies CRUD Flow', () => {
  const companyName = `E2E Test Company ${Date.now()}`;
  const updatedName = `${companyName} (Updated)`;

  test('Create a new company', async ({ page }) => {
    await page.goto('/companies');

    // Navigate to create page
    await page.getByRole('link', { name: /Add Company/i }).click();
    await expect(page).toHaveURL(/\/companies\/new$/);

    // Fill out form
    await page.locator('input[name="name"]').fill(companyName);
    await page.locator('input[name="website"]').fill('https://playwright.dev');
    await page.locator('input[name="industry"]').fill('Software Testing');
    await page.locator('input[name="sizeRange"]').fill('50-100');
    await page.locator('textarea[name="notes"]').fill('Initial E2E notes');

    // Submit
    await page.getByRole('button', { name: /Create/i }).click();

    // Verify redirection and existence
    await expect(page).toHaveURL(/\/companies$/);
    await expect(page.getByText(companyName)).toBeVisible();
  });

  test('Read/View company details', async ({ page }) => {
    await page.goto('/companies');

    // Verify the company card exists and has correct info
    const companyCard = page.locator('.card', { hasText: companyName });
    await expect(companyCard).toBeVisible();
    await expect(companyCard).toContainText('Software Testing');
    await expect(companyCard).toContainText('50-100');
  });

  test('Update company information', async ({ page }) => {
    await page.goto('/companies');

    // Click the edit icon (PencilIcon) in the correct card
    const companyCard = page.locator('.card', { hasText: companyName });
    await companyCard.locator('a[href*="/edit"]').click();

    // Verify we are on the edit page
    await expect(page).toHaveURL(/\/companies\/.*\/edit$/);

    // Change the name and notes
    await page.locator('input[name="name"]').fill(updatedName);
    await page.locator('textarea[name="notes"]').fill('Updated E2E notes');

    // Submit
    await page.getByRole('button', { name: /Update/i }).click();

    // Verify redirection and updated data
    await expect(page).toHaveURL(/\/companies$/);
    await expect(page.getByText(updatedName)).toBeVisible();
    await expect(page.getByText('Updated E2E notes')).toBeVisible();
  });

  test('Delete the company', async ({ page }) => {
    await page.goto('/companies');

    // Click the delete icon (TrashIcon) in the updated card
    const companyCard = page.locator('.card', { hasText: updatedName });
    await companyCard.locator('a[href*="/delete"]').click();

    // Assuming there's a confirmation step on the delete page
    await expect(page).toHaveURL(/\/companies\/.*\/delete$/);

    // Look for a delete confirmation button
    const deleteButton = page.getByRole('button', { name: /Delete|Confirm/i });
    await deleteButton.click();

    // Verify redirection and removal
    await expect(page).toHaveURL(/\/companies$/);
    await expect(page.getByText(updatedName)).toBeHidden();
  });
});

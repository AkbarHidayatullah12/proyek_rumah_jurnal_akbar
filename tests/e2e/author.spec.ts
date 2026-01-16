import { test, expect } from '@playwright/test';

test('Author list page shows submissions and links navigate', async ({ page }) => {
  await page.goto('http://localhost:3000/author/daftar-pengajuan');
  await expect(page.getByText('Daftar Pengajuan Saya')).toBeVisible();

  // wait for table to load and check first row title link exists
  const firstTitle = page.locator('table tbody tr').first().locator('a');
  await expect(firstTitle).toBeVisible();

  // click and assert navigation to detail page
  await firstTitle.click();
  await expect(page).toHaveURL(/\/author\/daftar-pengajuan\/.+/);
});
import { test, expect } from '@playwright/test';

test.describe('Wikipedia main flows', () => {
  test('loads the main page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Wikipedia/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Wikipedia');
  });

  test('searches for Playwright software', async ({ page }) => {
    await page.goto('/');
    const searchBox = page.getByRole('searchbox', { name: 'Search Wikipedia' });
    await searchBox.fill('Playwright (software)');
    await searchBox.press('Enter');

    await expect(page).toHaveURL(/Playwright_\(software\)/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Playwright');
    await expect(page.locator('#mw-content-text')).toContainText('Microsoft');
  });

  test('navigates to the random article and back', async ({ page }) => {
    await page.goto('/');
    await page.goto('/wiki/Special:Random'); // avoid flaky header locator
    await expect(page).toHaveURL(/wiki\//);

    const firstHeading = page.getByRole('heading', { level: 1 });
    await expect(firstHeading).toBeVisible();

    await page.goto('/');
    await expect(page).toHaveURL(/\/(wiki\/Main_Page)?$/);
  });
});

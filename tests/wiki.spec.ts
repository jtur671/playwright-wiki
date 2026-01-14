import { test, expect } from '@playwright/test';
import { WikipediaHomePage } from './pages/WikipediaHomePage';
import { WikipediaArticlePage } from './pages/WikipediaArticlePage';

test.describe('Wikipedia main flows', () => {
  test('loads the main page', async ({ page }) => {
    const home = new WikipediaHomePage(page);
    const article = new WikipediaArticlePage(page);

    await home.goto();
    await expect(page).toHaveTitle(/Wikipedia/);
    await expect(article.heading).toContainText('Wikipedia');
  });

  test('searches for Playwright software', async ({ page }) => {
    const home = new WikipediaHomePage(page);
    const article = new WikipediaArticlePage(page);

    await home.goto();
    await home.searchFor('Playwright (software)');

    await expect(page).toHaveURL(/Playwright_\(software\)/);
    await expect(article.heading).toContainText('Playwright');
    await expect(article.content).toContainText('Microsoft');
  });

  test('navigates to the random article and back', async ({ page }) => {
    const home = new WikipediaHomePage(page);
    const article = new WikipediaArticlePage(page);

    await home.goto();
    await home.openRandomArticle();
    await expect(page).toHaveURL(/wiki\//);

    await expect(article.heading).toBeVisible();

    await home.goto();
    await expect(page).toHaveURL(/\/(wiki\/Main_Page)?$/);
  });
});

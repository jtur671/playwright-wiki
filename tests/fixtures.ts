import { test as base, expect } from '@playwright/test';
import { WikipediaHomePage } from './pages/WikipediaHomePage';
import { WikipediaArticlePage } from './pages/WikipediaArticlePage';
import { WikipediaSearchResultsPage } from './pages/WikipediaSearchResultsPage';

type Fixtures = {
  home: WikipediaHomePage;
  article: WikipediaArticlePage;
  results: WikipediaSearchResultsPage;
};

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => {
    await use(new WikipediaHomePage(page));
  },
  article: async ({ page }, use) => {
    await use(new WikipediaArticlePage(page));
  },
  results: async ({ page }, use) => {
    await use(new WikipediaSearchResultsPage(page));
  },
});

export { expect };

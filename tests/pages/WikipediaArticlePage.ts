import { type Locator, type Page } from '@playwright/test';

export class WikipediaArticlePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly content: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.content = page.locator('#mw-content-text');
  }
}

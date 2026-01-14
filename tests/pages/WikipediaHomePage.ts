import { type Locator, type Page } from '@playwright/test';

export class WikipediaHomePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly randomArticleLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByRole('searchbox', { name: 'Search Wikipedia' });
    this.randomArticleLink = page.getByRole('link', { name: 'Random article' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async searchFor(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchBox.press('Enter');
  }

  async openRandomArticle(): Promise<void> {
    await this.page.goto('/wiki/Special:Random');
  }
}

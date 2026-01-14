import { expect, type Locator, type Page } from '@playwright/test';
import { WikipediaTopNav } from '../components/WikipediaTopNav';

export class WikipediaHomePage {
  readonly page: Page;
  readonly topNav: WikipediaTopNav;
  readonly mainHeading: Locator;
  readonly randomArticleLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topNav = new WikipediaTopNav(page);
    this.mainHeading = page.getByRole('heading', { level: 1 });
    this.randomArticleLink = page.getByRole('link', { name: 'Random article' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openRandomArticle(): Promise<void> {
    await this.page.goto('/wiki/Special:Random');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Wikipedia/);
    await expect(this.mainHeading).toContainText('Wikipedia');
  }
}

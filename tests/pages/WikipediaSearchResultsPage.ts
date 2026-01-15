import { expect, type Locator, type Page } from '@playwright/test';

export class WikipediaSearchResultsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly resultLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1, name: /Search results/i });
    this.resultLinks = page.locator('.mw-search-result-heading a');
  }

  async isOpen(): Promise<boolean> {
    return this.heading.isVisible({ timeout: 2000 }).catch(() => false);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async openFirstResult(): Promise<void> {
    await this.resultLinks.first().click();
  }

  async openRandomResult(maxResults = 5): Promise<void> {
    const total = await this.resultLinks.count();
    if (total === 0) {
      throw new Error('No search results available.');
    }

    const maxIndex = Math.min(maxResults, total) - 1;
    const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
    await this.resultLinks.nth(randomIndex).click();
  }

  async openResult(title: string): Promise<void> {
    await this.resultLinks.filter({ hasText: title }).first().click();
  }

  async openFirstResultIfPresent(): Promise<boolean> {
    if (!(await this.isOpen())) {
      return false;
    }

    await this.openFirstResult();
    return true;
  }

  async openRandomResultIfPresent(maxResults = 5): Promise<boolean> {
    if (!(await this.isOpen())) {
      return false;
    }

    await this.openRandomResult(maxResults);
    return true;
  }

  async openResultIfPresent(title: string): Promise<boolean> {
    if (!(await this.isOpen())) {
      return false;
    }

    await this.openResult(title);
    return true;
  }
}

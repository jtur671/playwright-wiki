import { expect, type Locator, type Page } from '@playwright/test';

export class WikipediaTopNav {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly mainPageLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByRole('searchbox', { name: 'Search Wikipedia' });
    this.mainPageLink = page.getByRole('link', { name: 'Main page' });
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchBox.press('Enter');
  }

  async openMainPage(): Promise<void> {
    await this.mainPageLink.click();
  }

  async openMainPageSafe(): Promise<void> {
    const primaryLink = this.mainPageLink.first();
    let clicked = false;

    if (await primaryLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await primaryLink.click();
      clicked = true;
    } else {
      const candidates = this.page.locator('a[href="/wiki/Main_Page"]');
      const count = await candidates.count();

      for (let i = 0; i < count; i += 1) {
        const candidate = candidates.nth(i);
        if (await candidate.isVisible().catch(() => false)) {
          await candidate.click();
          clicked = true;
          break;
        }
      }

      if (!clicked) {
        const logoLink = this.page.locator('a.mw-logo');
        if (await logoLink.isVisible().catch(() => false)) {
          await logoLink.click();
          clicked = true;
        }
      }
    }

    await expect(clicked).toBe(true);
  }
}

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
    let lastError: unknown;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const searchBox = this.page.getByRole('searchbox', { name: 'Search Wikipedia' }).first();

      try {
        await searchBox.waitFor({ state: 'visible', timeout: 2000 });
        await searchBox.evaluate((element, value) => {
          const input = element as HTMLInputElement;
          input.value = value as string;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));

          if (input.form) {
            input.form.submit();
          } else {
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          }
        }, term);
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
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

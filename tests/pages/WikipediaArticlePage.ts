import { expect, type Locator, type Page } from '@playwright/test';
import { WikipediaTopNav } from '../components/WikipediaTopNav';

export class WikipediaArticlePage {
  readonly page: Page;
  readonly topNav: WikipediaTopNav;
  readonly heading: Locator;
  readonly content: Locator;
  readonly toc: Locator;
  readonly infobox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topNav = new WikipediaTopNav(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.content = page.locator('#mw-content-text');
    this.toc = page.locator(
      '#toc, #vector-toc, .vector-toc, nav[aria-label="Contents"], nav[aria-labelledby="p-toc-label"]'
    );
    this.infobox = page.locator('table.infobox').first();
  }

  async open(slug: string): Promise<void> {
    await this.page.goto(`/wiki/${slug}`);
  }

  async expectHeadingContains(text: string): Promise<void> {
    await expect(this.heading).toContainText(text);
  }

  async expectHeadingVisible(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectMainPageHeading(): Promise<void> {
    await expect(this.heading).toContainText(/Main Page|Welcome to Wikipedia/);
  }

  async expectContentMentions(mentions: string[]): Promise<void> {
    for (const mention of mentions) {
      await expect(this.content).toContainText(mention);
    }
  }

  async expectInfoboxContains(text: string): Promise<void> {
    await expect(this.infobox).toBeVisible();
    await expect(this.infobox).toContainText(text);
  }

  async openTab(label: string | RegExp): Promise<void> {
    const tabLink = this.page.getByRole('link', { name: label }).first();
    await expect(tabLink).toBeVisible();
    await tabLink.click();
  }

  async openTocSection(anchor: string): Promise<void> {
    await expect(this.toc.first()).toBeVisible();
    const tocLink = this.toc.locator(`a[href="#${anchor}"]`).first();
    await expect(tocLink).toBeVisible();
    await tocLink.click();
  }

  async expectSectionVisible(anchor: string): Promise<void> {
    await expect(this.page.locator(`#${anchor}`)).toBeVisible();
  }

  async openFirstInternalLinkInIntro(): Promise<void> {
    const firstPara = this.page.locator('#mw-content-text .mw-parser-output > p:not(.mw-empty-elt)').first();
    await expect(firstPara).toBeVisible();

    const firstInternalLink = firstPara.locator('a[href^="/wiki/"]:not([href*=":"])').first();
    await expect(firstInternalLink).toBeVisible();
    await firstInternalLink.click();
  }
}

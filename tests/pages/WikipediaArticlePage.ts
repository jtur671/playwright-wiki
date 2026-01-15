import { expect, type Locator, type Page } from '@playwright/test';
import { WikipediaTopNav } from '../components/WikipediaTopNav';

export class WikipediaArticlePage {
  readonly page: Page;
  readonly topNav: WikipediaTopNav;
  readonly heading: Locator;
  readonly content: Locator;
  readonly toc: Locator;
  readonly infobox: Locator;
  readonly editorTextarea: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topNav = new WikipediaTopNav(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.content = page.locator('#mw-content-text');
    this.toc = page.locator(
      '#toc, #vector-toc, .vector-toc, nav[aria-label="Contents"], nav[aria-labelledby="p-toc-label"]'
    );
    this.infobox = page.locator('table.infobox').first();
    this.editorTextarea = page.locator('#wpTextbox1');
  }

  async open(slug: string): Promise<void> {
    await this.page.goto(`/wiki/${slug}`);
  }

  async openAndCaptureSummary(
    slug: string
  ): Promise<{ title: string; extract: string; source: 'network' | 'fallback'; url: string }> {
    const apiUrl = new RegExp(`api\\.php.*action=query.*titles=${this.encodeTitle(slug)}`, 'i');
    const fallbackUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&format=json&titles=${this.encodeTitle(
      slug
    )}`;

    const responsePromise = this.page.waitForResponse(apiUrl, { timeout: 5000 }).catch(() => null);

    await this.open(slug);
    await this.expectHeadingVisible();

    const response = await responsePromise;
    if (response) {
      const json = await response.json().catch(() => null);
      const summary = this.readSummary(json);
      console.log(`[api] summary response: ${response.url()}`);
      return {
        title: summary.title,
        extract: summary.extract,
        source: 'network',
        url: response.url(),
      };
    }

    const res = await this.page.request.get(fallbackUrl);
    console.log(`[api] fallback summary response: ${res.url()}`);
    const json = await res.json().catch(() => null);
    const summary = this.readSummary(json);
    return {
      title: summary.title,
      extract: summary.extract,
      source: 'fallback',
      url: res.url(),
    };
  }

  async openAndExpectHeading(slug: string): Promise<void> {
    await this.open(slug);
    await this.expectHeadingVisible();
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

  async openViewSourceOrNavigate(slug: string): Promise<void> {
    const viewSource = this.page.getByRole('link', { name: /View source|Edit source/i }).first();
    if (await this.tryClickLocator(viewSource)) {
      await expect(this.page).toHaveURL(/action=edit/i);
      return;
    }

    await this.page.goto(`/w/index.php?title=${this.encodeTitle(slug)}&action=edit`);
  }

  async openPageInformation(slug: string): Promise<void> {
    await this.openToolOrNavigate(
      /Page information/i,
      'action=info',
      `/w/index.php?title=${this.encodeTitle(slug)}&action=info`
    );
  }

  async openCiteThisPage(slug: string): Promise<void> {
    await this.openToolOrNavigate(
      /Cite this page/i,
      'Special:CiteThisPage',
      `/w/index.php?title=Special:CiteThisPage&page=${this.encodeTitle(slug)}`
    );
  }

  async openPermanentLink(slug: string): Promise<void> {
    if (await this.tryClickLinkByNameOrHref(/Permanent link/i, 'oldid=')) {
      return;
    }

    await this.page.goto(`/w/index.php?title=${this.encodeTitle(slug)}&action=history`);
    const firstRevision = this.page.locator('#pagehistory a[href*="oldid="]').first();
    await expect(firstRevision).toBeVisible();
    await firstRevision.click();
  }

  async openWhatLinksHere(slug: string): Promise<void> {
    await this.openToolOrNavigate(
      /What links here/i,
      'Special:WhatLinksHere',
      `/wiki/Special:WhatLinksHere/${this.encodeTitle(slug)}`
    );
  }

  async switchToLanguageOrNavigate(slug: string, languageCode: string): Promise<void> {
    const link = this.page.locator(`a[lang="${languageCode}"]`).first();
    if (await this.tryClickLocator(link)) {
      return;
    }

    await this.page.goto(`https://${languageCode}.wikipedia.org/wiki/${this.encodeTitle(slug)}`);
  }

  async openPrivacyPolicyFromFooter(): Promise<void> {
    const privacy = this.page.getByRole('link', { name: /Privacy policy/i }).first();
    await privacy.scrollIntoViewIfNeeded();
    await privacy.click();
  }

  private async openToolOrNavigate(name: RegExp, hrefContains: string, fallbackUrl: string): Promise<void> {
    if (await this.tryClickLinkByNameOrHref(name, hrefContains)) {
      return;
    }

    await this.page.goto(fallbackUrl);
  }

  private async tryClickLinkByNameOrHref(name: RegExp, hrefContains: string): Promise<boolean> {
    const byName = this.page.getByRole('link', { name }).first();
    if (await this.tryClickLocator(byName)) {
      return true;
    }

    const byHref = this.page.locator(`a[href*="${hrefContains}"]`).first();
    if (await this.tryClickLocator(byHref)) {
      return true;
    }

    return false;
  }

  private async tryClickLocator(locator: Locator): Promise<boolean> {
    if (await locator.isVisible({ timeout: 1500 }).catch(() => false)) {
      await locator.scrollIntoViewIfNeeded();
      await locator.click();
      return true;
    }

    return false;
  }

  private encodeTitle(title: string): string {
    return encodeURIComponent(title);
  }

  private readSummary(json: any): { title: string; extract: string } {
    const pages = json?.query?.pages;
    const firstKey = pages ? Object.keys(pages)[0] : null;
    const pageObj = firstKey ? pages[firstKey] : null;

    return {
      title: pageObj?.title ?? '',
      extract: pageObj?.extract ?? '',
    };
  }
}

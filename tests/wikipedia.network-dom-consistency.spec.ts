import { test, expect } from './fixtures';

test('advanced: UI matches MediaWiki API summary (network + DOM)', async ({ page, article }) => {
  const title = 'Playwright_(software)';

  await test.step('Open article and capture API summary response', async () => {
    const summary = await article.openAndCaptureSummary(title);
    expect(summary.title).toBeTruthy();
    expect(summary.extract).toBeTruthy();
    await expect(article.heading).toContainText(summary.title.replace(/_/g, ' '));

    const leadPara = page.locator('#mw-content-text .mw-parser-output > p:not(.mw-empty-elt)').first();
    await expect(leadPara).toBeVisible();

    const snippet = summary.extract.slice(0, 80).trim();
    await expect(leadPara).toContainText(snippet);
  });
});

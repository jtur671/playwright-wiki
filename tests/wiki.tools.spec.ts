import { test, expect } from './fixtures';

test.describe('Wikipedia extra coverage (tools + meta + i18n)', () => {
  test('tools: opens "View source" and shows wikitext editor textarea', async ({ article }) => {
    await test.step('Open a protected page', async () => {
      await article.openAndExpectHeading('Main_Page');
    });

    await test.step('Open view source', async () => {
      await article.openViewSourceOrNavigate('Main_Page');
      await expect(article.editorTextarea).toBeVisible();
    });
  });

  test('tools: opens "Page information" and lands on an info page', async ({ page, article }) => {
    await test.step('Open an article', async () => {
      await article.openAndExpectHeading('Selenium_(software)');
    });

    await test.step('Open Page information', async () => {
      await article.openPageInformation('Selenium_(software)');
    });

    await expect(page).toHaveURL(/action=info|Special:PageInfo/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('tools: opens "Cite this page" and shows citation content', async ({ page, article }) => {
    await test.step('Open an article', async () => {
      await article.openAndExpectHeading('Selenium_(software)');
    });

    await test.step('Open Cite this page', async () => {
      await article.openCiteThisPage('Selenium_(software)');
    });

    await expect(page).toHaveURL(/Special:CiteThisPage/i);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Cite/i);
    await expect(page.locator('#mw-content-text')).toContainText(/Retrieved|Wikipedia/i);
  });

  test('tools: opens "Permanent link" and URL contains an oldid revision', async ({ page, article }) => {
    await test.step('Open an article', async () => {
      await article.openAndExpectHeading('Selenium_(software)');
    });

    await test.step('Open a permanent link', async () => {
      await article.openPermanentLink('Selenium_(software)');
    });

    await expect(page).toHaveURL(/oldid=\d+/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('tools: opens "What links here" for the current page', async ({ page, article }) => {
    await test.step('Open an article', async () => {
      await article.openAndExpectHeading('Selenium_(software)');
    });

    await test.step('Open What links here', async () => {
      await article.openWhatLinksHere('Selenium_(software)');
    });

    await expect(page).toHaveURL(/Special:WhatLinksHere/i);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/What links here|Pages that link to/i);
    await expect(page.locator('#mw-content-text')).toBeVisible();
  });

  test('i18n: switches to Spanish using the language list (sidebar)', async ({ page, article }) => {
    await test.step('Open an article', async () => {
      await article.openAndExpectHeading('Python_(programming_language)');
    });

    await test.step('Switch to Spanish', async () => {
      await article.switchToLanguageOrNavigate('Python_(programming_language)', 'es');
    });

    await expect(page).toHaveURL(/https:\/\/es\.wikipedia\.org\/wiki\//i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('footer: opens Privacy policy from the footer', async ({ page, article }) => {
    await test.step('Open an article', async () => {
      await article.openAndExpectHeading('Selenium_(software)');
    });

    await test.step('Open Privacy policy', async () => {
      await article.openPrivacyPolicyFromFooter();
    });

    await expect(page).toHaveURL(/foundation\.wikimedia\.org\/wiki\/(Special:MyLanguage\/)?Policy:Privacy_policy/i);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Privacy policy/i);
  });

  test('redirects: visiting /wiki/USA ends on the canonical United States article', async ({ page, article }) => {
    await test.step('Open the redirect slug', async () => {
      await article.open('USA');
    });

    await expect(page).toHaveURL(/\/wiki\/United_States/i);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/United States/i);
  });
});

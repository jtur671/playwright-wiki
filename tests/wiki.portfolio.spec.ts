import { test, expect } from './fixtures';

test.describe('Wikipedia portfolio suite (POM + stable locators)', () => {
  test('searches a broad term and opens the first search result', async ({ page, home, article, results }) => {
    await test.step('Search for a term that usually returns a results page', async () => {
      await home.goto();
      await home.topNav.search('automation');
    });

    await test.step('Open the first result if a results page appears', async () => {
      await results.openFirstResultIfPresent();
    });

    await test.step('Verify we landed on an article', async () => {
      await expect(page).toHaveURL(/\/wiki\//);
      await expect(article.heading).toBeVisible();
    });
  });

  test('TOC: clicking a section navigates to the correct anchor', async ({ page, article }) => {
    await test.step('Open a long article with a TOC', async () => {
      await article.open('Python_(programming_language)');
      await article.expectHeadingContains('Python');
    });

    await test.step('Click a TOC link (History) and confirm anchor/section is visible', async () => {
      await article.openTocSection('History');
      await expect(page).toHaveURL(/#History$/);
      await article.expectSectionVisible('History');
    });
  });

  test('tabs: opens "View history" for an article', async ({ page, article }) => {
    await test.step('Open an article', async () => {
      await article.open('Wikipedia');
      await article.expectHeadingContains('Wikipedia');
    });

    await test.step('Open View history', async () => {
      await article.openTab('View history');
      await expect(page).toHaveURL(/action=history/i);
      await article.expectHeadingContains('Wikipedia');
    });
  });

  test('tabs: opens "Talk" page for an article', async ({ page, article }) => {
    await test.step('Open an article', async () => {
      await article.open('Wikipedia');
      await article.expectHeadingContains('Wikipedia');
    });

    await test.step('Open Talk tab', async () => {
      await article.openTab(/^Talk$/);
      await expect(page).toHaveURL(/\/wiki\/Talk:Wikipedia/);
      await expect(article.heading).toContainText('Talk:Wikipedia');
    });
  });

  test('navigation: Main page link takes you back to Main Page', async ({ page, article }) => {
    await test.step('Open an article', async () => {
      await article.open('Playwright_(software)');
      await article.expectHeadingContains('Playwright');
    });

    await test.step('Click "Main page" in the sidebar/navigation', async () => {
      await article.topNav.openMainPageSafe();
      await expect(page).toHaveURL(/\/wiki\/Main_Page/);
      await article.expectMainPageHeading();
    });
  });

  test('content: verifies an infobox exists and contains a key field', async ({ page, article }) => {
    await test.step('Open an article known to have an infobox', async () => {
      await article.open('Python_(programming_language)');
      await article.expectHeadingContains('Python');
    });

    await test.step('Assert the infobox exists and has a stable label', async () => {
      await article.expectInfoboxContains('Paradigm');
    });
  });

  test('content: clicks the first internal link in the intro paragraph and navigates', async ({ page, article }) => {
    await test.step('Open an article', async () => {
      await article.open('Playwright_(software)');
      await article.expectHeadingContains('Playwright');
      await expect(article.content).toBeVisible();
    });

    await test.step('Click the first internal wiki link in the first real paragraph', async () => {
      await article.openFirstInternalLinkInIntro();
      await expect(page).toHaveURL(/\/wiki\//);
      await expect(article.heading).toBeVisible();
    });
  });
});

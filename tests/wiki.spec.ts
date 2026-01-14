import { test, expect } from './fixtures';
import { articleCases } from './data/articles';

test.describe('Wikipedia main flows', () => {
  test('loads the main page', { tag: ['@full', '@smoke'] }, async ({ home }) => {
    await test.step('Open the main page', async () => {
      await home.goto();
      await home.expectLoaded();
    });
  });

  test('searches for Playwright software', { tag: ['@full', '@smoke'] }, async ({ page, home, article, results }) => {
    await test.step('Open the main page', async () => {
      await home.goto();
    });

    await test.step('Search for the Playwright article', async () => {
      await home.topNav.search('Playwright (software)');
    });

    await test.step('Select search result if needed', async () => {
      await results.openResultIfPresent('Playwright (software)');
    });

    await test.step('Validate article content', async () => {
      await expect(page).toHaveURL(/Playwright_\(software\)/);
      await article.expectHeadingContains('Playwright');
      await article.expectContentMentions(['Microsoft', 'Node.js']);
    });
  });

  test('navigates to the random article and back', { tag: '@full' }, async ({ page, home, article }) => {
    await test.step('Open a random article', async () => {
      await home.goto();
      await home.openRandomArticle();
      await expect(page).toHaveURL(/wiki\//);
    });

    await test.step('Confirm article loaded', async () => {
      await article.expectHeadingVisible();
    });

    await test.step('Return to the main page', async () => {
      await article.topNav.openMainPageSafe();
      await expect(page).toHaveURL(/\/(wiki\/Main_Page)?$/);
    });
  });

  test('searches for Playwright and opens first result', { tag: '@full' }, async ({ page, home, article, results }) => {
    await test.step('Open the main page', async () => {
      await home.goto();
    });

    await test.step('Search for Playwright', async () => {
      await home.topNav.search('Playwright');
    });

    await test.step('Open the first result if needed', async () => {
      await results.openFirstResultIfPresent();
    });

    await test.step('Confirm article opens', async () => {
      await expect(page).toHaveURL(/wiki\//);
      await article.expectHeadingContains('Playwright');
    });
  });

  test.describe('article search data set', () => {
    for (const articleCase of articleCases) {
      test(`finds ${articleCase.term}`, { tag: '@full' }, async ({ page, home, article, results }) => {
        await test.step('Open the main page', async () => {
          await home.goto();
        });

        await test.step(`Search for ${articleCase.term}`, async () => {
          await home.topNav.search(articleCase.term);
        });

        await test.step('Navigate to the intended article', async () => {
          await results.openResultIfPresent(articleCase.resultTitle);
        });

        await test.step('Validate the article', async () => {
          await expect(page).toHaveURL(/wiki\//);
          await article.expectHeadingContains(articleCase.expectedHeading);
          if (articleCase.mentions.length > 0) {
            await article.expectContentMentions(articleCase.mentions);
          }
        });
      });
    }
  });
});

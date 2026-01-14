# Playwright Wikipedia Test Suite

Simple, reliable Playwright test suite that targets Wikipedia pages.

## What's Included

- Playwright config with list, HTML, and JUnit reporters
- Cross-browser projects (Chromium, Firefox, WebKit)
- Example tests for Wikipedia homepage, search, and random article
- Screenshots, videos, and traces on failures

## Requirements

- Node.js 18+ recommended

## Install

```bash
npm install
npx playwright install
```

## Run Tests

```bash
npm test
```

Optional:

```bash
npm run test:ui
npm run show-report
```

## Project Structure

- `playwright.config.ts` - Playwright configuration and reporters
- `tests/wiki.spec.ts` - Example Wikipedia tests
- `tests/fixtures.ts` - Shared test fixtures for page objects
- `tests/pages/` - Page objects for Wikipedia pages and flows
- `tests/components/` - Reusable UI components used by page objects
- `test-results/` - Test artifacts (gitignored)
- `playwright-report/` - HTML report (gitignored)

## Architecture

- Page Object Model with shared UI extracted into components
- Fixtures create page objects once per test for clean test bodies
- Assertion helpers live on POMs to keep tests intent-focused

## Why Wikipedia

Wikipedia is read-only and has stable, accessible selectors, making it a reliable target for demo automation without worrying about test data or mutations.

## Notes

- Tests run against the live `https://en.wikipedia.org` site.
- If Wikipedia is slow, rerun or adjust timeouts in `playwright.config.ts`.
# playwright-wiki

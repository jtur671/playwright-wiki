# Playwright Wikipedia Test Suite

Simple, reliable Playwright test boilerplate that targets Wikipedia pages.

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
- `test-results/` - Test artifacts (gitignored)
- `playwright-report/` - HTML report (gitignored)

## Notes

- Tests run against the live `https://en.wikipedia.org` site.
- If Wikipedia is slow, rerun or adjust timeouts in `playwright.config.ts`.
# playwright-wiki

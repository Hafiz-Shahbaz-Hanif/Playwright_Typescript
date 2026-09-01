# CLAUDE.md — working agreement for AI agents in this repo

This framework is developed with an **agentic-AI workflow**: Claude Code (and the
subagents/skills in `.claude/`) draft scenarios, page objects and API clients,
triage failures, and review diffs against the conventions below. This file is the
contract every agent follows.

## What this project is

UI **and** API test automation for two public demo systems:

| | |
|---|---|
| UI | [Practice Software Testing — "The Toolshop"](https://practicesoftwaretesting.com) (Angular SPA) |
| API | [restful-booker](https://restful-booker.herokuapp.com) (REST, token auth) |
| Runner | Playwright Test + `playwright-bdd` (Gherkin → Playwright) |
| Language | TypeScript, `strict` |
| Reporting | Allure + Playwright HTML + traces/video/screenshots on failure |

## Golden rules

1. **BDD first.** Behaviour lives in `features/**/*.feature`. A `.spec.ts` is
   never hand-written — `bddgen` generates it from features + steps.
2. **Strict Page Object Model.** Step definitions never contain a selector, a
   `page.locator(...)`, a wait, or `expect` on a raw locator. They call an
   intent-revealing Page Object / API-client method and assert on its return.
3. **Selectors only in Page Objects**, only as `data-test` ids via
   `this.byTest(...)`. No XPath, no text selectors for control identification.
4. **No hard waits.** Use web-first assertions, `expect.poll`, and app-emitted
   readiness markers (e.g. `search_completed`). `waitForTimeout` is banned.
5. **Never hard-code Toolshop product ids** — the demo resets nightly. Reach
   products by search term or by `productCards.first()`.
6. **Every API response is schema-validated** (`src/api/schemas.ts`, `zod`) and
   every API call is logged to Allure via `recordCall` with a response-time
   budget assertion.
7. **Config via `env/config.ts`** only — env vars with safe defaults. No literals
   for URLs/credentials in tests.
8. **Determinism.** Each scenario owns its data (API scenarios create their own
   bookings; UI scenarios reset state). Scenarios must pass in any order and in
   parallel.

## Layout

```
features/{ui,api}/*.feature      Gherkin
src/pages/*.page.ts              Page Object Model (BasePage + one per screen)
src/api/*.ts                     typed client, zod schemas, Allure HTTP logger
src/steps/{ui,api}/*.ts          step definitions (thin)
src/fixtures/fixtures.ts         Page Object + API fixtures, createBdd()
env/config.ts                    typed config
test-data/*.ts                   data builders
```

## Commands

```bash
npm test                 # bddgen + run every project
npm run test:ui          # UI (Chromium)
npm run test:api         # API
npx bddgen && npx playwright test --grep "@smoke"
npm run allure:generate && npm run allure:open
npm run lint && npm run typecheck
```

## Definition of done for a change

- `npm run typecheck` and `npm run lint` clean
- `npm test` green (or the affected `--grep` tag green with a note)
- New behaviour expressed as Gherkin; new steps are one call + one assertion
- Tags applied: `@ui`/`@api`, plus `@smoke` for happy-path, `@negative`, `@contract`
- Allure attachments present for new API calls

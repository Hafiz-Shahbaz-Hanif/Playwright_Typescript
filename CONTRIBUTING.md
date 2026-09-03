# Contributing

Thanks for looking at this project. It is a portfolio framework, but it is built
to real standards and PRs are welcome.

## Ground rules

The conventions in [`CLAUDE.md`](CLAUDE.md) are the contract — read it first. In
short:

- **BDD first.** Behaviour lives in `features/**/*.feature`. Never hand-write a
  `.spec.ts`; `bddgen` generates it.
- **Strict Page Object Model.** No selector, `page.locator(...)`, wait or
  `expect` on a raw locator in a step definition.
- **`data-test` selectors only**, via `this.byTest(...)` in a Page Object.
- **No hard waits** — web-first assertions, `expect.poll`, app readiness markers.
- **Every API response is schema-validated** (`src/api/schemas.ts`, `zod`) and
  logged to Allure with a response-time budget.

## Getting set up

```bash
npm ci
npx playwright install --with-deps chromium
npm test          # bddgen + run
```

## Adding a scenario

1. Add or extend a `.feature` under `features/ui` or `features/api`. Use a
   `Scenario Outline` + `Examples` for data variations.
2. Reuse existing step text where possible (`grep` `src/steps/`). New steps are
   **one Page Object / API-client call + one assertion**.
3. If the UI surface is new, add a Page Object method (or a new `*.page.ts`
   extending `BasePage`); if the API surface is new, add a `zod` schema and a
   client method with `recordCall`.
4. Tag it: `@ui` / `@api`, plus `@smoke` / `@negative` / `@contract`.

## Before you open a PR

```bash
npm run lint && npm run typecheck
npm test                       # or the affected --grep tag, note it in the PR
```

- [ ] `typecheck` and `lint` clean
- [ ] New behaviour is Gherkin; steps stay thin
- [ ] Allure attachments present for new API calls
- [ ] No new `waitForTimeout`, no hard-coded Toolshop product ids
- [ ] Commit messages are conventional (`feat(api): …`, `test(ui): …`, `docs: …`)

## AI-assisted workflow

`.claude/` contains the subagents and skills used to develop this repo
(`flaky-test-triager`, `page-object-author`, `api-contract-guardian`, and the
`new-bdd-scenario` / `allure-triage` skills). They encode the same rules as this
document — use them, or don't, but the output must still meet the checklist above.

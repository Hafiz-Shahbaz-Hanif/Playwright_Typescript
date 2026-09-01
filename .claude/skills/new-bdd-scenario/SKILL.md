---
name: new-bdd-scenario
description: Scaffold a new Gherkin scenario or feature for this Playwright + playwright-bdd framework, wired to existing (or new, thin) step definitions and Page Objects. Use when adding UI or API coverage.
---

# Add a BDD scenario

## 1. Decide where it lives

- UI behaviour → `features/ui/<area>.feature`, tagged `@ui`
- API behaviour → `features/api/<area>.feature`, tagged `@api`
- Add `@smoke` only for a single happy path per area; `@negative` / `@contract` as apt.

## 2. Write the scenario in business language

- One capability per `Feature`. Use `Background` for shared setup.
- Prefer a `Scenario Outline` with an `Examples` table for data variations
  (each row is a real test case and is counted as one).
- Steps read as behaviour, not mechanics: `When I search for "hammer"`, not
  `When I type "hammer" into the search box and click search`.

## 3. Reuse steps first

Search `src/steps/` for an existing step that fits. Only add a new step when none
matches. A new step definition is **one Page Object / API-client call + one
assertion** — nothing else. Register step args from the Gherkin capture order.

## 4. If a new Page Object method is needed

Add it to the relevant `src/pages/*.page.ts` (action returns `this`/next page,
query returns a plain value). If a whole screen is missing, use the
`page-object-author` agent.

## 5. Verify

```bash
npm run typecheck
npx bddgen && npx playwright test --grep "@<your-tag>"
```

For API scenarios, confirm the Allure transcript attachment appears and the
response-time assertion is present.

## Checklist before done

- [ ] Scenario is independent (creates/owns its data, no ordering assumption)
- [ ] No selector / wait / `expect(locator)` in the step file
- [ ] No hard-coded Toolshop product id
- [ ] Tags applied; `typecheck` + targeted run green

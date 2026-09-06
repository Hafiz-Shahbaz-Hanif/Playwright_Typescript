<!-- See CONTRIBUTING.md and CLAUDE.md for the full conventions. -->

## What & why

<!-- One or two lines. Link the issue if there is one. -->

## Checklist

- [ ] `npm run lint` and `npm run typecheck` clean
- [ ] `npm test` green (or the affected `--grep` tag green — say which, and why)
- [ ] New behaviour is expressed as Gherkin; new steps are one call + one assertion
- [ ] Selectors are `data-test` ids inside a Page Object only
- [ ] No `waitForTimeout`; no hard-coded Toolshop product ids
- [ ] New API calls are `zod`-schema-validated and logged to Allure via `recordCall`
- [ ] Tags applied (`@ui` / `@api`, plus `@smoke` / `@negative` / `@contract`)

## Notes for the reviewer

<!-- Anything non-obvious: a demo quirk worked around, a deliberate deviation, follow-ups. -->

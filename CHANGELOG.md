# Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 2026-09-11

### Added
- Negative coverage: `DELETE /booking` without a token now asserts a 403
  (`deleteWithoutToken` client method + matching step and scenario).

## 2026-09-08

### Added
- `authResponseSchema` (`zod`) — the `POST /auth` response is now schema-validated
  like every other restful-booker response, not just cast.

## 2026-09-07

### Added
- `test:smoke`, `test:contract`, `test:negative` npm scripts mapping directly to
  the documented Gherkin tags.

## 2026-09-06

### Added
- `.github/ISSUE_TEMPLATE/{bug_report,flaky_test}.md`,
  `.github/pull_request_template.md`.

## 2026-09-05

### Added
- `.editorconfig` mirroring `.prettierrc`.

## 2026-09-03

### Added
- `CONTRIBUTING.md` (BDD workflow, Page Object Model rules, PR checklist).

## 2026-09-01

### Added
- `CLAUDE.md` and the AI-assisted workflow: `.claude/agents/{flaky-test-triager,
  page-object-author,api-contract-guardian}.md`, `.claude/skills/{new-bdd-scenario,
  allure-triage}`.
- API: name-filter query support; 24-row data-driven create/round-trip suite;
  full-update (PUT) and partial-update (PATCH) data-driven suites; filter-by-name
  and delete suites; a dedicated auth suite and expanded negative coverage
  (missing fields, bad ids).
- UI: sort helpers with a stable-sort wait, out-of-stock-safe product details;
  catalogue browse/sort feature; data-driven cart feature; expanded
  catalogue-search coverage and an unknown-account login outline.
- Fix: retry sign-in once when a parallel burst is rate-limited by the demo.
- README coverage table and `.claude/` layout.

## 2026-08-31

### Added
- Initial scaffold: TypeScript + Cucumber (`playwright-bdd`), typed env config,
  Playwright projects for UI/API with parallelism and cross-browser support.
- Page Object Model base and Toolshop screen objects; login, catalogue-search and
  end-to-end checkout BDD scenarios.
- Typed restful-booker client with `zod` contract validation and CRUD scenarios;
  contract, negative and response-time budget coverage with Allure request/response
  logging.
- GitHub Actions matrix running UI and API suites with report artifacts.
- Framework overview, structure and run instructions.

# Playwright + TypeScript + Cucumber — UI & API Automation Framework

[![CI](https://github.com/Hafiz-Shahbaz-Hanif/Playwright_Typescript/actions/workflows/ci.yml/badge.svg)](https://github.com/Hafiz-Shahbaz-Hanif/Playwright_Typescript/actions/workflows/ci.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.5x-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![BDD](https://img.shields.io/badge/BDD-Cucumber%2FGherkin-23D96C?logo=cucumber&logoColor=white)
![Allure](https://img.shields.io/badge/Report-Allure-FF7043)
![License](https://img.shields.io/badge/license-MIT-blue)

A production-style end-to-end automation framework that exercises both a **web UI** and a
**REST API** through the same Gherkin/BDD layer, on the **Page Object Model**, with parallel
cross-browser execution and **Allure** reporting.

| | |
|---|---|
| **UI under test** | [Practice Software Testing — "The Toolshop"](https://practicesoftwaretesting.com) (Angular SPA) |
| **API under test** | [restful-booker](https://restful-booker.herokuapp.com) (REST, token auth) |
| **Runner / BDD** | Playwright Test + [`playwright-bdd`](https://github.com/vitalets/playwright-bdd) (Gherkin → Playwright) |
| **Language** | TypeScript (strict) |
| **Reporting** | Allure + Playwright HTML + traces / video / screenshots on failure |
| **CI** | GitHub Actions, UI and API suites as a matrix |

---

## Why this framework

- **One BDD layer, two test types.** UI journeys and API contract checks are written in the
  same Gherkin style and share fixtures, so the suite reads as behaviour, not scripts.
- **Strict Page Object Model.** Step definitions never see a raw selector — every interaction
  goes through an intent-revealing Page Object method (`checkoutPage.payWith('Bank Transfer')`).
- **Pro-level API automation** (`src/api/`):
  - typed client with centralised auth, headers and endpoint paths
  - **schema / contract validation** on every response with `zod`
  - full CRUD + PATCH lifecycle, token and cookie auth
  - **negative coverage**: bad credentials, missing mandatory fields, 404, 403
  - **non-functional**: per-call **response-time budget** assertions
  - every request/response is **attached to the Allure report** for zero-rerun triage
- **Parallel + cross-browser.** `fullyParallel`, sharded workers, Chromium/Firefox/WebKit projects.
- **Stable by construction.** Web-first assertions, `expect.poll`, app-emitted readiness
  markers (`search_completed`) instead of hard waits.

---

## Project structure

```
.
├── features/
│   ├── ui/                     # login, catalogue search, cart & checkout
│   └── api/                    # booking lifecycle, contract, negative
├── src/
│   ├── pages/                  # Page Object Model (BasePage + one class per screen)
│   ├── api/                    # typed API client, zod schemas, Allure HTTP logger
│   ├── steps/
│   │   ├── ui/                 # UI step definitions
│   │   └── api/                # API step definitions
│   └── fixtures/fixtures.ts    # Page Object + API client fixtures, createBdd()
├── env/config.ts              # typed configuration (env vars + safe defaults)
├── test-data/                 # test-data builders
├── playwright.config.ts       # projects, parallelism, reporters, BDD wiring
└── .github/workflows/ci.yml
```

## Getting started

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env        # optional — defaults already target the public demos
```

## Running

```bash
npm test              # generate BDD specs + run every project
npm run test:ui       # UI suite (Chromium)
npm run test:api      # API suite
npm run test:headed   # UI suite, headed
npm run test:all-browsers   # Chromium + Firefox + WebKit
```

Filter by tag:

```bash
npx bddgen && npx playwright test --grep "@smoke"
npx bddgen && npx playwright test --grep "@negative"
```

## Reports

```bash
npm run report            # Playwright HTML report
npm run allure:generate   # build Allure report from allure-results/
npm run allure:open       # open it
```

The Allure report includes a plain-text **request/response transcript and timing** for every
API call, plus traces, video and screenshots for any failed UI step.

## CI

`.github/workflows/ci.yml` runs the **UI** and **API** suites as a matrix on every push and
PR, installs browsers with OS deps, and uploads the Playwright report and `allure-results`
as build artifacts.

## Configuration

All configuration is environment-variable driven with working defaults (`env/config.ts`):

| Variable | Default | Purpose |
|---|---|---|
| `UI_BASE_URL` | `https://practicesoftwaretesting.com` | Toolshop base URL |
| `API_BASE_URL` | `https://restful-booker.herokuapp.com` | Booking API base URL |
| `UI_EMAIL` / `UI_PASSWORD` | demo customer creds | UI login |
| `API_USERNAME` / `API_PASSWORD` | `admin` / `password123` | Booking API auth |

---

## Author

**Hafiz Shahbaz Hanif** — Staff SQA Engineer / Test Automation Architect
[LinkedIn](https://www.linkedin.com/in/hafiz-shahbaz-hanif-70407417a) · [GitHub](https://github.com/Hafiz-Shahbaz-Hanif)

Licensed under the [MIT License](LICENSE).

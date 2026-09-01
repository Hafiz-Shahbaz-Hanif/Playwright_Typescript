---
name: allure-triage
description: Turn an Allure results folder into a ranked failure summary for this framework — grouping by root cause, pulling the request/response transcript for failed API calls and the trace pointer for failed UI steps. Use after a run to decide what to fix first.
---

# Triage an Allure run

## 1. Generate / locate results

```bash
npm run allure:generate           # builds allure-report/ from allure-results/
```

Raw material: `allure-results/*-result.json` (one per test) and
`allure-results/*-attachment.txt` (the HTTP transcripts written by `recordCall`).

## 2. Build the failure table

For each `*-result.json` with `"status": "failed"` or `"broken"`:

| field | source |
|---|---|
| scenario | `fullName` |
| tags | `labels[]` where `name == "tag"` |
| failed step | last step in `steps[]` with non-passed status |
| message | `statusDetails.message` (first line) |
| attachment | linked `*-attachment.txt` (API) or trace/screenshot name (UI) |
| elapsed | `Elapsed:` line in the attachment, vs `RESPONSE_TIME_BUDGET_MS` |

## 3. Group by root cause

Cluster failures that share a message pattern or a Page Object. Common clusters:
selector drift (one `data-test` id), timing/hydration, demo-app downtime (5xx /
long elapsed across many API scenarios), data coupling.

## 4. Rank

1. Real product bugs (assertion on correct expected value fails deterministically)
2. Framework defects affecting many scenarios (one Page Object / step)
3. Single flaky scenario (passed on retry)
4. External (demo app/API down) — note and move on

## Output

A ranked list: cluster → scenarios affected → likely cause → owner action, plus
the one command to reproduce the top item. Hand fixes to `flaky-test-triager`.

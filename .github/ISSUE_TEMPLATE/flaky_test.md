---
name: Flaky test
about: A test that passes on rerun without a code change
title: "[flaky] "
labels: flaky
---

## Which test

<!-- feature : scenario (or Scenario Outline + Examples row) -->

## Evidence it is flaky

- [ ] Passed on rerun with no code change
- [ ] Fails only in parallel / only in CI / only headless
- Rough failure rate: __ / 10 runs

## Failure detail

<!-- The assertion or Playwright error, and the step it happened on. -->

## Suspected cause

<!-- missing web-first assertion, shared state, Toolshop nightly reset, restful-booker
     instability, hydration timing, animation. -->

## Notes

Link the CI run and the trace. The `flaky-test-triager` agent in `.claude/` is built
for this.

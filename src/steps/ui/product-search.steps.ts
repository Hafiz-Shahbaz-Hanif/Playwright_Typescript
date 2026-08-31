import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/fixtures';

Given('the products page is open', async ({ productsPage }) => {
  await productsPage.open();
});

When('I search for {string}', async ({ productsPage }, term: string) => {
  await productsPage.search(term);
});

Then('every product in the results contains {string}', async ({ productsPage }, term: string) => {
  await expect.poll(() => productsPage.everyResultContains(term), { timeout: 10_000 }).toBe(true);
});

Then('at least {int} product is shown', async ({ productsPage }, min: number) => {
  await expect.poll(() => productsPage.resultCount(), { timeout: 10_000 }).toBeGreaterThanOrEqual(min);
});

Then('{int} products are shown', async ({ productsPage }, count: number) => {
  await expect.poll(() => productsPage.resultCount(), { timeout: 10_000 }).toBe(count);
});

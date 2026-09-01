import { expect } from '@playwright/test';
import { When, Then } from '../../fixtures/fixtures';

When(
  'I add the first {string} search result to my cart',
  async ({ productsPage, productDetailsPage, world }, term: string) => {
    await productsPage.open();
    await productsPage.search(term);
    world.productName = await productsPage.openFirstProduct();
    await productDetailsPage.waitForLoaded();
    await productDetailsPage.addToCartAndWait();
  },
);

When(
  'I open the first {string} search result',
  async ({ productsPage, productDetailsPage, world }, term: string) => {
    await productsPage.open();
    await productsPage.search(term);
    world.productName = await productsPage.openFirstProduct();
    await productDetailsPage.waitForLoaded();
  },
);

Then('the cart contains that product', async ({ cartPage, world }) => {
  expect(await cartPage.containsProduct(world.productName as string)).toBe(true);
});

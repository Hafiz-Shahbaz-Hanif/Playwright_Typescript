import { expect } from '@playwright/test';
import { When, Then } from '../../fixtures/fixtures';

function isSorted(values: Array<string | number>, direction: string): boolean {
  const norm = (v: string | number) => (typeof v === 'number' ? v : v.toLowerCase());
  const cmp = (a: string | number, b: string | number) => {
    const [x, y] = [norm(a), norm(b)];
    if (typeof x === 'number' && typeof y === 'number') return x - y;
    return String(x) < String(y) ? -1 : String(x) > String(y) ? 1 : 0;
  };
  const sorted = [...values].sort(cmp);
  if (direction === 'descending') sorted.reverse();
  return values.every((v, i) => norm(v) === norm(sorted[i]));
}

When('I sort the catalogue by {string}', async ({ productsPage }, option: string) => {
  await productsPage.sortBy(option);
});

Then('the products are sorted {word} by {word}', async ({ productsPage }, direction: string, key: string) => {
  const values =
    key === 'price' ? await productsPage.productPriceValues() : await productsPage.productNamesText();
  expect(values.length).toBeGreaterThan(1);
  expect(isSorted(values, direction), `expected ${key} ${direction}: ${JSON.stringify(values)}`).toBe(true);
});

When('I open the product at position {int}', async ({ productsPage, productDetailsPage, world }, index: number) => {
  world.productName = await productsPage.openProductByIndex(index);
  await productDetailsPage.waitForLoaded();
});

Then("the product details page shows that product's name and price", async ({ productDetailsPage, world }) => {
  expect(await productDetailsPage.productName()).toBe(world.productName as string);
  expect(await productDetailsPage.unitPriceValue()).toBeGreaterThan(0);
});

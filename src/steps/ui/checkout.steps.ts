import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/fixtures';
import { env } from '../../../env/config';

Given('I am signed in as a customer', async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.signInAndLandOnAccount(env.ui.email, env.ui.password);
});

When('I add the first catalogue product to my cart', async ({ productsPage, productDetailsPage, world }) => {
  await productsPage.open();
  const name = await productsPage.openFirstProduct();
  await productDetailsPage.waitForLoaded();
  world.productName = name;
  await productDetailsPage.addToCartAndWait();
});

When('I open the first catalogue product', async ({ productsPage, productDetailsPage, world }) => {
  await productsPage.open();
  world.productName = await productsPage.openFirstProduct();
  await productDetailsPage.waitForLoaded();
});

When('I set the quantity to {int} and add it to the cart', async ({ productDetailsPage }, qty: number) => {
  await productDetailsPage.setQuantity(qty);
  await productDetailsPage.addToCartAndWait();
});

When('I open the cart', async ({ cartPage }) => {
  await cartPage.open();
});

Then('the cart contains that product with quantity {int}', async ({ cartPage, world }, qty: number) => {
  const name = world.productName as string;
  expect(await cartPage.containsProduct(name)).toBe(true);
  expect(await cartPage.quantityFor(name)).toBe(qty);
});

When('I proceed through checkout and pay by {string}', async ({ cartPage, checkoutPage }, method: string) => {
  await cartPage.proceedToCheckout();
  await checkoutPage.proceedFromCart();
  await checkoutPage.confirmAccountStep();
  await checkoutPage.fillBillingAddress();
  await checkoutPage.payWith(method);
});

Then('the order is confirmed', async ({ checkoutPage }) => {
  await checkoutPage.expectOrderConfirmed();
});

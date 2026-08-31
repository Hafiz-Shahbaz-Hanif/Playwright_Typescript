import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';
import { ProductDetailsPage } from '../pages/product-details.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { BookingClient } from '../api/booking.client';

/**
 * Page Object + API client fixtures. Each is lazily instantiated per test and
 * shared across all step definitions in a scenario.
 */
type PageObjects = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

type ApiObjects = {
  bookingClient: BookingClient;
};

/** Mutable per-scenario state passed between steps. */
type World = {
  world: Record<string, unknown>;
};

export const test = base.extend<PageObjects & ApiObjects & World>({
  world: async ({}, use) => {
    await use({});
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },
});

export const { Given, When, Then, Step, BeforeAll, AfterAll, Before, After } =
  createBdd(test);

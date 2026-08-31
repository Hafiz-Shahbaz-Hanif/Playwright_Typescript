import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/fixtures';
import { env } from '../../../env/config';

Given('the login page is open', async ({ loginPage }) => {
  await loginPage.open();
});

When('I sign in with valid customer credentials', async ({ loginPage }) => {
  await loginPage.login(env.ui.email, env.ui.password);
});

When(
  'I sign in with email {string} and password {string}',
  async ({ loginPage }, email: string, password: string) => {
    await loginPage.login(email, password);
  },
);

Then('I should be signed in and see my account menu', async ({ page }) => {
  await expect(page.locator('[data-test="nav-menu"]')).toBeVisible();
  await expect(page).toHaveURL(/\/account/);
});

Then('I should see the login error {string}', async ({ loginPage }, message: string) => {
  await loginPage.expectLoginError(message);
});

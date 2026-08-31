import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export interface BillingAddress {
  street: string;
  houseNumber: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export const DEFAULT_ADDRESS: BillingAddress = {
  street: '1 Test Street',
  houseNumber: '1',
  city: 'Lahore',
  state: 'Punjab',
  country: 'Pakistan',
  postalCode: '54000',
};

/**
 * Drives the four-step checkout wizard of the Toolshop demo:
 *   cart (proceed-1) -> sign-in -> confirm account (proceed-2)
 *   -> billing address (proceed-3) -> payment (finish) -> confirmation
 * Steps already satisfied for the current session are skipped defensively.
 */
export class CheckoutPage extends BasePage {
  protected readonly path = '/checkout';

  private readonly proceed1 = this.byTest('proceed-1');
  private readonly proceed2 = this.byTest('proceed-2');
  private readonly proceed3 = this.byTest('proceed-3');
  private readonly street = this.byTest('street');
  private readonly houseNumber = this.byTest('house_number');
  private readonly city = this.byTest('city');
  private readonly state = this.byTest('state');
  private readonly country = this.byTest('country');
  private readonly postalCode = this.byTest('postal_code');
  private readonly paymentMethod = this.byTest('payment-method');
  private readonly bankName = this.byTest('bank_name');
  private readonly accountName = this.byTest('account_name');
  private readonly accountNumber = this.byTest('account_number');
  private readonly finish = this.byTest('finish');
  private readonly successMessage = this.byTest('payment-success-message');

  constructor(page: Page) {
    super(page);
  }

  async proceedFromCart(): Promise<void> {
    await this.clickIfVisible(this.proceed1);
  }

  async confirmAccountStep(): Promise<void> {
    await this.clickIfVisible(this.proceed2);
  }

  async fillBillingAddress(address: BillingAddress = DEFAULT_ADDRESS): Promise<void> {
    await expect(this.proceed3).toBeVisible();
    // The form hint: "Enter country, postal code and house number. We will fill
    // in the rest automatically." Country is a <select>; the rest are inputs.
    await this.country.selectOption({ label: address.country });
    await this.setValue(this.postalCode, address.postalCode);
    await this.setValue(this.houseNumber, address.houseNumber);
    await this.setValue(this.street, address.street);
    await this.setValue(this.city, address.city);
    await this.setValue(this.state, address.state);
    await this.clickWhenReady(this.proceed3);
  }

  async payWith(method: string): Promise<void> {
    await expect(this.paymentMethod).toBeVisible();
    await this.paymentMethod.selectOption({ label: method });
    if (method.toLowerCase().includes('bank')) {
      await this.setValue(this.bankName, 'Test Bank');
      await this.setValue(this.accountName, 'Hafiz QA');
      await this.setValue(this.accountNumber, '1234567890');
    }
    await this.clickWhenReady(this.finish);
  }

  async expectOrderConfirmed(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 15_000 });
    await expect(this.successMessage).toContainText(/payment was successful/i);
  }

  private async clickIfVisible(locator: Locator): Promise<void> {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
    }
  }

  private async setValue(locator: Locator, value: string): Promise<void> {
    if ((await locator.count()) === 0) return;
    await locator.fill(value);
  }
}

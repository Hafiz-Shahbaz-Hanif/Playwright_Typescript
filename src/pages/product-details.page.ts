import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductDetailsPage extends BasePage {
  // Reached by navigation from the catalogue; no direct path.
  protected readonly path = '/';

  private readonly name = this.byTest('product-name');
  private readonly unitPrice = this.byTest('unit-price');
  private readonly quantity = this.byTest('quantity');
  private readonly addToCart = this.byTest('add-to-cart');
  private readonly cartQuantity = this.byTest('cart-quantity');

  constructor(page: Page) {
    super(page);
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.name).toBeVisible();
    await expect(this.addToCart).toBeEnabled();
  }

  async productName(): Promise<string> {
    return (await this.name.innerText()).trim();
  }

  async unitPriceValue(): Promise<number> {
    const raw = (await this.unitPrice.innerText()).replace(/[^0-9.]/g, '');
    return Number(raw);
  }

  async setQuantity(qty: number): Promise<void> {
    await this.quantity.fill(String(qty));
  }

  async addToCartAndWait(): Promise<void> {
    const before = await this.readCartBadge();
    await this.clickWhenReady(this.addToCart);
    await expect
      .poll(() => this.readCartBadge(), { message: 'cart badge did not increase' })
      .toBeGreaterThan(before);
  }

  private async readCartBadge(): Promise<number> {
    if ((await this.cartQuantity.count()) === 0) return 0;
    const text = (await this.cartQuantity.innerText()).trim();
    return text ? Number(text) : 0;
  }
}

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
    await expect(this.unitPrice).toBeVisible();
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
    await this.waitForLoaded();
    const before = await this.readCartBadge();
    await expect(this.addToCart).toBeEnabled();
    await this.clickWhenReady(this.addToCart);

    // The badge updates from the "added to cart" toast/XHR; give it a generous
    // window and click once more if the first click did not register.
    try {
      await expect.poll(() => this.readCartBadge(), { timeout: 8_000 }).toBeGreaterThan(before);
    } catch {
      await this.clickWhenReady(this.addToCart);
      await expect
        .poll(() => this.readCartBadge(), { message: 'cart badge did not increase', timeout: 10_000 })
        .toBeGreaterThan(before);
    }
  }

  private async readCartBadge(): Promise<number> {
    if ((await this.cartQuantity.count()) === 0) return 0;
    const text = (await this.cartQuantity.innerText()).trim();
    return text ? Number(text) : 0;
  }
}

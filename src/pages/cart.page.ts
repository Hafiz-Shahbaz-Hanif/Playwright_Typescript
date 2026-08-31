import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  protected readonly path = '/checkout';

  private readonly rows = this.page.locator('tr', { has: this.page.locator('[data-test="product-title"]') });
  private readonly rowTitles = this.byTest('product-title');
  private readonly cartTotal = this.byTest('cart-total');
  private readonly proceed1 = this.byTest('proceed-1');

  constructor(page: Page) {
    super(page);
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.proceed1).toBeVisible({ timeout: 20_000 });
  }

  async lineItemCount(): Promise<number> {
    return this.rowTitles.count();
  }

  async containsProduct(name: string): Promise<boolean> {
    const titles = await this.rowTitles.allInnerTexts();
    return titles.some((t) => t.trim() === name.trim());
  }

  async quantityFor(name: string): Promise<number> {
    const row = this.rows.filter({ hasText: name });
    const value = await row.locator('[data-test="product-quantity"]').inputValue();
    return Number(value);
  }

  async cartTotalValue(): Promise<number> {
    return Number((await this.cartTotal.innerText()).replace(/[^0-9.]/g, ''));
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickWhenReady(this.proceed1);
  }
}

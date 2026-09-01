import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  protected readonly path = '/';

  private readonly searchInput = this.byTest('search-query');
  private readonly searchSubmit = this.byTest('search-submit');
  private readonly productCards = this.page.locator('a[data-test^="product-"]');
  private readonly productNames = this.byTest('product-name');
  private readonly productPrices = this.byTest('product-price');
  private readonly searchCompleted = this.byTest('search_completed');
  private readonly sortDropdown = this.byTest('sort');

  constructor(page: Page) {
    super(page);
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.productCards.first()).toBeVisible({ timeout: 20_000 });
  }

  async search(term: string): Promise<void> {
    await this.fill(this.searchInput, term);
    await this.clickWhenReady(this.searchSubmit);
    // The app renders a `search_completed` marker once the XHR-driven grid has
    // re-rendered - the reliable signal that results (or "no results") are ready.
    await this.searchCompleted.waitFor({ state: 'attached', timeout: 15_000 });
  }

  async resultCount(): Promise<number> {
    return this.productCards.count();
  }

  async everyResultContains(term: string): Promise<boolean> {
    const names = await this.productNames.allInnerTexts();
    if (names.length === 0) return false;
    return names.every((n) => n.toLowerCase().includes(term.toLowerCase()));
  }

  async openFirstProduct(): Promise<string> {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 15_000 });
    const name = (await this.productNames.first().innerText()).trim();
    await this.clickWhenReady(this.productCards.first());
    return name;
  }

  async openProductByIndex(index: number): Promise<string> {
    const card = this.productCards.nth(index);
    const name = (await this.productNames.nth(index).innerText()).trim();
    await this.clickWhenReady(card);
    return name;
  }

  async sortBy(option: string): Promise<void> {
    await Promise.all([
      this.page
        .waitForResponse((r) => r.url().includes('/products') && r.request().method() === 'GET', {
          timeout: 15_000,
        })
        .catch(() => undefined),
      this.sortDropdown.selectOption({ label: option }),
    ]);
    // Wait until the grid has settled: cards visible and a stable first item.
    await expect(this.productCards.first()).toBeVisible();
    let last = '';
    await expect
      .poll(
        async () => {
          const current = await this.productNames.first().innerText().catch(() => '');
          const stable = current !== '' && current === last;
          last = current;
          return stable;
        },
        { timeout: 15_000, intervals: [300, 300, 500] },
      )
      .toBe(true);
  }

  async productNamesText(): Promise<string[]> {
    return (await this.productNames.allInnerTexts()).map((t) => t.trim());
  }

  async productPriceValues(): Promise<number[]> {
    const raw = await this.productPrices.allInnerTexts();
    return raw.map((t) => Number(t.replace(/[^0-9.]/g, ''))).filter((n) => !Number.isNaN(n));
  }
}

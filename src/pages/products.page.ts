import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  protected readonly path = '/';

  private readonly searchInput = this.byTest('search-query');
  private readonly searchSubmit = this.byTest('search-submit');
  private readonly productCards = this.page.locator('a[data-test^="product-"]');
  private readonly productNames = this.byTest('product-name');
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
    const name = (await this.productNames.first().innerText()).trim();
    await this.clickWhenReady(this.productCards.first());
    return name;
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: option });
    await this.page.waitForLoadState('networkidle');
  }
}

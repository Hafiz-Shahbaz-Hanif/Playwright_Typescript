import { expect, type Page, type Locator } from '@playwright/test';

/**
 * Shared behaviour for every Page Object: navigation helpers, common waits and
 * a thin wrapper around the most repetitive Playwright calls. Page Objects
 * expose intent-revealing methods; step definitions never touch raw locators.
 */
export abstract class BasePage {
  protected readonly page: Page;

  /** Path relative to `baseURL`, e.g. `/auth/login`. */
  protected abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto(this.path);
    await this.waitForLoaded();
  }

  /** Override in subclasses to assert the page's landmark element is visible. */
  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  protected byTest(testId: string): Locator {
    return this.page.locator(`[data-test="${testId}"]`);
  }

  protected async clickWhenReady(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  protected async fill(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async expectUrlToContain(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')));
  }
}

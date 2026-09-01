import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  protected readonly path = '/auth/login';

  private readonly email = this.byTest('email');
  private readonly password = this.byTest('password');
  private readonly submit = this.byTest('login-submit');
  private readonly loginError = this.byTest('login-error');

  constructor(page: Page) {
    super(page);
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.email).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.email, email);
    await this.fill(this.password, password);
    await this.clickWhenReady(this.submit);
  }

  /**
   * Sign in and land on the account page. Retries once if the first attempt is
   * bounced back to the login form (the public demo occasionally rate-limits a
   * burst of parallel sign-ins).
   */
  async signInAndLandOnAccount(email: string, password: string): Promise<void> {
    for (let attempt = 1; attempt <= 2; attempt++) {
      await this.login(email, password);
      try {
        await this.page.waitForURL(/\/account/, { timeout: 15_000 });
        return;
      } catch {
        if (attempt === 2) throw new Error('Login did not reach /account after 2 attempts');
        await this.open();
      }
    }
  }

  async expectLoginError(message: string): Promise<void> {
    await expect(this.loginError).toContainText(message);
  }
}

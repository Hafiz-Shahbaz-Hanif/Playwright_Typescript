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

  async expectLoginError(message: string): Promise<void> {
    await expect(this.loginError).toContainText(message);
  }
}

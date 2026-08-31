import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { config as loadEnv } from 'dotenv';
import { env } from './env/config';

loadEnv();

const uiTestDir = defineBddConfig({
  features: 'features/ui/**/*.feature',
  steps: ['src/steps/ui/**/*.ts', 'src/fixtures/*.ts'],
  outputDir: '.features-gen/ui',
});

const apiTestDir = defineBddConfig({
  features: 'features/api/**/*.feature',
  steps: ['src/steps/api/**/*.ts', 'src/fixtures/*.ts'],
  outputDir: '.features-gen/api',
});

export default defineConfig({
  testDir: '.features-gen',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'ui-chromium',
      testDir: uiTestDir,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.uiBaseUrl,
      },
    },
    {
      name: 'ui-firefox',
      testDir: uiTestDir,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: env.uiBaseUrl,
      },
    },
    {
      name: 'ui-webkit',
      testDir: uiTestDir,
      use: {
        ...devices['Desktop Safari'],
        baseURL: env.uiBaseUrl,
      },
    },
    {
      name: 'api',
      testDir: apiTestDir,
      use: {
        baseURL: env.apiBaseUrl,
      },
    },
  ],
});

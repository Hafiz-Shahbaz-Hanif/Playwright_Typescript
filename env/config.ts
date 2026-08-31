/**
 * Central, typed configuration. Values come from environment variables with
 * sensible defaults so the suite runs out of the box against public demo apps.
 */
export interface TestEnv {
  uiBaseUrl: string;
  apiBaseUrl: string;
  ui: {
    email: string;
    password: string;
  };
  api: {
    username: string;
    password: string;
  };
}

export const env: TestEnv = {
  // "The Toolshop" demo application (Practice Software Testing).
  uiBaseUrl: process.env.UI_BASE_URL ?? 'https://practicesoftwaretesting.com',
  // restful-booker public API sandbox.
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
  ui: {
    email: process.env.UI_EMAIL ?? 'customer@practicesoftwaretesting.com',
    password: process.env.UI_PASSWORD ?? 'welcome01',
  },
  api: {
    username: process.env.API_USERNAME ?? 'admin',
    password: process.env.API_PASSWORD ?? 'password123',
  },
};

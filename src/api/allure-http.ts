import * as allure from 'allure-js-commons';
import type { APIResponse } from '@playwright/test';

/**
 * Attaches a readable request/response transcript to the Allure report so a
 * failing API scenario can be triaged without re-running it. Also enforces a
 * per-call response-time budget, which is a common non-functional API check.
 */
export async function recordCall(
  label: string,
  method: string,
  url: string,
  response: APIResponse,
  startedAt: number,
  requestBody?: unknown,
): Promise<number> {
  const elapsedMs = Date.now() - startedAt;
  let body: string;
  try {
    body = JSON.stringify(await response.json(), null, 2);
  } catch {
    body = await response.text();
  }

  const transcript = [
    `${method.toUpperCase()} ${url}`,
    requestBody !== undefined ? `\nRequest body:\n${JSON.stringify(requestBody, null, 2)}` : '',
    `\nStatus: ${response.status()} ${response.statusText()}`,
    `Elapsed: ${elapsedMs} ms`,
    `\nResponse body:\n${body}`,
  ].join('\n');

  await allure.attachment(`${label} (${response.status()})`, transcript, 'text/plain');
  return elapsedMs;
}

import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { env } from '../../env/config';
import { recordCall } from './allure-http';
import {
  bookingIdListSchema,
  bookingSchema,
  createBookingResponseSchema,
  type Booking,
  type CreateBookingResponse,
} from './schemas';

/** Default non-functional budget for a single API call. */
export const RESPONSE_TIME_BUDGET_MS = 2500;

/**
 * Typed client for the restful-booker API. Centralises auth, headers, endpoint
 * paths, schema validation, response-time budgeting and Allure logging so step
 * definitions only express intent.
 */
export class BookingClient {
  private token?: string;
  /** Elapsed time of the most recent call, for response-time assertions. */
  lastElapsedMs = 0;

  constructor(private readonly request: APIRequestContext) {}

  async ping(): Promise<APIResponse> {
    return this.timed('health check', 'GET', '/ping', () => this.request.get('/ping'));
  }

  async authenticate(username = env.api.username, password = env.api.password): Promise<string> {
    const res = await this.timed('auth', 'POST', '/auth', () =>
      this.request.post('/auth', { data: { username, password } }),
    );
    expect(res.status(), 'auth should return 200').toBe(200);
    const body = (await res.json()) as { token?: string; reason?: string };
    expect(body.token, `auth failed: ${body.reason ?? 'no token'}`).toBeTruthy();
    this.token = body.token;
    return this.token as string;
  }

  async tryAuthenticate(username: string, password: string): Promise<APIResponse> {
    return this.timed('auth (negative)', 'POST', '/auth', () =>
      this.request.post('/auth', { data: { username, password } }),
    );
  }

  async createBooking(booking: Booking): Promise<CreateBookingResponse> {
    const res = await this.timed('create booking', 'POST', '/booking', () =>
      this.request.post('/booking', { data: booking, headers: { Accept: 'application/json' } }),
    );
    expect(res.status(), 'create booking should return 200').toBe(200);
    return createBookingResponseSchema.parse(await res.json());
  }

  async createRaw(payload: unknown): Promise<APIResponse> {
    return this.timed('create booking (raw)', 'POST', '/booking', () =>
      this.request.post('/booking', { data: payload as object, headers: { Accept: 'application/json' } }),
    );
  }

  async getBooking(id: number): Promise<APIResponse> {
    return this.timed(`get booking ${id}`, 'GET', `/booking/${id}`, () =>
      this.request.get(`/booking/${id}`, { headers: { Accept: 'application/json' } }),
    );
  }

  async getBookingValidated(id: number): Promise<Booking> {
    const res = await this.getBooking(id);
    expect(res.status()).toBe(200);
    return bookingSchema.parse(await res.json());
  }

  async assertBookingMatches(id: number, expected: Booking): Promise<void> {
    const body = await this.getBookingValidated(id);
    expect(body).toMatchObject({
      firstname: expected.firstname,
      lastname: expected.lastname,
      totalprice: expected.totalprice,
      depositpaid: expected.depositpaid,
    });
  }

  async updateBooking(id: number, booking: Booking): Promise<APIResponse> {
    this.assertAuthenticated();
    return this.timed(`update booking ${id}`, 'PUT', `/booking/${id}`, () =>
      this.request.put(`/booking/${id}`, {
        data: booking,
        headers: { Accept: 'application/json', Cookie: `token=${this.token}` },
      }),
    );
  }

  async updateWithoutToken(id: number, booking: Booking): Promise<APIResponse> {
    return this.timed(`update booking ${id} (no token)`, 'PUT', `/booking/${id}`, () =>
      this.request.put(`/booking/${id}`, { data: booking, headers: { Accept: 'application/json' } }),
    );
  }

  async patchBooking(id: number, partial: Partial<Booking>): Promise<APIResponse> {
    this.assertAuthenticated();
    return this.timed(`patch booking ${id}`, 'PATCH', `/booking/${id}`, () =>
      this.request.patch(`/booking/${id}`, {
        data: partial,
        headers: { Accept: 'application/json', Cookie: `token=${this.token}` },
      }),
    );
  }

  async deleteBooking(id: number): Promise<APIResponse> {
    this.assertAuthenticated();
    return this.timed(`delete booking ${id}`, 'DELETE', `/booking/${id}`, () =>
      this.request.delete(`/booking/${id}`, { headers: { Cookie: `token=${this.token}` } }),
    );
  }

  async listBookingIds(): Promise<number[]> {
    const res = await this.timed('list bookings', 'GET', '/booking', () =>
      this.request.get('/booking', { headers: { Accept: 'application/json' } }),
    );
    expect(res.status()).toBe(200);
    return bookingIdListSchema.parse(await res.json()).map((b) => b.bookingid);
  }

  expectWithinBudget(budgetMs = RESPONSE_TIME_BUDGET_MS): void {
    expect(
      this.lastElapsedMs,
      `last call took ${this.lastElapsedMs} ms, budget is ${budgetMs} ms`,
    ).toBeLessThanOrEqual(budgetMs);
  }

  private async timed(
    label: string,
    method: string,
    path: string,
    call: () => Promise<APIResponse>,
    body?: unknown,
  ): Promise<APIResponse> {
    const startedAt = Date.now();
    const res = await call();
    this.lastElapsedMs = await recordCall(label, method, `${env.apiBaseUrl}${path}`, res, startedAt, body);
    return res;
  }

  private assertAuthenticated(): void {
    if (!this.token) {
      throw new Error('BookingClient: call authenticate() before mutating a booking');
    }
  }
}

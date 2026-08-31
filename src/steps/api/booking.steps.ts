import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/fixtures';
import { aBooking } from '../../../test-data/bookings';
import { bookingSchema, type Booking } from '../../api/schemas';
import { RESPONSE_TIME_BUDGET_MS } from '../../api/booking.client';

/* ---------- authentication ---------- */

Given('I am authenticated against the booking API', async ({ bookingClient }) => {
  await bookingClient.authenticate();
});

When('I request a token with username {string} and password {string}', async ({ bookingClient, world }, u: string, p: string) => {
  world.lastResponse = await bookingClient.tryAuthenticate(u, p);
});

Then('the auth response has status {int} and no token', async ({ world }, status: number) => {
  const res = world.lastResponse as import('@playwright/test').APIResponse;
  expect(res.status()).toBe(status);
  expect((await res.json()).token).toBeUndefined();
});

/* ---------- create + read ---------- */

async function createInWorld(
  bookingClient: import('../../api/booking.client').BookingClient,
  world: Record<string, unknown>,
  overrides: Partial<Booking>,
): Promise<void> {
  const booking = aBooking(overrides);
  const created = await bookingClient.createBooking(booking);
  world.bookingId = created.bookingid;
  world.booking = booking;
}

Given('a booking exists for {string} {string}', async ({ bookingClient, world }, f: string, l: string) => {
  await createInWorld(bookingClient, world, { firstname: f, lastname: l });
});

Given(
  'a booking exists for {string} {string} with total price {int}',
  async ({ bookingClient, world }, f: string, l: string, totalprice: number) => {
    await createInWorld(bookingClient, world, { firstname: f, lastname: l, totalprice });
  },
);

When(
  'I create a booking for {string} {string} with total price {int}',
  async ({ bookingClient, world }, f: string, l: string, totalprice: number) => {
    await createInWorld(bookingClient, world, { firstname: f, lastname: l, totalprice });
  },
);

Then('the create response returns a numeric booking id', async ({ world }) => {
  expect(typeof world.bookingId).toBe('number');
  expect(world.bookingId as number).toBeGreaterThan(0);
});

Then('fetching that booking returns the same details', async ({ bookingClient, world }) => {
  await bookingClient.assertBookingMatches(world.bookingId as number, world.booking as Booking);
});

/* ---------- contract + non-functional ---------- */

When('I fetch that booking', async ({ bookingClient, world }) => {
  world.lastResponse = await bookingClient.getBooking(world.bookingId as number);
});

Then('the response body matches the booking schema', async ({ world }) => {
  const res = world.lastResponse as import('@playwright/test').APIResponse;
  const parsed = bookingSchema.safeParse(await res.json());
  expect(parsed.success, parsed.success ? '' : JSON.stringify(parsed.error?.issues)).toBe(true);
});

Then('the response arrives within the response-time budget', async ({ bookingClient }) => {
  bookingClient.expectWithinBudget(RESPONSE_TIME_BUDGET_MS);
});

Then('the health endpoint reports the service is up', async ({ bookingClient }) => {
  const res = await bookingClient.ping();
  expect(res.status()).toBe(201);
});

/* ---------- update ---------- */

When("I update that booking's last name to {string}", async ({ bookingClient, world }, lastname: string) => {
  const updated: Booking = { ...(world.booking as Booking), lastname };
  const res = await bookingClient.updateBooking(world.bookingId as number, updated);
  expect(res.status()).toBe(200);
  world.booking = updated;
});

Then("the booking's last name is {string}", async ({ bookingClient, world }, lastname: string) => {
  const body = await bookingClient.getBookingValidated(world.bookingId as number);
  expect(body.lastname).toBe(lastname);
});

When("I patch that booking's total price to {int}", async ({ bookingClient, world }, totalprice: number) => {
  const res = await bookingClient.patchBooking(world.bookingId as number, { totalprice });
  expect(res.status()).toBe(200);
});

Then("the booking's total price is {int}", async ({ bookingClient, world }, totalprice: number) => {
  const body = await bookingClient.getBookingValidated(world.bookingId as number);
  expect(body.totalprice).toBe(totalprice);
});

Then("the booking's first name is still {string}", async ({ bookingClient, world }, firstname: string) => {
  const body = await bookingClient.getBookingValidated(world.bookingId as number);
  expect(body.firstname).toBe(firstname);
});

/* ---------- delete ---------- */

When('I delete that booking', async ({ bookingClient, world }) => {
  const res = await bookingClient.deleteBooking(world.bookingId as number);
  expect([200, 201, 204]).toContain(res.status());
});

Then('fetching that booking returns status {int}', async ({ bookingClient, world }, status: number) => {
  const res = await bookingClient.getBooking(world.bookingId as number);
  expect(res.status()).toBe(status);
});

/* ---------- negative ---------- */

When('I attempt to update that booking without a token', async ({ bookingClient, world }) => {
  const res = await bookingClient.updateWithoutToken(world.bookingId as number, world.booking as Booking);
  world.lastStatus = res.status();
});

Then('the update is rejected with status {int}', async ({ world }, status: number) => {
  expect(world.lastStatus).toBe(status);
});

When('I create a booking with a payload missing the price', async ({ bookingClient, world }) => {
  const payload: Record<string, unknown> = { ...aBooking() };
  delete payload.totalprice;
  world.lastResponse = await bookingClient.createRaw(payload);
});

When('I fetch a booking with id {int}', async ({ bookingClient, world }, id: number) => {
  world.lastResponse = await bookingClient.getBooking(id);
});

Then('the response status is {int}', async ({ world }, status: number) => {
  const res = world.lastResponse as import('@playwright/test').APIResponse;
  expect(res.status()).toBe(status);
});

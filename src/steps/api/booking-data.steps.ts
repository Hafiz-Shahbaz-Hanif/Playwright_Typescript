import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/fixtures';
import { aBooking } from '../../../test-data/bookings';
import type { Booking } from '../../api/schemas';

type Api = import('@playwright/test').APIResponse;

/* ---------- data-driven create + round-trip ---------- */

When(
  'I create a booking {string} {string} priced {int} deposit {word} staying {string} to {string} needing {string}',
  async ({ bookingClient, world }, first, last, price: number, deposit, checkin, checkout, needs) => {
    const booking = aBooking({
      firstname: first,
      lastname: last,
      totalprice: price,
      depositpaid: deposit === 'true',
      bookingdates: { checkin, checkout },
      additionalneeds: needs,
    });
    const created = await bookingClient.createBooking(booking);
    world.bookingId = created.bookingid;
    world.booking = booking;
  },
);

Then('the stored booking matches what I sent', async ({ bookingClient, world }) => {
  const body = await bookingClient.getBookingValidated(world.bookingId as number);
  const sent = world.booking as Booking;
  expect(body).toMatchObject({
    firstname: sent.firstname,
    lastname: sent.lastname,
    totalprice: sent.totalprice,
    depositpaid: sent.depositpaid,
  });
  expect(body.bookingdates.checkin).toContain(sent.bookingdates.checkin);
});

/* ---------- full update (PUT) ---------- */

When(
  'I fully update that booking to {string} {string} priced {int}',
  async ({ bookingClient, world }, first, last, price: number) => {
    const updated: Booking = {
      ...(world.booking as Booking),
      firstname: first,
      lastname: last,
      totalprice: price,
    };
    const res = await bookingClient.updateBooking(world.bookingId as number, updated);
    expect(res.status()).toBe(200);
    world.booking = updated;
  },
);

Then(
  'the booking reads back as {string} {string} priced {int}',
  async ({ bookingClient, world }, first, last, price: number) => {
    const body = await bookingClient.getBookingValidated(world.bookingId as number);
    expect(body.firstname).toBe(first);
    expect(body.lastname).toBe(last);
    expect(body.totalprice).toBe(price);
  },
);

/* ---------- partial update (PATCH) ---------- */

When("I patch that booking's first name to {string}", async ({ bookingClient, world }, first: string) => {
  const res = await bookingClient.patchBooking(world.bookingId as number, { firstname: first });
  expect(res.status()).toBe(200);
});

When("I patch that booking's additional needs to {string}", async ({ bookingClient, world }, needs: string) => {
  const res = await bookingClient.patchBooking(world.bookingId as number, { additionalneeds: needs });
  expect(res.status()).toBe(200);
});

Then("the booking's additional needs are {string}", async ({ bookingClient, world }, needs: string) => {
  const body = await bookingClient.getBookingValidated(world.bookingId as number);
  expect(body.additionalneeds).toBe(needs);
});

/* ---------- filtering ---------- */

When(
  'I filter bookings by firstname {string} and lastname {string}',
  async ({ bookingClient, world }, first: string, last: string) => {
    world.filtered = await bookingClient.listBookingIdsWhere({ firstname: first, lastname: last });
  },
);

Then('the filtered results contain that booking', async ({ world }) => {
  expect(world.filtered as number[]).toContain(world.bookingId as number);
});

/* ---------- negative: missing fields ---------- */

When('I create a booking missing the {word} field', async ({ bookingClient, world }, field: string) => {
  const payload: Record<string, unknown> = { ...aBooking() };
  delete payload[field];
  world.lastResponse = await bookingClient.createRaw(payload);
});

Then('the response status is a client or server error', async ({ world }) => {
  const res = world.lastResponse as Api;
  expect(res.status()).toBeGreaterThanOrEqual(400);
});

/* ---------- auth positive ---------- */

Then('a token is returned', async ({ world }) => {
  const res = world.lastResponse as Api;
  expect(res.status()).toBe(200);
  expect((await res.json()).token).toBeTruthy();
});

Given('I have a valid API token', async ({ bookingClient }) => {
  await bookingClient.authenticate();
});

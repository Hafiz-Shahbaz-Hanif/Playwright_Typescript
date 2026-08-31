import type { Booking } from '../src/api/schemas';

export function aBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Hafiz',
    lastname: 'QA',
    totalprice: 275,
    depositpaid: true,
    bookingdates: { checkin: '2026-09-01', checkout: '2026-09-07' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

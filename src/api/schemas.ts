import { z } from 'zod';

/** restful-booker response contracts, validated on every API assertion. */

export const bookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
});

export const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: bookingDatesSchema,
  additionalneeds: z.string().optional(),
});

export const createBookingResponseSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: bookingSchema,
});

export const bookingIdSchema = z.object({ bookingid: z.number().int().positive() });
export const bookingIdListSchema = z.array(bookingIdSchema);

/** Shape of a successful `POST /auth` response. */
export const authResponseSchema = z.object({ token: z.string().min(1) });

export type Booking = z.infer<typeof bookingSchema>;
export type CreateBookingResponse = z.infer<typeof createBookingResponseSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;

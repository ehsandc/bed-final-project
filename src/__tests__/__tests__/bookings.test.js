import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../index.js"; // Adjust path if needed

describe("Bookings API", () => {
  it("GET /bookings should return all bookings", async () => {
    const res = await request(app).get("/bookings");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /bookings/:id should return a booking or 404", async () => {
    const res = await request(app).get("/bookings/1");
    expect([200, 404]).toContain(res.statusCode);
  });

  it("POST /bookings should fail without auth", async () => {
    const res = await request(app).post("/bookings").send({
      userId: 1,
      propertyId: 1,
      checkinDate: "2025-08-05",
      checkoutDate: "2025-08-10",
      numberOfGuests: 2,
      totalPrice: 500,
      bookingStatus: "confirmed",
    });
    expect(res.statusCode).toBe(401);
  });
});

import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../index.js"; // Adjust path if needed

describe("Properties API", () => {
  it("GET /properties should return all properties", async () => {
    const res = await request(app).get("/properties");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /properties/:id should return a property or 404", async () => {
    const res = await request(app).get("/properties/1");
    expect([200, 404]).toContain(res.statusCode);
  });

  it("POST /properties should fail without auth", async () => {
    const res = await request(app).post("/properties").send({
      title: "Test Property",
      description: "A test property",
      location: "Test City",
      pricePerNight: 100,
      bedroomCount: 2,
      bathRoomCount: 1,
      maxGuestCount: 4,
    });
    expect(res.statusCode).toBe(401);
  });
});

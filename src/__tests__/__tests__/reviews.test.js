import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../index.js"; // Adjust path if needed

describe("Reviews API", () => {
  it("GET /reviews should return all reviews", async () => {
    const res = await request(app).get("/reviews");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /reviews/:id should return a review or 404", async () => {
    const res = await request(app).get("/reviews/1");
    expect([200, 404]).toContain(res.statusCode);
  });

  it("POST /reviews should fail without auth", async () => {
    const res = await request(app).post("/reviews").send({
      userId: 1,
      propertyId: 1,
      rating: 5,
      comment: "Great place!",
    });
    expect(res.statusCode).toBe(401);
  });
});

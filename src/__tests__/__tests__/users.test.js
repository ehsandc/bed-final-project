// __tests__/users.test.js
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../index.js";

describe("GET /users", () => {
  it("should return all users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

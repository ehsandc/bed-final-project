import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../index.js"; // Adjust the path if your app is exported elsewhere

describe("Hosts API", () => {
  it("GET /hosts should return all hosts", async () => {
    const res = await request(app).get("/hosts");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /hosts/:id should return a single host or 404", async () => {
    const res = await request(app).get("/hosts/1");
    expect([200, 404]).toContain(res.statusCode);
  });

  it("POST /hosts should fail without auth", async () => {
    const res = await request(app).post("/hosts").send({
      username: "testhost",
      password: "testpass",
      name: "Test Host",
      email: "testhost@example.com",
      phoneNumber: "1234567890",
      pictureUrl: "",
      aboutMe: "Test host bio",
    });
    expect(res.statusCode).toBe(401);
  });
});

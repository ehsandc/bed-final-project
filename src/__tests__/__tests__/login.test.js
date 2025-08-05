import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../index.js"; // Adjust path if needed

describe("Login API", () => {
  it("POST /login should fail with invalid credentials", async () => {
    const res = await request(app).post("/login").send({
      username: "wronguser",
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  // Uncomment and adjust the following test if you have a valid user in your seed data
  // it("POST /login should succeed with valid credentials", async () => {
  //   const res = await request(app).post("/login").send({
  //     username: "validuser",
  //     password: "validpass"
  //   });
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toHaveProperty("token");
  // });
});

/// <reference types="jest" />
import request from "supertest";
import { app } from "../app";

describe("Auth", () => {
  it("rejects invalid login", async () => {
    const res = await request(app).post("/auth/login").send({ email: "x@x.com", password: "bad" });
    expect([400,401]).toContain(res.status);
  });
});

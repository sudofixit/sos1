import { describe, test, expect } from "bun:test";
import { BASE_URL, buildHeaders, getCookieHeader, env } from "./utils";

describe("Auth Route", () => {
  test("POST /auth/login issues token cookie", async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
      }),
    });
    expect(res.status).toBe(200);
    const cookie = getCookieHeader(res.headers);
    expect(cookie).toContain("admin_token=");
  });

  test("POST /auth/login rejects invalid email", async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ email: "not-an-email", password: "secret" }),
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error || json.message).toBeDefined();
  });

  test("POST /auth/login rejects missing password", async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ email: env.ADMIN_EMAIL }),
    });
    expect(res.status).toBe(400);
  });
});

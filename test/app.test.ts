import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, beforeEach, describe, it } from "node:test";

import { createApp, type AppDependencies } from "../src/app.js";
import { InMemoryTokenStore } from "../src/auth/token-store.js";
import { DailyWordLimiter } from "../src/rate-limit/daily-word-limiter.js";

describe("HTTP API", () => {
  let baseUrl: string;
  let dependencies: AppDependencies;
  let server: Server;

  before(async () => {
    server = createServer((request, response) => {
      void createApp(dependencies)(request, response);
    });

    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address() as AddressInfo;
    baseUrl = `http://${address.address}:${address.port}`;
  });

  beforeEach(() => {
    dependencies = {
      lineWidth: 10,
      rateLimiter: new DailyWordLimiter(5),
      tokenStore: new InMemoryTokenStore(),
    };
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error === undefined) {
          resolve();
          return;
        }

        reject(error);
      });
    });
  });

  it("creates a token from an email", async () => {
    const response = await fetch(`${baseUrl}/api/token`, {
      body: JSON.stringify({ email: "foo@bar.com" }),
      headers: { "content-type": "application/json; charset=utf-8" },
      method: "POST",
    });

    const payload = (await response.json()) as { token: string };

    assert.equal(response.status, 200);
    assert.match(payload.token, /^[0-9a-f-]{36}$/u);
  });

  it("returns the health status", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  });

  it("returns 404 for an unknown route", async () => {
    const response = await fetch(`${baseUrl}/unknown`);

    assert.equal(response.status, 404);
  });

  it("rejects token requests with a wrong method", async () => {
    const response = await fetch(`${baseUrl}/api/token`);

    assert.equal(response.status, 405);
  });

  it("rejects token requests with a wrong content type", async () => {
    const response = await fetch(`${baseUrl}/api/token`, {
      body: JSON.stringify({ email: "foo@bar.com" }),
      headers: { "content-type": "text/plain" },
      method: "POST",
    });

    assert.equal(response.status, 415);
  });

  it("rejects token requests with invalid json", async () => {
    const response = await fetch(`${baseUrl}/api/token`, {
      body: "{",
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    assert.equal(response.status, 400);
  });

  it("rejects token requests with invalid email", async () => {
    const response = await fetch(`${baseUrl}/api/token`, {
      body: JSON.stringify({ email: "not-an-email" }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    assert.equal(response.status, 400);
  });

  it("justifies text with a valid bearer token", async () => {
    const token = await createToken(baseUrl);

    const response = await fetch(`${baseUrl}/api/justify`, {
      body: "aa bb cc dd",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "text/plain",
      },
      method: "POST",
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(await response.text(), "aa  bb  cc\ndd");
  });

  it("rejects justification requests with a wrong method", async () => {
    const response = await fetch(`${baseUrl}/api/justify`);

    assert.equal(response.status, 405);
  });

  it("rejects justification requests with a wrong content type", async () => {
    const response = await fetch(`${baseUrl}/api/justify`, {
      body: JSON.stringify({ text: "hello" }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    assert.equal(response.status, 415);
  });

  it("rejects justification without a valid token", async () => {
    const response = await fetch(`${baseUrl}/api/justify`, {
      body: "hello",
      headers: { "content-type": "text/plain" },
      method: "POST",
    });

    assert.equal(response.status, 401);
  });

  it("rejects justification with an unknown bearer token", async () => {
    const response = await fetch(`${baseUrl}/api/justify`, {
      body: "hello",
      headers: {
        authorization: "Bearer unknown-token",
        "content-type": "text/plain",
      },
      method: "POST",
    });

    assert.equal(response.status, 401);
  });

  it("returns 402 when the daily word limit is exceeded", async () => {
    const token = await createToken(baseUrl);

    const response = await fetch(`${baseUrl}/api/justify`, {
      body: "one two three four five six",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "text/plain",
      },
      method: "POST",
    });

    const payload = (await response.json()) as {
      details: { limit: number; remainingWords: number };
      error: string;
    };

    assert.equal(response.status, 402);
    assert.equal(payload.error, "Daily word limit exceeded.");
    assert.equal(payload.details.limit, 5);
    assert.equal(payload.details.remainingWords, 5);
  });
});

async function createToken(baseUrl: string): Promise<string> {
  const response = await fetch(`${baseUrl}/api/token`, {
    body: JSON.stringify({ email: "foo@bar.com" }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });

  const payload = (await response.json()) as { token: string };

  return payload.token;
}

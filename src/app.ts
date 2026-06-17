import type { IncomingMessage, ServerResponse } from "node:http";

import { InMemoryTokenStore, isValidEmail } from "./auth/token-store.js";
import { DEFAULT_LINE_WIDTH } from "./config.js";
import { BodyTooLargeError, readBody } from "./http/body.js";
import { hasContentType } from "./http/content-type.js";
import { sendError, sendJson, sendText } from "./http/responses.js";
import { countWords, justifyText } from "./justify/justify-text.js";
import { DailyWordLimiter } from "./rate-limit/daily-word-limiter.js";

export interface AppDependencies {
  lineWidth: number;
  rateLimiter: DailyWordLimiter;
  tokenStore: InMemoryTokenStore;
}

export function createDefaultDependencies(): AppDependencies {
  return {
    lineWidth: DEFAULT_LINE_WIDTH,
    rateLimiter: new DailyWordLimiter(),
    tokenStore: new InMemoryTokenStore(),
  };
}

export function createApp(dependencies = createDefaultDependencies()) {
  return async (
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> => {
    try {
      await routeRequest(request, response, dependencies);
    } catch (error) {
      if (error instanceof BodyTooLargeError) {
        sendError(response, 413, "Request body is too large.");
        return;
      }

      sendError(response, 500, "Unexpected server error.");
    }
  };
}

async function routeRequest(
  request: IncomingMessage,
  response: ServerResponse,
  dependencies: AppDependencies,
): Promise<void> {
  const path = getPath(request);

  if (request.method === "GET" && path === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (path === "/api/token") {
    await handleTokenRequest(request, response, dependencies);
    return;
  }

  if (path === "/api/justify") {
    await handleJustifyRequest(request, response, dependencies);
    return;
  }

  sendError(response, 404, "Route not found.");
}

async function handleTokenRequest(
  request: IncomingMessage,
  response: ServerResponse,
  dependencies: AppDependencies,
): Promise<void> {
  if (request.method !== "POST") {
    sendError(response, 405, "Method not allowed.");
    return;
  }

  if (!hasContentType(request.headers, "application/json")) {
    sendError(response, 415, "Content-Type must be application/json.");
    return;
  }

  const body = await readBody(request);
  const payload = parseJson(body);

  if (!isObject(payload) || !isValidEmail(payload.email)) {
    sendError(response, 400, "Body must contain a valid email.");
    return;
  }

  const token = dependencies.tokenStore.createForEmail(payload.email);

  sendJson(response, 200, { token });
}

async function handleJustifyRequest(
  request: IncomingMessage,
  response: ServerResponse,
  dependencies: AppDependencies,
): Promise<void> {
  if (request.method !== "POST") {
    sendError(response, 405, "Method not allowed.");
    return;
  }

  if (!hasContentType(request.headers, "text/plain")) {
    sendError(response, 415, "Content-Type must be text/plain.");
    return;
  }

  const token = extractBearerToken(request.headers.authorization);

  if (token === undefined || !dependencies.tokenStore.exists(token)) {
    sendError(response, 401, "A valid Bearer token is required.");
    return;
  }

  const text = await readBody(request);
  const wordsInRequest = countWords(text);
  const rateLimit = dependencies.rateLimiter.consume(token, wordsInRequest);

  if (!rateLimit.accepted) {
    sendError(response, 402, "Daily word limit exceeded.", {
      limit: 80_000,
      remainingWords: rateLimit.remainingWords,
      resetDate: rateLimit.resetDate,
    });
    return;
  }

  sendText(response, 200, justifyText(text, dependencies.lineWidth));
}

function getPath(request: IncomingMessage): string {
  return new URL(request.url ?? "/", "http://localhost").pathname;
}

function parseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractBearerToken(authorization: string | undefined): string | undefined {
  if (authorization === undefined) {
    return undefined;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || token === undefined) {
    return undefined;
  }

  return token;
}

import type { ServerResponse } from "node:http";

export interface ApiError {
  error: string;
  details?: Record<string, unknown>;
}

export function sendJson(
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
): void {
  const body = JSON.stringify(payload);

  response.writeHead(statusCode, {
    "content-length": Buffer.byteLength(body),
    "content-type": "application/json; charset=utf-8",
  });
  response.end(body);
}

export function sendText(
  response: ServerResponse,
  statusCode: number,
  body: string,
): void {
  response.writeHead(statusCode, {
    "content-length": Buffer.byteLength(body),
    "content-type": "text/plain; charset=utf-8",
  });
  response.end(body);
}

export function sendError(
  response: ServerResponse,
  statusCode: number,
  error: string,
  details?: Record<string, unknown>,
): void {
  const payload: ApiError =
    details === undefined ? { error } : { error, details };

  sendJson(response, statusCode, payload);
}

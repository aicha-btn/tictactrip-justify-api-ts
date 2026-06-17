import type { IncomingMessage } from "node:http";

import { MAX_BODY_SIZE_BYTES } from "../config.js";

export class BodyTooLargeError extends Error {
  constructor() {
    super("Request body is too large.");
  }
}

export function readBody(
  request: IncomingMessage,
  maxBytes = MAX_BODY_SIZE_BYTES,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let receivedBytes = 0;

    request.on("data", (chunk: Buffer) => {
      receivedBytes += chunk.length;

      if (receivedBytes > maxBytes) {
        reject(new BodyTooLargeError());
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", reject);
  });
}

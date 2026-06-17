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
    let isTooLarge = false;
    let receivedBytes = 0;

    request.on("data", (chunk: Buffer) => {
      if (isTooLarge) {
        return;
      }

      receivedBytes += chunk.length;

      if (receivedBytes > maxBytes) {
        isTooLarge = true;
        reject(new BodyTooLargeError());
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", () => {
      if (isTooLarge) {
        return;
      }

      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", reject);
  });
}

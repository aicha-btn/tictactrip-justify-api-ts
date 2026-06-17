import assert from "node:assert/strict";
import type { IncomingMessage } from "node:http";
import { Readable } from "node:stream";
import { describe, it } from "node:test";

import { BodyTooLargeError, readBody } from "../src/http/body.js";

describe("readBody", () => {
  it("reads the full request body as utf-8 text", async () => {
    const request = Readable.from([
      Buffer.from("hello "),
      Buffer.from("world"),
    ]) as IncomingMessage;

    assert.equal(await readBody(request, 20), "hello world");
  });

  it("rejects when the configured body size limit is exceeded", async () => {
    const request = Readable.from([Buffer.from("abcd")]) as IncomingMessage;

    await assert.rejects(readBody(request, 3), BodyTooLargeError);
  });
});

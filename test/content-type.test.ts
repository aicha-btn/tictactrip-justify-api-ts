import assert from "node:assert/strict";
import type { IncomingHttpHeaders } from "node:http";
import { describe, it } from "node:test";

import { hasContentType } from "../src/http/content-type.js";

describe("hasContentType", () => {
  it("returns false when the content-type header is missing", () => {
    assert.equal(hasContentType({}, "text/plain"), false);
  });

  it("accepts content-type values with parameters", () => {
    assert.equal(
      hasContentType(
        { "content-type": "text/plain; charset=utf-8" },
        "text/plain",
      ),
      true,
    );
  });

  it("uses the first value when the header is represented as an array", () => {
    assert.equal(
      hasContentType(
        {
          "content-type": ["application/json; charset=utf-8"],
        } as unknown as IncomingHttpHeaders,
        "application/json",
      ),
      true,
    );
  });
});

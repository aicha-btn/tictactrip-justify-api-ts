import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DailyWordLimiter } from "../src/rate-limit/daily-word-limiter.js";

describe("DailyWordLimiter", () => {
  it("accepts requests until the daily limit is reached", () => {
    const limiter = new DailyWordLimiter(5);
    const token = "token";
    const date = new Date("2026-06-17T12:00:00.000Z");

    assert.deepEqual(limiter.consume(token, 3, date), {
      accepted: true,
      consumedWords: 3,
      remainingWords: 2,
      resetDate: "2026-06-17",
    });

    assert.deepEqual(limiter.consume(token, 2, date), {
      accepted: true,
      consumedWords: 5,
      remainingWords: 0,
      resetDate: "2026-06-17",
    });

    assert.deepEqual(limiter.consume(token, 1, date), {
      accepted: false,
      consumedWords: 5,
      remainingWords: 0,
      resetDate: "2026-06-17",
    });
  });

  it("resets usage on the next UTC day", () => {
    const limiter = new DailyWordLimiter(5);
    const token = "token";

    limiter.consume(token, 5, new Date("2026-06-17T23:59:00.000Z"));

    assert.deepEqual(
      limiter.consume(token, 1, new Date("2026-06-18T00:00:00.000Z")),
      {
        accepted: true,
        consumedWords: 1,
        remainingWords: 4,
        resetDate: "2026-06-18",
      },
    );
  });
});

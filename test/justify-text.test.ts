import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { countWords, justifyText } from "../src/justify/justify-text.js";

describe("justifyText", () => {
  it("justifies non-final lines to the requested width", () => {
    const result = justifyText("aa bb cc dd", 10);

    assert.equal(result, "aa  bb  cc\ndd");
    assert.equal(result.split("\n")[0]?.length, 10);
  });

  it("keeps the last line left aligned", () => {
    const result = justifyText("one two three", 20);

    assert.equal(result, "one two three");
  });

  it("starts a new justified block after a blank line", () => {
    const result = justifyText("one two three\n\nfour five six", 10);

    assert.equal(result, "one    two\nthree\nfour  five\nsix");
  });

  it("splits words that are longer than the target width", () => {
    const result = justifyText("abcdefghijk", 5);

    assert.equal(result, "abcde\nfghij\nk");
  });

  it("does not add trailing spaces to a single-word line", () => {
    const result = justifyText("abc defghijklmnop", 5);

    assert.equal(result, "abc\ndefgh\nijklm\nnop");
  });

  it("returns an empty string for blank text", () => {
    assert.equal(justifyText(" \n\t ", 80), "");
  });

  it("rejects invalid line widths", () => {
    assert.throws(() => justifyText("hello", 0), /positive integer/u);
  });
});

describe("countWords", () => {
  it("counts words separated by any whitespace", () => {
    assert.equal(countWords(" one\ntwo\tthree  "), 3);
  });
});

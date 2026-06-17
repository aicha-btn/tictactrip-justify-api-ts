import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { InMemoryTokenStore, isValidEmail } from "../src/auth/token-store.js";

describe("InMemoryTokenStore", () => {
  it("returns the same token for the same normalized email", () => {
    const store = new InMemoryTokenStore();
    const token = store.createForEmail(" Foo@Bar.com ");

    assert.equal(store.createForEmail("foo@bar.com"), token);
    assert.equal(store.exists(token), true);
    assert.equal(store.exists("unknown-token"), false);
  });
});

describe("isValidEmail", () => {
  it("accepts simple valid email addresses", () => {
    assert.equal(isValidEmail("foo@bar.com"), true);
  });

  it("rejects non-string or malformed values", () => {
    assert.equal(isValidEmail(undefined), false);
    assert.equal(isValidEmail("foo"), false);
  });
});

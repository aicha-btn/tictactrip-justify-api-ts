import { randomUUID } from "node:crypto";

export type Token = string;

export interface TokenStore {
  createForEmail(email: string): Token;
  exists(token: Token): boolean;
}

export class InMemoryTokenStore implements TokenStore {
  private readonly emailToToken = new Map<string, Token>();
  private readonly tokens = new Set<Token>();

  createForEmail(email: string): Token {
    const normalizedEmail = normalizeEmail(email);
    const existingToken = this.emailToToken.get(normalizedEmail);

    if (existingToken !== undefined) {
      return existingToken;
    }

    const token = randomUUID();
    this.emailToToken.set(normalizedEmail, token);
    this.tokens.add(token);

    return token;
  }

  exists(token: Token): boolean {
    return this.tokens.has(token);
  }
}

export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim())
  );
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

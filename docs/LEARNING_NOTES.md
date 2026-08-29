# Understand the Project from Scratch

This document is a short learning guide for rebuilding the project later.

## 1. What Is a REST API?

An API is like a service desk: you arrive with a precise request, and the service responds in an expected format.

In this project:

- you request a token from `/api/token`;
- you send text to `/api/justify`;
- the API returns the justified text.

REST is a convention for organizing those service points with HTTP routes.

## 2. Why Use a Token?

A token is an access key.

Without a token, anyone could call `/api/justify` without a limit. With a token, the API knows which word counter to use.

The request sends the token like this:

```text
Authorization: Bearer YOUR_TOKEN
```

`Bearer` means: "I am presenting this key; let me in if it is valid."

## 3. Why Use a Rate Limit?

A rate limit is a safety counter.

For this assessment, the rule is:

```text
1 token = maximum 80,000 words per day
```

If the limit is exceeded, the API responds with:

```text
402 Payment Required
```

Here, `402` means that the free daily quota has been exceeded.

## 4. How Does Justification Work?

The text is split into words.

Then a line is filled as long as the next word still fits within 80 characters. When the next word no longer fits, spaces are distributed between the words in the line.

Small example with a width of 10 characters:

```text
aa bb cc dd
```

becomes:

```text
aa  bb  cc
dd
```

The first line is complete. The last line stays left-aligned, as in most text justification systems.

## 5. Why TypeScript?

JavaScript allows many mistakes to appear only when the program runs.

TypeScript adds checks before execution. For example, it can report:

```text
This function expects a number, not a string.
```

That helps write more reliable code.

## 6. Why Tests?

A test is a small automated simulation.

Example:

- provide a short text;
- call the justification function;
- verify that the output matches the expected result.

Tests build confidence for reviewers and for future changes.

## 7. Why Git?

Git is the project history.

A commit is a snapshot of the project at a specific moment. Clean commits show the reasoning behind the work:

```text
chore: initialise project
feat: add text justification
feat: add token authentication
test: add API tests
docs: explain deployment
```

## 8. What to Open

1. Open **VS Code**.
2. Click **File > Open Folder...**.
3. Choose the project folder.
4. Open the integrated terminal with **Terminal > New Terminal**.
5. Run:

```bash
npm install
npm test
```

If the tests pass, the foundation is healthy.

## 9. Most Important Files

- `src/justify/justify-text.ts`: the core exercise.
- `src/app.ts`: the HTTP routes.
- `src/auth/token-store.ts`: token creation and validation.
- `src/rate-limit/daily-word-limiter.ts`: the daily word quota.
- `test/`: automated proof that the code works.
- `README.md`: the first documentation a reviewer will read.

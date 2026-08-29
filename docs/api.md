# API Documentation

Local base URL:

```text
http://localhost:3000
```

## GET /

Returns the main API information.

### 200 Response

```json
{
  "name": "Tictactrip Justify API",
  "status": "ok",
  "description": "REST API that justifies text to 80 characters.",
  "endpoints": {
    "health": "GET /health",
    "token": "POST /api/token",
    "justify": "POST /api/justify"
  },
  "lineWidth": 80,
  "dailyWordLimit": 80000
}
```

## POST /api/token

Creates or returns the token associated with an email address.

### Request

Headers:

```text
Content-Type: application/json
```

Body:

```json
{
  "email": "foo@bar.com"
}
```

### 200 Response

```json
{
  "token": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### Errors

- `400` when the email is missing or invalid.
- `413` when the body exceeds the accepted maximum size.
- `405` when the method is not `POST`.
- `415` when `Content-Type` is not `application/json`.

## POST /api/justify

Justifies text into 80-character lines.

### Request

Headers:

```text
Authorization: Bearer <token>
Content-Type: text/plain
```

Body:

```text
Free text to justify.
```

### 200 Response

Headers:

```text
Content-Type: text/plain; charset=utf-8
```

Body:

```text
Justified text.
```

### Errors

- `401` when the token is missing or invalid.
- `402` when the token exceeds 80,000 words for the day.
- `413` when the body exceeds the accepted maximum size.
- `405` when the method is not `POST`.
- `415` when `Content-Type` is not `text/plain`.

Example `402` response:

```json
{
  "error": "Daily word limit exceeded.",
  "details": {
    "limit": 80000,
    "remainingWords": 0,
    "resetDate": "2026-06-17"
  }
}
```

## GET /health

Technical endpoint used to verify that the server is responding.

### 200 Response

```json
{
  "status": "ok"
}
```

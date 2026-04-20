# Error Handling Architecture

## Overview

This document describes the error handling strategy across microservices, focusing on resilience patterns and consistent error propagation.

## Error Categories

| Category | HTTP Status | Description |
|---|---|---|
| Validation | 400 | Invalid input from client |
| Authentication | 401 | Missing or invalid token |
| Authorization | 403 | Insufficient permissions |
| Not Found | 404 | Resource does not exist |
| Conflict | 409 | State conflict (e.g. duplicate) |
| Internal | 500 | Unexpected server error |

## Resilience Patterns

### Retry with Exponential Backoff

Applied to transient failures (network timeouts, 503s). Max 3 retries with jitter.

```
attempt 1 → wait 1s → attempt 2 → wait 2s → attempt 3 → fail
```

### Circuit Breaker

Each downstream service has a circuit breaker with:

- **Threshold**: 5 failures in 10s → open circuit
- **Half-open**: probe every 30s
- **Fallback**: return cached data or default response

### Dead Letter Queue

Failed async events are routed to a DLQ for manual inspection and replay.

## Error Response Format

All services return a consistent JSON envelope:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Order with id=42 does not exist",
    "traceId": "abc-123"
  }
}
```

## Logging Convention

- Log at `ERROR` level with full stack trace for 5xx
- Log at `WARN` level for 4xx (client errors)
- Always include `traceId` for distributed tracing correlation

## Key Decisions

> **Decision**: Avoid exposing internal error details to clients.
> All 5xx responses return a generic message; details are only in server logs.

# Error Handling Logic for Development and Production

---

## Overview

This code defines two functions, `sendErrorDev` and `sendErrorProd`, to handle errors differently depending on whether the application is running in **development** or **production** mode.

---

## Functions to Handle Errors

### 1. `sendErrorDev` (for Development Environment)

- **Purpose**: To send detailed error information to the client for debugging.
- **Response**:
  - `status`: Status of the error (e.g., "fail" or "error").
  - `error`: The full error object.
  - `message`: A description of the error.
  - `stack`: The stack trace, useful for debugging.

### 2. `sendErrorProd` (for Production Environment)

- **Purpose**: To send minimal error details to the client to avoid leaking sensitive information.
- **Handling**:
  - **Operational Errors (expected errors)**: If `err.isOperational` is `true`, sends a user-friendly message to the client.
  - **Unknown or Programming Errors**: For errors that aren't operational, logs the error and sends a generic message like _"Something went very wrong"_ to avoid exposing sensitive details.

---

## Middleware for Global Error Handling

The exported function is an Express error-handling middleware.

### Arguments:

- `err`: The error object.
- `req`, `res`, `next`: Standard Express parameters.

### Logic:

1. Sets default values for `statusCode` (500) and `status` ("error") if they aren't provided.
2. Checks the `NODE_ENV` environment variable:
   - If in **development**, calls `sendErrorDev` to provide detailed error information.
   - If in **production**, calls `sendErrorProd` to provide minimal error information.

---

## Example Usage in Express

You would include this middleware at the end of your middleware stack in your Express app to handle all errors:

```javascript
app.use((err, req, res, next) => {
  // Call the global error-handling logic
});
```

## Key Concepts

Operational Errors: Errors that are expected and handled, like invalid user input or failed API requests. Marked with err.isOperational = true.
Programming Errors: Bugs in the code or unexpected errors, which should not be exposed to the client.

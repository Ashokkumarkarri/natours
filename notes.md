# Error Handling in Async Functions in Express

When using `async/await` in Express applications, it's essential to handle errors efficiently to prevent crashes or unexpected failures. Here's how to handle errors using a utility function.

## The Problem

- **Async/Await**: If an error occurs inside an `async` function (e.g., during a database query), it won't be caught automatically.
- **Result**: The application may fail or behave unpredictably if errors aren't handled correctly.

## Solution: `catchAsync` Utility Function

The `catchAsync` function wraps your `async` functions and ensures errors are passed to the next middleware for handling.

### Implementation

```javascript
// catchAsync.js
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // Catches errors and passes to next()
  };
};
```

- Function Wrapper: Takes an async function (fn) and returns a middleware function.
- Error Handling: .catch(next) catches any errors and calls next() to trigger Express's error middleware.

### Error-Handling Middleware

Make sure to define error-handling middleware to catch and respond to errors:

```js
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  });
});
```

### Advantages

1. Cleaner Code: No repetitive try-catch blocks.
2. Centralized Handling: All errors are handled in one place, simplifying debugging and error management.

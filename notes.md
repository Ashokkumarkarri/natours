# Handling Unhandled Rejections in Node.js

In Node.js, **unhandled rejections** occur when a promise is rejected and there’s no `.catch()` handler to catch that rejection.
Handling unhandled rejections gracefully is important to prevent the application from running in an unstable state.

Here's a breakdown of the code:

1. **Listening for `unhandledRejection`**:

   ```javascript
   process.on('unhandledRejection', (err) => {
     // This event listener captures any unhandled promise rejections.
   });
   ```

   Using `process.on('unhandledRejection')`, you can listen for unhandled rejections globally. If any promise is rejected without a `.catch()` method, it will be caught here.

2. **Logging the Error**:

   ```javascript
   console.log(err.name, err.message);
   console.log('UNHANDLED REJECTION!🔥 Shutting down...');
   ```

   This logs the error’s name and message, helping to identify the cause of the unhandled rejection.

3. **Gracefully Shutting Down**:

   ```javascript
   server.close(() => {
     process.exit(1); // code 0 for success, code 1 for uncaught exceptions
   });
   ```

   - `server.close()` stops the server from accepting new connections but allows ongoing requests to complete.
   - `process.exit(1)` then terminates the Node.js process with a non-zero exit code (`1`), which typically signifies an error.

This approach helps prevent any unpredictable behavior by safely terminating the application in response to unhandled promise rejections. This way, you can restart it in a clean state (usually with a process manager like PM2 or Docker).

### Additional Note

For production systems, it’s recommended to add logging or alerts (like sending the error to an error-tracking service) before shutting down, so you have a record of unhandled rejections.

### Error Handling in Express

In Express.js, handling errors, especially for routes that are not defined, is crucial to provide meaningful responses to clients.

---

#### Default Behavior

- By default, when a user tries to access a URL that does not exist, Express returns an HTML response.
- To customize this and send a JSON response, I can define a "catch-all" route.

---

### Setting Up a 404 Error Route

- I use `app.all('*', ...)` to handle all requests that don’t match any of the defined routes.
- The ``symbol acts as a wildcard, capturing any request that does not match`/api/v1/tours`or`/api/v1/users`.
- Example:

  ```js
  // 3) Routes
  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);

  // Catch-all route for undefined URLs
  app.all('*', (req, res, next) => {
    res.status(404).json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`,
    });
  });
  ```

  - **Explanation**:
    - `app.all('*')`: Captures all HTTP methods (GET, POST, PUT, DELETE, etc.) for any undefined route.
    - `res.status(404)`: Sets the HTTP status code to 404, indicating "Not Found."
    - `req.originalUrl`: Provides the original URL requested by the client.
    - The JSON response includes a `status` of "fail" and a message that the URL is not found.

### Note

- This ensures my API returns a consistent JSON response when a client tries to access an undefined route, making error handling more straightforward.

I can now handle errors more efficiently and provide a better API experience.

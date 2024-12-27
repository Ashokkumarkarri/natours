# 018 Adding a \_me Endpoint

### Notes on Implementing `/me` Endpoint in Node.js

1. **Purpose of `/me` Endpoint**:
   - A common practice in APIs to allow users to retrieve their own data.
   - Eliminates the need to pass a user ID in the URL.
2. **Steps to Implement `/me` Endpoint**:
   - Use a middleware to set the `req.params.id` to the current user's ID.
   - Reuse existing `getOne` factory function to retrieve the user data.
3. **Middleware for `/me` Endpoint**:

   ```jsx
   exports.getMe = (req, res, next) => {
     req.params.id = req.user.id; // Assign current user's ID to req.params.id
     next(); // Pass control to the next middleware
   };
   ```

4. **Define `/me` Route**:

   ```jsx
   router.get(
     '/me',
     authController.protect, // Ensure user is logged in
     userController.getMe, // Add user ID to params
     userController.getUser, // Fetch user data using the factory function
   );
   ```

5. **How It Works**:
   - **Authentication**: `authController.protect` middleware verifies the user and attaches their data (e.g., ID) to `req.user`.
   - **Parameter Setting**: `userController.getMe` sets `req.params.id` to `req.user.id`.
   - **Data Retrieval**: `userController.getUser` fetches the user document using the ID from `req.params`.
6. **Key Points**:
   - Middleware simplifies the logic by handling ID assignment automatically.
   - No need for additional logic in `getOne` since the middleware adjusts the request parameters dynamically.
   - The `/me` endpoint retrieves user data without requiring body or URL parameters.
7. **Testing the Endpoint**:
   - Send a GET request to `/me` with a valid token for authorization.
   - Expected Response:
     ```json
     {
       "name": "John Doe",
       "email": "john.doe@example.com",
       "role": "user",
       "data": "..."
     }
     ```
8. **Benefits**:
   - Clean and reusable code.
   - Efficient implementation leveraging middleware.
   - Enhances security by avoiding explicit passing of sensitive IDs.

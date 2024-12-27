# 019 Adding Missing Authentication and Authorization

### Notes on Authentication and Authorization in Node.js API

1. **Authentication and Authorization on Routes**:
   - Authentication and authorization are handled at the route level.
   - For example, the **tour resource** has different authorization rules for different actions:
     - **GET requests** (e.g., getting all tours) are **open to everyone** (no authentication required).
     - **POST and PUT requests** (e.g., creating or editing tours) are restricted to **admins** and **lead guides** using middleware:
       ```jsx
       authController.protect, authController.restrictTo('admin', 'lead-guide');
       ```
2. **Using Middleware for Authentication**:
   - `authController.protect` is a middleware that checks if a user is authenticated (logged in).
   - **Global Protection**:
     - Instead of adding `authController.protect` to each route individually, it can be applied to all routes at once by using:
       ```jsx
       router.use(authController.protect);
       ```
     - This ensures that all routes following this middleware require authentication.
3. **Handling Role-Based Authorization**:
   - For actions like **getting users**, **creating users**, **updating** or **deleting users**, only **admins** should have access.
   - The middleware `authController.restrictTo('admin')` ensures that only admins can perform these actions.
4. **Example of Protecting Routes**:
   - If you want to protect the route for **updating the password**, it would require authentication:
     ```jsx
     router.use(authController.protect);
     ```
   - This middleware ensures that only authenticated users can update their password.
5. **Testing the Protection**:
   - After setting up `authController.protect`, if a user tries to access a protected route without being logged in, they will get an error (e.g., "You are not logged in").
   - Example with **Postman**: If you test an endpoint like getting user data, you’ll need to pass a **Bearer token** for authentication.
   - If you try to access an admin-restricted route without admin rights, you will get a "Permission Denied" error.
6. **Refining Authorization for Specific Routes**:
   - The middleware can be applied in sequence to protect or restrict access based on the user role:
     - `authController.restrictTo('admin')`: Ensures that only admins can perform certain actions.
     - For **reviews**, only regular users can post, not guides or admins.
     - Apply this authorization logic globally for routes related to reviews.
7. **Postman Example**:
   - The Postman tests need to be updated to reflect the authentication and authorization rules:
     - **Bearer tokens** are required for routes that need authentication.
     - Admin routes should also check for the correct authorization token to ensure only admins can access them.
8. **Final Steps**:
   - Make sure all routes that should be protected are marked with `authController.protect` for authentication and `authController.restrictTo` for role-based authorization.
   - After ensuring the routes are properly protected, you can update Postman tests to include the necessary authentication tokens where required.

These steps ensure that the API is both **secure** and **role-specific**, with proper access control for users and admins.

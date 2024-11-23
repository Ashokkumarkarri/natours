### Notes: 016 Updating the Current User\_ Data in `userController`

---

**Route for Updating User Data**

```jsx
router.patch('/updateMe', authController.protect, userController.updateMe);
```

- **Login Required**:
  - Before accessing the `/updateMe` route, the user must be logged in.
- **Middleware `authController.protect`**:
  - Ensures the user is authenticated before allowing access to the `updateMe` controller.
  - If the user is not logged in, the request will be blocked.
- Once the middleware confirms the user is logged in, the `updateMe` logic will execute to update the user's data.

---

1. **Purpose of Updating the User**:
   - We allow users to update their information like **name** and **email** through a dedicated route.
   - Password updates are handled **separately** using a different route. This separation is intentional and aligns with **real-world app practices**, ensuring better security and maintainability.

---

2. **Why we Separate Routes for `Password` and `User Data Updates`?**
   - **Password Security**:Updating passwords involves more security checks (e.g., verifying the old password, encrypting the new password). Combining this with other user data updates could lead to vulnerabilities.
   - **Clarity and Purpose**:By using separate routes, we keep the application logic clear. Each route serves a specific purpose:
     - `/updateMyPassword` → Handles password updates.
     - `/updateMe` → Handles general user information updates (like name and email).
   - **Better Control**:Allows us to apply different validation and logic to each route without complicating the codebase.

---

3. **Steps in the Code Logic for `/updateMe`**:
   - **Step 1: Prevent Password Updates in This Route**
     - If the user tries to update `password` or `passwordConfirm` fields using this route, we block the request and send an error response.
     - **Why?** Password updates are handled by `/updateMyPassword` to ensure security.
   - **Step 2: Filter Allowed Fields**
     - A utility function (`filterObj`) is used to filter the fields the user is allowed to update (e.g., only `name` and `email`).
     - This ensures unauthorized fields (like `role` or `password`) are not accidentally updated.
   - **Step 3: Update the User in the Database**
     - We use `findByIdAndUpdate()` to update the user data in the database.
     - This method is preferred here because we are not dealing with sensitive data (e.g., passwords). It bypasses Mongoose's pre-save hooks, which simplifies the process.
     - Options used:
       - `new: true`: Ensures the response contains the updated user data.
       - `runValidators: true`: Ensures the data being updated adheres to the schema validation rules.
   - **Step 4: Send the Response**
     - A success message is returned with the updated user data.

---

4. **The `filterObj` Function**:
   - **Purpose**:Filters the incoming request body to allow only specific fields (e.g., `name` and `email`).
   - **Why Use This?**This ensures users cannot update fields they are not authorized to modify (like `password`, `role`, or `createdAt`).
   - **How It Works?**
     - Loops through the request body keys.
     - Keeps only the keys that match the allowed fields.
     - Returns the filtered object.

---

5. **Practical Example**:
   - **Request to `/updateMe`:**
     ```json
     {
       "name": "John Doe",
       "email": "john.doe@example.com",
       "role": "admin"
     }
     ```
   - **Filtered Output:**
     Only `name` and `email` are updated. The `role` field is ignored.
   - **Response:**
     ```json
     {
       "status": "success",
       "data": {
         "user": {
           "name": "John Doe",
           "email": "john.doe@example.com"
         }
       }
     }
     ```

---

1. **Why Not Use `save()` for Updates?**
   - The `save()` method triggers Mongoose's pre-save hooks, which include logic for password encryption and validation.
   - Since this route does not deal with passwords, using `findByIdAndUpdate()` is more efficient. It avoids unnecessary operations.

---

By structuring routes this way, we achieve a **secure, modular, and clear approach** to updating user information. Future changes or updates to the logic will also be easier to manage.

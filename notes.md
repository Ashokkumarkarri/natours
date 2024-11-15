`Agenda`: Restrict access to routes, only logged-in users can access these routes. This improves security by ensuring that only authenticated users can access certain app features.

### Steps Explained:

1. **Extract Token**:
   - **Logic**: Look for a token in the `Authorization` header.
   - **Reason**: This token identifies the user session and is required for validation.
2. **Check Token Presence**:
   - **Logic**: If no token, return an error.
   - **Reason**: Users must be logged in to access the protected route.
3. **Verify Token**:
   - **Logic**: (To be implemented) Use a library (like `jsonwebtoken`) to verify the token.
   - **Reason**: Ensures the token is genuine and hasn’t been altered.
4. **Confirm User Exists**:
   - **Logic**: Query database to check if the user still exists.
   - **Reason**: Users may be deleted, so this check prevents access for removed users.
5. **Check Password Change**:
   - **Logic**: Ensure token was issued after the last password change.
   - **Reason**: If the user changed their password, older tokens should be invalidated for security.
6. **Allow Access**:
   - **Logic**: If all checks pass, call `next()` to grant access to the route.
   - **Reason**: Only verified users proceed to the protected feature.

**Outcome**: This middleware ensures that only authenticated, valid users can access secure routes, protecting sensitive functionality from unauthorized access.

---

we will add an middleware in front the route, so the first this middleware will get executed and go through the steps we define, and if it passes all the checks then it will go to the route.

```js
  .get(authController.protect, tourController.getAllTours)
```

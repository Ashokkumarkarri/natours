## login Function - Quick Notes

1. Extracts email and password from request body.

2. `Validation Checks`:

   - `Check #1`: Ensures both email and password are provided.

   - `Check #2`: Verifies if a user with that email exists and if the provided password is correct (using correctPassword method).

3. `Token Creation`:
   If all checks pass, generates a JWT token using signToken with the user's ID.

4. `Response`:
   Sends a success status and the JWT token to the client for authentication.

---

### Login Function Overview

1. **Extract Email and Password**:

   - Extracts `email` and `password` from the request body.

   ```jsx
   const email = req.body.email;
   const password = req.body.password;
   ```

2. **Validation Check**:

   - Checks if both `email` and `password` exist.
   - Returns an error if missing.

   ```jsx
   if (!email || !password)
     return next(new AppError('Provide email and password', 400));
   ```

3. **Check User Existence & Password Match**:

   - Finds user by `email` and includes the `password` field.
   - Uses instance method `correctPassword` to verify password match.
   - Returns error if user is not found or password is incorrect.

   ```jsx
   const user = await User.findOne({ email }).select('+password');
   if (!user || !(await user.correctPassword(password, user.password))) {
     return next(new AppError('Incorrect email or password', 401));
   }
   ```

4. **Generate JWT Token**:

   - Calls `signToken` function to create a JWT using the user's ID.

   ```jsx
   const token = signToken(user._id);
   ```

5. **Send Response with Token**:
   - Responds with status `200` and includes the token in the response.

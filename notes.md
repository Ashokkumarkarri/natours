## 014 Password Reset Functionality\_ Setting New Password

`1. Get user from collection.`

`2. Check if posted password is correct.`

`3. If so, update the password.`

`4. Log user in, send JWT.`

---

`Note:`

- We allow users to update their passwords without using the "forgot password" option.
  However, a user can only change their password while logged in.
- For instance, if a user leaves their computer unattended, someone else could potentially change their password.
- To prevent this, we always require the user to provide their current password before allowing them to set a new one.

---

## Simple Notes for updatePassword Function

1. Fetch the User:
   Find the user by their id and include the password field using .select('+password').
   Verify Current Password:

2. Check if the provided passwordCurrent matches the user's existing password using correctPassword.
   Update Password:

3. If the current password is correct, update password and passwordConfirm.
   Save the changes using .save() (important for validation and middleware).
   Send JWT:

Log the user in again by sending a new JWT after the password is updated.

---

---

### Detailed Notes for `updatePassword` Function

1. **Purpose:**This function updates the logged-in user's password securely by validating the current password and then saving the new password.

2. **Steps:**

   ### a. **Get the User from the Database:**

   - Use `User.findById(req.user.id)` to fetch the user based on their `id` (available from the logged-in user's JWT).
   - Use `.select('+password')` to explicitly include the `password` field, as it's typically excluded in query results due to the schema configuration.

   ### b. **Verify the Current Password:**

   - Check if the `passwordCurrent` provided in the request body matches the stored password.
   - Use the `correctPassword` method defined in the `User` model for this comparison.
   - If the passwords do not match, throw an error using `next(new AppError(...))` with a status code of `401` (Unauthorized).

   ### c. **Update the Password:**

   - Assign the new password (`req.body.password`) and password confirmation (`req.body.passwordConfirm`) to the user object.
   - Use `user.save()` to save the updated user in the database.
     - _Important:_ Use `save()` instead of `findByIdAndUpdate()` to ensure the pre-save hooks and validators (e.g., hashing the password) are executed.

   ### d. **Send a New JWT to Log In the User:**

   - Call `createSendToken(user, 200, res)` to:
     1. Generate a new JSON Web Token (JWT) for the updated user.
     2. Send the token along with a response confirming the password update.

---

1. **Key Notes:**
   - The `correctPassword` method checks the encrypted password. Ensure this method is implemented correctly in the `User` model.
   - `password` and `passwordConfirm` fields must match for the save operation to succeed. This is validated by the Mongoose schema.
   - Always use `next(new AppError(...))` for handling errors gracefully in middleware.

```js
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //2)Check if posted password is correct.
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  //3)If so, update the password.
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //user.findByIdAndUpdate method will not work as intended.

  //4)Log user in, send JWT

  createSendToken(user, 200, res);
});
```

```js
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
```

## 014 Password Reset Functionality\_ Setting New Password

`1. Get the user based on the token.`

`2. if token has not expired, and there is user, set the new password.`

`3. Update changedPasswordAt property for the user.`

`4. Log the user in, send JWT to client.`

```js
exports.resetPassword = async (req, res, next) => {
  //1)Get the user based on the token.
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3) Update changedPasswordAt property for the user.

  //4)Log the user in, send JWT to client.
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
};
```

---

1. **Get the user based on the token**
   - Hash the token from the URL to match the one stored in the database.
   - Search for a user with the hashed token and check if the token has not expired (`passwordResetExpires > Date.now()`).
2. **Check token validity and set a new password**
   - If no user is found or the token has expired, send an error.
   - Otherwise, update the user's password (`password` and `passwordConfirm` fields).
   - Remove the reset token and its expiration time from the database.
3. **Update the `changedPasswordAt` property**
   - Automatically update the `passwordChangedAt` timestamp when the user changes their password.
   - Ensure this update happens during password modification only.
4. **Log the user in and send a new JWT**
   - Generate a new JWT token for the user using their ID.
   - Respond with a success message and the new token.

### Example Logic Flow:

1. Verify the reset token's authenticity and expiration.
2. If valid, save the new password.
3. Update `passwordChangedAt` so old tokens can't be reused.
4. Generate and return a fresh login token (JWT).

---

## code

- **Get the user based on the token**
  - Hash the token and find the user in the database.
  ```jsx
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  ```
- **Check token validity and set a new password**
  - If no user is found or the token is expired, return an error.
  - Otherwise, update the password and clear the reset token fields.
  ```jsx
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  ```
- **Update the `changedPasswordAt` property**
  - Automatically set `passwordChangedAt` when the password is updated.
  ```jsx
  userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });
  ```
- **Log the user in and send a new JWT**
  - Create a new JWT and send it to the client.
  ```jsx
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
  ```

### Password Reset Process:

1. **Requesting a Password Reset**:
   - The user provides their email and sends a POST request to the "forgot password" route.
   - A random reset token is generated (not a JSON Web Token) and sent to the user's email.
2. **Resetting the Password**:
   - The user uses the token from the email to send another POST request, this time to the "reset password" route.
   - Along with the token, the user includes their new password.
   - If everything is valid, the system updates the user's password.

---

## Code:

```js
router.post('/forgotPassword', authController.forgotPassword); //only receives email address.
router.post('/resetPassword', authController.resetPassword); //receives token and the  new password.
```

```jsx
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)  Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  //we used findOne since user and we do not know his id, we only know his emailID, so we are trying to find him with his email.
  if (!user) {
    return next(new AppError('There is no user with email address ', 404));
  }

  //2) Generate  the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3)Send it to user's email
});

exports.resetPassword = (req, res, next) => {};
```

```js
userSchema.methods.createPasswordResetToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString('hex'); //we should not directly store this token in DB.
  // Hash the token and store it in the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  // Set token expiration time (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //we want the token to be expire in 10 mns: in millie seconds

  // Return the raw token (to be sent to the user)
  return resetToken;
};
```

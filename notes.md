## Verify:

In verification, we check whether the token has been modified or has expired.
We use the `jwt.verify` method for this purpose.

If we manipulate the payload of a JWT, it generates a different JWT. When we try to access data using this manipulated JWT, an error occurs.
The error is called `JsonWebTokenError`.

```js
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
console.log(decoded);
```

## Check if User Still Exists:

If a user holds a valid JWT but their account has been deleted, they should no longer have access.
This scenario ensures proper access control.

```js
const currentUser = await User.findById(decoded.id);
if (!currentUser) {
  return next(
    new AppError('The user belonging to the token does not exist', 401),
  );
}
```

## Check if User Changed Password After Token Issuance:

Use a `static method` in the userModel to verify if the user has changed their password after the token was issued.
If the password was changed, access should be denied.

```js
if (currentUser.changedPasswordAfter(decoded.iat)) {
  return next(
    new AppError('User recently changed password! Please login again.', 401),
  );
}
```

---

## Give Access:

If all tests are successful, the user is granted access to the protected routes.

```

```

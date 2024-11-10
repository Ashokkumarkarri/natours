## Password Hashing and Validation in Mongoose with bcryptjs

`npm i bcryptjs`

This code snippet outlines how to securely handle passwords in a Mongoose schema by using the `bcryptjs` library to hash passwords and enforce password confirmation validation. Here’s a breakdown of each part:

---

## Schema Definitions

### Password Field

```javascript
password: {
  type: String,
  required: [true, 'User must have a password'],
  minlength: 8,
}
```

- **Type**: `String`, stores the hashed password.
- **Required**: Ensures that every user must provide a password.
- **Minimum Length**: Set to 8 characters to enforce a basic security measure.

### Password Confirmation Field

```javascript
passwordConfirm: {
  type: String,
  required: [true, 'Please confirm your password'],
  validate: {
    validator: function (el) {
      return el === this.password;
    },
    message: 'Passwords are not the same!',
  },
}
```

- **Required**: Prompts the user to confirm their password.
- **Custom Validator**: Checks if `passwordConfirm` matches `password`. This validation only runs on `.save()` and `.create()` operations, ensuring passwords are identical during account creation or update.

---

## Pre-Save Middleware

```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Remove `passwordConfirm` from the saved document
  this.passwordConfirm = undefined;
  next();
});
```

- **Purpose**: Ensures that passwords are hashed before being saved to the database.
- **Condition**: `if (!this.isModified('password')) return next();`
  - This condition prevents the password from being rehashed if it hasn’t been modified, which is useful when updating other user details (e.g., name or email).
- **Hashing with `bcrypt`**:
  - Uses a **cost factor of 12** for hashing, which balances security and performance.
- **Removing `passwordConfirm`**:
  - `passwordConfirm` is deleted before saving since it’s only needed temporarily for validation and shouldn’t be stored in the database.

---

## Summary

- **Purpose**: Ensures secure storage and validation of user passwords by hashing them and validating confirmation on account creation or update.
- **Security**: Hashing passwords with `bcrypt` and a cost factor adds significant protection against brute-force attacks.
- **Efficiency**: Middleware only hashes the password if it’s been modified, optimizing performance during other user updates.

This approach follows best practices in password management, providing strong user authentication while keeping code maintainable and efficient.

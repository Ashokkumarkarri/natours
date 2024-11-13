resources:
npm i jsonwebtoken

---

## Implementing JWT for User Signup

## Purpose of JWT in Authentication

- **JSON Web Token (JWT)** is a secure way to handle authentication.
- JWT contains encoded information (payload) that verifies the user's identity and can include custom data.
- Tokens are signed with a secret key, ensuring they cannot be modified without detection.

## Code Walkthrough

### 1. Required Modules

```js
const jwt = require('jsonwebtoken');
Use code with caution.
```

jsonwebtoken is a library for generating and verifying JWTs.

### 2. Signup Function

This function is used to register a new user and return a JWT for client-side authentication.

```js
exports.signup = catchAsync(async (req, res, next) => { ... });
```

catchAsync is a wrapper function that manages errors in asynchronous functions.

### 3. Creating a New User

```js
const newUser = await User.create({
  name: req.body.name,
  email: req.body.email,
  password: req.body.password,
  passwordConfirm: req.body.passwordConfirm,
});
```

- A new user is created using `User.create()` with values from `req.body`.
- **Note**: `passwordConfirm` is only used to verify matching passwords during signup and is not saved in the database.

### 4. Generating JWT

```js
const token = jwt.sign({ id: newUser.\_id }, process.env.JWT_SECRET, {
expiresIn: process.env.JWT_EXPRESS_IN,
});
```

- **jwt.sign()** is used to create the token.
  - **Payload**: `{ id: newUser._id }`, includes the user ID, uniquely identifying the user.
  - **Secret Key**: `process.env.JWT_SECRET`, the secret used to securely sign the token.
  - **Options**:
    - **expiresIn**: `process.env.JWT_EXPRESS_IN`, specifies the token’s lifespan, here set to `90d` (90 days).

### 5. Responding to Client

```js
res.status(201).json({
  status: 'Success',
  token: token,
  data: {
    user: newUser,
  },
});
```

- **status**: HTTP status `201`, indicating the user has been created.
- **token**: The JWT is sent back to the client.
- **data**: Includes the user information for client reference.

## Environment Variables

```
JWT_SECRET=my-ultra-secure-and-best-powerf
JWT_EXPRESS_IN=90d
```

- **JWT_SECRET**: A secret key used to sign tokens.
- **JWT_EXPRESS_IN**: Sets the token’s expiration duration, here as `90d` (90 days).

## Summary

This signup implementation:

1. **Creates** a new user and securely generates a JWT.
2. **Returns** the token to the client for use in protected routes.
3. **Secures** user sessions without storing sensitive information on the client, relying on the secret key to validate the JWT.

## 019 Sending JWT via Cookie

### **Cookies**

- **Definition**: A small piece of text sent by the server to the client.
- **Purpose**: Helps store data like session identifiers, user preferences, or tokens for authentication.
- **Behavior**:
  - When the server sends cookies, the browser stores them automatically.
  - In future requests, the browser sends cookies back to the server.

---

### **Cross-Site Scripting (XSS) Attack**

- **Definition**: A security vulnerability where attackers inject malicious scripts (usually JavaScript) into trusted websites.
- **Impact**:
  - Can steal cookies, session data, or other sensitive information.
  - Can hijack user accounts or redirect users to malicious sites.

---

### **Cookie Security Options**

1. **`secure: true`**
   - Ensures cookies are sent only over HTTPS connections.
   - Protects against interception of cookies in plaintext HTTP.
2. **`httpOnly: true`**
   - Prevents client-side JavaScript from accessing or modifying cookies.
   - Protects against cross-site scripting (XSS) attacks.

---

### **JWT_COOKIE_EXPIRES_IN**

- **Definition**: Specifies the lifespan of a JWT (JSON Web Token) stored in a cookie.
- **Example Value**: `JWT_COOKIE_EXPIRES_IN=90` (90 days).

---

## code

```jsx
//function to send responses
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Set cookie options
  const cookieOptions = {
    // Expiration for the cookie
    maxage: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    ),
    // secure: true, //https
    httpOnly: true, // Prevents client-side scripts from accessing cookies (XSS protection)
  };
  // Only send cookies securely in production (HTTPS)
  //arg1=name of the cookie, arg2=data we want to send, aeg3=some options
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true; // Send cookies only over HTTPS
  }
  // Send the cookie to the client
  res.cookie('jwt', token, cookieOptions);

  // Remove the password before sending the user data in the response
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: user },
  });
};
```

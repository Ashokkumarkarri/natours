# 019 Logging out Users

## **Implementing a Secure User Logout in Node.js**

---

## **Introduction**

In this session, we focus on implementing a **secure logout mechanism** for our application. Unlike traditional logout methods that directly delete cookies, we will:

1. Use an **HTTP-only cookie** for enhanced security.
2. Implement a **logout route** to clear the authentication token by overwriting the existing cookie.

---

## **Why Traditional Logout Doesn't Work Here**

1. **HTTP-Only Cookies**:
   - The cookie storing the JSON Web Token (JWT) is set as **HTTP-only**.
   - **What this means**:
     - The browser cannot access or manipulate the cookie (e.g., deleting it).
     - Provides additional security by preventing client-side JavaScript from tampering with the token.
2. **Problem**:
   - Normally, we delete cookies or tokens stored in local storage for logout.
   - But with HTTP-only cookies, they cannot be deleted or modified directly from the browser.
3. **Solution**:
   - We overwrite the JWT cookie with a dummy value (e.g., `logged-out-dummy-jwt`).
   - This new cookie has:
     - The same name (`jwt`) as the original token.
     - An **expiry time of 10 seconds**.
   - Once this cookie expires, the user is effectively logged out.

---

## **Step-by-Step Implementation**

### **1. Backend: Logout Controller**

### **Code: `authController.js`**

```jsx
exports.logout = (req, res) => {
  res.cookie('jwt', 'logged-out-dummy-jwt', {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true, // Prevents client-side JavaScript access
  });
  res.status(200).json({ status: 'success' });
};
```

### **Explanation**

1. **Overwriting the JWT Cookie**:
   - `res.cookie('jwt', 'logged-out-dummy-jwt')` sets a new cookie with the same name as the original JWT cookie.
   - By overwriting the original cookie, we effectively invalidate the token.
2. **Short Expiry Time**:
   - The new cookie expires in 10 seconds (`Date.now() + 10 * 1000`).
   - After this, the browser automatically deletes it.
3. **HTTP-Only Cookie**:
   - The cookie is set as **httpOnly: true**, meaning:
     - It cannot be accessed or modified via JavaScript.
     - This enhances security, preventing cross-site scripting (XSS) attacks.
4. **Response**:
   - A `200 OK` response is sent with `{ status: 'success' }`.

---

### **2. Routing the Logout Endpoint**

### **Code: `userRoutes.js`**

```jsx
router.get('/logout', authController.logout);
```

### **Explanation**

1. **GET Request**:
   - The logout endpoint is a simple **GET request** since we’re not sending or modifying user data—just overwriting the cookie.
   - Example URL: `http://127.0.0.1:8000/api/v1/users/logout`.
2. **Triggering Logout**:
   - When this endpoint is hit, the `logout` controller is executed, invalidating the JWT cookie.

---

### **3. Frontend: Logout Functionality**

### **Code: `login.js`**

```jsx
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout',
    });
    if (res.data.status === 'success') location.reload(true); // Reload the page from the server
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
```

### **Explanation**

1. **Logout Request**:
   - Sends a **GET request** to the logout endpoint using `axios`.
2. **On Success**:
   - If the response indicates success (`res.data.status === 'success'`), the page is reloaded to reflect the logout state:
     ```jsx
     location.reload(true);
     ```
     - `true` forces the page to reload from the server instead of using the browser cache.
3. **Error Handling**:
   - If the request fails (e.g., no internet connection), an error message is displayed using `showAlert`.

---

### **4. Adding Logout Button Listener**

### **Code: `index.js`**

```jsx
// Import logout function
import { logout } from './login';

// DOM Element for logout button
const logOutButton = document.querySelector('.nav__el--logout');

// Add click event listener to logout button
if (logOutButton) {
  logOutButton.addEventListener('click', logout);
}
```

### **Explanation**

1. **DOM Selection**:
   - Selects the logout button element (`.nav__el--logout`).
2. **Event Listener**:
   - Adds a `click` event listener to trigger the `logout` function when the button is clicked.

---

### **5. Handling Middleware Errors for Logout**

### **Code Fix: `authController.isLoggedIn`**

```jsx
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      if (currentUser.changedPasswordAfter(decoded.iat)) return next();

      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next(); // No logged-in user; proceed to the next middleware
  }
  next();
};
```

### **Fix Explanation**

1. **Error Cause**:
   - The `isLoggedIn` middleware tried verifying a malformed JWT (the dummy `logged-out-dummy-jwt`), causing errors.
2. **Solution**:
   - Catch and handle verification errors locally using a `try-catch` block.
   - If verification fails, simply call `next()` to proceed without identifying a logged-in user.

---

### **6. Ensuring Proper Logout Behavior**

1. **Reloading the Page**:
   - After logout, the page reloads from the server (`location.reload(true)`), ensuring the user menu reflects the logged-out state.
2. **Preventing Cache Issues**:
   - Setting `true` in `location.reload(true)` ensures the page isn’t reloaded from the browser cache, which might still display the user menu.

---

### **7. Testing the Logout**

### **Steps to Test**

1. **Log In**:
   - Verify that the user menu appears after successful login.
2. **Log Out**:
   - Click the logout button.
   - Check that:
     - The JWT cookie is overwritten with the dummy token.
     - The user menu disappears after the page reloads.
     - The application reflects the logged-out state.
3. **Check Cookies**:
   - After logout, confirm that the JWT cookie has expired or been removed.

### **Common Errors to Handle**

1. **No Internet Connection**:
   - Verify that the application shows an error alert if the logout request fails.
2. **JWT Errors**:
   - Ensure the `isLoggedIn` middleware gracefully handles invalid tokens without breaking the application.

---

## **Key Takeaways**

1. **HTTP-Only Cookies**:
   - Enhance security by preventing client-side access to sensitive tokens.
   - Require server-side mechanisms for logout (e.g., overwriting cookies).
2. **Logout Mechanism**:
   - Overwrite the JWT cookie with a dummy value and set a short expiry time.
   - Reload the page to reflect the logged-out state.
3. **Middleware Design**:
   - Gracefully handle errors in middleware, ensuring smooth user experience even when tokens are invalid.
4. **Frontend-Backend Integration**:
   - Use **axios** to send requests to the logout endpoint.
   - Dynamically update the UI by reloading the page from the server.

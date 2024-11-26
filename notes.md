### **What is Express Rate Limit?**

- A middleware for **Express.js** to limit the number of requests an IP address can make to your server.
- Protects against **brute force attacks** and **Denial of Service (DoS)** attacks.

### **Why Use Rate Limiting?**

1. **Prevents abuse**: Stops a single user (or bot) from overloading your server with requests.
2. **Enhances security**: Protects your app from brute force attacks by limiting the number of attempts.
3. **Fair usage**: Ensures resources are distributed among users fairly.

### **How Does It Work?**

- Counts the requests made from each IP.
- If an IP exceeds the limit within a specific time window, further requests from that IP are blocked for the rest of the window.

---

### **Installing the Package**

Run the following command to install the `express-rate-limit` package:

```jsx
npm i express-rate-limit
```

---

### **How to Implement It?**

Here’s how you can use `express-rate-limit` in your Express app:

1. **Import the Package:**

   ```jsx
   const rateLimit = require('express-rate-limit');
   ```

2. **Create a Rate Limiter:**

   ```jsx
   const limiter = rateLimit({
     max: 100, // Maximum number of requests allowed per IP
     windowMs: 60 * 60 * 1000, // Time window of 1 hour (in milliseconds)
     message: 'Too many requests from this IP, please try again after an hour.', // Error message sent when limit is reached
   });
   ```

   - **`max`**: Sets the maximum number of requests allowed per IP.
   - **`windowMs`**: Sets the time window for the limit (e.g., 1 hour = 60 _ 60 _ 1000 ms).
   - **`message`**: Custom message sent to the client when the limit is exceeded.

3. **Apply the Rate Limiter to Routes:**
   - To apply to all API routes:
     ```jsx
     app.use('/api', limiter);
     ```
     This limits requests to any route starting with `/api`.

---

### **How It Protects Your App**

1. Counts requests for each IP in the specified `windowMs` time frame.
2. Once the `max` requests are reached, the server blocks further requests from that IP and responds with the **message**.
3. Helps to mitigate malicious attacks, such as:
   - **Brute force**: Repeated login attempts with guessed passwords.
   - **DoS**: Overloading the server with too many requests.

---

### **Benefits**

1. **Improves security** by preventing excessive or malicious requests.
2. **Saves resources** for legitimate users.
3. Easy to configure and integrate with your existing app.

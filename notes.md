**What is Parameter Pollution?**

- **Parameter pollution** happens when a user sends duplicate query parameters in the URL.Example:In such cases:
  ```bash
  /api/v1/tours?price=100&price=200
  ```
  - The server might use the first value, the last value, or both, leading to **unexpected behavior** or **security issues**.

---

### **Why Prevent Parameter Pollution?**

1. **Avoid Ambiguity**: Prevents the app from being confused by multiple conflicting parameter values.
2. **Enhance Security**: Protects the app from attacks where malicious users exploit duplicate parameters.
3. **Ensure Data Integrity**: Ensures clean and reliable query parameters for consistent processing.

---

### **Using `hpp` to Prevent Parameter Pollution**

1. **Install the `hpp` Package**:

   ```bash
   npm install hpp
   ```

2. **Add `hpp` Middleware**:

   ```jsx
   const hpp = require('hpp');

   app.use(
     hpp({
       whitelist: [
         'duration', // Parameters allowed to have duplicates
         'ratingsQuantity',
         'ratingsAverage',
         'maxGroupSize',
         'difficulty',
         'price',
       ],
     }),
   );
   ```

3. **What `hpp` Does**:
   - Removes duplicate query parameters by keeping only the **last value**.
   - For example:`/api/v1/tours?price=100&price=200` → `price=200`
   - **Whitelist**: Allows specified parameters to accept duplicates if needed (e.g., `price=100&price=200` might be valid for filtering).

---

### **Summary**

1. **`hpp`**: A middleware to prevent HTTP parameter pollution.
2. **Install**:

   ```bash
   npm install hpp
   ```

3. **Usage**: Add `hpp` to your app to clean up query parameters and whitelist acceptable duplicates.
4. **Why Use It?**:
   - Prevents attacks and ambiguity caused by duplicate query parameters.
   - Ensures clean, secure, and predictable parameters in your Express app.

---

**Quick Code**:

```jsx
const hpp = require('hpp');

// Prevent param pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'price'], // Allow duplicates for these
  }),
);
```

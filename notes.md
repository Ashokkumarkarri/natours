## 021 Setting Security HTTP Headers

---

### ** HTTP Headers**

- **What are Headers?**
  Metadata sent with HTTP requests and responses to share information between the client and server.
- **Types**:
  1. **Request Headers**: Sent by the client (e.g., browser) to the server with details like browser type or authorization.
  2. **Response Headers**: Sent by the server to the client with details like content type or security policies.
- **Why Important?**
  - Control communication (e.g., format, authentication).
  - Enhance security (e.g., prevent attacks).
  - Improve performance (e.g., caching).
- **Examples**:
  - `Content-Type`: Specifies the data format (e.g., `text/html`).
  - `Authorization`: Includes user credentials for authentication.
  - `X-Frame-Options`: Prevents clickjacking by disallowing frames.

**Summary**: Headers ensure smooth and secure communication between clients and servers.

---

### **What is Helmet?**

- `Helmet` is a middleware for Express that helps secure your app by setting HTTP headers.
- Express does not have strong security features by default, so `Helmet` is highly recommended.
  ***

### **Why Use Helmet?**

- **Protects Against Common Web Attacks**: It adds security headers to prevent attacks like Cross-Site Scripting (XSS), clickjacking, and more.
- **Improves Security**: Makes your app safer without much effort.
- **Easy to Us**ingle line of code enhances security.

---

### **How to Use Helmet?**

1. **Install Helmet**:

   ```bash
   npm install helmet
   ```

2. **Add Helmet to Your App**:

   ```jsx
   const express = require('express');
   const helmet = require('helmet');

   const app = express();

   // Use Helmet to secure the app
   app.use(helmet());
   ```

---

### **What Does Helmet Do?**

- **Sets Security Headers**: Helps protect your app by setting headers like:
  - **`X-Frame-Options`**: Stops your app from being displayed in iframes to prevent clickjacking.
  - **`Strict-Transport-Security`**: Forces the app to use HTTPS.
  - **`Content-Security-Policy`**: Controls what content can load on your site (e.g., scripts, styles).
  - **`X-Content-Type-Options`**: Stops browsers from guessing file types (prevents MIME sniffing).

---

### **Best Practices**:

1. Add `helmet()` early in your app:

---

### **In Short**:

- Helmet is a must-have middleware for Express apps.
- It secures your app by adding important HTTP headers.
- Simple to implement, with strong benefits for app security.

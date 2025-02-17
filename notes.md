# 009 Implementing CORS

---

### Notes on Implementing CORS (Cross-Origin Resource Sharing) in Node.js

In this section, we will break down the concept of **CORS** (Cross-Origin Resource Sharing), its importance in API development, and how to implement it in a Node.js application. These notes will serve as a detailed and beginner-friendly reference.

---

### **What is CORS?**

**CORS** stands for **Cross-Origin Resource Sharing**. It is a security feature implemented by web browsers to prevent malicious websites from accessing resources and APIs from a different origin without permission.

- **Origin** refers to a combination of the protocol (e.g., HTTP/HTTPS), domain (e.g., example.com), and port (e.g., 80 or 443).
- A **cross-origin request** occurs when a web application (e.g., at example.com) tries to make a request to an API hosted on another domain (e.g., natours-jonas.herokuapp.com).

For example:

- The domain `example.com` trying to access an API hosted on `natours-jonas.herokuapp.com` would be a **cross-origin request**.

By default, cross-origin requests are **blocked** for security reasons. This is where CORS comes in: it enables you to configure your API to allow cross-origin requests.

---

### **Why is CORS Needed?**

- CORS is crucial for ensuring that your API can be accessed by other websites, mobile apps, or services while maintaining security.
- It prevents malicious websites from making unauthorized requests to your API.

Without CORS, cross-origin requests will fail due to restrictions placed by web browsers.

### **Example of a Cross-Origin Request Failure:**

1. Let’s say we try to make a fetch request to `https://natours-jonas.herokuapp.com/api/v1` from a different domain (e.g., `https://example.com`).
2. Without CORS, the browser will block this request with a CORS policy error.

**Error Message:**

> "Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at [API URL]."

---

### **How to Implement CORS in Node.js**

To enable CORS in a Node.js application, we will use the **CORS middleware** provided by the `cors` npm package. Here’s how to set it up step by step:

### **1. Install the CORS Package**

First, install the CORS package via npm:

```bash
npm install cors
```

### **2. Use the CORS Middleware in Express**

Now, require the `cors` package in your application and set it up as middleware:

```
const cors = require('cors');
const express = require('express');
const app = express();

// Enable CORS for all incoming requests
app.use(cors());
```

- This will allow all incoming requests from any origin, which is ideal for APIs that want to be publicly accessible.

### **3. Understanding the CORS Headers**

The CORS middleware automatically adds the necessary headers to the response to allow cross-origin requests. The primary header added is:

```
Access-Control-Allow-Origin: *
```

This header tells the browser that the API can accept requests from any origin.

### **4. Allowing CORS for Specific Routes**

If you want to enable CORS for only specific routes (e.g., `/api/v1/tours`), you can specify the CORS middleware for that route only:

```
app.use('/api/v1/tours', cors());
```

Alternatively, you can configure more advanced CORS settings, such as specifying the allowed origin:

```
app.use(cors({
  origin: 'https://www.natours.com'
}));
```

In this case, only requests from `https://www.natours.com` will be allowed to access your API.

### **5. Handling Non-Simple Requests (Preflight Requests)**

**Simple requests** (e.g., GET, POST) can directly access the API if CORS is enabled. However, **non-simple requests** (e.g., PUT, DELETE, PATCH, requests with cookies or non-standard headers) trigger a "preflight" request.

- **Preflight Request**: Before sending the actual request, the browser sends an **OPTIONS** request to check if the actual request is safe.

To handle this, you need to respond to the **OPTIONS** HTTP method:

```
app.options('*', cors());
```

This ensures that the browser can proceed with the actual request (e.g., DELETE, PATCH) if the preflight request is successful.

---

### **Code Example for Handling Preflight Requests**

Let’s implement the preflight request handler for all routes:

```
app.options('*', cors());  // Preflight request handler for all routes
```

If you want to handle preflight for specific routes (e.g., `/api/v1/tours/:id`), use:

```
app.options('/api/v1/tours/:id', cors());  // Preflight for DELETE or PATCH requests on /tours/:id
```

---

### **Setting Specific CORS Options**

If you want to allow only specific origins (for example, a front-end hosted on a different domain), you can pass additional configuration options to the CORS middleware:

```
app.use(cors({
  origin: 'https://www.natours.com'  // Only allow this domain to access the API
}));
```

You can also specify more options, like methods or credentials:

```
app.use(cors({
  origin: 'https://www.natours.com',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true  // Allow cookies to be sent with requests
}));
```

---

### **Why Use the CORS Middleware?**

You might wonder why we are using an external package (`cors`) instead of manually adding headers to every response. Here are a few reasons:

1. **Simplifies Code**: The CORS package automatically adds all the necessary headers, saving you from writing repetitive code.
2. **Security**: It reduces the risk of errors and ensures that your application follows best practices for handling CORS.
3. **Scalability**: The package allows easy configuration for both simple and complex requests, as well as specific routes or origins.

---

### **Redeploy the Application**

Once you've configured CORS, deploy your changes to the production environment (e.g., Heroku):

```bash
git add .
git commit -m "Implemented CORS"
git push heroku master
```

After deployment, verify that cross-origin requests are working by making a fetch request from a different domain or using tools like Postman.

---

### **Conclusion**

In this lecture, we've learned how to implement **CORS** in a Node.js application using the `cors` package. By enabling CORS, we allow our API to accept requests from other domains, making it accessible to a wider range of users. We've also explored handling preflight requests and setting CORS options for specific routes and origins.

By following these steps, you can successfully implement CORS and ensure that your API can interact with different web applications securely and efficiently.

---

**Key Takeaways:**

- CORS is essential for enabling cross-origin requests.
- The `cors` middleware simplifies adding the necessary headers to your API.
- You can fine-tune the CORS configuration to control which domains, methods, and credentials are allowed.
- Handling preflight requests is necessary for non-simple requests like PUT or DELETE.

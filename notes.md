# 016

### **Implementing the Login Functionality in Node.js**

### **Overview**

In this section, we will connect the front-end login functionality to the back-end API that we built earlier. The objective is to allow users to log in to the website by making HTTP requests to the login API. This process involves multiple steps, which we will cover systematically.

When a user logs in, the API sends back a cookie that the browser automatically stores. This cookie is crucial as it gets sent along with every subsequent request, forming the backbone of our authentication system.

Since we are working on the client side, all the logic will be written in JavaScript and integrated with the front-end.

---

### **Step-by-Step Implementation**

### **1. Creating the Login Script**

1. Navigate to the `public/js` directory in your project.
2. Create a new file called `login.js`.This file will contain the JavaScript logic for handling the login process.

### **2. Adding an Event Listener for Form Submission**

- First, select the login form using `document.querySelector` by targeting its class or ID.
- Attach an `eventListener` for the `submit` event to capture when the user submits the form.

```jsx
document
  .querySelector('.form-class')
  .addEventListener('submit', function (event) {
    event.preventDefault(); // Prevents page reload on form submission
  });
```

- The `event.preventDefault()` method ensures that the form does not reload the page, allowing us to handle the submission entirely via JavaScript.

---

### **3. Extracting Form Data**

To get the user's input (email and password):

- Use `document.getElementById` to target the input fields by their IDs.
- Access the values of these fields using the `.value` property.

```jsx
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
```

---

### **4. Creating a Login Function**

Create a separate function called `login` to handle the actual login process. This function will accept `email` and `password` as parameters.

```jsx
const login = async (email, password) => {
  console.log(email, password); // Logs input values for testing
};
```

To ensure the function is properly called:

- Pass the extracted `email` and `password` values to the `login` function when the form is submitted.

---

### **5. Integrating Axios for HTTP Requests**

To interact with the API, use **Axios**, a popular JavaScript library for making HTTP requests.

### **Using Axios via CDN**

- Add Axios to your project by including it from a CDN in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

This will make the Axios object globally available for use.

### **Making the POST Request**

- Use Axios to send the user's email and password to the login API.
- Include the API endpoint URL and the data (email and password) in the request.

```jsx
const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    console.log(result.data); // Logs the response data
  } catch (err) {
    console.error(err.response.data); // Handles errors
  }
};
```

---

### **6. Handling Errors**

- Use a `try-catch` block to handle potential errors during the request.
- If the API sends back an error (e.g., wrong credentials), Axios automatically throws an error, which can be caught in the `catch` block.

```jsx
try {
  // Successful request logic
} catch (err) {
  console.error('Error:', err.response.data.message); // Logs specific error message
}
```

---

### **7. Storing and Using Cookies**

- After a successful login, the API sends a cookie containing a **JSON Web Token (JWT)**.
- This cookie gets automatically stored in the browser.
- To view stored cookies:
  - Open developer tools in Chrome (right-click > Inspect).
  - Navigate to **Application > Cookies**.

Cookies are automatically sent with every request, enabling authentication for protected routes.

---

### **8. Using Middleware for Cookie Parsing**

On the back-end, install and use the `cookie-parser` middleware to access cookies in incoming requests.

1. Install the package:

   ```bash
   npm install cookie-parser
   ```

2. Use it in your Express app:

   ```jsx
   const cookieParser = require('cookie-parser');
   app.use(cookieParser());
   ```

---

### **Key Points to Remember**

1. **Prevent Default Behavior**: Use `event.preventDefault()` to manage form submission via JavaScript.
2. **Axios for HTTP Requests**: Simplifies API interaction and error handling.
3. **JWT and Cookies**: These are essential for maintaining authentication state.
4. **Middleware**: `cookie-parser` is used to parse and manage cookies on the back-end.

---

### **Next Steps**

- Bundle all JavaScript files into a single file for better performance and maintainability.
- Enhance error handling to provide user-friendly feedback on login failures.
- Transition the development environment to HTTPS for secure communication.

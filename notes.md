# **Node.js Frontend Integration: Alerts and Login Functionality**

This session is focused on integrating alerts and login functionality in a Node.js application. We modularize the code for maintainability and use Parcel for bundling files to streamline frontend development.

- **What Does Modularize Mean?**
  - Breaking code into smaller, reusable pieces (modules).
  - Each module handles a specific functionality (e.g., alerts, login, map display).
- **Why Modularize?**
  - **Improved Readability:** Code is easier to understand and maintain.
  - **Reusability:** Functions can be reused across different parts of the application.
  - **Isolation:** Each module works independently, reducing bugs.
  - **Scalability:** Adding new features becomes simpler.
- **How to Modularize?**

  - Use ES6 modules: `export` and `import` keywords.
  - Example:

    ```jsx
    // alert.js
    export const showAlert = (type, msg) => {
      /* alert logic */
    };

    // login.js
    import { showAlert } from './alert';
    ```

- **Role of Parcel Bundler**
  - Combines all modules into a single file for production use.
  - Benefits:
    - Automatically resolves dependencies.
    - Optimizes the code for browsers.
- **Steps for Parcel Setup**

  - Install Parcel:
    ```bash
    npm install parcel-bundler --save-dev
    ```
  - Add scripts to `package.json`:

    ```json
    "scripts": {
      "watch:js": "parcel watch src/index.js --out-dir dist --out-file bundle.js",
      "build:js": "parcel build src/index.js --out-dir dist --out-file bundle.js"
    }

    ```

  - Run Parcel:
    ```bash
    npm run watch:js
    ```

- **Conclusion**
  - Modularizing and bundling with tools like Parcel ensures maintainable, scalable, and browser-compatible code.

---

## **1. Purpose of Dynamic Alerts**

### **What are Alerts?**

Alerts are small messages displayed to users to provide feedback on their actions. For example:

- **Success Alert:** "Logged in successfully!"
- **Error Alert:** "Incorrect email or password."

### **Why Use Alerts?**

1. **Immediate Feedback:** Users instantly know the result of their action.
2. **User Experience:** Alerts improve the interface by clearly communicating success or failure.
3. **Customizable:** Alerts can be styled and programmed to disappear after a few seconds, keeping the interface clean.

---

## **2. Managing Alerts in Code**

To handle alerts effectively, we create a separate module (`alert.js`) for:

1. **Showing Alerts:** Display success or error messages dynamically.
2. **Hiding Alerts:** Remove existing alerts from the page after a set duration or before displaying a new one.

---

### **Code: `alert.js`**

```jsx
// Function to hide an existing alert
export const hideAlert = () => {
  const el = document.querySelector('.alert'); // Select alert element
  if (el) el.parentElement.removeChild(el); // Remove alert from DOM
};

// Function to display an alert
// Parameters:
// - `type`: Either 'success' (green alert) or 'error' (red alert)
// - `msg`: Message to display inside the alert
export const showAlert = (type, msg) => {
  hideAlert(); // Ensure no duplicate alerts exist
  const markup = `<div class="alert alert--${type}">${msg}</div>`; // HTML for the alert
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup); // Add alert to DOM
  window.setTimeout(hideAlert, 5000); // Automatically hide alert after 5 seconds
};
```

---

### **Explanation**

1. **`hideAlert()`**:
   - **Purpose:** Remove any existing alert to avoid duplicates.
   - **How It Works:**
     - Finds the alert element (`.alert`) on the page.
     - Removes it from the DOM using `parentElement.removeChild()`.
2. **`showAlert(type, msg)`**:
   - **Purpose:** Display a dynamic alert on the page.
   - **Parameters:**
     - `type`: Determines the alert style (`success` for green, `error` for red).
     - `msg`: The message text to display inside the alert.
   - **Process:**
     - Calls `hideAlert()` to remove existing alerts.
     - Creates the alert HTML dynamically using a template string.
     - Inserts the alert at the top of the page (`<body>`) using `insertAdjacentHTML('afterbegin')`.
     - Schedules the alert to disappear after 5 seconds with `setTimeout`.

---

## **3. Login Form Submission**

### **Workflow**

1. User enters their **email** and **password**.
2. Upon form submission:
   - The data is validated on the client side.
   - A POST request is sent to the backend API for authentication.
3. Depending on the response:
   - A success alert is displayed, and the user is redirected.
   - An error alert is displayed with the failure message.

---

### **Code: `index.js`**

```jsx
// Import modules
import '@babel/polyfill'; // Adds support for older browsers
import { login } from './login'; // Login functionality
import { displayMap } from './mapbox'; // Map display functionality

// DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

// Render map if mapBox exists
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations); // Parse locations from data attribute
  displayMap(locations);
}

// Handle login form submission
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    const email = document.getElementById('email').value; // Get email input value
    const password = document.getElementById('password').value; // Get password input value
    login(email, password); // Call login function with user inputs
  });
}
```

---

### **Explanation**

1. **DOM Selection:**
   - `mapBox`: Checks if a map element exists to render locations dynamically.
   - `loginForm`: Selects the login form to handle submission.
2. **Form Submission Handling:**
   - Listens for the `submit` event on the login form.
   - **`e.preventDefault()`**: Prevents the default behavior of the form (e.g., reloading the page).
   - Fetches user-entered values (`email` and `password`) from the input fields.
   - Passes the values to the `login` function for further processing.

---

## **4. Handling Login Requests**

### **Code: `login.js`**

```jsx
import axios from 'axios'; // HTTP request library
import { showAlert } from './alert'; // Alerts module

// Login function
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login', // Backend login endpoint
      data: { email, password }, // Data sent in the request body
    });

    // On success
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully'); // Display success alert
      window.setTimeout(() => location.assign('/'), 1500); // Redirect to homepage after 1.5 seconds
    }
  } catch (err) {
    showAlert('error', err.response.data.message); // Display error alert
  }
};
```

---

### **Explanation**

1. **`axios` Request:**
   - Sends a `POST` request to the backend API.
   - Includes `email` and `password` in the request body.
2. **Success Handling:**
   - If the server responds with `status: 'success'`:
     - Displays a green success alert using `showAlert`.
     - Redirects the user to the homepage (`/`) after 1.5 seconds.
3. **Error Handling:**
   - If an error occurs (e.g., invalid credentials), displays a red error alert with the server's error message.

---

## **5. Modular Frontend Architecture**

### **Why Modularize?**

- Simplifies maintenance and improves readability.
- Avoids including multiple script files manually in HTML.
- Uses ES6 modules (`import`/`export`) for reusable and organized code.

---

## **6. Using Parcel for Bundling**

### **What is Parcel?**

- A modern **JavaScript bundler** that combines all modules into a single file for production.
- Key Features:
  - **Zero Configuration:** No complex setup required.
  - **Fast:** Efficiently bundles files and manages dependencies.

---

### **Setting Up Parcel**

1. Install Parcel:

   ```bash
   npm install parcel-bundler --save-dev
   ```

2. Add Scripts to `package.json`:

   ```json
   "scripts": {
     "watch:js": "parcel watch public/js/index.js --out-dir public/js --out-file bundle.js",
     "build:js": "parcel build public/js/index.js --out-dir public/js --out-file bundle.js"
   }
   ```

3. Run Parcel Watcher:

   ```bash
   npm run watch:js
   ```

4. Include the bundled file in your HTML:

   ```html
   <script src="/public/js/bundle.js"></script>
   ```

---

## **7. Testing and Debugging**

### **Test Cases**

1. **Successful Login:**
   - Use correct credentials.
   - Verify the success alert and redirection.
2. **Failed Login:**
   - Use incorrect credentials.
   - Verify the error alert with the correct failure message.
3. **Alerts:**
   - Ensure alerts disappear after 5 seconds.

---

### 8. Making Code Work in All Browsers with Babel and Polyfills

1. **Babel**
   - Transpiles modern JavaScript syntax (ES6+) into older versions for compatibility.
   - Handles syntax but **not runtime features** (e.g., `Promise`, `async/await`).
2. **Polyfills**
   - Adds missing features to browsers that don't support them.
   - Replace deprecated `@babel/polyfill` with:
     - **`core-js/stable`**: For JavaScript features like `Promise`, `Array.includes`.
     - **`regenerator-runtime/runtime`**: For `async/await` and generators.

---

## **9. Key Takeaways**

1. **Dynamic Alerts:** Modularize and reuse alert functions for user feedback.
2. **Frontend Architecture:** Use ES6 modules and Parcel for a clean and maintainable codebase.
3. **Async Login Handling:** Use `axios` for secure and structured API communication.

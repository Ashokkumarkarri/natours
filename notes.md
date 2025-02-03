# Updating User Data in Node.js

In this lecture, we will learn how to allow users to update their name and email address using two different approaches:

1. **Traditional Form Submission (No JavaScript)**
2. **API-based Form Submission (Using JavaScript)** (covered in the next lecture)

For this lecture, we will focus on the **traditional method**, which involves submitting the form directly through an HTML `POST` request.

---

## 1. Traditional Form Submission

This method does not require JavaScript for making API calls. Instead, the form submission happens automatically when the user clicks the submit button.

### 1.1 Setting Up the Form

We need to define a form with:

- An `action` attribute pointing to our backend route.
- A `method` attribute set to `POST`.
- `name` attributes for each input field.

```html
<form action="/submit-user-data" method="POST">
  <input type="text" name="name" placeholder="Enter your name" required />
  <input type="email" name="email" placeholder="Enter your email" required />
  <button type="submit">Update</button>
</form>
```

### 1.2 How Form Data is Sent

- When the form is submitted, the browser automatically sends a `POST` request to the specified endpoint.
- The data is sent in **URL-encoded format** (default behavior for forms).
- The backend will receive the request body containing `name` and `email`.

---

## 2. Setting Up the Backend

Since this method requires a new route and handler, we need to define them in our Express application.

### 2.1 Creating the Route

We define a `POST` route in `routes.js`:

```jsx
const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect the route so only authenticated users can access it
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData,
);

module.exports = router;
```

### 2.2 Implementing the Controller

In `viewsController.js`, we create the `updateUserData` function:

```jsx
const User = require('../models/userModel');

exports.updateUserData = async (req, res) => {
  try {
    // Ensure request body is received
    console.log(req.body);

    // Update the user data
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true, // Return updated document
        runValidators: true, // Validate fields before saving
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
```

### 2.3 Middleware to Parse URL-Encoded Data

Since form data is sent in URL-encoded format, Express needs to parse it using a built-in middleware.

Add the following line to `app.js`:

```jsx
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

- `extended: true` allows parsing of more complex data.
- `limit: '10kb'` ensures the request body does not exceed 10KB.

---

## 3. Testing the Implementation

### 3.1 Checking Form Submission

- Open the browser and fill out the form.
- Submit the form and inspect the network request in **Developer Tools**.
- Ensure the form sends a `POST` request to `/submit-user-data` with `name` and `email` in the request body.

### 3.2 Handling Errors

- If the form submission fails, check for errors in the backend logs.
- Ensure `authController.protect` is correctly implemented to secure the route.
- Verify that the `User` model correctly updates the database.

---

## 4. Security Considerations

- **Sanitize Input:** Prevent malicious input by validating user data.
- **Protect the Route:** Ensure only logged-in users can update their data.
- **Restrict Update Fields:** Only allow `name` and `email` updates to prevent users from modifying sensitive data like passwords.

---

## 5. Conclusion

In this lecture, we implemented **traditional form submission** in Node.js using:

- HTML forms with `POST` requests.
- Express routes and middleware to process form data.
- Securely updating user data in MongoDB.

In the next lecture, we will explore a **JavaScript-based approach** for updating user data using AJAX and API calls.

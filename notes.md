# 015 Building the Login Screen

## Adding Login Functionality to the Website

### 1. Overview

In the upcoming lectures, we will implement the **login functionality** for our website. The first step is to render a **login screen** to make it easy for users to log in.

---

### 2. Challenge: Creating the Login Route

**Objective:** Practice creating routes, controllers, and templates by implementing the `/login` route.

**Steps:**

1. Create a `/login` route in the router.
2. Write a corresponding **controller function** to handle the route.
3. Create a **template** to render the login screen.

The login template is straightforward and consists of static HTML. No dynamic variables need to be passed into it. A pre-existing template in the folder can be reused for this purpose.

---

### 3. Implementing the `/login` Route

**Code Implementation:**

```jsx
// Define the login route
router.get('/login', loginController.getLoginForm);
```

- The route is defined as `/login`.
- The handler for this route is `getLoginForm`, which will be created in the `loginController`.

---

### 4. Creating the `getLoginForm` Controller

**Controller Logic:**

```jsx
exports.getLoginForm = (req, res, next) => {
  try {
    res.status(200).render('login', {
      title: 'Log into your account',
    });
  } catch (err) {
    next(err); // Always pass errors to the next middleware
  }
};
```

- **Purpose:** Render the `login` template with a custom title.
- The title, "Log into your account," will be passed to the base template to display in the `<title>` HTML element.

**Important Note:**

When using async functions wrapped in a utility like `catchAsync`, always include the `next` parameter to handle errors properly.

---

### 5. Creating the Login Template

**Steps:**

1. Locate the template folder.
2. Open an existing HTML/Pug template, copy its structure, and create a new file named `login.pug`.
3. Extend the base template and define a block for content.

**Code Example (Pug):**

```
pug
Copy code
extends base
block content
  h1 Log into your account
  form(action="/login", method="POST")
    label(for="username") Username:
    input(type="text", id="username", name="username")
    label(for="password") Password:
    input(type="password", id="password", name="password")
    button(type="submit") Login
```

---

### 6. Adding Links to the Login Page

**Modifications to Navigation:**

- Replace the existing **button elements** for "Login" and "Sign Up" with **anchor (`<a>`) tags** to allow navigation using the `href` attribute.

**Updated Code:**

```html
<a href="/login" class="btn">Login</a> <a href="/signup" class="btn">Sign Up</a>
```

---

### 7. Optional: Implementing a Sign-Up Page

The process for creating a sign-up page is similar to the login page:

- Define a `/signup` route.
- Create a `getSignupForm` controller to render the sign-up page.
- Design a corresponding template for user registration.

This exercise is left as optional to avoid redundancy.

---

### 8. Summary

- We successfully created a `/login` route, controller, and template.
- The `login` page is now accessible via a link in the navigation bar.
- This foundation sets the stage for adding more advanced login features like authentication.

Feel free to revisit the code and try implementing the sign-up page or customizing the login form further.

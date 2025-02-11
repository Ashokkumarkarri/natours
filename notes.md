# 011 Sending Password Reset Emails

---

# Sending Password Reset Emails in Node.js

## Overview

In this section, we will learn how to send password reset emails in a Node.js application using Pug templates and an email handler class. We will cover:

- Creating a Pug template for password reset emails
- Implementing the email sending function
- Integrating the function into our authentication controller
- Testing the password reset functionality using Postman

---

## 1. Creating the Password Reset Email Template

To format the password reset email, we use a **Pug template**. This template includes:

- A greeting with the user's first name
- Instructions to reset the password with a clickable link
- A fallback message in case the user did not request a reset
- A simple button for better user experience

### **passwordReset.pug**:

```
extends baseEmail

block content
    p Hi #{firstName},
    p Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: #{url}

    p (Website for this action not yet implemented)
    table.btn.btn-primary(role='presentation' border='0' cellpadding='0' cellspacing='0')
        tbody
            tr
                td(align='left')
                    table(role='presentation' border='0' cellpadding='0' cellspacing='0')
                        tbody
                            tr
                                td
                                    a(href=`${url}`, target='_blank') Reset your password
    p If you didn’t forget your password, please ignore this email.
```

### **Key Features:**

- Uses **Pug** template syntax for dynamic content.
- Interpolates `#{firstName}` and `#{url}` dynamically.
- Provides a **button** for better UI experience.
- Includes a fallback message to prevent unauthorized resets.

---

## 2. Implementing the Email Sending Function

We now define a method to send password reset emails in our **Email class**.

### **email.js**:

```jsx
async sendPasswordReset() {
    await this.send(
        'passwordReset',
        'Your password reset token (valid for only 10 minutes)'
    ); // Template name and subject line
}
```

### **Explanation:**

- This function calls `this.send()`, which is a general function for sending emails.
- It passes **'passwordReset'** as the template name and a subject line.
- This keeps our code clean and modular.

---

## 3. Integrating Email Functionality in Authentication Controller

Now, we integrate the email sending function into our authentication logic.

### **authController.js**:

```jsx
const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
await new Email(user, resetURL).sendPasswordReset();
```

### **Steps:**

1. **Generate the reset URL** dynamically based on the request protocol and host.
2. **Create a new Email instance**, passing the user and reset URL.
3. **Call `sendPasswordReset()`** to send the email.

### **Benefits:**

- Keeps email logic **separate** from authentication logic.
- Enhances **code reusability**.
- Improves **maintainability** by abstracting email details.

---

## 4. Testing Password Reset Functionality

To verify that our password reset email works correctly, we use **Postman**.

### **Steps to Test:**

1. **Send a `POST` request** to the Forgot Password endpoint:

   - Route: `/api/v1/users/forgotPassword`
   - Payload:

   ```
   {
     "email": "test3@natours.io"
   }
   ```

2. **Check the response**:
   - The response should return `{ success: true }` and a reset token.
3. **Verify the email** in Mailtrap (for development mode):
   - The email should appear in the Mailtrap inbox.
   - The email should contain a reset link.
4. **Use the reset token to update the password**:

   - Send a `PATCH` request to `/api/v1/users/resetPassword/:token`
   - Example payload:

   ```
   {
     "password": "newpassword",
     "passwordConfirm": "newpassword"
   }
   ```

5. **Attempt logging in with the new password**:
   - Use `/api/v1/users/login`
   - Verify that authentication succeeds.

---

## 5. Using Mailtrap for Development Testing

To prevent sending real emails during development, we use **Mailtrap**.

### **Why Mailtrap?**

- **Prevents accidental emails** from reaching real users.
- **Allows testing and debugging** email templates in a sandboxed environment.
- **Captures all outgoing emails**, making them visible in the Mailtrap dashboard.

### **Next Steps**

In the next phase, we will configure our application to send **real emails** to actual email addresses using a transactional email service like **SendGrid or Mailgun**.

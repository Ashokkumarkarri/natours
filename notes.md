# 010 Email Templates with Pug\_ Welcome Emails

---

## Sending Emails with Pug in Node.js

## Overview

In this guide, we will learn how to use **Pug** to create a dynamic email template and send a welcome email based on that template. The email template will include a personalized message and a styled button. We will also discuss inlining CSS, structuring reusable email templates, and dynamically inserting user data.

---

## 1. Creating the Email Template

We will use **Pug** to create an HTML email template. The template file is named `welcome.pug` and is stored in the `dev-data/templates/` directory.

### Steps:

1. **Copy an existing email template**

   - The email design is adapted from an HTML template.
   - The HTML template is converted into **Pug** using an online tool: [HTML to Pug Converter](https://html2pug.com/).

     ```
     //- Email template adapted from https://github.com/leemunroe/responsive-html-email-template
     //- Converted from HTML using https://html2pug.now.sh/

     ```

   - This allows quick conversion of pre-existing HTML pages into **Pug** format.

2. **Inline CSS**
   - Email clients require **inline styles** for proper rendering.
   - The template includes a large amount of CSS directly in the file.
   - To keep the template clean, we will extract the styles into a separate file.
3. **Extracting Styles to a Separate File**
   - Create a new file `_style.pug`.
   - Move all inline CSS from `welcome.pug` to `_style.pug`.
   - Use the `include` keyword in Pug to import the styles:
     ```
     include _style.pug
     ```
   - Format the Pug file using VS Code's Pug beautifier (Shortcut: **Cmd + Shift + P** / **Ctrl + Shift + P** → "Beautify Pug").

---

## 2. Understanding Email Formatting

Many email clients only support **table-based layouts**, making email templates complex with nested tables. However, we focus on the **content area**, which contains the actual message.

To make templates reusable:

- Move **reusable elements** (headers, footers, styles) into a `baseEmail.pug` file.
- Define a **block named `content`** in `baseEmail.pug` where specific email content can be inserted.
- Modify `welcome.pug` to **extend** `baseEmail.pug` and insert content inside the block.

### Example:

**baseEmail.pug**

```
doctype html
html
  head
    title= subject
  body
    block content
```

**welcome.pug**

```
extends baseEmail

block content
  h1 Welcome, #{firstName}!
  p Thank you for joining us.
  a(href=url) Upload User Photo
```

---

## 3. Sending Emails in Node.js

To send an email, we integrate our Pug template with **Nodemailer** in the `authController.js` file.

### Steps:

1. **Import the email module:**

   ```
   const Email = require('../utils/email');
   ```

2. **Modify the `signup` function** in `authController.js` to send a welcome email:

   ```jsx
   exports.signup = async (req, res, next) => {
     const newUser = await User.create(req.body);
     const url = `${req.protocol}://${req.get('host')}/me`;
     await new Email(newUser, url).sendWelcome();
     res.status(201).json({ status: 'success', data: { user: newUser } });
   };
   ```

   - The `url` dynamically generates the correct host (localhost for development, domain for production).
   - The `Email` class sends the email.

---

## 4. Testing the Email System

1. **Use Postman to create a test user**
   - Send a POST request to `/signup` with sample user data.
   - Check the response for success.
2. **Verify the email in Mailtrap**
   - Log in to Mailtrap.
   - Open the inbox and check for the received email.

---

## Conclusion

By following these steps, we have:
✔ Created a **Pug-based email template**.
✔ Structured the template to be **reusable and modular**.
✔ Integrated email sending into **Node.js with Nodemailer**.
✔ Ensured that **emails work in development and production** environments.

This method allows us to create and manage multiple email templates efficiently, ensuring a scalable and maintainable email system in our Node.js application.

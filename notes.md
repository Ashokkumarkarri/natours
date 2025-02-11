## Node.js - Sending Emails with Pug and SendGrid

---

## Introduction

In this section, we will enhance our email handling capabilities in Node.js by creating email templates using **Pug** and sending real emails with **SendGrid**. We previously implemented a basic email handler for password resets, but now we will build a **robust, scalable email service** that can handle multiple email templates and use different transporters for development and production environments.

## Steps to Implement the Email Service

### 1. Creating the Email Class

We will create an `Email` class inside the `utils` folder. This class will:

- Handle email sending.
- Support multiple email templates.
- Work with both development and production environments.

### Defining the `Email` Class

We start by defining the class and exporting it:

```jsx
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0]; // Extract first name
    this.url = url;
    this.from = `Natours <${process.env.EMAIL_FROM}>`;
  }
};
```

### Explanation:

- `user.email` is assigned to `this.to` to specify the recipient.
- `user.name.split(' ')[0]` extracts the first name for personalization.
- `this.url` stores the relevant URL (e.g., a password reset link).
- `this.from` is assigned from an **environment variable (EMAIL_FROM)** to keep the sender's email configurable.

### 2. Configuring Transporters

To send emails, we need to define a transporter. The transporter varies based on the environment:

- **Development**: Uses Mailtrap to catch emails.
- **Production**: Uses SendGrid for real email delivery.

### Creating the `createTransport` Method

```jsx
createTransport() {
    if (process.env.NODE_ENV === 'production') {
        return 1; // Placeholder for SendGrid configuration (to be implemented later)
    }
    return nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });
}
```

### Explanation:

- Checks if the app is in **production mode**.
- Uses **Mailtrap** in development mode for testing emails safely.

### 3. Creating the `send` Method

This method will handle the **actual email sending process**.

### Defining the `send` Method

```jsx
async send(template, subject) {
    // 1. Render the HTML for the email
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject
    });

    // 2. Define email options
    const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.fromString(html) // Convert HTML to plain text
    };

    // 3. Create a transporter and send the email
    await this.createTransport().sendMail(mailOptions);
}
```

### Explanation:

- **Step 1:** Converts the Pug template into an HTML email.
- **Step 2:** Defines email properties like `to`, `from`, `subject`, and `text`.
- **Step 3:** Sends the email using the transporter.

### 4. Implementing Specific Email Methods

To simplify email handling, we define specific methods like `sendWelcome` and `sendPasswordReset` that call `send` with the required template and subject.

### `sendWelcome` Method

```jsx
async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
}
```

### Explanation:

- Calls `send` with the `welcome` template.
- Passes a predefined subject line.

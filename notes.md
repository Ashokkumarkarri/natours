```js
//old reference
const transporter=nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.EMAIL_USERNAME,
        PASS:process.env.EMAIL_PASSWORD
    }
    //enable or aCTIVATE IN GMAIL: "LESS SECURE APP" OPTION
})
//2)Define the email options

//3) Actually send the email
}
```

To send the password reset token via email, we use the **Nodemailer** package. Install it using the following command:

```jsx
npm install nodemailer
```

We won't be using Gmail as it's not suitable for sending emails in production. Gmail imposes strict limitations, and if more than 500 emails are sent per day, it may flag the sender as a spammer. To avoid this, we use alternative email services like **SendGrid** or **Mailgun** for production environments.

For testing purposes, we are using **Mailtrap** to simulate sending emails.

---

```jsx
text: options.message,
// html:
```

We can also send emails in HTML format for more flexibility and better styling. However, for now, we are commenting out this feature.

---

## 013 Sending Emails with Nodemailer

To send the password reset token via email, we use the **Nodemailer** package. Install it using the following command:

```jsx
npm install nodemailer
```

We won't be using Gmail as it's not suitable for sending emails in production. Gmail imposes strict limitations, and if more than 500 emails are sent per day, it may flag the sender as a spammer. To avoid this, we use alternative email services like **SendGrid** or **Mailgun** for production environments.

For testing purposes, we are using **Mailtrap** to simulate sending emails.

---

```jsx
text: options.message,
// html:
```

We can also send emails in HTML format for more flexibility and better styling. However, for now, we are commenting out this feature.

---

## **Sending Emails with Nodemailer**

     `utils>>email.js`

- **Import Nodemailer**
  Import the `nodemailer` library to handle email sending.
  ```jsx
  const nodemailer = require('nodemailer');
  ```
- **Purpose of `sendEmail` Function**
  The `sendEmail` function is used to send emails to a specific email address with a subject and message.
- **Steps in the `sendEmail` Function**
  - **Step 1: Create a transporter**
    A transporter is used to connect to the email service (e.g., Gmail). The configuration uses environment variables for:
    - `EMAIL_HOST`: The email server (e.g., smtp.gmail.com).
    - `EMAIL_PORT`: The port for the email service (usually 587 for Gmail).
    - `EMAIL_USERNAME`: Your email address.
    - `EMAIL_PASSWORD`: Your email password.
      Example:
    ```jsx
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: false, // Use false for non-encrypted connections
    });
    ```
  - **Step 2: Define email options**
    Specify the email details like:
    - `from`: Sender's name and email address.
    - `to`: Recipient's email address.
    - `subject`: The subject of the email.
    - `text`: The message content.
      Example:
    ```jsx
    const mailOptions = {
      from: 'Ashok Kumar <ashokkumar1999@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
    ```
  - **Step 3: Send the email**
    Use the `transporter` to send the email with the specified options.
    Example:
    ```jsx
    await transporter.sendMail(mailOptions);
    ```
- **Gmail Configuration Note**
  If using Gmail, enable the "Less Secure App" option or use an app-specific password for secure email sending.
- **Export the Function**
  Export the `sendEmail` function to use it in other parts of the project.
  ```jsx
  module.exports = sendEmail;
  ```

---

## **Logic in Auth controller in forgotPassword**

```jsx
const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
//in future when he click on the link he can enter the details, but for now, user has to copy the url and enter his details.
const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nif you don't forgot your password, please Ignore this email.`;

try {
  //sendEmail function is an async function, which means it will return a promise and we need to handel that promise
  await sendEmail({
    email: user.email,
    subject: 'Your password reset token for (valid only for 10 mins)',
    message,
  });
  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  });
} catch (err) {
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });
  return next(
    new AppError('There was an error sending the email. Try again later!', 500),
  );
}
```

1.  **Reset URL**

    The `resetURL` is dynamically generated to point the user to the reset password endpoint.

    - `req.protocol`: Fetches the protocol used (HTTP or HTTPS).
    - `req.get('host')`: Fetches the host (e.g., `example.com`).
    - `${resetToken}`: Appends the reset token to the URL.
    - Example URL:`http://example.com/api/v1/users/resetPassword/<resetToken>`

    **Purpose:** This URL will be shared with the user to reset their password.

2.  **Email Message**

    The `message` variable contains instructions for the user:

    - Explains that they need to make a PATCH request with their new password and confirm password.

3.  **Sending the Email**

    The `sendEmail` function is called to deliver the reset token to the user's email address:

    - `email`: The recipient's email (from the `user` object).
    - `subject`: The subject of the email, indicating its purpose.
    - `message`: The email body (text format).

    **Key Note:**

    `sendEmail` is an asynchronous function that returns a promise. The `await` keyword ensures the code waits for the email to be sent before proceeding.

4.  **Successful Email Handling**

    If the email is sent successfully, the server responds with:

    ```json
    {
      "status": "success",
      "message": "Token sent to email!"
    }
    ```

5.  **Error Handling**

    If sending the email fails:

    - The `passwordResetToken` and `passwordResetExpires` are cleared (`undefined`).
    - The user object is saved without validation using `{ validateBeforeSave: false }`.
    - A custom error is passed to the global error handler using `AppError`.

    **Error Response:**

    Example message:

    ```vbnet
    There was an error sending the email. Try again later!
    ```

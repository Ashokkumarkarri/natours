# 024 Updating User Password with Our API

## Node.js: Updating User Settings (Data & Password)

## Overview

In this section, we will enhance our API by implementing a function to update user settings. Instead of creating separate functions for updating user data and passwords, we will combine them into a single function called `updateSettings`. This function will accept an object containing the update data and a `type` parameter to determine whether we are updating user data or the password.

## Steps to Implement

### 1. Creating the `updateSettings` Function

Instead of having separate functions for updating user data (e.g., name and email) and updating passwords, we create a single function `updateSettings` that:

- Accepts an object with the data to be updated.
- Accepts a `type` parameter, which can be either `'data'` or `'password'`.
- Determines the correct API endpoint based on the `type`.
- Sends a request to the appropriate endpoint with the data.

### **Code Implementation (updateSettings.js)**

```jsx
import axios from 'axios';
import { showAlert } from './alert';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:8000/api/v1/users/updateMyPassword'
        : 'http://localhost:8000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
```

### 2. Updating User Data

We use the `updateSettings` function to update user information such as name and email.

### **Steps:**

1. Import the `updateSettings` function.
2. Select the user form elements.
3. Read input values (name, email) and pass them to `updateSettings`.

### **Code Implementation (Handling Form Submission)**

```jsx
import { updateSettings } from './updateSettings';

document.querySelector('.form-user-data').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append('name', document.getElementById('name').value);
  form.append('email', document.getElementById('email').value);

  updateSettings(form, 'data');
});
```

### 3. Updating User Password

To ensure security, we require the user to provide their current password along with the new password and confirmation.

### **Steps:**

1. Select the password form elements.
2. Read input values (current password, new password, confirm password).
3. Pass the data to `updateSettings`.
4. Clear the input fields after a successful update.

### **Code Implementation (Handling Password Update)**

```jsx
document
  .querySelector('.form-user-password')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
```

### 4. Handling API Responses

- The API requires the following fields for updating passwords:
  - `passwordCurrent`: The user’s current password.
  - `password`: The new password.
  - `passwordConfirm`: Confirmation of the new password.
- If the update is successful, a success message appears, and the user remains logged in.
- If an error occurs, it is displayed to the user.

### 5. UX Enhancements

To improve user experience, we:

- Show a loading indicator while updating passwords (`Updating...` message on the button).
- Clear input fields after a successful password update.

### 6. Maintaining Authentication After Password Change

After changing the password:

- A new authentication cookie is issued to keep the user logged in.
- This happens because the API automatically logs the user in after updating their password.

### 7. Verifying Changes in Postman

- Test the `updateSettings` function in Postman.
- Ensure correct field names (`passwordCurrent`, `password`, `passwordConfirm`).
- Check if updates reflect in the database.

## Conclusion

We have successfully created a single function, `updateSettings`, to handle both user data and password updates. This approach optimizes code reuse, improves maintainability, and enhances the user experience. In the next section, we will implement file uploads, email templates, and payments to further enrich our application.

**Next Steps:**

- Implement file uploads.
- Design email templates.
- Integrate payment functionality.

# 023 Updating User Data with Our API

# Updating User Data via API in Node.js

## Overview

In this section, we will implement functionality to update user data (name and email) through an API call from the front end. We will follow a structured approach similar to the login functionality.

## Steps to Implement

### 1. Creating the `updateSettings.js` File

We need to create a new JavaScript file called `updateSettings.js` to handle the API call for updating user data. This file will:

- Export a function called `updateData`
- Use Axios to send a `PATCH` request to the server
- Handle errors properly
- Show user-friendly alerts for success and failure messages

### 2. Modifying the Form

Before implementing the JavaScript function, we need to adjust the form in our HTML:

- Remove the `action` and `method` attributes to prevent form submission via traditional methods.
- Ensure that the form fields have the appropriate IDs (`name` and `email`).

### 3. Implementing the `updateData` Function

### **Code Implementation:**

```jsx
import axios from 'axios';
import { showAlert } from './alert';

export const updateData = async (name, email) => {
  console.log('Updating user data...');
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:8000/api/v1/users/updateMe',
      data: {
        name: name,
        email: email,
      },
    });

    console.log('Response from server:', res);
    if (res.data.status === 'success') {
      showAlert('success', 'Data Updated Successfully');
    }
  } catch (err) {
    console.error('Error updating data:', err);
    showAlert('error', err.response.data.message);
  }
};
```

### **Explanation:**

- **Import necessary modules**: `axios` for making API calls and `showAlert` for displaying alerts.
- **Define `updateData` function**:
  - Takes `name` and `email` as arguments.
  - Sends a `PATCH` request to `http://localhost:8000/api/v1/users/updateMe`.
  - Uses `try-catch` for error handling.
  - Calls `showAlert` to display success or error messages.

### 4. Integrating `updateData` into `index.js`

Next, we integrate the function in our main JavaScript file to execute it when the form is submitted.

### **Code Implementation:**

```jsx
import { updateData } from './updateSettings';
const userDataForm = document.querySelector('.form-user-data');

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateData(name, email);
  });
}
```

### **Explanation:**

- **Select the user data form**: `document.querySelector('.form-user-data')`.
- **Add an event listener**:
  - Prevents the default form submission behavior.
  - Extracts values from the input fields.
  - Calls `updateData(name, email)` to trigger the API request.

### 5. API Endpoint Details

- **Endpoint:** `PATCH /api/v1/users/updateMe`
- **Body Parameters:** `{ name, email }`
- **Response Structure:**
  ```jsx
  {
    "status": "success",
    "data": {
      "user": {
        "name": "Updated Name",
        "email": "updated@example.com"
      }
    }
  }
  ```
- **Error Handling:** The server sends an error message if the update fails.

### 6. Testing the Update Functionality

- Navigate to the **user settings page**.
- Modify the **name** or **email** fields.
- Click **Save Settings**.
- If the update is successful, an alert message appears: `Data Updated Successfully`.
- Refresh the page to confirm persistence of the changes.

### 7. Handling Errors

- If an invalid email is entered, an error message appears.
- Example:
  ```jsx
  showAlert('error', 'Invalid email address');
  ```
- Future improvements:
  - Highlighting incorrect input fields.
  - Using a front-end framework like React or Vue for better UI management.

### Conclusion

We successfully implemented user data updates via API using:

- `updateSettings.js` for API requests.
- `index.js` to handle form submission.
- Proper error handling and user alerts.

Next, we will extend this functionality to update user passwords.

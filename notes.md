# 006 Adding Image Uploads to Form

---

## Uploading User Photos in a Node.js Web Application

## Overview

In this lesson, we will implement a feature that allows users to upload their photos directly from the website. The process involves updating the frontend to include a file input field, handling file selection using JavaScript, and sending the selected file to the backend using FormData and an API call.

---

## Steps to Implement File Upload

### 1. Updating the HTML (Pug Template)

The first step is to modify the HTML form to allow users to select a file. In Pug (our templating engine), we replace the placeholder link with an input element of type `file`.

### **Modification in `accounts.pug`**

```
input.form__upload(type='file' accept='image/*' id='photo' name='photo')
label(for='photo') Choose new photo
```

### **Explanation:**

- `type='file'` - Specifies that this input is for file selection.
- `accept='image/*'` - Ensures only image files can be selected.
- `id='photo'` - Assigns an ID for JavaScript access.
- `name='photo'` - Ensures the backend recognizes the field.
- The `label` element, when clicked, triggers the file input.

---

### 2. Handling Form Submission with JavaScript

Once we have the input field, we need to handle the submission process using JavaScript. This includes preventing the default form submission, extracting the selected file, and sending it to the backend using `FormData`.

### **Modification in `index.js` (Frontend JavaScript)**

```jsx
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents form from reloading the page

    const form = new FormData();

    // Append form data fields
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}
```

### **Explanation:**

- `e.preventDefault();` - Prevents the default form submission behavior.
- `new FormData();` - Creates a `FormData` object to send data as `multipart/form-data`.
- `form.append('fieldName', value);` - Adds form fields dynamically.
- `document.getElementById('photo').files[0]` - Extracts the first file from the input field.
- `updateSettings(form, 'data');` - Sends the form data to the backend.

---

### **Why Use `FormData` for Image Uploads?**

- **Files can't be sent as JSON** – Browsers and servers require `multipart/form-data` to handle file uploads.
- **Allows sending both files and text fields** in a single request.
- **Encodes binary data properly**, ensuring images are uploaded correctly.

### **Why Does Multer Use `FormData`?**

- **Multer extracts files from `multipart/form-data`** requests.
- **Parses and stores files** in a designated location (disk, memory, or cloud).
- **Adds file details to `req.file` or `req.files`**, making them accessible in Node.js.

### **Conclusion**

✅ Use `FormData` to send images.

✅ Multer reads `multipart/form-data` to handle and store uploads efficiently.

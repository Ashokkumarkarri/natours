# 004 Saving Image Name to Database

---

## Handling User Profile Photos in a Node.js Application

## Overview

In this section, we will discuss how to handle user profile photos in a Node.js application. We will cover how to update user profile images, set a default photo for new users, and handle image uploads efficiently.

---

## Updating the User Profile Photo

When a user updates their profile, we need to ensure that the uploaded image is saved properly in our database. This process involves:

1. **Filtering the Incoming Data**
   - We use a `filteredBody` object to store only the allowed fields (e.g., name and email) from `req.body`.
   - If an image file is uploaded, we must also include it in `filteredBody`.
2. **Storing the Image Filename**
   - Instead of storing the full file path, we only store the image filename in the database.
   - This ensures that we maintain a clean and structured database while keeping the storage logic simple.

### Implementation:

### Update User Middleware (`userController.js`)

```js
if (req.file) filteredBody.photo = req.file.filename;
```

- Here, we check if a file was uploaded (`req.file` exists).
- If a file is present, we assign `filteredBody.photo` to `req.file.filename`.
- This means that when the user uploads an image, the filename will be stored in our database under the `photo` field.

### Testing the Update:

- After making this change, save the file and try updating the profile picture through the application.
- The uploaded image's filename should be correctly saved and displayed.
- Console logs related to debugging can now be removed.

---

## Setting a Default Profile Picture

New users who sign up will not have a profile picture initially. To handle this, we set a default image (`default.jpg`).

### Implementation:

### User Model (`userModel.js`)

```js
photo: {
  type: String,
  default: 'default.jpg',
},
```

- The `photo` field is of type `String`.
- We set a default value of `'default.jpg'`.
- This ensures that new users who don’t upload a photo will have a placeholder image until they update their profile.

### Testing the Default Profile Picture:

1. Create a new user.
2. Log in using the newly created account.
3. Check the profile picture.
   - It should display the default avatar (`default.jpg`).

---

## Handling Large Image Uploads

What if a user uploads an image that is too large or not in the correct format?

- If the uploaded image is too large (e.g., `10,000 x 10,000` pixels), it could cause performance issues.
- If the image is not a square, it might not display correctly in the UI.

### Solution:

- **Resize the image** to fit the application's required dimensions.
- **Convert the image format** if needed.
- This will be covered in the next steps.

---

## Summary

- Users can now update their profile pictures, and the uploaded image’s filename is stored in the database.
- If a user does not upload a photo, a default avatar (`default.jpg`) is used.
- The next step is to implement image resizing and formatting to optimize performance and maintain a consistent UI.

These updates ensure a more polished and real-world user experience in our application.

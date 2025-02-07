# Image Processing and Manipulation in Node.js

## Overview

In this lesson, we will learn how to process and manipulate images in a Node.js application. Specifically, we will:

- Resize and convert uploaded images.
- Ensure that all uploaded images are square to maintain consistency in UI display.
- Use middleware to handle image processing before updating user data.
- Utilize the `sharp` package for efficient image manipulation.

---

## Problem Statement

- Our UI assumes that uploaded images are squares so they can be displayed as circles.
- However, real-world user uploads rarely come in a perfect square format.
- We need a solution to automatically resize uploaded images to a square format before updating user data.

## Approach

1. Implement a middleware function (`resizeUserPhoto`) to handle image processing.
2. Modify the existing upload logic to store images in memory instead of directly saving them to disk.
3. Use the `sharp` library to:
   - Resize images to a 500x500 square.
   - Convert them to JPEG format with a 90% quality setting.
   - Save the processed image to disk.

---

## Step-by-Step Implementation

### 1. Installing `sharp`

Before using `sharp`, we need to install it:

```
npm install sharp
```

### 2. Creating the Middleware Function

We define a middleware function `resizeUserPhoto` in our user controller to handle image resizing and conversion.

### **Middleware: `resizeUserPhoto`**

```jsx
const sharp = require('sharp');

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next(); // If no file is uploaded, proceed to next middleware

  req.file.filename = `user-${req.user.id}.jpeg`; // Define a new filename

  await sharp(req.file.buffer) // Use buffer instead of reading from disk
    .resize(500, 500) // Resize to 500x500 pixels
    .toFormat('jpeg') // Convert to JPEG format
    .jpeg({ quality: 90 }) // Set JPEG quality to 90%
    .toFile(`public/img/users/${req.file.filename}`); // Save to disk

  next(); // Proceed to the next middleware
};
```

### 3. Updating Multer Storage Configuration

To store the uploaded file in memory instead of writing it directly to disk, we modify our `multer` storage settings:

### **Multer Storage Configuration**

```jsx
const multer = require('multer');

const multerStorage = multer.memoryStorage();
```

This change ensures that the uploaded file is stored as a buffer (`req.file.buffer`), allowing `sharp` to process it before saving.

### 4. Adding Middleware to the Route

We integrate `resizeUserPhoto` into our route middleware stack. This ensures image processing occurs before user data updates:

### **User Routes (`userRoutes.js`)**

```jsx
router.patch(
  '/updateMe',
  uploadController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
```

Here’s the execution order:

1. `uploadUserPhoto` handles the file upload.
2. `resizeUserPhoto` processes the image.
3. `updateMe` updates the user's profile.

### 5. Testing Image Upload and Processing

To test the implementation:

- Use **Postman** to send a PATCH request to `/updateMe` with an image file.
- The server will:
  - Resize the image to **500x500 px**.
  - Convert it to **JPEG**.
  - Save it to `public/img/users/`.
- The updated image should now be reflected in the UI.

### 6. Verifying the Output

- Check the `public/img/users/` directory to see if the processed image is stored correctly.
- Open the image to confirm that it is **500x500 px** and in **JPEG** format.
- Observe reduced file size due to compression.

---

## Summary

1. **Problem**: Users upload images in various aspect ratios, but we need squares.
2. **Solution**: Implement a middleware to resize images using `sharp`.
3. **Implementation**:
   - Modify `multer` to store images in memory.
   - Use `sharp` to resize, format, and save images.
   - Add middleware in the route before updating user data.
4. **Outcome**:
   - All images are stored as **500x500 px JPEGs**.
   - Storage is optimized using memory buffers before writing to disk.
   - The user experience remains consistent with circular profile images.

This approach ensures efficient and automatic image processing in our Node.js application. 🚀

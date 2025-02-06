# 003 Configuring Multer

---

## Configuring Multer for Image Uploads in Node.js

## Overview

Multer is a middleware for handling multipart/form-data, primarily used for uploading files in Node.js applications.
In this section, we will configure Multer to:

1. Assign better filenames to uploaded images.
2. Restrict uploads to only image files.
3. Move Multer-related logic from routes to controllers for cleaner code.

## Moving Multer Configuration to the Controller

To maintain cleaner code, all Multer-related logic should be handled in the controller instead of the router.

### Steps:

1. **Move Multer setup from the router to the controller**
2. **Import the Multer package**
3. **Create a middleware for handling uploads**

```jsx
const multer = require('multer');

// Define the upload middleware
exports.uploadUserPhoto = multer().single('photo');
```

This middleware function is named `uploadUserPhoto` for clarity and will be used in the controller.

## Configuring Multer Storage and File Filtering

Multer allows two storage options:

- **Disk Storage**: Saves files directly to the filesystem.
- **Memory Storage**: Stores files as a buffer in memory.

For now, we will use **disk storage** to persist uploaded images.

### 1. Setting Up Multer Storage

```jsx
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dev-data/images'); // Define the folder where images will be stored
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1]; // Extract file extension
    cb(null, `user-${req.user.id}-${Date.now()}.${extension}`); // Generate unique filename
  },
});
```

### Explanation:

- **`destination`**: Specifies where to store files. This function accepts `req`, `file`, and a callback `cb`.
  - `cb(null, 'dev-data/images')`: Calls the callback with `null` for no error and the folder path.
- **`filename`**: Defines the file naming convention.
  - Extracts the file extension from `mimetype`.
  - Generates a unique filename using the user’s ID and a timestamp.

### 2. Setting Up Multer File Filter

To ensure only image files are uploaded, we use a filter:

```jsx
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // Accept the file
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // Reject the file
  }
};
```

### Explanation:

- Checks if the file’s `mimetype` starts with `'image'`.
- If true, passes `null` for no error and `true` to accept the file.
- If false, rejects the file with an error message.

### 3. Creating the Upload Middleware

Now, we configure Multer using the defined storage and filter:

```jsx
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
```

Finally, we export a middleware for uploading single files:

```jsx
exports.uploadUserPhoto = upload.single('photo');
```

## Implementing in Routes

Now, use `uploadUserPhoto` in the router:

```jsx
const userController = require('../controllers/userController');
router.post(
  '/uploadPhoto',
  userController.uploadUserPhoto,
  userController.processUpload,
);
```

## Testing the Implementation

### 1. Uploading an Image

- Use **Postman** to send a `POST` request with a valid image file.
- Expect a successful upload and a correctly named file in `dev-data/images`.

### 2. Uploading a Non-Image File

- Try uploading a JSON file or another non-image format.
- Expect a `400` error: _"Not an image! Please upload only images."_

## Conclusion

- We successfully configured Multer to store images with unique filenames.
- We implemented filtering to restrict uploads to image files only.
- We structured the code cleanly by handling Multer logic inside the controller.

With this setup, your Node.js app is now capable of handling secure and efficient image uploads!

# 002 Image Uploads Using Multer\_ Users

---

### `Note`:

- cleaned unwanted console.log
- implemented meter

- here we are not uploading this photo to the DB, we will upload to DB in next video. in this video we will only upload the photo to our folder in the file directory.

---

# Uploading Images with Multer in Node.js

## Introduction

In this section, we will learn how to upload images using the **Multer** package in a Node.js application. This tutorial will focus on implementing image uploads for user photos. We will:

- Install and configure Multer
- Set up a middleware to handle file uploads
- Test the upload functionality using Postman

## Cleaning Up Unnecessary Logs

Before diving into image uploads, let's clean up unnecessary logs in our code. If you have any console logs that are outputting cookies or other irrelevant data, remove them to keep the console output clean and relevant.

## What is Multer?

Multer is a popular **middleware** for handling **multipart/form-data**, which is commonly used for uploading files through a form. Previously, we used **URL-encoded forms** to update user data, requiring special middleware. Similarly, for file uploads, we use Multer to handle **multipart-form data** efficiently.

## Installing Multer

To use Multer, we need to install it in our Node.js project:

```jsx
npm install multer
```

At the time of writing, the version being used is **1.4.1**. If you run into issues, ensure you are using the same version.

## Configuring Multer

Once installed, we need to configure Multer. Start by requiring the package:

```
const multer = require('multer');
```

Now, let's configure a Multer instance:

```
const upload = multer({
  dest: 'public/images/users'
});
```

### Explanation:

- `multer()` initializes the Multer middleware.
- The `dest` option specifies the directory where uploaded files will be stored (`public/images/users`).
- Without specifying a destination, Multer stores the file in memory (not in the file system).
- Images are **not directly uploaded into the database**; instead, we store them in the file system and save their **file path** in the database.

## Implementing Image Uploads in the `Update Me` Route

We will allow users to upload a **photo** when updating their profile. Modify the `Update Me` route to include Multer as middleware:

```
app.patch('/updateMe', upload.single('photo'), (req, res) => {
  console.log(req.file);  // Logs file information
  console.log(req.body);  // Logs other form fields

  res.send('File uploaded successfully');
});
```

### Explanation:

- `upload.single('photo')` is a **Multer middleware** that processes a single file upload.
- The `'photo'` argument refers to the **form field name** that holds the uploaded file.
- Multer will extract the file and attach its details to `req.file`.
- `req.body` will still contain other form data except for the file itself.

## Testing the Image Upload using Postman

Since we don't have a frontend form yet, we will use **Postman** to test the API:

1. **Open Postman** and select the `PATCH` method.
2. Enter the API endpoint: `http://localhost:3000/api/v1/users/updateMe`.
3. Navigate to the **Body** tab and select **form-data**.
4. Add a new key:
   - **Key:** `name`, **Value:** `New Name` (text field).
5. Add another key:
   - **Key:** `photo`, **Type:** `File`, **Choose File:** Select an image file.
6. Click **Send**.

### Expected Response:

- The file is stored in `public/images/users/`.
- The console logs `req.file` with the following details:
  ```
  {
    "fieldname": "photo",
    "originalname": "profile.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "public/images/users",
    "filename": "xyz123",
    "path": "public/images/users/xyz123",
    "size": 102400
  }
  ```
- The body only contains the `name` field, as Multer processes files separately.

## Verifying File Upload

Navigate to the `public/images/users/` folder to confirm the uploaded image is present. However, the file may not have an extension (e.g., `.jpg`, `.png`), making it unreadable. This will be addressed in the next section.

## Next Steps

In the next section, we will:

- Rename uploaded files to maintain original extensions.
- Store file paths in the database.
- Enhance our upload functionality with additional options.

Stay tuned!

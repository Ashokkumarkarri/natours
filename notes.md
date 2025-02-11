# 007 Uploading Multiple Images\_ Tours

---

## Uploading and Processing Multiple Images in Node.js

## Overview

In this lecture, we focus on uploading and processing multiple images at the same time using `multer` and `sharp`. We will implement this feature for tour pictures, allowing an image cover and multiple additional images to be uploaded and processed efficiently.

## Tour Model Image Fields

Our `tour` model contains two image-related fields:

- **imageCover**: A single image representing the main cover photo.
- **images**: An array containing multiple images (at least three) for the tour details page.

Since our requirements involve uploading multiple files with different constraints, we will configure `multer` to handle this appropriately.

---

## Setting Up Multer for Image Uploads

### Import Required Modules

```jsx
const multer = require('multer');
const sharp = require('sharp');
```

### Configuring Storage

We store uploaded images in memory as buffers instead of saving them directly to the disk:

```jsx
const multerStorage = multer.memoryStorage();
```

### File Type Filtering

We define a filter to accept only images:

```jsx
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
```

### Multer Upload Configuration

```jsx
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
```

We use different multer methods depending on our requirements:

- `upload.single('image')` → For a single image upload.
- `upload.array('images', 5)` → For multiple images with the same field name.
- `upload.fields([{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 3 }])` → For handling multiple fields.

Since we need one `imageCover` and up to three `images`, we configure:

```jsx
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
```

---

## Middleware for Image Processing (next viedo)

Once images are uploaded, we need to resize and format them consistently. (we do it in next video)

### Resizing and Saving Images with `sharp` (next viedo)

To maintain consistent image formatting, we process images using `sharp`:

This ensures:

1. The `imageCover` is resized to 2000x1333 pixels and saved in JPEG format.
2. Each additional image undergoes the same processing.
3. The processed filenames are stored in `req.body` for database updates.

---

## Integrating Upload and Processing Middleware

We apply these middlewares to our tour update route:

```jsx
router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.uploadTourImages,
  tourController.resizeTourImages,
  tourController.updateTour,
);
```

This ensures:

1. Only authorized users can upload images.
2. `multer` handles file uploads.
3. `resizeTourImages` processes the images before updating the database. (next viedo)

---

## Testing in Postman

### Steps:

1. **Create a New Tour** in MongoDB Compass by duplicating an existing tour and removing `imageCover` and `images` fields.
2. **Update Tour in Postman**
   - Change request type to `PATCH`.
   - Use `multipart/form-data` in the request body.
   - Upload:
     - One file for `imageCover`.
     - Three files for `images`.
   - Modify any other fields, like `price`.
   - Ensure you are logged in as an admin before sending the request.
3. **Inspect Console Output**
   - Verify uploaded files are logged correctly.
   - Ensure `req.files` contains the expected structure.
   - Check the `public/img/tours` directory for resized images.

---

## Next Steps

In the following lecture, we will integrate these processed image paths into our database and serve them efficiently through our API.

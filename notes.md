# 008 Processing Multiple Images

---

## Uploading and Processing Tour Images in Node.js

---

## Processing Tour Images

Now, let’s implement a similar process for uploading and processing tour images.

### Step 1: Checking for Uploaded Images

Before proceeding with image processing, we must check if images were uploaded.

```jsx
const resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.imageCover || !req.files.images) return next();
```

- The function first checks if `req.files` exists.
- It also ensures that both `imageCover` and `images` fields exist before proceeding.
- If no images were uploaded, it moves to the next middleware immediately.

### Step 2: Processing the Cover Image

We extract the `imageCover` from `req.files`, resize it, format it as a JPEG, and save it with a unique filename.

```jsx
const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

await sharp(req.files.imageCover[0].buffer)
  .resize(2000, 1333)
  .toFormat('jpeg')
  .jpeg({ quality: 90 })
  .toFile(`public/img/tours/${imageCoverFilename}`);

req.body.imageCover = imageCoverFilename;
```

- The filename follows the pattern: `tour-{tourId}-{timestamp}-cover.jpeg`.
- `sharp` resizes the image to a 3:2 aspect ratio (2000x1333 pixels).
- The processed image is saved in the `public/img/tours/` directory.
- The filename is stored in `req.body.imageCover` so it can be updated in the database.

### Step 3: Processing Multiple Images

The `images` array contains multiple uploaded files. We loop through them and apply the same processing logic.

```jsx
req.body.images = [];

await Promise.all(
  req.files.images.map(async (file, i) => {
    const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

    await sharp(file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${filename}`);

    req.body.images.push(filename);
  }),
);
```

- We initialize `req.body.images` as an empty array.
- `map()` is used to iterate over each file and apply processing.
- Each image gets a unique filename (`tour-{tourId}-{timestamp}-{index}.jpeg`).
- `Promise.all()` ensures all images are processed before moving to the next middleware.

### Step 4: Moving to the Next Middleware

Finally, we call `next()` to pass the processed data to the next middleware.

```jsx
  next();
});
```

---

## Testing the Implementation

To verify our implementation:

1. Upload a tour image via an API request.
2. Check if the `imageCover` is stored correctly.
3. Verify that multiple images are processed and saved with correct filenames.
4. Ensure the tour document in the database gets updated with the image filenames.

By structuring the image upload handling properly, we ensure that:

- No images are lost.
- Processing is efficient.
- The database correctly reflects the uploaded files.

This implementation is now robust and ready for integration into the tour management system.

const multer = require('multer');
const sharp = require('sharp'); //image processing library for node.js
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// // Configure the storage settings for multer
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // Create a unique filename using the user's ID and a timestamp
//     //user-76585654845ab4-654654654654.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, );
//   },
// });

const multerStorage = multer.memoryStorage(); //store the image as a buffer in memory instead of saving it to the disk.

// Define a filter to allow only image uploads
const multerFilter = (req, file, cb) => {
  // Check if the uploaded file is an image
  if (file.mimetype.startsWith('image')) {
    // If the file is an image, accept it
    cb(null, true);
  } else {
    // If the file is not an image, reject it with a custom error
    cb(new AppError('Not an image! please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; //we set the filename here so that we can use it in the next middleware.
  // Resize the image to 500x500 pixels using sharp library and convert it to jpeg format
  // The image is stored in the req.file.buffer, which is the image buffer
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

// filterOBJ function: Filters object keys to allow only specific fields
// This ensures no unauthorized fields are updated
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    // If the field is allowed, add it to the new object
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj; // Return the filtered object
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// CatchAsync: Utility to handle asynchronous functions and errors
exports.updateMe = catchAsync(async (req, res, next) => {
  // Step 1: Prevent password updates through this route
  // If the request body contains password or passwordConfirm, throw an error
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400, // Bad Request error
      ),
    );
  }

  // Step 2: Filter the request body to allow only specific fields
  // The `filterObj` function ensures only 'name' and 'email' are included
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // Step 3: Update the user document
  // Using findByIdAndUpdate() to update the user in the database
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // Ensures the response contains the updated user data
    runValidators: true, // Ensures all schema validation rules are applied
  });

  // Step 4: Send the updated user data in the response
  res.status(200).json({
    status: 'success', // Response status
    data: {
      user: updatedUser, // Updated user details
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  //in postman we do not see this status code. but even tough it's best practice to send a response.

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use signup instead',
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
//Do not update password whit this, since it is only for Admins
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

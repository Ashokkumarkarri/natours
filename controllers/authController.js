const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  //.sing(payload,secret,{options})
  //payload: all the data that we want to store.
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'Success',
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //checks
  //1)check if email and password exists
  //2)check if user exists & password is correct
  //3)if everything is okay, send token to client

  //1)check if email and password exists
  if (!email || !password) {
    const error = new AppError('Please provide email and password', 400);
    return next(error);
  }

  //2)check if user exists & password is correct
  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //3)if everything is okay, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)Getting token and check it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);

  if (!token) {
    const error = new AppError(
      'you are not logged in! please log in to get access',
      401,
    );
    return next(error);
  }

  //2)Verification token : if the token is tampered or not
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //3)check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to the token does not exist', 401),
    );
  }
  //4)check if user change password after the token was issues
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password!, please login again.', 401),
    );
  }
  //Grant Access to Protected Route
  req.user = currentUser; // this is for future. we can use it in next middleware.
  next();
});

// Middleware to restrict actions based on user roles
exports.restrictTo = (...roles) => {
  //...roles : rest parameter syntax
  return (req, res, next) => {
    // Example: roles = ['admin', 'lead-guide']
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next(); // Proceed if authorized
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)  Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  //we used findOne since user and we do not know his id, we only know his emailID, so we are trying to find him with his email.
  if (!user) {
    return next(new AppError('There is no user with email address ', 404));
  }

  //2) Generate  the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3)Send it to user's email
});

exports.resetPassword = (req, res, next) => {};

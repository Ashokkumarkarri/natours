const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
//function to send responses
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  // Set cookie options

  // Only send cookies securely in production (HTTPS)

  // Send the cookie to the client
  //arg1=name of the cookie, arg2=data we want to send, aeg3=some options
  res.cookie('jwt', token, {
    // Expiration for the cookie
    maxAge: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    ),
    // secure: true, //https
    httpOnly: true, // Prevents client-side scripts from accessing cookies (XSS protection)
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https', // Send cookies only over HTTPS
  });

  // Remove the password before sending the user data in the response
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: user },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return next(new AppError('Please provide all required fields', 400));
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
    });
    // const url = 'http://localhost:8000/me';
    const url = `${req.protocol}://${req.get('host')}/me`;
    // console.log(url);
    await new Email(newUser, url).sendWelcome();
    createSendToken(newUser, 201, req, res);
  } catch (err) {
    console.error('Error during signup:', err);
    next(err);
  }
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
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logged-out-dummy-jwt', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  //1)Getting token and check it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt; //now we can also authenticate the users based on tokens send by a cookies not only auth headers
  }
  if (!token) {
    // console.log(token);

    const error = new AppError(
      'you are not logged in! please log in to get access',
      401,
    );
    return next(error);
  }

  //2)Verification token : if the token is tampered or not
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
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
  res.locals.user = currentUser;
  next();
});

//Only for rendered pages, there will be no errors
//we will check if user logged in or not
//we also have protect middleware to check if user loged in or not, but that protect middleware is only for proteced route. but this middleware will run for all requests.
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //1)Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );
      // console.log(decoded);

      //2)check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //3)check if user change password after the token was issues
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      //There is a Logged in USER
      res.locals.user = currentUser; // what ever we mention here, we can access that in our PUG template. Ever pug template has access to this variable "res.locals"
      return next();
    } catch (err) {
      return next();
    }
  }
  next(); //if there is no cookies the next middleware will be called.
};

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

  try {
    //3)Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)Get the user based on the token.
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3) Update changedPasswordAt property for the user.

  //4)Log the user in, send JWT to client.
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //2)Check if posted password is correct.
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  //3)If so, update the password.
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //user.findByIdAndUpdate method will not work as intended.

  //4)Log user in, send JWT

  createSendToken(user, 200, req, res);
});

const AppError = require('./../utils/appError');

const handelCastErrorDB = (err) => {
  const message = `Invalid  ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handelDuplicateFieldsDB = (err) => {
  let val = err.keyValue.name;
  const message = `Duplicate field value: ${val}. Please use another value!`;
  return new AppError(message, 400);
};

const handelValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data.. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handelJWTError = (err) =>
  new AppError('Invalid token. Please log in again', 401);

const handelJWTExpiredError = (err) =>
  new AppError('Your token has been expired!, Please login again', 401);

const sendErrorDev = (err, req, res) => {
  // ---------------A) Handle API Errors--------------
  // Check if the request URL starts with '/api' (indicating it's an API request).
  if (req.originalUrl.startsWith('/api')) {
    // Respond with detailed error information for development purposes.
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message, //we can leak the complete Error details since it's "dev env"
      stack: err.stack,
    });
  }
  // ------------B) RENDERED WEBSITE-------------------
  console.error(`Error 🔥`, err);
  // Render the 'error' page with a descriptive message for developers.
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // ----------- A) API Errors -----------------
  // Check if the request URL starts with '/api' (indicating it's an API request).
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: Send a clear, user-friendly message to the client.
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status, // Status of the error ('fail' or 'error').
        message: err.message, // Custom error message for the client.
      });
    }
    // B) Programming or 3rd-party/unknown error: Avoid leaking sensitive details to the client.
    console.error(`Error `, err); // Log the full error for debugging purposes.
    return res.status(500).json({
      // Send a generic error response to the client.
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  // ----------- B) Rendered Website Errors -----------------
  // Handle errors for non-API requests (e.g., rendered website pages).

  // A) Operational, trusted error: Show a friendly error page with the error message.
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong', // Page title.
      msg: err.message, // Custom error message to display on the page.
    });
  }
  // B) Programming or 3rd-party/unknown error: Avoid leaking sensitive details.
  console.error(`Error `, err); //1)Log Error
  return res.status(err.statusCode).render('error', {
    // 2) Render a generic error page with a user-friendly message.
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }; //shallow copy
    error.message = err.message;
    if (err.name === 'CastError') error = handelCastErrorDB(error);
    if (error.code === 11000) error = handelDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handelValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handelJWTError(error);
    if (err.name === 'TokenExpiredError') error = handelJWTExpiredError(error);
    sendErrorProd(error, req, res);
  }
};

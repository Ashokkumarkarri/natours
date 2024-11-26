const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// const { execArgv } = require('process');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1)GLOBAL MIDDLEWARE
//set security HTTP headers
app.use(helmet());

//DEvelopment logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 100, //100 req for same IP
  windowMs: 60 * 60 * 1000, // in 1 hour
  message: 'Too many request from this IP, please try again in a hour',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
//when body larger than 10kb will not be accepted
app.use(express.json({ limit: '10kb' })); //middleware

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XXS attacks
app.use(xss());

//Prevent Param Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//Serving static files
app.use(express.static(`${__dirname}/public`));

//Testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.header);
  next();
});

//3)Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
//when we specify the 4 args the express will get to know that it's an error handling middleware
module.exports = app;

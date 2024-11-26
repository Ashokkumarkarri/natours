const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// const { execArgv } = require('process');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1)GLOBAL MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100, //100 req for same IP
  windowMs: 60 * 60 * 1000, // in 1 hour
  message: 'Too many request from this IP, please try again in a hour',
});
app.use('/api', limiter);
app.use(express.json()); //middleware

app.use(express.static(`${__dirname}/public`));

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

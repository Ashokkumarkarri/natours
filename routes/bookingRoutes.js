const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession,
);

module.exports = router;

// authController.protect = this to do that only users who logged in will be able to access it protected routes.
//authController.restrictTo('user') we restrict it to users only.

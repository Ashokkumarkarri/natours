const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const router = express.Router();
const reviewController = require('./../controllers/reviewController');

// router.param('id', tourController.checkID);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect, // Ensure the user is authenticated
    authController.restrictTo('admin', 'lead-guide'), // Restrict to specific roles
    tourController.deleteTour, //Controller for deleting the tour
  );

// Nested Routes for Reviews:
// Example endpoints:
// 1. POST /tours/:tourId/reviews     -->   To create a new review for a specific tour
// 2. GET /tours/:tourId/reviews       -->     To get all reviews for a specific tour
// 3. GET /tours/:tourId/reviews/:reviewId --> To get a specific review for a tour

//req for POST / for TOUR /tourUID1234567 /reviews
//so we have tourId in the URL and the user ID will come from currently logged in user, this is called nested route
//nested route is very useful when we are dealing with parent child relation between resources. (reviews is  a child of tours).
//so the nested route is basically means: a url

router.route('/:tourId/reviews').post(
  // Middleware to protect this route - only authenticated users can access it
  authController.protect,
  // Restrict access to certain roles (e.g., only users can create reviews)
  authController.restrictTo('user'),
  // Controller to handle the creation of a new review
  reviewController.createReview,
);
// Note for Future Improvement:
//for now it is intrigitive to call the reviewController in tourRotes.
//for now we do this since the route starts with tour (//  POST / tour /id_of tour234asv/reviews)
//in feature we will fix it.

//so now we have tourId in the url, now we should let the controller know, that controller should use this ID. (reviewController.js)

module.exports = router;

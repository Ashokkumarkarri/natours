const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const router = express.Router();
const reviewRouter = require('./reviewRoutes');
// router.param('id', tourController.checkID);

// Nested Routes for Reviews:
// Example endpoints:
// 1. POST /tours/:tourId/reviews
// 2. GET /tours/:tourId/reviews
router.use('/:tourId/reviews', reviewRouter);

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

module.exports = router;

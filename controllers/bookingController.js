const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1_) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  console.log(tour);

  //2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], //we only accept card payments
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`, //called when the payment is successful
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`, //called when the payment is cancelled
    client_reference_id: req.params.tourId, //this is the id of the tour that the user is booking
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
            ],
          },
          unit_amount: tour.price * 100, // Stripe requires the amount in cents
        },
        quantity: 1,
      },
    ],
  });

  //3) Send it to the client
  res.status(200).json({
    status: 'success',
    session,
  });
});

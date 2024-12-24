const Tour = require('../models/tourModel');
// const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    //stages
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: null,
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // { $match: { _id: { $ne: 'EASY' } } },
    //we can repeat the stages
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      stats: stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; //2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //If a tour document has an array of startDates, applying $unwind will produce separate documents for each date.
    },
    {
      $match: {
        //Match startDates between the given year:
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        //Group by month
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 }, //how many tours
        tours: { $push: '$name' }, //which tours are there
      },
    },
    {
      $addFields: { month: '$_id' }, //Add month field:
    },
    {
      $project: {
        _id: 0, // _id will be hidden
      },
    },
    { $sort: { numToursStarts: -1 } },
    {
      $limit: 12, // how many you want to see
    },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      plan: plan,
    },
  });
});

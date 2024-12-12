const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    //if there is not tour
    return next(new AppError('No tour Found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    //if there is not tour
    return next(new AppError('No tour Found with that ID', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    //if there is not tour
    return next(new AppError('No tour Found with that ID', 404));
  }
  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

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

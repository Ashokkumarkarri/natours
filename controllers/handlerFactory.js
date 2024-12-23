const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//factory function to create a new document
//a fun which return another fun
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No Document Found with that ID', 404));
    }
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);
//     if (!tour) {
//       //if there is not tour
//       return next(new AppError('No tour Found with that ID', 404));
//     }
//     res.status(204).json({
//       status: 'Success',
//       data: null,
//     });
//   });

const mongoose = require('mongoose');

//review / rating / createdAt/ ref to tour / ref to user(who wrote this wrote)

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can't be empty"],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', //this is a reference to other model.
      required: [true, 'Review must belongs to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }, // When we have a virtual property that is not saved in the database but is used for calculations, we need to enable this to include it in the output.
);

//POPULATE
//regular expression
reviewSchema.pre(/^find/, function (next) {
  // In pre middleware, `this` refers to the current query
  this.populate({
    path: 'tour', // name of the field that we want to replace
    select: 'name',
  });
  this.populate({
    path: 'user', // name of the field that we want to replace
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

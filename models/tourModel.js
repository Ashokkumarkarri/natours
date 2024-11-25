const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator'); //3rd party validator
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      //trim removes all the black space in the beginning and ending.
      maxlength: [40, 'A Tour name must have less or equal then 40 characters'],
      minlength: [10, 'A Tour name must have grater or equal to 10 characters'],
      // validate: [
      //   validator.isAlpha,
      //   'name should contain string only, no num, no spaces , allowed',
      // ], //3 rd party validator from npm
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'Difficulty is either: easy,medium,difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      //it will be calculated from our code, it will check how many ratings are then and then it will calculate.
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a Price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
          //.this will point to the current doc only when we are creating new document.
          //so this fun will nto work for update tour
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      //trim removes all the black space in the beginning and ending.
      required: [true, 'A Tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have a cover image'],
      //now we are just storing the name of the image, we will store the real image from file system later.
    },
    images: [String], //we have an array of strings,
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
//arg1=schema_definition, arg2=options-object

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//we can not use the virtual properties while querying, since they are not part of querying. They are part of mongoDB.

//4 type of middlewares are there in mongoose: 1.document, 2.query, 3.aggregate, 4.model middleware.
//Document Middleware: runs before  .save() and .create()
//we can use save= for .save(), .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//we can have multiple pre save, post hooks.
//hook is a another terminology for middleware.

// tourSchema.pre('save', function (next) {
//   console.log('will save document ');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
//   //in post we do not have access to :  .this
//   //we have have access to the doc which is currently saved.
// });

//we can have middleware that can run before the event occurred, after the event occurred.
// in case of doc middleware, it suppose to be a save event

//Query Middleware
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   //give me tours which has the secretTour set not equal to true
//   next();
// });

// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  //this refers to query
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  //this.start is adding a new property to the query object and storing the current timestamp in it
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`API took: ${Date.now() - this.start} milliseconds`);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  console.log(this);
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  //this refers to the aggregate object
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
//name of the model  , schema
//always use upper case ofr model names and variable.
// thats why I had used Capital T for the variable so that we will get to know that we are dealing with mode.
module.exports = Tour;

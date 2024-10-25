const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      //trim removes all the black space in the begining and ending.
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
    },

    ratingsAverage: {
      type: Number,
      default: 4.1,
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
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      //trim removes all the black space in the begining and ending.
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
//arg1=schema_definition, arg2=options-object

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//we can not use the virtual properties while querying, since they are not part of quering. They are part of mongoDB.

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

const Tour = mongoose.model('Tour', tourSchema);
//name of the model  , schema
//allways use upper case ofr model names and varible.
// thats why I had used Captial T for the varible so that we will get to know that we are dealing with mode.
module.exports = Tour;

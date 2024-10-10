const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    //trim removes all the black space in the begining and ending.
  },
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
});

const Tour = mongoose.model('Tour', tourSchema);
//name of the model  , schema
//allways use upper case ofr model names and varible.
// thats why I had used Captial T for the varible so that we will get to know that we are dealing with mode.
module.exports = Tour;

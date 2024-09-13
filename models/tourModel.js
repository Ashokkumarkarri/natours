const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.1,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a Price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);
//name of the model  , schema
//allways use upper case ofr model names and varible.
// thats why I had used Captial T for the varible so that we will get to know that we are dealing with mode.
module.exports = Tour;

const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interaction

// Defining the schema for the Booking model
const bookingSchema = new mongoose.Schema({
  // Parent referencing: Storing references to the User and Tour models
  tour: {
    type: mongoose.Schema.ObjectId, // ObjectId references another document in MongoDB
    ref: 'Tour', // Reference to the 'Tour' model
    required: [true, 'Booking must belong to a Tour!'], // Ensuring every booking has an associated tour
  },
  user: {
    type: mongoose.Schema.ObjectId, // ObjectId references another document in MongoDB
    ref: 'User', // Reference to the 'User' model
    required: [true, 'Booking must belong to a User!'], // Ensuring every booking has an associated user
  },
  price: {
    type: Number, // Price of the booking
    required: [true, 'Booking must have a Price'], // Ensuring the price is always provided
  },
  createdAt: {
    type: Date, // Timestamp for when the booking was created
    default: Date.now, // Automatically sets the current date/time when the document is created
  },
  paid: {
    type: Boolean, // Indicates whether the booking is paid
    default: true, // By default, every booking is considered paid
  },
});

// Middleware to automatically populate the `user` and `tour` fields in queries
bookingSchema.pre(/^find/, function (next) {
  this.populate('user') // Populating user details
    .populate({
      path: 'tour', // Populating tour details
      select: 'name', // Only selecting the tour name to optimize query performance
    });

  next(); // Move to the next middleware or execution step
});

// Creating the Booking model from the schema
const Booking = mongoose.model('Booking', bookingSchema);

// Exporting the Booking model for use in other parts of the application
module.exports = Booking;

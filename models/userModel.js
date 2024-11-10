const mongoose = require('mongoose');
const validator = require('validator'); //3rd party validator

//name,email,photo,passwords,password confirmation

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name '],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    // Only works on CREATE and SAVE
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'user must have a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

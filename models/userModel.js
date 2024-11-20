const crypto = require('crypto'); // build in node package, no need to install.
const mongoose = require('mongoose');
const validator = require('validator'); //3rd party validator
const bcrypt = require('bcryptjs');

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

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'], // Allowed roles
    default: 'user', // Default role
  },
  password: {
    type: String,
    required: [true, 'user must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //This only works on CREATE and  SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  //user updated his name, this time we do not want the password to be encrypt.

  //only run this fun when pass is modified
  if (!this.isModified('password')) return next();
  //this refers to the current document: user

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete passwordConform
  this.passwordConfirm = undefined;
  next();
});
//instance method, a method which will be available in every file.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp; //10 < 12
  }
  //False means NOt changed
  return false;
};

// Generate a random token
//instance method
userSchema.methods.createPasswordResetToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString('hex'); //we should not directly store this token in DB.
  // Hash the token and store it in the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  // Set token expiration time (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //we want the token to be expire in 10 mns: in millie seconds

  // Return the raw token (to be sent to the user)
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

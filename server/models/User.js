const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => {validator.isEmail(value)},
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// overwrite toJSON function to send only picked fields
userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    id: user._id.toHexString(),
    email: user.email
  }, 'my secret').toString();

  user.tokens.push({access, token});

  // return promise
  return user.save().then(() => {
    return token;
  });
}

var User = mongoose.model('User', userSchema);

User.prototype.findByToken = function (jwt) {
  var promise = new Promise();

  this.tokens.filter((token) => token == jwt);
  if (token) {
    promise.resolve(token);
  } else {
    promise.reject(err);
  }
  return promise;
}

module.exports = {User};

const mongoose = require('mongoose');
var passwordLocalMongoose = require('passport-local-mongoose');

var AppUser = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: String,
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  profileimg: String,
});

AppUser.plugin(passwordLocalMongoose);

module.exports = mongoose.model('AppUser', AppUser);

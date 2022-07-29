const mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
  pname: String,
  size: String,
  height: String,
  width: String,
  weight: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
});

module.exports = mongoose.model('Request', requestSchema);

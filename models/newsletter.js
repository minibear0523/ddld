var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Newsletters = new Schema({
  name: String,
  email: {
    type: String,
    index: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Newsletters', Newsletters);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dateUtils = require('../utils/date');


var Employments = new Schema({
  title: String,
  requirement: {
    type: [String],
    required: false
  },
  duty: {
    type: [String],
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

Employments.virtual('dateString').get(function() {
  return dateUtils.humanizedDateFormatter(this.date);
})

module.exports = mongoose.model('Employments', Employments);
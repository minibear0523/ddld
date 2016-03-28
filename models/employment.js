var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic');
var dateUtils = require('../utils/date');


var Employments = new Schema({
  title: {
    type: String,
    es_indexed: true,
    es_type: 'String'
  },
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

Employments.plugin(mongoosastic, {index: 'ddld'});
var EmploymentsModel = mongoose.model('Employments', Employments);
var stream = EmploymentsModel.synchronize();
var count = 0;

EmploymentsModel.createMapping(function(err, mapping) {
  if (err) {
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  } else {
    console.log('EmploymentsModel mapping created!');
    console.log(mapping);
  }
});

stream.on('data', function(err, doc) {
  count ++;
});

stream.on('close', function() {
  console.log('EmploymentsModel indexed ' + count + ' documents!');
});

stream.on('error', function(err) {
  console.log(err);
});

module.exports = EmploymentsModel;

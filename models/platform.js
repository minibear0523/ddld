var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Platforms = new Schema({
  name: String,
  intro: String
});


module.exports = mongoose.model('Platforms', Platforms);
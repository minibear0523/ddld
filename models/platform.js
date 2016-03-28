var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;


var Platforms = new Schema({
  name: {
    type: String,
    es_indexed: true,
    es_type: 'String'
  },
  intro: {
    type: String,
    es_indexed: true,
    es_type: 'String'
  }
});

Platforms.plugin(mongoosastic, {index: 'ddld'});
var PlatformsModel = mongoose.model('Platforms', Platforms);
var stream = PlatformsModel.synchronize();
var count = 0;

PlatformsModel.createMapping(function(err, mapping) {
  if (err) {
    console.log('err creating mapping (you can safely ignore this)');
    console.log(err);
  } else {
    console.log('PlatformsModel mapping created!');
    console.log(mapping);
  }
});

stream.on('data', function(err, doc) {
  count ++;
});

stream.on('close', function() {
  console.log('PlatformsModel indexed ' + count + ' documents!');
});

stream.on('error', function(err) {
  console.log(err);
});

module.exports = PlatformsModel;

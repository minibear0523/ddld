var express = require('express');
var router = express.Router();
var Platforms = require('../models/platform');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

router.post('/', function(req, res, next) {
  var q = req.body.q || "";
  client.search({
    index: 'ddld',
    q: q
  })
  .then(function(results) {
    console.log(results);
    // res.send(results);
    res.render('results', {results: results.hits.hits});
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
});

router.get('/result', function(req, res, next) {
  res.render('results', {title: 'title'});
})

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('transfer/', function(req, res, next) {
  res.render('transfer');
});

router.get('merchant/', function(req, res, next) {
  res.render('merchant');
});

module.exports = router;
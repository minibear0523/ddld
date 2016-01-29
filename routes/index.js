var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/404', function(req, res, next) {
  res.render('404');
});

router.get('/intro', function(req, res, next) {
  res.render('intro');
});

router.get('/platform', function(req, res, next) {
  res.render('platform');
})

module.exports = router;

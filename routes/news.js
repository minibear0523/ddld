/**
 * Created by MiniBear on 16/1/23.
 */
var express = require('express');
var router = express.Router();

/**
 * 资讯中心首页
 */
router.get('/', function(req, res) {

});

/**
 * 资讯中心详情页
 */
router.get('/:id', function(req, res) {
  var newsId = req.params.id;
});

module.exports = router;
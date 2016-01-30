/**
 * Created by MiniBear on 16/1/23.
 */
var express = require('express');
var router = express.Router();
var Q = require('q');
var News = require('../models/news');

var PAGE_LIMIT = 10;
/**
 * 资讯中心首页, 列表页
 * :url: /news/
 * :method: GET
 * :params kind: 资讯种类: company(公司动态), industry(行业资讯), 空(全部)
 * :params page: 分页的页数, 每页是PAGE_LIMIT条资讯.
 */
//router.get('/', function(req, res) {
//  var kind = req.query.kind;
//  var page = req.query.page || 1;
//  var skip = (page - 1) * PAGE_LIMIT;
//  var query = {};
//  if (kind) {
//    query['kind'] = kind;
//  }
//  News
//    .find(query)
//    .sort({date: -1})
//    .limit(PAGE_LIMIT)
//    .skip(skip)
//    .exec()
//    .then(function(news_list) {
//      var data = {
//        page: page,
//        kind: kind,
//        news_list: news_list
//      };
//      return res.render('news/list', data);
//    })
//    .catch(function(err) {
//      return res.status(404).send(err);
//    });
//});
router.get('/', function(req, res, next) {
  res.render('news');
});

/**
 * 资讯中心详情页
 */
router.get('/:id', function(req, res, next) {
  var newsId = req.params.id;
  News
    .findById(newsId)
    .exec()
    .then(function(news) {
      return res.render('news/detail', {news: news});
    })
    .catch(function(err) {
      return res.render('404', {err: err});
    });
});

module.exports = router;
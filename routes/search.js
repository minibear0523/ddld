var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var searchClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
var Platforms = require('../models/platform');
var News = require('../models/news');
var Employments = require('../models/employment');
var Products = require('../models/product');

/**
 * 创建并初始化Elasticsearch的Index, 包括几个重要的model, 例如platform, employment, news, product
 */
router.get('/index/create', function(req, res, next) {
  searchClient
    .indices
    .create({index: 'platform'})
    .then(function(response) {
      console.log('[*] Create index: platform response: ', response);
      searchClient.indices.create({index: 'product'});
    })
    .then(function(response) {
      console.log('[*] Create index: product response: ', response);
      searchClient.indices.create({index: 'news'});
    })
    .then(function(response) {
      console.log('[*] Create index: news response: ', response);
      searchClient.indices.create({index: 'employment'});
    })
    .then(function(response) {
      console.log('[*] Create index: employment response: ', response);
      res.status(200).send("All databases' index has been created");
    })
    .catch(function(err) {
      res.status(400).send(err);
    });
});

/**
 * 初始化elasticsearch中index的对应mapping,也就是table
 * :param model: platform, news, product, employment
 */
router.get('/index/:model/create', function(req, res, next) {
  var model = req.params.model;
  if (model == 'platform') {
    searchClient
      .indices
      .putMapping({
        index: 'ddld',
        type: 'platforms',
        updateAllTypes: true,
        body: {
          platforms: {
            properties: {
              name: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              },
              intro: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              }
            }
          }
        }
      })
      .then(function(response) {
        console.log('[*] Create type: platforms response: ', response);
        res.status(200).send(response);
      });
  } else if (model == 'product') {
    searchClient
      .indices
      .putMapping({
        index: 'ddld',
        type: 'products',
        updateAllTypes: true,
        body: {
          products: {
            properties: {
              name: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              },
              detail: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              },
              kind: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              },
              sub_kind: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              }
            }
          }
        }
      })
      .then(function(response) {
        console.log('[*] Create type: products response:', response);
        res.status(200).send(response);
      });
  } else if (model == 'news') {
    searchClient
      .indices
      .putMapping({
        index: 'ddld',
        type: 'news',
        updateAllTypes: true,
        body: {
          news: {
            properties: {
              title: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              },
              abstract: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              },
              kind: {
                type: 'string',
                index: 'not_analyzed'
              },
              tags: {
                type: 'string',
                index: 'not_analyzed'
              }
            }
          }
        }
      })
      .then(function(response) {
        console.log('[*] Create type: news response: ', response);
        res.status(200).send(response);
      });
  } else if (model == 'employment') {
    searchClient
      .indices
      .putMapping({
        index: 'ddld',
        type: 'employments',
        updateAllTypes: true,
        body: {
          employments: {
            properties: {
              title: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              },
              requirement: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              },
              duty: {
                type: 'string',
                term_vector: 'with_positions_offsets',
                analyzer: 'ik_smart',
                search_analyzer: 'ik_smart'
              }
            }
          }
        }
      })
      .then(function(response) {
        console.log('[*] Create type: employments response: ', response);
        res.status(200).send(response);
      });
  }
});

/**
 * 同步数据, 之后设置为crontab更新
 * :param model: product, news, employment, platform
 */
router.post('/index/:model/sync', function(req, res, next) {
  var model = req.params.model;
  if (model == 'product') {
    Products
      .find()
      .select('name detail kind sub_kind')
      .exec()
      .then(function(products) {
        var body = new Array();
        for (var i = 0; i < products.length; i++) {
          var product = products[i];
          body.push({index: {_index: 'ddld', _type: 'products', _id: product.id}});
          body.push(product);
        }
        return searchClient.bulk({body: body});
      })
      .then(function(response) {
        res.send(response);
      })
      .catch(function(err) {
        res.send(err);
      });
  } else if (model == 'news') {
    News
      .find()
      .select('title abstract kind tags')
      .exec()
      .then(function(news_list) {
        var body = new Array();
        for (var i = 0; i < news_list.length; i++) {
          var news = news_list[i];
          body.push({index: {_index: 'ddld', _type: 'news', _id: news.id}});
          body.push(news);
        }
        return searchClient.bulk({body: body});
      })
      .then(function(response) {
        res.send(response);
      })
      .catch(function(err) {
        res.send(err);
      })
  } else if (model == 'platform') {
    Platforms
      .find()
      .select('name intro')
      .exec()
      .then(function(platforms) {
        var body = new Array();
        for (var i = 0; i < platforms.length; i++) {
          var platform = platforms[i];
          body.push({index: {_index: 'ddld', _type: 'news', _id: platform.id}});
          body.push(platform);
        }
        return searchClient.bulk({body: body});
      })
      .then(function(response) {
        res.send(response);
      })
      .catch(function(err) {
        res.send(err);
      });
  } else if (model == 'employment') {
    Employments
      .find()
      .select('title requirement duty')
      .exec()
      .then(function(employments) {
        var body = new Array();
        for (var i = 0; i < employments.length; i++) {
          var employment = employments[i];
          body.push({index: {_index: 'ddld', _type: 'employments', _id: employment.id}});
          body.push(employment);
        }
        return searchClient.bulk({body: body});
      })
      .then(function(response) {
        res.send(response);
      })
      .catch(function(err) {
        res.send(err);
      });
  }
});

module.exports = router;

/**
 * Created by MiniBear on 16/1/23.
 */
var express = require('express');
var router = express.Router();
var Q = require('q');
var News = require('../models/news');
var cheerio = require('cheerio');
var redis = require('redis');
var client = redis.createClient();
client.select(3);

var PAGE_LIMIT = 10;
/**
 * 资讯中心首页, 列表页
 * :url: /news/
 * :method: GET
 * :params kind: 资讯种类: company(公司动态), industry(行业资讯), 空(全部)
 * :params page: 分页的页数, 每页是PAGE_LIMIT条资讯.
 */
router.get('/', function(req, res) {
  var kind = req.query.kind || "";
  var page = req.query.page || 1;
  var skip = (page - 1) * PAGE_LIMIT;
  var query = {};
  if (kind) {
    query['kind'] = kind;
  }
  var data = {
    kind: kind
  };

 News
    .find(query)
    .sort({date: -1})
    .limit(PAGE_LIMIT)
    .skip(skip)
    .exec()
    .then(function(news_list) {
      data['page'] = page;
      data['news_list'] = news_list;
      return News.count(query).exec();
    })
    .then(function(count) {
      data['total'] = parseInt(count/PAGE_LIMIT) + 1;
      return res.render('news', data);
    })
    .catch(function(err) {
      return res.status(404).send(err);
    });
});

/**
 * 资讯中心详情页
 */
router.get('/detail/:id', function(req, res, next) {
  var newsId = req.params.id;
  News
    .findById(newsId)
    .exec()
    .then(function(news) {
      news.pv += 1
      return news.save();
    })
    .then(function(news) {
      return res.render('news_detail', {news: news});
    })
    .catch(function(err) {
      return res.render('404', {err: err});
    });
});

router.get('/detail', function(req, res, next) {
  var newsId = req.query.id;
  News
    .findById(newsId)
    .exec()
    .then(function(news) {
      news.pv += 1
      return news.save()
    })
    .then(function(news) {
      res.status(200).send(news);
    })
    .catch(function(err) {
      console.log(err);
      res.status(404).send(err);
    });
});

/**
 * 发布或修改新的资讯
 */
router.post('/', function(req, res, next) {
  var newsId = req.query.id || "";
  var data = req.body;
  var content = data['detail'];
  var $ = cheerio.load(content, {
    ignoreWhitespaces: false,
    decodeEntities: false,
    xmlMode: false,
    lowerCaseTags: false,
    lowerCaseAttributeNames: false,
    recognizeSelfClosing: false
  });

  var thumbnail = $('img').first().attr('src');
  var abstract = $('p').first().text();

  if (data['tags']) {
    storeTags(data['tags']);
  }

  if (newsId) {
    // 更新资讯
    News
      .findById(newsId)
      .exec()
      .then(function(news) {
        news.title = data['title'];
        news.content = content;
        news.source = data['source'];
        news.kind = data['kind'];
        news.published = data['published'];
        news.thumbnail = thumbnail;
        news.tags = data['tags'];
        news.abstract = abstract;

        return news.save()
      })
      .then(function(news) {
        res.status(200).send();
      })
      .catch(function(err) {
        res.status(400).send(err);
      });

  } else {
    // 发布新的资讯
    var news = new News({
      title: data['title'],
      detail: content,
      abstract: abstract,
      source: data['source'],
      kind: data['kind'],
      published: data['published'],
      thumbnail: thumbnail,
      tags: data['tags']
    });
    news
      .save()
      .then(function(news) {
        res.status(200).send();
      })
      .catch(function(err) {
        res.status(400).send(err);
      })
  }
});

/**
 * 更新新闻的tag
 */
router.post('/update/tags', function(req, res, next) {
  News
    .find()
    .select('tags')
    .exec()
    .then(function(news_tags_list) {
      news_tags_list.forEach(function(tags_list) {
        console.log(tags_list);
        storeTags(tags_list);
      });
      res.status(200).send();
    })
    .catch(function(err) {
      res.status(400).send(err);
    });
});

function storeTags(tags) {
  tags.forEach(function(tag, i, tags) {
    // zincrby命令: 有序集合的名称, 增加的score数值, 和对应的key值.
    client.zincrby('tags:news', 1, tag, function(err, response) {
      console.log(response);
    });
  });
}

/**
 * 获取tags, 使用ajax单独来获取
 */
router.get('/tags', function(req, res, next) {
  client.zrevrangebyscore('tags:news', '+inf', '-inf', function(err, tags) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.status(200).send(tags);
    }
  });
});


/**
 * 删除资讯
 */
router.delete('/', function(req, res, next) {
  var newsId = req.query.id || '';
  if (!newsId) {
    res.status(204).send();
  } else {
    News
      .findByIdAndRemove(newsId, function(err) {
        if (err) {
          res.status(204).send(err);
        } else {
          res.status(200).send();
        }
      });
  }
});

module.exports = router;

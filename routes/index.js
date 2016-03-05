var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var Q = require('q');
var Products = require('../models/product');
var News = require('../models/news');
var Employments = require('../models/employment');
var Platforms = require('../models/platform');
var indexPageCache = require('../utils/cache').createIndexPageCache();

var introImagePath = path.join(__dirname, '..', 'uploads', 'certifications', 'images');

/* GET home page. */
router.get('/', function(req, res, next) {
  var indexPage = indexPageCache.get();
  if (indexPage) {
    // 没有过期, 存有数据
    res.render('index', indexPage);
  } else {
    // 已经过期,或者没有数据
    var data = {};
    Products
      .find()
      .limit(10)
      .sort({date: -1})
      .exec()
      .then(function(products) {
        data['products_list'] = products;
        return News
                .find()
                .limit(6)
                .sort({date: -1})
                .exec()
      })
      .then(function(news) {
        data['news_list'] = splitNewsArray(news);
        // 更新数据, 保存到cache中
        indexPageCache.set(data);
        res.render('index', data);
      })
      .catch(function(err) {
        console.log(err);
        res.render('404', {err: err});
      });
  }
});

/**
 * 将新闻数组分为几个子数组
 */
function splitNewsArray(news) {
  var news_list = new Array();
  while (news.length > 0) {
    news_list.push(news.splice(0,2));
  }
  return news_list;
}

router.get('/404', function(req, res, next) {
  res.render('404');
});

router.get('/intro', function(req, res, next) {
  var imagesPath = introImagePath;
  fs.readdir(imagesPath, function(err, files) {
    if (err || files.length === 0) {
      res.render('intro', {images: []});
    } else {
      var images = new Array();
      for (var i = 0; i < files.length; i++) {
        if (path.extname(files[i]) == '.jpg' || path.extname(files[i]) == '.png') {
          var url = '/certifications/images/' + files[i];
          images.push({
            image: url,
            thumbnail: url.replace('images', 'thumbnails')
          });
        }
      }
      res.render('intro', {images: images});
    }
  });
});

router.get('/contact', function(req, res, next) {
  Employments
    .find()
    .exec()
    .then(function(employments) {
      res.render('contact', {employments: employments});
    })
    .catch(function(err) {
      res.render('404', {err: err});
    })
});

/**
 * 获取详细信息
 */
router.get('/employment/detail', function(req, res, next) {
  var employmentId = req.query.id || "";
  if (!employmentId) {
    res.status(404).send();
  } else {
    Employments
      .findById(employmentId)
      .exec()
      .then(function(employment) {
        res.status(200).send(employment);
      })
      .catch(function(err) {
        res.status(400).send(err);
      });
  }
});

/**
 * 提交招聘信息
 */
router.post('/employment', function(req, res, next) {
  var employmentId = req.query.id || "";
  var title = req.body.title;
  var requirement = req.body.requirement.split('\n');
  var duty = req.body.duty.split('\n');
  if (employmentId) {
    Employments
      .findById(employmentId)
      .exec()
      .then(function(employment) {
        employment.title = title;
        employment.requirement = requirement;
        employment.duty = duty;
        return employment.save();
      })
      .then(function(employment) {
        res.status(200).send(employment);
      })
      .catch(function(err) {
        res.status(404).send(err);
      });
  } else {
    var employment = new Employments({
      title: title,
      requirement: requirement,
      duty: duty
    });
    employment
      .save()
      .then(function(employment) {
        res.status(200).send(employment);
      })
      .catch(function(err) {
        res.status(400).send(err);
      });
  }
});

/**
 * 删除招聘信息
 */
router.delete('/employment', function(req, res, next) {
  var employmentId = req.query.id || "";
  Employments
    .findByIdAndRemove(employmentId, function(err) {
      if (err) {
        res.status(204).send(err);
      } else {
        res.status(200).send();
      }
    });
});

/**
 * 技术平台相关API
 */
router.get('/platform', function(req, res, next) {
  var platformId = req.query.id || "";
  if (platformId) {
    Platforms
      .findById(platformId)
      .exec()
      .then(function(platform) {
        res.status(200).send(platform);
      })
      .catch(function(err) {
        res.status(404).send(err);
      });
  } else {
    Platforms
      .find()
      .exec()
      .then(function(platforms) {
        res.render('platform', {platforms: platforms});
      })
      .catch(function(err) {
        res.render('404', {err: err});
      });
  }
});

router.post('/platform', function(req, res, next) {
  var platformId = req.query.id || "";
  var name = req.body.name;
  var intro = req.body.intro;
  if (platformId) {
    Platforms
      .findById(platformId)
      .exec()
      .then(function(platform) {
        platform.name = name;
        platform.intro = intro;
        return platform.save();
      })
      .then(function(platform) {
        res.status(200).send();
      })
      .catch(function(err) {
        res.status(404).send(err);
      });
  } else {
    var platform = new Platforms({
      name: name,
      intro: intro
    });
    platform
    .save()
    .then(function(platform) {
      res.status(200).send();
    })
    .catch(function(err) {
      res.status(400).send(err);
    });
  }
});

router.delete('/platform', function(req, res, next) {
  var platformId = req.query.id || "";
  if (!platformId) {
    res.status(404).send();
  } else {
    Platforms
      .findByIdAndRemove(platformId, function(err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send();
        }
      });
  }
});

module.exports = router;

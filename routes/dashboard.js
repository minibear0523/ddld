var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var Transfer = require('../models/transfer');
var Merchant = require('../models/merchant');
var News = require('../models/news');
var Employments = require('../models/employment');
var Platforms = require('../models/platform');
var Parterners = require('../models/parterner.js');
var modalContentCache = require('../utils/modal_content').createModalContentCache();
var multer = require('multer');
var crypto = require('crypto');

var partnerImagePath = path.join(__dirname, '..', 'uploads', 'partners');
var introImagePath = path.join(__dirname, '..', 'uploads', 'certifications', 'images');
var orgnizationImagePath = path.join(__dirname, '..', 'uploads', 'orgnizations');

var partnerStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, partnerImagePath);
  },
  filename: function(req, file, cb) {
    cb(err, err ? undefined : ('company_orgnization' + path.extname(file.originalname)));
  }
});

var orgnizationStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, orgnizationImagePath);
  },
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(err, err ? undefined : ('company_orgnization' + path.extname(file.originalname)));
    });
  }
});

// 添加中间件, 用来限制管理员权限, 如果没有权限, 不能进入dashboard
router.use(function checkUser(req, res, next) {
  if (!req.user) {
    res.redirect('/users/login');
  } else {
    next();
  }
})

/**
 * 后台首页
 */
router.get('/home', function(req, res, next) {
  res.render('dashboard/index');
});

/**
 * 多媒体管理
 */
router.get('/intro', function(req, res, next) {
  fs.readdir(introImagePath, function(err, files) {
    if (err || files.length <= 0) {
      res.render('dashboard/intro', {images: []});
    } else {
      var oriImageList = {};
      files.forEach(function(file) {
        var ext = path.extname(file).toLowerCase();
        if (ext == '.jpg' || ext == '.jpeg' || ext == '.png' || ext == '.gif') {
          var mtime = new Date(fs.statSync(path.join(introImagePath, file)).mtime).getTime();
          oriImageList[mtime.toString()] = file;
        }
      });
      var keys = Object.keys(oriImageList);
      var sortedImageList = Object.keys(oriImageList).sort();
      var imageList = [];
      sortedImageList.forEach(function(key) {
        imageList.push({
          image: '/certifications/images/' + oriImageList[key],
          thumbnail: '/certifications/thumbnails/' + oriImageList[key]
        });
      });
      res.render('dashboard/intro', {images: imageList});  
    }
  });
});

/**
 * 技术平台管理列表页
 */
router.get('/platforms', function(req, res, next) {
  Platforms
    .find()
    .exec()
    .then(function(platforms) {
      res.render('dashboard/platforms', {platforms: platforms});
    })
    .catch(function(err) {
      console.log(err);
      res.render('404', {err: err});
    });
});

/**
 * 技术平台详情页面
 */
router.get('/platform', function(req, res, next) {
  res.render('dashboard/platform');
})

/**
 * 产品管理--转让产品列表
 */
router.get('/products/transfer', function(req, res, next) {
  Transfer
    .find()
    .exec()
    .then(function(products) {
      res.render('dashboard/transfer', {products: products});
    })
    .catch(function(err) {
      res.render('404');
    });
});

/**
 * 推广内容相关
 */
router.get('/modal', function(req, res, next) {
  res.render('dashboard/modal');
});

/**
 * 产品管理--招商产品列表
 */
router.get('/products/merchant', function(req, res, next) {
  var sub_kind = req.query.kind || "";
  var query = {}
  if (sub_kind) {
    query['kind'] = {$in: [sub_kind]};
  }
  Merchant
    .find(query)
    .exec()
    .then(function(products) {
      res.render('dashboard/merchant', {products: products});
    })
    .catch(function(err) {
      res.render('404');
    });
});

/**
 * 获取产品详情
 * :type: merchant | transfer
 */
router.get('/products/product/:type', function(req, res, next) {
  var type = req.params.type || "";
  var productId = req.query.id || "";
  if (type == 'transfer') {
    if (productId) {
      Transfer
        .findById(productId)
        .exec()
        .then(function(product) {
          res.render('dashboard/product_transfer', {product: product});
        })
        .catch(function(err) {
          res.render('404');
        })
    } else {
      res.render('dashboard/product_transfer');
    }
  } else if (type == 'merchant') {
    if (productId) {
      Merchant
        .findById(productId)
        .exec()
        .then(function(product) {
          res.render('dashboard/product_merchant', {product: product});
        })
        .catch(function(err) {
          res.render('404');
        })
    } else {
      res.render('dashboard/product_merchant');
    }
  }
});

/**
 * 资讯列表
 */
router.get('/news', function(req, res, next) {
  News
    .find()
    .exec()
    .then(function(news_list) {
      res.render('dashboard/news', {news_list: news_list});
    })
    .catch(function(err) {
      res.render('../404');
    });
});

/**
 * 资讯详情: 新增&修改
 */
router.get('/news/detail', function(req, res, next) {
  res.render('dashboard/news_detail');
});

/**
 * 招聘信息列表
 */
router.get('/employment', function(req, res, next) {
  Employments
    .find()
    .exec()
    .then(function(employments) {
      res.render('dashboard/employment', {employments: employments});
    })
    .catch(function(err) {
      res.status(404).send(err);
    });
});

/**
 * 添加新的招聘信息
 */
router.get('/employment/new', function(req, res, next) {
  res.render('dashboard/employment_new');
});

router.get('/employment/detail', function(req, res, next) {
  res.render('dashboard/employment_new');
});

/**
 * 合作伙伴API
 */
router.get('/partners', function(req, res, next) {
  Parterners
    .find()
    .exec()
    .then(function(partners) {
      res.render('dashboard/partners', {partners: partners});
    })
    .catch(function(err) {
      res.render('404').send(err);
    })
});

router.get('/partner', function(req, res, next) {
  var partnerId = req.params.id || "";
  if (partnerId) {
    Parterners
      .findById(partnerId)
      .exec()
      .then(function(partner) {
        res.render('dashboard/partner', {data: partner});
      })
      .catch(function(err) {
        res.render('dashboard/partner');
      })
  } else {
    res.render('dashboard/partner');
  }
});

router.post('/partner', multer({storage: partnerStorage, limits: {fieldSize: 5*1024*1024}}).single('file'), function(req, res, next) {
  var name = req.body.name;
  var logoPath = '/partners/' + req.file.filename;
  var partner = new Parterners({
    name: name,
    logo: logoPath
  });
  partner
    .save()
    .then(function(partner) {
      res.status(200).send(partner);
    })
    .catch(function(err) {
      res.status(400).send(err);
    })
});

router.delete('/partner/', function(req, res, next) {
  var partnerId = req.query.id;
  console.log(partnerId);
  if (partnerId) {
    Parterners
      .findByIdAndRemove(partnerId, function(err) {
        if (err) {
          res.status(204).send(err);
        } else {
          res.status(200).send();
        }
      });
  } else {
    res.status(404).send();
  }
});

/**
 * 组织结构API
 * URL:/dashboard/company
 */
router.get('/company', function(req, res, next) {
  //company_orgnization
  fs.readdir(orgnizationImagePath, function(err, files) {
    if (err || files.length == 0) {
      res.render('dashboard/company', {image: null});
    } else {
      var finished = false;
      files.forEach(function(file) {
        var extname = path.extname(file).toLowerCase();
        if (extname == '.jpg' || extname == '.png' || extname == '.gif') {
          finished = true;
          var imagePath = '/orgnizations/' + file;
          res.render('dashboard/company', {image: imagePath});
        }
      });
      if (finished == false) {
        res.render('dashboard/company', {image: null});  
      }
    }
  });
});

/**
 * 上传组织结构图片
 * 1. 删除已有的图片
 * 2. 上传新图片
 */
router.post('/company', multer({storage: orgnizationStorage, limits: {fieldSize: 10*1024*1024}}).single('file'), function(req, res, next) {
  res.status(200).send('/orgnizations/' + req.file.filename);
});

router.delete('/company', function(req, res, next) {
  fs.readdir(orgnizationImagePath, function(err, files) {
    if (err) {
      res.status(400).send(err);
    } else {
      files.forEach(function(file) {
        var extname = path.extname(file).toLowerCase();
        if (extname == '.jpg' || extname == '.png' || extname == '.gif') {
          fs.unlinkSync(path.join(orgnizationImagePath, file));
        }
      });
      res.status(200).send();
    }
  });
});

module.exports = router;

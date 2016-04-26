var express = require('express');
var router = express.Router();
var Transfer = require('../models/transfer');
var Merchant = require('../models/merchant');

router.get('/transfer', function(req, res, next) {
  Transfer
    .find()
    .exec()
    .then(function(products) {
      res.render('transfer', {products: products});
    })
    .catch(function(err) {
      res.render('404');
    });
});

router.get('/merchant', function(req, res, next) {
  Merchant
    .find()
    .exec()
    .then(function(products) {
      res.render('merchant', {products: products});
    })
    .catch(function(err) {
      res.render('404');
    });
});

/**
 * 获取产品详情页面
 * :kind: {transfer: '转让项目', merchant: '招商项目'}
 */
router.get('/detail/:kind/:id', function(req, res, next) {
  var kind = req.params.kind || "";
  var productId = req.params.id || "";
  if (!productId || !kind) {
    return res.render('404');
  }
  if (kind == 'transfer') {
    // 转让项目产品
    Transfer
      .findById(productId)
      .exec()
      .then(function(product) {
        return res.render('product_transfer_detail', {transfer: product, products: []});
      })
      .catch(function(err) {
        return res.render('404', {err: err});
      })
  } else if (kind == 'merchant') {
    // 招商项目产品
    Merchant
      .findById(productId)
      .exec()
      .then(function(product) {
        return res.render('product_merchant_detail', {merchant: product, products: []});
      })
      .catch(function(err) {
        return res.render('404', {err: err});
      })
  }
});

// RESTful API
/**
 * 上传或修改产品
 */
router.post('/product/', function(req, res, next) {
  var productId = req.query.id || "";
  var type = req.body.type;
  // 根据不同的type, 读取数据
  var data = new Object();
  if (type == 'merchant') {
    data['name'] = req.body.name;
    data['name_co'] = req.body.name_co || "";
    data['abstract'] = req.body.abstract;
    data['specification'] = req.body.specification;
    data['package'] = req.body.package;
    data['wholesale_price'] = req.body.wholesale_price || "";
    data['investment_price'] = req.body.investment_price || "";
    data['production_company'] = req.body.production_company || "";
    data['manual'] = req.body.manual;
    data['other'] = req.body.other || "";
    data['kind'] = req.body['kind'] || [""];
  } else if (type == 'transfer') {
    data['name'] = req.body.name;
    data['abstract'] = req.body.abstract;
    data['registration_class'] = req.body.registration_class;
    data['indication'] = req.body.indication;
    data['specification'] = req.body.specification;
    data['advantage'] = req.body.advantage || "";
    data['transfer_target'] = req.body.transfer_target || "";
    data['introduction'] = req.body.introduction || "";
    data['market'] = req.body.market || "";
    data['intellectual_property'] = req.body.intellectual_property || "";
    data['other'] = req.body.other || "";
    data['kind'] = req.body['kind'] || [""];
  }

  if (productId) {
    // 更新产品信息
    if (type == 'merchant') {
      Merchant
        .findById(productId)
        .exec()
        .then(function(product) {
          product.name = data.name;
          product.name_co = data.name_co;
          product.abstract = data.abstract;
          product.specification = data.specification;
          product.package = data.package;
          product.wholesale_price = data.wholesale_price;
          product.investment_price = data.investment_price;
          product.production_company = data.production_company;
          product.manual = data.manual;
          product.other = data.other;
          product.kind = data.kind;

          return product.save();
        })
        .then(function(product) {
          res.status(200).send(product);
        })
        .catch(function(err) {
          res.status(400).send(err);
        });  
    } else if (type == 'transfer') {
      Transfer
        .findById(productId)
        .exec()
        .then(function(product) {
          product.name = data.name;
          product.abstract = data.abstract;
          product.registration_class = data.registration_class;
          product.indication = data.indication;
          product.specification = data.specification;
          product.advantage = data.advantage;
          product.transfer_target = data.transfer_target;
          product.introduction = data.introduction;
          product.market = data.market;
          product.intellectual_property = data.intellectual_property;
          product.other = data.other;
          product.kind = data.kind;

          return product.save();
        })
        .then(function(product) {
          res.status(200).send(product);
        })
        .catch(function(err) {
          res.status(400).send(err);
        });
    }
  } else {
    // 创建新产品
    if (type == 'merchant') {
      var product = new Merchant(data)
      product
        .save()
        .then(function(product) {
          res.status(200).send(product);
        })
        .catch(function(err) {
          res.status(400).send(err);
        });  
    } else if (type == 'transfer') {
      var product = new Transfer(data)
      product
        .save()
        .then(function(product) {
          res.status(200).send(product);
        })
        .catch(function(err) {
          res.status(400).send(err);
        });
    }
  }
});

/**
 * 获取产品详情
 */
router.get('/product/:kind', function(req, res, next) {
  var type = req.params.kind || "";
  var productId = req.query.id || "";
  if (productId) {
    if (type == 'merchant') {
      Merchant
        .findById(productId)
        .exec()
        .then(function(product) {
          res.status(200).send(product);
        })
        .catch(function(err) {
          res.status(400).send(err);
        })
    } else if (type == 'transfer') {
      Transfer
        .findById(productId)
        .exec()
        .then(function(product) {
          res.status(200).send(product);
        })
        .catch(function(err) {
          res.status(400).send(err);
        })
    }
  } else {
    res.status(404).send();
  }
});

router.delete('/product/:kind', function(req, res, next) {
  var type = req.params.kind || "";
  var productId = req.query.id || "";
  if (type && productId) {
    if (type == 'merchant') {
      Merchant
      .findByIdAndRemove(productId, function(err) {
        if (err) {
          res.status(204).send(err);
        } else {
          res.status(200).send();
        }
      });
    } else if (type == 'transfer') {
      Transfer
        .findByIdAndRemove(productId, function(err) {
          if (err) {
            res.status(204).send(err);
          } else {
            res.status(200).send();
          }
        });
    }
  }
});

module.exports = router;

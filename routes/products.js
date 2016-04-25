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
      res.render('product_transfer_detail', {product: product});
    })
    .catch(function(err) {
      res.render('404', {err: err});
    })
  } else if (kind == 'merchant') {
    // 招商项目产品
    Merchant
    .findById(productId)
    .exec()
    .then(function(product) {
      res.render('product_merchant_detail', {product: product});
    })
    .catch(function(err) {
      res.render('404', {err: err});
    })
  }
});

// RESTful API
/**
 * 上传或修改产品
 */
router.post('/product/', function(req, res, next) {
  var productId = req.query.id || "";
  var name = req.body.name;
  var nameCo = req.body.name_co;
  var detail = req.body.detail;
  var kind = req.body.kind;
  var subKind = "";
  if (kind == 'merchant') {
    subKind = req.body['sub_kind'];
  }

  if (productId) {
    // 更新产品信息
    if (kind == 'merchant') {
      Merchant
        .findById(productId)
        .exec()
        .then(function(product) {
          product.name = name;
          product.name_co = nameCo;
          product.detail = detail;
          product.kind = kind;
          product.sub_kind = subKind;

          return product.save();
        })
        .then(function(product) {
          res.status(200).send();
        })
        .catch(function(err) {
          res.status(400).send(err);
        });  
    } else if (kind == 'transfer') {
      Transfer
        .findById(productId)
        .exec()
        .then(function(product) {
          product.name = name;
          product.name_co = nameCo;
          product.detail = detail;
          product.kind = kind;
          product.sub_kind = subKind;

          return product.save();
        })
        .then(function(product) {
          res.status(200).send();
        })
        .catch(function(err) {
          res.status(400).send(err);
        });
    }
  } else {
    // 创建新产品
    if (kind == 'merchant') {
      var product = new Merchant({
        name: name,
        name_co: nameCo,
        detail: detail,
        kind: kind,
        sub_kind: subKind
      })
      product
        .save()
        .then(function(product) {
          res.status(200).send();
        })
        .catch(function(err) {
          res.status(400).send(err);
        });  
    } else if (kind == 'transfer') {
      var product = new Transfer({
        name: name,
        name_co: nameCo,
        detail: detail,
        kind: kind,
        sub_kind: subKind
      })
      product
        .save()
        .then(function(product) {
          res.status(200).send();
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
  var kind = req.params.kind || "";
  var productId = req.query.id || "";
  if (productId) {
    if (kind == 'merchant') {
      Merchant
        .findById(productId)
        .exec()
        .then(function(product) {
          res.status(200).send(product);
        })
        .catch(function(err) {
          res.status(400).send(err);
        })
    } else if (kind == 'transfer') {
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

router.delete('/product', function(req, res, next) {
  var productId = req.query.id || "";
  if (productId) {
    Products
      .findByIdAndRemove(productId, function(err) {
        if (err) {
          res.status(204).send(err);
        } else {
          res.status(200).send();
        }
      })
  }
});

module.exports = router;

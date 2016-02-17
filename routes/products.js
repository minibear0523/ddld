var express = require('express');
var router = express.Router();
var Products = require('../models/product');

router.get('/transfer', function(req, res, next) {
  Products
  .find({kind: 'transfer'})
  .exec()
  .then(function(products) {
    res.render('transfer', {products: products});
  })
  .catch(function(err) {
    res.render('404');
  });
});

router.get('/merchant', function(req, res, next) {
  Products
  .find({kind: 'merchant'})
  .exec()
  .then(function(products) {
    res.render('merchant', {products: products});
  })
  .catch(function(err) {
    res.render('404');
  });
});

/**
 * 上传或修改产品
 */
router.post('/product', function(req, res, next) {
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
    Products
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

  } else {
    // 创建新产品
    var product = new Products({
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
});

/**
 * 获取产品详情
 */
router.get('/product', function(req, res, next) {
  var productId = req.query.id || "";
  if (productId) {
    Products
      .findById(productId)
      .exec()
      .then(function(product) {
        res.status(200).send(product);
      })
      .catch(function(err) {
        res.status(400).send(err);
      })
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
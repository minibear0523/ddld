var express = require('mongoose');
var router = express.Router();
var Newsletters = require('../models/newsletter');
var Q = require('q');

/**
 * Newsletter注册
 * :url: /newsletter
 * :method: POST
 * :param name: 姓名
 * :param email: 邮件地址
 */
router.post('/signup', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;

  Newsletters
    .findOne({email: email})
    .exec()
    .then(function(newsletter){
      if (newsletter) {
        if (newsletter.verified) {
          res.status(200).send("您已经订阅!")
        } else {
          res.status(200).send("您已经订阅, 但尚未激活, 请前往您的邮箱进行激活.")
        }
      } else {
        newsletter = new Newsletters({
          name: name,
          email: email
        });
        return newsletter.save();
      }
    })
    .then(function(newsletter) {
      // TODO: 发送邮件
      res.status(201).send('订阅成功, 请前往邮箱验证.');
    });
});

/**
 * 激活Newsletter
 * Activation Key使用Newsletter的ID即可, 既保证unique, 又保证复杂性
 */
router.get('/activate/:key', function(req, res, next) {
  var activationKey = req.params.key;
  Newsletters
    .findById(activationKey)
    .exec()
    .then(function(newsletter) {
      if (newsletter) {
        // 检验是否已经验证
      } else {
        // 没找到对应的newsletter
      }
    })
});

module.exports = router;

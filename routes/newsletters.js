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
router.post('/newsletter', function(req, res, next) {
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
        return newsletter.save().then(function(newsletter) {
          res.status(201).send('订阅成功, 请前往邮箱验证.');
        });
      }
    })
});

module.exports = router;
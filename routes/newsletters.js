var express = require('express');
var router = express.Router();
var Newsletters = require('../models/newsletter');
var Q = require('q');
// var emailQueue = require('../utils/email').createEmailQueue();
//
// /**
//  * Newsletter注册
//  * :url: /newsletter
//  * :method: POST
//  * :param name: 姓名
//  * :param email: 邮件地址
//  */
// router.post('/signup', function(req, res, next) {
//   var name = req.body.name;
//   var email = req.body.email;
//
//   console.log(name, email);
//
//   Newsletters
//     .findOne({email: email})
//     .exec()
//     .then(function(newsletter){
//       if (newsletter) {
//         if (newsletter.verified) {
//           res.status(200).send("您已经订阅!")
//         } else {
//           res.status(200).send("您已经订阅, 但尚未激活, 请前往您的邮箱进行激活.")
//         }
//       } else {
//         newsletter = new Newsletters({
//           name: name,
//           email: email
//         });
//         return newsletter.save();
//       }
//     })
//     .then(function(newsletter) {
//       // 将这个邮箱添加到队列中
//       emailQueue.addTask({
//         to: newsletter.email,
//         name: newsletter.name,
//         key: newsletter.id
//       }, 'activation');
//       res.status(201).send('订阅成功, 请前往邮箱验证.');
//     });
// });

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
      if (newsletter && !newsletter.verified) {
        // 存在这个newsletter, 并且没有验证过, 修改verified域
        newsletter.verified = true;
        newsletter
          .save(function(err, newsletter) {
            if (err) {
              console.log(err);
              res.status(400).send(err);
            } else {
              res.status(200).send('验证成功, 谢谢您的支持!');
            }
          });
      } else if (newsletter.verified) {
        // 已经验证过了
        res.status(200).send('该邮箱已经过验证');
      } else {
        res.status(404).send('无法验证该邮箱, 请检查您的链接是否正确.');
      }
    })
});

module.exports = router;

var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var passport = require('passport');

/**
 * 用户登录
 */
router.get('/login', function(req, res, next) {
  res.render('dashboard/login', {});
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/dashboard/home');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

/**
 * 注册用户, 注册一次之后就暂时不再启用这个注册接口, 避免不必要的hacker行为
 */
// router.get('/register', function(req, res, next) {
//   res.render('dashboard/register', {});
// });

// router.post('/register', function(req, res, next) {
//   Account.register(new Account({username: req.body.username,}), req.body.password, function(err, user) {
//     if (err) {
//       console.log(err);
//       res.render('404', {err: err});
//     } else {
//       passport.authenticate('local')(req, res, function() {
//         res.redirect('/dashboard/home');
//       })
//     }
//   });
// });

module.exports = router;

var express = require('express');
var router = express.Router();
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');
var multer = require('multer');

var newsStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '/Users/MiniBear0523/Projects/ddld/uploads/news/')
  },
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(err, err ? undefined : (raw.toString('hex') + path.extname(file.originalname)));
    });
  }
});

var introStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '/Users/MiniBear0523/Projects/ddld/uploads/certifications/')
  },
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(err, err ? undefined : (raw.toString('hex') + path.extname(file.originalname)));
    });
  }
});

/**
 * 上传资讯图片
 */
router.post('/news', multer({storage: newsStorage}).single('file'), function(req, res, next) {
  var data = {
    url: '/news/' + req.file.filename,
    path: req.file.path,
    size: req.file.size,
    filename: req.file.filename,
    delete_url: '/uploads/' + req.file.filename,
    delete_type: 'DELETE'
  };
  res.status(200).send(data);
});

/**
 * 删除资讯图片
 */
router.delete('/news/:filename', function(req, res, next) {
  var filename = req.params.filename;
  var filePath = '/Users/MiniBear0523/Projects/ddld/uploads/news/' + filename;

  fs.unlink(filePath, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send();
    }
  })
});

/**
 * 上传介绍图片
 */
router.post('/intro', multer({storage: introStorage}).single('file'), function(req, res, next) {
  var filename = req.file.filename;
  var data = {
    url: '/certifications/' + filename,
    delete_url: '/uploads/intro/' + filename
  }
  res.status(200).send(data);
});

/**
 * 删除介绍图片
 */
router.delete('/intro/:filename', function(req, res, next) {
  var filename = req.params.filename;
  var filePath = '/Users/MiniBear0523/Projects/ddld/uploads/certifications/' + filename;
  fs.unlink(filePath, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send();
    }
  })
});

module.exports = router;

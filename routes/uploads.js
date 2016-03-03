var express = require('express');
var router = express.Router();
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');
var multer = require('multer');
var jimp = require('jimp');

var newsImagePath = path.join(__dirname, '..', 'uploads', 'news');
var introImagePath = path.join(__dirname, '..', 'uploads', 'certifications', 'images');

var newsStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, newsImagePath);
  },
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(err, err ? undefined : (raw.toString('hex') + path.extname(file.originalname)));
    });
  }
});

var introStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, introImagePath);
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
router.post('/news', multer({storage: newsStorage, limits: {fieldSize: '5MB'}}).single('file'), function(req, res, next) {
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
  var filePath = path.join(newsImagePath, filename);

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
router.post('/intro', multer({storage: introStorage, limits: {fieldSize: '5MB'}}).single('file'), function(req, res, next) {
  var filename = req.file.filename;
  var data = {
    url: '/certifications/images/' + filename,
    delete_url: '/uploads/intro/' + filename
  }
  // 修改尺寸
  var imageURL = path.join(__dirname, '..', 'uploads', data.url);
  console.log(imageURL);
  jimp
    .read(imageURL)
    .then(function(image) {
      var thumbnailURL = imageURL.replace('images', 'thumbnails');
      image
        .resize(350, 270)
        .quality(80)
        .write(thumbnailURL, function(err, image) {
          if (err) console.log(err);
          data['thumbnail'] = thumbnailURL;
          res.status(200).send(data);
        });
    })
    .catch(function(err) {
      console.log(err);
      data['thumbnail'] = "";
      res.status(200).send(data);
    });
});

/**
 * 删除介绍图片
 */
router.delete('/intro/:filename', function(req, res, next) {
  var filename = req.params.filename;
  var filePath = path.join(introImagePath, filename);
  console.log(filename, filePath);
  fs.unlink(filePath, function(err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send();
    }
  })
});

module.exports = router;

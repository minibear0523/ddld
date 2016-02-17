var express = require('express');
var router = express.Router();
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '/Users/MiniBear0523/Projects/ddld/uploads')
  }
})

router.post('/news', multer({storage: }))
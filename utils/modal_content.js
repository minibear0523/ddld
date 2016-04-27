/**
 * 使用本地文件储存的方式来设置modal的内容, 采用单例模式来进行模式设计
 * 从而保证一个服务中只有一个modal content
 */
var fs = require('fs');
var path = require('path');

var update = function(data, cb) {
  this.content['title'] = data.title;
  this.content['content'] = data.content;
  this.content['link'] = data.link;
  fs.writeFile(path.join(__dirname, 'content.json'), JSON.stringify(this.content), function(err){
    if (err) {
      cb(err);
    } else {
      cb(null);
    }
  });
}

var get = function(cb) {
  var _content = this.content;
  if (!_content) {
    fs.readFile(path.join(__dirname, 'content.json'), function(err, data) {
      if (err) {
        cb(err, null);
      } else {
        this.content = JSON.parse(data)
        cb(null, data);
      }
    });
  } else {
    return cb(null, _content);
  }
}

var clear = function(cb) {
  this.content = null;
  cb(null);
  fs.unlink(path.join(__dirname, 'content.json'), function(err) {
    if (err) {
      cb(err);
    } else {
      cb(null);
    }
  });
}

var createModalContentCache = function() {
  var obj = {
    content: {},
    update: update,
    get: get,
    clear: clear
  }
  return obj;
}

exports.createModalContentCache = createModalContentCache;

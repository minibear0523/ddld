/**
 * 可以忍受缓存失效和冷启动, 所以自己实现cache模块
 * 最简单的方法就是使用Object对象, 以key-value方式保存
 */
var Products = require('../models/product');
var News = require('../models/news');
var Q = require('q');


/**
 * 设置首页缓存的value
 */
var set = function(value) {

};

/**
 * 获取已经缓存的value
 */
var get = function() {

};

/**
 * 获取首页缓存
 * @return 缓存对象或者获取到的对象
 */
var createIndexPageCache = function() {
  var obj = {
    cache: {},
    set: set,
    get: get,
    clear: clear,
    updateDate: Date.now(),
    expire: 2000,
  };

  return obj;
};

exports.createIndexPageCache = createIndexPageCache;

/**
 * 可以忍受缓存失效和冷启动, 所以自己实现cache模块
 * 最简单的方法就是使用Object对象, 以key-value方式保存
 */
var CacheExpireTime = 1000 * 60 * 60 * 6;

/**
 * 设置首页缓存的value
 */
var set = function(value) {
  var _cache = this.cache;
  _cache['value'] = value;
  this.updateDate = +new Date();
  this.expire = CacheExpireTime;
};

/**
 * 获取已经缓存的value
 */
var get = function() {
  var _cache = this.cache;
  var _expire = this.expire;
  if (_expire && (+new Date() - _cache.updateDate > _expire)) {
    // 数据已经过期, 返回null. Cache只负责储存数据, 但不负责数据的获取和更新, 这样可以保证解耦合性.
    return null;
  } else {
    // 数据没有过期, 则直接返回数据, 但是不更新updateDate时间.
    return _cache.value;
  }
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
    updateDate: +new Date(),
    expire: CacheExpireTime,
  };

  return obj;
};

exports.createIndexPageCache = createIndexPageCache;

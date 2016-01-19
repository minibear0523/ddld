var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 产品招商数据表
 * :name: 通用名
 * :name_co: 商用名(非必填)
 * :name_en: 英文名
 * :name_py: 汉语拼音
 * 其他使用JSON格式或者图片表示
 */
var Product = new Schema({
  // 药品名称
  name: String,
  name_co: {
    type: String,
    required: false
  },
  name_en: String,
  name_py: String,
  detail: String
});

module.exports = mongoose.model('Product', Product);
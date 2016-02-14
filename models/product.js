var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 产品招商数据表
 * :name: 通用名
 * :name_co: 商用名(非必填)
 * :detail: 直接字符串保存
 * :kind: 招商项目还是转让项目, 其中转让项目还有附加的分类
 * :sub_kind: 转让项目的附件分类
 */
var Product = new Schema({
  // 药品名称
  name: String,
  // 商品名
  name_co: {
    type: String,
    required: false
  },
  detail: String,
  kind: String,
  sub_kind: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Product', Product);
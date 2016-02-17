var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dateUtils = require('../utils/date.js');

/**
 * 产品招商数据表
 * :name: 通用名
 * :name_co: 商用名(非必填)
 * :detail: 直接字符串保存
 * :kind: 招商项目(merchant)还是转让项目(transfer), 其中转让项目还有附加的分类
 * :sub_kind: 转让项目的附件分类: {orphan, creative, children, generics, psychiatric}
 */
var Products = new Schema({
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
    type: [String],
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

Products.virtual('dateString').get(function() {
  return dateUtils.humanizedDateFormatter(this.date);
});

Products.virtual('kindString').get(function() {
  var mapping = {
    transfer: '转让产品',
    merchant: '招商产品'
  };
  return mapping[this.kind];
});

Products.virtual('subKindString').get(function() {
  var result = ""
  var mapping = {
    orphan: '孤儿药',
    creative: '创新药剂(经皮给药系列)',
    children: '儿童药',
    generics: '其他仿制药',
    psychiatric: '精神类药'
  };

  for (var i = 0; i < this.sub_kind.length; i ++) {
    result += mapping[this.sub_kind[i]] + '  ';
  }

  return result;
});

Products.virtual('sub_kind_string').get(function() {
  var result = '["all"'
  for (var i = 0; i < this.sub_kind.length; i++) {
    result += ',"' + this.sub_kind[i] + '"'
  }
  result += ']';
  console.log(result);
  return result;
});

module.exports = mongoose.model('Products', Products);
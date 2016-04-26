var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic');
var dateUtils = require('../utils/date.js');

/**
 * 产品招商数据表
 * :name: 通用名
 * :name_co: 商品名
 * :abstract: 介绍(用于列表页面显示)
 * :specification: 规格
 * :package: 包装
 * :wholesale_price: 批发价格
 * :investment_price: 招商价格
 * :production_company: 生产企业
 * :manual: 说明
 * :other: 其他
 * :kind: 分类
 * :date: 添加日期
 */

var Merchant = new Schema({
  name: {
    type: String,
    es_indexed: true,
    es_type: 'String'
  },
  name_co: {
    type: String,
    required: false,
    es_indexed: true,
    es_type: 'String'
  },
  abstract: {
    type: String
  },
  specification: {
    type: String,
  },
  package: {
    type: String
  },
  wholesale_price: {
    type: String,
    required: false
  },
  investment_price: {
    type: String,
    required: false
  },
  production_company: {
    type: String,
    required: false
  },
  manual: {
    type: String
  },
  other: {
    type: String,
    required: false
  },
  kind: {
    type: [String],
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

Merchant.virtual('kindString').get(function() {
  var result = ""
  var mapping = {
    orphan: '孤儿药',
    creative: '创新药剂(经皮给药系列)',
    children: '儿童药',
    generics: '其他仿制药',
    psychiatric: '精神类药'
  };

  for (var i = 0; i < this.kind.length; i ++) {
    result += mapping[this.kind[i]] + '  ';
  }

  return result;
});

Merchant.virtual('kind_string').get(function() {
  var result = '["all"'
  for (var i = 0; i < this.kind.length; i++) {
    result += ',"' + this.kind[i] + '"'
  }
  result += ']';
  return result;
});

Merchant.virtual('dateString').get(function() {
  return dateUtils.humanizedDateFormatter(this.date);
});

Merchant.plugin(mongoosastic, {index: 'ddld'});
var MerchantModel = mongoose.model('Merchant', Merchant);
var stream = MerchantModel.synchronize();
var count = 0;

MerchantModel.createMapping(function(err, mapping) {
  if (err) {
    console.log('err creating mapping (you can safely ignore this)');
    console.log(err);
  } else {
    console.log('MerchantModel mapping created!');
    console.log(mapping);
  }
});

stream.on('data', function(err, doc) {
  count ++;
});

stream.on('close', function() {
  console.log('MerchantModel indexed ' + count + ' documents!');
})

stream.on('error', function(err) {
  console.log(err);
});
module.exports = MerchantModel;

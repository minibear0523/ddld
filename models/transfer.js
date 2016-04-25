var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic = require('mongoosastic');
var dateUtils = require('../utils/date.js');

/**
 * 产品转让数据表
 * :name: 通用名
 * :abstract: 简介(用于列表页面显示)
 * :registration_class: 注册分类
 * :indication: 适用症
 * :specification: 剂型及规格
 * :advantage: 项目优势
 * :transfer_target: 转让标的
 * :introduction: 项目简介
 * :market: 市场情况
 * :intellectual_property: 知识产权情况
 * :other: 其他
 * :kind: 分类
 * :date: 添加日期
 */
var Transfer = new Schema({
  // 药品名称
  name: {
    type: String,
    es_indexed: true,
    es_type: 'String'
  },
  // 用于列表页面的简介
  abstract: {
    type: String
  },
  // 注册分类
  registration_class: {
    type: String,
    es_indexed: true,
    es_type: 'String'
  },
  // 适应症
  indication: {
    type: String,
  },
  // 剂型及规格
  specification: {
    type: String,
    required: false
  },
  // 项目优势
  advantage: {
    type: String,
    required: false
  },
  // 转让标的
  transfer_target: {
    type: String,
    required: false
  },
  // 项目简介
  introduction: {
    type: String,
    required: false
  },
  // 市场情况
  market: {
    type: String,
    required: false
  },
  // 知识产权情况
  intellectual_property: {
    type: String,
    required: false
  },
  // 其他
  other: {
    type: String,
    required: false
  },
  // 子分类
  kind: {
    type: [String],
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

Transfer.virtual('dateString').get(function() {
  return dateUtils.humanizedDateFormatter(this.date);
});

Transfer.virtual('kindString').get(function() {
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

Transfer.virtual('kind_string').get(function() {
  var result = '["all"'
  for (var i = 0; i < this.kind.length; i++) {
    result += ',"' + this.kind[i] + '"'
  }
  result += ']';
  return result;
});

Transfer.plugin(mongoosastic, {index: 'ddld'});
var TransferModel = mongoose.model('Transfer', Transfer);
var stream = TransferModel.synchronize();
var count = 0;

TransferModel.createMapping(function(err, mapping) {
  if (err) {
    console.log('err creating mapping (you can safely ignore this)');
    console.log(err);
  } else {
    console.log('TransferModel mapping created!');
    console.log(mapping);
  }
});

stream.on('data', function(err, doc) {
  count ++;
});

stream.on('close', function() {
  console.log('TransferModel indexed ' + count + ' documents!');
})

stream.on('error', function(err) {
  console.log(err);
});
module.exports = TransferModel;

var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;
var dateUtils = require('../utils/date');

/**
 * 新闻资讯数据表
 * :title: 标题
 * :detail: 内容
 * :date: 日期
 * :thumbnail: 大图
 * :source: 来源(原创|转载)
 * :kind: 种类(公司动态Company | 行业资讯Industry)
 * :published: 是否发布
 * :pv: pv
 */
var News = new Schema({
  title: {
    type: String,
    es_indexed: true,
    es_type: 'String'
  },
  detail: String,
  abstract: {
    type: String,
    es_indexed: true,
    es_type: 'String'
  },
  date: {
    type: Date,
    default: Date.now
  },
  thumbnail: String,
  source: String,
  kind: String,
  published: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    required: false,
    es_indexed: true,
    es_type: 'nested'
  },
  pv: {
    type: Number,
    default: 0
  }
});

News.virtual('dateString').get(function() {
  return dateUtils.humanizedDateFormatter(this.date);
});

News.virtual('kindString').get(function() {
  var mapping = {
    company: '公司动态',
    industry: '行业资讯'
  }
  return mapping[this.kind];
});

News.virtual('publishString').get(function() {
  return this.published ? '已发布' : '未发布';
});

News.plugin(mongoosastic, {index: 'ddld'});

var NewsModel = mongoose.model('News', News);
var stream = NewsModel.synchronize()
var count = 0;

NewsModel.createMapping(function(err, mapping){  
  if(err){
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  }else{
    console.log('NewsModel mapping created!');
    console.log(mapping);
  }
});

stream.on('data', function(err, doc){
  count++;
});
stream.on('close', function(){
  console.log('NewsModel indexed ' + count + ' documents!');
});
stream.on('error', function(err){
  console.log(err);
});
module.exports = NewsModel;

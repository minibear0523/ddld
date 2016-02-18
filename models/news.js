var mongoose = require('mongoose');
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
  title: String,
  detail: String,
  abstract: String,
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
    required: false
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

module.exports = mongoose.model('News', News);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 新闻资讯数据表
 * :title: 标题
 * :detail: 内容
 * :date: 日期
 * :kind: 种类(公司动态 | 行业资讯)
 * :published: 是否发布
 * :pv: pv
 * :commentsCount: 评论数量
 */
var News = new Schema({
  title: String,
  detail: String,
  date: {
    type: Date,
    default: Date.now
  },
  kind: String,
  published: {
    type: Boolean,
    default: false
  },
  pv: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('News', News);
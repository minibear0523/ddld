var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 技术转让数据表
 * :title: 品种名称
 * :application: 临床应用
 * :kind: 类别
 * :process: 进度
 * :note: 备注信息(非必填)
 */
var Technology = new Schema({
  title: String,
  application: String,
  kind: String,
  process: String,
  note: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Technology', Technology);
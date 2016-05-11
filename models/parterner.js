var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 合作伙伴数据表
 * :name: 名称
 * :logo: logo的本地路径
 */

var ParternerModel = new Schema({
  name: String,
  logo: String
});

module.exports = mongoose.model('Parterner', ParternerModel);

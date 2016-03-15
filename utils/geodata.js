/**
 * 使用缓存, 将geodata进行保存
 */
var fs = require('fs');
var path = require('path');
var fileName = 'geodata.json';
var geodata = null;

var dataGetter = function() {

  if (geodata) {
    return geodata
  } else {
    var filePath = path.join(__dirname, fileName);
    var options = {
      encoding: 'utf-8',
      flag: 'r'
    }
    var data =fs.readFileSync(filePath, options);
    geodata = JSON.parse(data);
    return geodata;
  }
}

exports.GeoDataGetter = dataGetter;

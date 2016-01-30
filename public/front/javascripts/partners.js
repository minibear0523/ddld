$(function() {
  var map = new BMap.Map("#partners-places");
  map.centerAndZoom(new BMap.Point(116.331205, 39.972179), 18);
  map.addControll(new BMap.MapTypeControl());
  map.setCurrentCity('北京');
  map.enableScrollWheelZoom(true);
});
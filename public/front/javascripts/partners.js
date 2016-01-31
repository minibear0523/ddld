$(function() {
  var map = new BMap.Map("partners-places");
  map.centerAndZoom(new BMap.Point(106.05119,35.260616), 5);

  map.setCurrentCity('北京');
  map.addControl(new BMap.MapTypeControl());
  map.enableScrollWheelZoom(true);


});
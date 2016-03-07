$(function() {
  var map = new BMap.Map('address-places');
  map.centerAndZoom(new BMap.Point(116.56507,39.781388), 8);
  map.setCurrentCity('北京');
  map.addControl(new BMap.MapTypeControl());
  map.enableScrollWheelZoom(true);
}(jQuery));

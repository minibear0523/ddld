$(function() {
  var map = new BMap.Map('address-places');
  map.centerAndZoom(new BMap.Point(116.565021,39.781415), 5);
  map.setCurrentCity('北京');
  map.addControl(new BMap.MapTypeControl());
  map.enableScrollWheelZoom(true);
}(jQuery));

$(function() {
  var map = new BMap.Map('address-places');
  map.centerAndZoom(new BMap.Point(116.56507,39.781388), 18);
  map.setCurrentCity('北京');
  map.addControl(new BMap.MapTypeControl());
  map.enableScrollWheelZoom(true);

  var companyPoint = new BMap.Point(116.565063,39.781406);
  var companyMarker = new BMap.Marker(companyPoint);
  map.addOverlay(companyMarker);
}(jQuery));

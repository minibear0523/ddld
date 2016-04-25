$(function() {

  function newMap(selector, coordinate) {
    var markerPoint = new BMap.Point(coordinate.x, coordinate.y);
    var marker = new BMap.Marker(markerPoint);

    var embeddedMap = new BMap.Map(selector);

    embeddedMap.centerAndZoom(new BMap.Point(coordinate.x, coordinate.y), 18);
    embeddedMap.setCurrentCity('北京');
    embeddedMap.addControl(new BMap.MapTypeControl());
    embeddedMap.enableScrollWheelZoom(true);
    embeddedMap.addOverlay(marker);
  }

  newMap('headquarter-map', {x: 116.3313, y: 39.972191});
  newMap('laboratory-map', {x: 116.56507, y: 39.781406});

}(jQuery));

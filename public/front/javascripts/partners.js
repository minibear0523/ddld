$(function() {

  var center = new BMap.Point(106.05119,35.260616);
  var map = new BMap.Map("partners-places");
  map.centerAndZoom(new BMap.Point(106.05119,35.260616), 5);
  map.setCurrentCity('北京');
  map.addControl(new BMap.MapTypeControl());
  map.enableScrollWheelZoom(true);

  var customLayer = new BMap.CustomLayer({
    geotableId: 133113,
    q: "",
    tags: "",
    filter: "",
  });
  map.addTileLayer(customLayer);

  function callback(e) {
    var customPoi = e.customPoi;
    var searchInfoWindow = new BMapLib.SearchInfoWindow(map, "", {
      title: customPoi.title,
      width: 200,
      height: 40,
      panel: 'panel',
      enableSendToPhone: true
    });
    var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
    searchInfoWindow.open(point);
  }
});

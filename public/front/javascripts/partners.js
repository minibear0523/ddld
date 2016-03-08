$(function() {
  var map = new BMap.Map("partners-places");
  map.centerAndZoom(new BMap.Point(106.05119,35.260616), 5);
  map.setCurrentCity('北京');
  map.addControl(new BMap.MapTypeControl());
  map.enableScrollWheelZoom(true);

  var customLayer;
  function addCustomLayer(keyword) {
    if (customLayer) {
      map.removeTileLayer(customLayer);
    }
    customLayer = new BMap.CustomLayer({

    });
    map.addTileLayer(customLayer);
    customLayer.addEventListener('hotspotclick', callback);
  }

  /**
   * 点击hot spot的响应事件
   */
  function callback(e) {
    var customPoi = e.customPoi;
    var contentPoi = e.content;
    var content = '<p style="width:280px;margin:0;line-height:20px;">地址' + customPoi.address;
    var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
      title: customPoi.title,
      width: 290,
      height: 40,
      panel: 'panel',
      enableAutoPan: true,
      enableSendToPhone: false,
    });
    var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
  }
});

$(function() {

  var center = new BMap.Point(106.05119,35.260616);
  var map = new BMap.Map("partners-places");
  map.centerAndZoom(new BMap.Point(106.05119,35.260616), 5);
  map.setCurrentCity('北京');
  map.addControl(new BMap.ScaleControl());                // 添加比例尺控件
  map.addControl(new BMap.OverviewMapControl());          // 添加缩略地图控件
  map.addControl(new BMap.MapTypeControl());              // 添加地图类型控件
  map.enableScrollWheelZoom(true);

  var customLayer = new BMap.CustomLayer(133113);
  map.addTileLayer(customLayer);
  customLayer.addEventListener('hotspotclick', hotspotclickCallback);

  function hotspotclickCallback(e) {
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

  function getGeoData() {
    var url = '/geodata';
    $.get(url, function(data, status, _) {
      if (status == 'success') {
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          // 添加地图标记
          var point = new BMap.Point(item.location[0], item.location[1]);
          var marker = new BMap.Marker(point);

          var tr = $("<tr><td width='75%;'>" + item.title + "<br>" + item.address + "</td><td width='25%'>" + item.province + "<br>" + item.city + "</td>");
          $('#partners-list').append(tr);
          marker.addEventListener('click', showInfo());
          function showInfo() {
            var content = "<p>大道隆达(北京)医药科技发展有限公司</p>" + 
                          "<p>名称: " + item.title + "</p>" +
                          "<p>地址: " + item.address + "</p>";
            var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
              title: item.title,
              width: 280,
              panel: 'panel',
              enableAutoPan: true,
              searchTypes: [
                BMAPLIB_TAB_SEARCH,   //周边检索
                BMAPLIB_TAB_TO_HERE,  //到这里去
                BMAPLIB_TAB_FROM_HERE //从这里出发
              ]
            });
            searchInfoWindow.open(marker);
          }
          map.addOverlay(marker);
        };
      }
    })
  }
  getGeoData();
});

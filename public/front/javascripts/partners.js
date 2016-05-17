$(function() {

  // var center = new BMap.Point(106.05119,35.260616);
  // var map = new BMap.Map("partners-places");
  // map.centerAndZoom(center, 5);
  // map.setCurrentCity('北京');
  // map.addControl(new BMap.ScaleControl());                // 添加比例尺控件
  // map.addControl(new BMap.OverviewMapControl());          // 添加缩略地图控件
  // map.addControl(new BMap.MapTypeControl());              // 添加地图类型控件
  // map.enableScrollWheelZoom(true);

  // var customLayer = new BMap.CustomLayer(133113);
  // map.addTileLayer(customLayer);
  // customLayer.addEventListener('hotspotclick', hotspotclickCallback);

  // function hotspotclickCallback(e) {
  //   var customPoi = e.customPoi;
  //   var searchInfoWindow = new BMapLib.SearchInfoWindow(map, "", {
  //     title: customPoi.title,
  //     width: 200,
  //     height: 40,
  //     panel: 'panel',
  //     enableSendToPhone: true
  //   });
  //   var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
  //   searchInfoWindow.open(point);
  // }

  // function getGeoData() {
  //   var url = '/geodata';
  //   $.get(url, function(data, status, _) {
  //     if (status == 'success') {
  //       $.each(data, function(i, item){ 
  //         var item = data[i];
  //         // 添加地图标记
  //         var point = new BMap.Point(item.location[0], item.location[1]);
  //         var marker = new BMap.Marker(point);

  //         var tr = $("<tr><td width='75%;'>" + item.title + "<br>" + item.address + "</td><td width='25%'>" + item.province + "<br>" + item.city + "</td>").click(showInfo);
  //         $('#partners-list').append(tr);
  //         marker.addEventListener('click', showInfo);
  //         function showInfo() {
  //           var content = "<p>大道隆达(北京)医药科技发展有限公司合作伙伴</p>" + 
  //                         "<p>名称: " + item.title + "</p>" +
  //                         "<p>地址: " + item.address + "</p>";
  //           var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
  //             title: item.title,
  //             width: 300,
  //             panel: 'panel',
  //             enableAutoPan: true,
  //             searchTypes: [
  //               BMAPLIB_TAB_SEARCH,   //周边检索
  //               BMAPLIB_TAB_TO_HERE,  //到这里去
  //               BMAPLIB_TAB_FROM_HERE //从这里出发
  //             ]
  //           });
  //           searchInfoWindow.open(marker);
  //         }
  //         map.addOverlay(marker);
  //       });
  //     }
  //   })
  // }
  // getGeoData();

  $(function() {

    function flip(e, face) {
      var $delegate = $(e.delegateTarget)
      var curr = '.' + face;
      var oppo = face === 'front' ? '.back' : '.front';

      $delegate.find(oppo).addClass('hidden');
      $delegate.find(curr).removeClass('hidden flipInX').addClass('flipOutX');

      setTimeout(function() {
        $delegate.find(curr).addClass('hidden');
        $delegate.find(oppo).removeClass('hidden flipOutX').addClass('flipInX');
      }, 200);
    }

    $('.flip').hover(function(e){ flip(e, 'front'); }, function(e){ flip(e, 'back'); });
  })
});

$(function() {

  var companyPoint = new BMap.Point(116.565063,39.781406);
  var companyMarker = new BMap.Marker(companyPoint);

  var headquarter = new BMap.Map('headquarter-map');

  headquarter.centerAndZoom(new BMap.Point(116.56507,39.781388), 18);
  headquarter.setCurrentCity('北京');
  headquarter.addControl(new BMap.MapTypeControl());
  headquarter.enableScrollWheelZoom(true);
  headquarter.addOverlay(companyMarker);

  var laboratory = new BMap.Map('laboratory-map');

  laboratory.centerAndZoom(new BMap.Point(116.56507,39.781388), 18);
  laboratory.setCurrentCity('北京');
  laboratory.addControl(new BMap.MapTypeControl());
  laboratory.enableScrollWheelZoom(true);
  laboratory.addOverlay(companyMarker);

}(jQuery));

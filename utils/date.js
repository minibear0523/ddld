/**
 * 使用更人性化的时间显示方式,对Date Object进行解析
 * :params date:需要转换的DateObject
 */
var MINUTES = 1000 * 60;
var HOURS = MINUTES * 60;
var DAY = HOURS * 24;
var MONTH = DAY * 30;
var YEARS = 365 * DAY;

exports.humanizedDateFormatter = function (date) {
    var dateTimeStamp = date.getTime();
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0){
        return null;
    }
    var yearC = diffValue / YEARS;
    if (yearC >= 1) return "" + parseInt(yearC) + "年前";
    var monthC = diffValue / MONTH;
    if (monthC >= 1) return "" + parseInt(monthC) + "个月前";
    var weekC = diffValue / (7 * DAY);
    if (weekC >= 1) return "" + parseInt(weekC) + "个星期前";
    var dayC = diffValue / DAY;
    if (dayC >= 1) return "" + parseInt(dayC) + "天前";
    var hourC = diffValue / HOURS;
    if (hourC >= 1) return "" + parseInt(hourC) + "小时前";
    var minC = diffValue / MINUTES;
    if (minC >= 1) return "" + parseInt(minC) + "分钟前";
    return "刚刚";
}

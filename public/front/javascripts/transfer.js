(function($) {
  $(function() {
    // 先调用custom.js中的listener, 然后调用这个listener
    $('#products-filter li a').click(function (e) {
      // 判断如果是第一个心脑血管类药物, 就需要显示cardiovascular-filter
      if ($(this).attr('data-group') == 'cardiovascular') {
        $('ul#cardiovasuclar-filter').slideDown();
      } else {
        $('ul#cardiovasuclar-filter').slideUp();
      }
    });

    var $grid = $('#products-grid');
    $('ul#cardiovasuclar-filter li a').click(function(e) {
      $('ul#cardiovasuclar-filter li a').removeClass('active');
      $(this).addClass('active');
      var groupName = $(this).attr('data-group');
      $grid.shuffle('shuffle', groupName);
    });
  });
})(window.jQuery);

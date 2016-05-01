(function($) {
  'use strict';
  $(document).ready(function(){
    // 更新第一个产品的状态
    $('#collapse0').addClass('in');
    $('#news-carousel > .carousel-inner').children().first().addClass('active');
  });

  /**
   * 增加搜索框 autofocus
   */
   $('#search-modal').on('shown.bs.modal', function(e) {
    console.log('yes');
    $(this).find('input[type="text"]').focus();
   });

   /*
    * initialize modal in current page, details are in modal.js
    */
   initModal()
}(jQuery));

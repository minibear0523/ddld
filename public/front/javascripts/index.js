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
   * create modal in current page, see modal.js for details
   */

// option sample
// {
//   autoShow: false
//   , confirm: {
//     text: "订阅我们"
//     , method: 'POST'
//     , icon: "envelope-o" | false
//   }
//   , expiry: 2
//   , icon: "envelope-o"
//   , 'icon-text': "订阅我们"
//   , shortcut: {
//     text: "<span>订阅</span><span>我们</span>"
//     , icon: "envelope-o" | false
//     , style: "cyanine"
//   }
// }

// shortcut style options
//   cyanine
// , black-blue
// , black-gloss
// , black-satin
// , blue-dark
// , blue-gloss
// , blue-ios
// , blue-light
// , gold
// , green
// , green-dark
// , green-ios-gloss
// , green-lime
// , grey-light
// , grey-light-alternate 
// , grey-shiny
// , khaki
// , orange
// , pink-gloss
// , pink-hot
// , purple
// , red
// , wood
// , yellow

  var customizedModal = ModalFactory.new('customized', '/modal_content', {
    autoShow: true
  });
  var subscriptionModal = ModalFactory.new('subscription', '/front/data/subscription.json', {
    icon: "envelope-o",
    'btn-text': "订阅我们",
    shortcut: {
      text: "<span>订阅</span><span>我们</span>",
      style: "cyanine"
    },
    confirm: {
      method: 'POST'
    }
  });

  // execute the deferred queue in ModalFactory, see modal.js for details
  ModalFactory.show()

}(jQuery));

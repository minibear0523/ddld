var initModal = (function() {
  'use strict';

  function Cookie(id, expiry) {
    this.id = id;
    this.expiry = expiry;
  }

  Cookie.prototype.setDate = function(day){
    if (day === 0) {
      docCookies.setItem(this.id, 'Fri, 31 Dec 9999 23:59:59 GMT');
    } else {
      var now = new Date();
      docCookies.setItem(this.id, now.addDays(day).toUTCString());
    }
  };

  Cookie.prototype.expired = function(){
    var expiry = new Date(docCookies.getItem(this.id));
    return (expiry == null || expiry.getTime() < Date.now());
  };

  // initialize
  var cookie = {
    expirydays: "3",
    iconId: 'subscription-icon-ddld'
  };

  var subscription = {
    $modal: $('#subscription-modal'),
    $icon: $( $('#subscription-icon-template').html() )
  };

  /*
   * Subscription Icon
   */
  function resize($icon) {
    var size = {
      min: 60,
      max: 110,
      font: {
        min: 2.5,
        max: 5.2
      }
    };

    var outerWidth = window.outerWidth;
    var innerWidth = $('#wrapper').outerWidth();
    var marginWidth = (outerWidth - innerWidth) / 2;

    var width = Math.min(Math.max(marginWidth, size.min), size.max); // 20 margin
    var right = Math.max(marginWidth - width - 10 ,0); // at most 10 px to wrapper right side

    // reset subscription icon width and right distance
    $icon
      .css({
        'right': right,
        'width': width
      })
    // hide icon is window width is less than 768px
      .css('display', function() {
        return (outerWidth < 768) ? 'none' : 'block';
      })
    // resize inner icon
      .find('.flap-description')
      .css('font-size', (((width - size.min) * (size.font.max - size.font.min) / (size.max - size.min)) + size.font.min) + 'em')
    ;

    // hide icon title under centain condition
    $icon
      .find('.flap-title')
      .css('display', function() {
        return (width < size.min + 15) ? 'none' : 'block';
      })
    ;
  }

  function initSubscriptionIcon(cookie) {

    // if cookie not exist or expired
    if (cookie.expired()) {
      // insert
      $('body').prepend(subscription.$icon);

      // init subscription icon size
      resize(subscription.$icon);

      // resize subscription icon
      $(window).resize(function() { resize(subscription.$icon); });

      subscription.$icon

      // Show modal
        .on('click', '.flap-little-inner', function(e) {
          e.preventDefault();

          subscription.$modal.modal('show');
        })

      // Close icon
        .on('click', '.flap-close', function(e) {
          e.preventDefault();

          subscription.$icon.fadeOut(200); /*Default*/

          cookie.setDate();
        });
    }
  }

  /*
   * Subscription Modal
   */

  // hide icon when modal is shown and vice versa
  function bindIcon($modal, $icon) {
    $modal
    // show
      .on('show.bs.modal', function(e) {
        $icon.hide();
      })
    // hide
      .on('hide.bs.modal', function(e) {
        $icon.fadeIn(200);
      })
    ;
  }

  function removeErrMsg(e) {
    $(e.target)
      .css('border-color', '#ccc')
      .prev('.errmsg')
      .remove()
    ;
  }

  function validateInput($input, condition, errMsg) {
    if (condition) {
      $input
        .css('border-color', '#00e45c')
      ;
    } else {
      $input
        .css('border-color', '#c43535')
        .before('<span class="errmsg">' + errMsg + '<span>')
      ;
    }
  }

  function initSubscriptionModal(url, subscription, cookie) {
    // if the cookie not exist or expired
    if (cookie.expired()) {

      var isValid = true;

      // bind modal and icon to hide one or the other
      bindIcon(subscription.$modal, subscription.$icon);

      subscription.$modal.find('#subscription-form')
      // name on focus
        .on('focus', 'input[name=name]', removeErrMsg)
      // validate name
        .on('blur', 'input[name=name]', function(e) {

          var $target = $(e.target);
          var condition = ($target.val().length !== 0);

          validateInput($target, condition, '请您输入姓名');

          isValid = isValid && condition;
        })
      // email on focus
        .on('focus', 'input[name=email]', removeErrMsg)
      // validate email
        .on('blur', 'input[name=email]', function(e) {
          var $target = $(e.target);
          var condition = ( /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test( $target.val() ) );

          validateInput($target, condition, '请您输入正确邮箱');

          isValid = isValid && condition;
        })
      ;

      // submit
      subscription.$modal.on('click', '.btn-secondary', function(e) {
        e.preventDefault();

        var $form = $('#subscription-form');

        if (isValid) {
          $.ajax({
            url: url,
            method: 'POST',
            data: $form.serialize(),
            success: function(data, textStatus, jqXHR) {
              subscription.$modal
                // update feedback message
                .find('.modal-body').html(data)
                // remove subscription button
                .next().remove()
              ;

              // pass 0 to setDate to set cookie never expire
              cookie.setDate(0);

              $('#subscription-icon').remove();

              setTimeout(function() {
                subscription.$modal.modal('hide');
              }, 1500);
            },
            error: function(jqXHR, textStatus, errorThrown) {
              // TODO: newsletter doesn't have an error feedback yet
              // console.log(jqXHR);
            }
          });
        }

      });
    }
  }

  /*
   * Customized Modal
   */
  function initCustomizedModal(id, url, autoShow, subscription, cookie) {
    // set default to false
    autoShow = autoShow || false;
    subscription.$icon.hide();

    var $customizedModal;

    $.ajax({
      method: 'GET',
      url: url,
      success: function(data, textStatus, jqXHR) {
        var template = $('#modal-template').html();

        $customizedModal = $(template).attr({
          id: id,
          'aria-labelledby': id
        });

        $customizedModal
          .find('.modal-title')
          .html(data.title);

        $customizedModal
          .find('.modal-body')
          .html(data.content);

        $customizedModal
          .on('click', '.btn-secondary', function(e) {
            window.location = data.link;
          });
      },
      error: function() {
        if (cookie.expired()) {
          $customizedModal = subscription.$modal;
        }
      },
      complete: function() {
        if ($customizedModal){
          bindIcon($customizedModal, subscription.$icon);
        }

        // show after ajax finished
        setTimeout(function() {
          if (autoShow && $customizedModal) {
            $customizedModal.modal('show');
          }
        }, 2000);
      }
    });
  }

  // classic way export
  return function() {
    var cookie = new Cookie('ddld-subscription-icon', 3);
    /*
     * Subscription Icon
     */
    initSubscriptionIcon(cookie);

    /*
     * Subcription Modal
     */
    initSubscriptionModal('/newsletter/signup', subscription, cookie);

    /*
     * Customized Modal - subscription modal is also binded with icon in customizeModal
     */
    initCustomizedModal('customize-modal', '/modal_content', true, subscription, cookie);
  }
})();
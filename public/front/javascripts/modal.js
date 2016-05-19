var ModalFactory = (function() {
  'use strict';  

  // GLOBAL
  var _promiseQueue = [];
  var _autoShowQueue = [];
  var DEFAULT = {
    modalTML: '#modal-template',
    shortcutTML: '#shortcut-template',
    bodyContainer: '#wrapper',
    shortcutContainer: '#modal-shortcut-list',
    shortcutSize: { // px 
      min: 60,
      max: 110,
      font: { // em
        min: 2.5,
        max: 5.2
      }
    }
  };

  /*
   * Cookie
   */

  /*
   * set cookie expiry for passed in id
   * @param: id: String
   * @param: day: Integer
   * return: void
   */
  var _setDate = function(id, day){
    if (day === 0) {
      docCookies.setItem(id, 'Fri, 31 Dec 9999 23:59:59 GMT');
    } else {
      var now = new Date();
      docCookies.setItem(id, now.addDays(day).toUTCString());
    }
  };

  /*
   * check cookie of passed in id is expired
   * @param: id: String
   * return: Boolean
   */
  var _expired = function(id){
    var expiry = new Date(docCookies.getItem(id));
    var now = new Date();
    return (expiry == null || expiry < now);
  };

  /*
   * resize modal shortcut list when browser window resized
   * return: void
   */
  var _resize = function() {
    var size = DEFAULT.shortcutSize;

    var outerWidth = $('body').outerWidth();
    var innerWidth = $(DEFAULT.bodyContainer).outerWidth();
    var marginWidth = (outerWidth - innerWidth) / 2;

    var width = Math.min(Math.max(marginWidth, size.min), size.max); // 20 margin
    var right = Math.max(marginWidth - width - 10 ,0); // at most 10 px to wrapper right side

    // reset subscription shortcut width and right distance
    $(DEFAULT.shortcutContainer)
      .css({
        'right': right,
        'width': width
      })
    // hide shortcut is window width is less than 768px
      .css('display', function() {
        return (outerWidth < 768) ? 'none' : 'block';
      })
    // resize inner shortcut
      .find('.flap-description')
      .css('font-size', (((width - size.min) * (size.font.max - size.font.min) / (size.max - size.min)) + size.font.min) + 'em')
    ;

    // hide icon title under centain condition
    $(DEFAULT.shortcutContainer)
      .find('.flap-title')
      .css('display', function() {
        return (width < size.min + 15) ? 'none' : 'block';
      })
    ;
  };

  /*
   * remove error message from modal content form
   * @param: e: Event Object
   * return: void
   */
  var _removeErrMsg = function(e) {
    $(e.target).css('border-color', '#ccc').prev('.errmsg').remove();
  };

  /*
   * validate modal content form input
   * @param: $input: jQuery Object
   * @param: condition: Boolean
   * @param: errMsg: String
   * return: void
   */
  var _validateInput = function($input, condition, errMsg) {
    if (condition) {
      $input.css('border-color', '#00e45c');
    } else {
      $input.prev(".errmsg").remove();
      $input.css('border-color', '#c43535').before('<span class="errmsg">' + errMsg + '<span>');
    }
  };

  var _autoShow = function() {
    if (_autoShowQueue.length > 0) {
      _autoShowQueue.shift().modal('show');
    }
  };

  var _initForm = function($form) {
    $form
    // name on focus
    .on('focus', 'input[name=name]', _removeErrMsg)
    // validate name
    .on('blur', 'input[name=name]', function(e) {

      var $target = $(e.target);
      var condition = ($target.val().length !== 0);

      _validateInput($target, condition, '请您输入姓名');

      $form.isValid = $form.isValid && condition;
    })
    // email on focus
    .on('focus', 'input[name=email]', _removeErrMsg)
    // validate email
    .on('blur', 'input[name=email]', function(e) {
      var $target = $(e.target);
      var condition = ( /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test( $target.val() ) );

      _validateInput($target, condition, '请您输入正确邮箱');

      $form.isValid = $form.isValid && condition;
    });
  };

  var _validateForm = function($form) {
    $form.isValid = true;
    $form.find('input').trigger('blur');
  };

  var _initShortcut = function(options, $shortcutContainer, iconTML) {
    var modal = this;
    var shortcutTML = $(DEFAULT.shortcutTML).html();
    var $shortcut = $(shortcutTML);

    $shortcut.find('.flap-title').html(options.shortcut.text || options['btn-text']);

    // set shortcut -> icon to false to disable the icon 
    if (options.shortcut.icon !== false) {
      // init icon
      var icon = options.shortcut.icon || options.icon;

      // remove fa- perfix of font-aweseom class
      icon = icon.replace(/^fa\-/, '');

      // insert icon into shortcut
      $shortcut.addClass('flap-' + options.shortcut.style)
               .find('.flap-description').html($(iconTML).addClass('fa-' + icon));
    }

    // insert shortcut
    $shortcutContainer.append($shortcut);

    // Show modal
    $shortcut.on('click', '.flap-little-inner', function(e) {
      e.preventDefault();
      modal.$modal.modal('show');
    })
    // Close icon
    .on('click', '.flap-close', function(e) {
      e.preventDefault();
      $shortcut.fadeOut(200);
      _setDate(modal.id, options.expiry);
    });

    return $shortcut;
  };

  var _confirmCallback = function(options, $form) {
    var modal = this;

    if (typeof options.confirm === 'object') {
      return function() {
        $.ajax({
          url: options.link,
          method: options.confirm.method || 'GET',
          data: $form.length ? $form.serialize() : '',
          success: function(data) {
            // set default response
            data = data || '成功！';

            // update body content as response and remove footer
            modal.$modal.$body.html(data).next().remove();

            // remove relative modal shortcut
            if (options.shortcut) {
              modal.$shortcut.remove();
            }

            setTimeout(function() {
              modal.$modal.modal('hide');
            }, 1500);

            // pass 0 to setDate to set cookie never expire
            _setDate(modal.id, 0);
          }
        })
      }
    } else {
      return function() {
        modal.$modal.modal('hide');
        window.location = options.link;
        _setDate(modal.id, 0);
      }
    }
  };

  // Modal content ajax callback handler
  var _getContent = {
    /*
     * Modal content ajax success callback handler
     * @params: data: Object
     * return: void
     */
    success: function(data) {
      var modal = this;
      var iconTML = "<i class=\"flap-icon fa\"></i>";

      // assemble modal html
      var $modal = modal.$modal;
      // init icon
      var icon = (data.confirm && data.confirm.icon) || data.icon;
      // remove fa- perfix of font-aweseom class
      icon = icon.replace(/^fa\-/, '');
      var $btn = $(iconTML).addClass('fa-' + icon);

      modal.$modal = $.extend($modal, {
        $title: $modal.find('.modal-title').html(data.title),
        $body: $modal.find('.modal-body').html(data.content),
        $btn: $modal.find('.btn-secondary').append($btn).append($('<span></span>').html((data.confirm && data.confirm.text) || data['btn-text']))
      });

      var $form = $modal.$body.find('form');
      $form.isValid = true;
      if ($form.length) { _initForm.call(modal, $form); }

      // assemble shortcut html
      var $shortcutContainer = $('#modal-shortcut-list');
      if (data.shortcut) {
        modal.$shortcut = _initShortcut.call(modal, data, $shortcutContainer, iconTML);
      }

      // bind shortcut with modal
      $modal.on('show.bs.modal', function(e) { $shortcutContainer.hide(); })
            .on('hide.bs.modal', function(e) { _autoShow(); $shortcutContainer.fadeIn(200); });

      // if enable ajax on confirm
      var confirmCb = _confirmCallback.call(modal, data, $form);

      $modal
      // close
      .on('click', '.close', function(e) {
        $(e.delegateTarget).modal('hide');
        if (!data.shortcut) {
          _setDate(modal.id, data.expiry);
        }
      })
      // confirm
      .on('click', '.btn-secondary', function(e) {
        e.preventDefault();
        if ($form.length) {
          // trigger the form validation
          _validateForm.call(modal, $form);
          if ($form.isValid) {
            confirmCb();
          }
        } else {
          confirmCb();
        }

        return false;
      });

      if (data.autoShow) {
        _autoShowQueue.push($modal);
      }
    },
    // TODO: update error handler once api completed
    error: function(jqXHR) {}
  };

  /*
   * Modal
   * @param: name: String
   * @param: url: String
   * @param: options: Object
   * return: Object
   */
  var _Modal = function(name, url, options) {
    var modal = this;

    // null check
    if (!name) { throw new Error('Modal name is now specified'); }
    if (!url) { throw new Error('Url for modal content is now specified'); }

    // sterilize id
    name = name.trim();
    modal.id = 'ddld-modal-' + name.replace(' ', '_');

    if (_expired(modal.id)) {

      var modalTML = $(DEFAULT.modalTML).html();
      modal.$modal = $(modalTML).attr({
        id: modal.id,
        'aria-labelledby': name
      });

      var defer = $.Deferred();

      $.ajax({
        method: 'GET',
        url: url,
        success: function(data) {
          // TODO: use extend to merge options and data into default
          // if options will be pulled from data directly,
          //   we can simply remove the following line
          data = $.extend({
            expiry: 2,
            icon: 'arrow-circle-right',
            'btn-text': '前往查看'
          }, data, options);

          _getContent.success.call(modal, data);

          defer.resolve(modal.id);
        },
        // TODO: update error handler once api completed
        error: function(jqXHR) {
          _getContent.error.call(modal, jqXHR);
          // TODO: temporary use resolve for error handler
          defer.resolve(modal.id);
        }
      });

      _promiseQueue.push(defer.promise());
    }

    return modal;
  };

  function _FactoryModal(args) {
    return _Modal.apply(this, args);
  }
  _FactoryModal.prototype = _Modal.prototype;

  // classic export
  return {
    create: function() {
      return new _FactoryModal(arguments);
    },
    show: function() {
      $.when.apply($, _promiseQueue).done(function() {
        _resize();
        $(window).resize(function() { _resize(); });
        setTimeout(function() {
          _autoShow();
        }, 3000);
      })
    }
  }
})();
(function() {
  'use strict';

  $.myModal = function(id, contenUrl, autoShow) {
    // set default to false
    autoShow = autoShow || false;

    var content = [
      '<div class="modal fade" id="',
      '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
      '<div class="modal-dialog" role="document">' +
      '<div class="modal-content">' +
      '<div class="modal-header">' +
      '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
      '<h4 class="modal-title" id="myModalLabel">',
      // title
      '</h4>' +
      '<hr>' +
      '</div>' +
      '<div class="modal-body">',
      // body
      '</div>' +
      '<div class="modal-footer">' +
      '<hr>' +
      '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>'
    ]
    $.get(contenUrl, function(data) {
      var modalHtml = content[0] +
        id +
        content[1] +
        data.title +
        content[2] +
        data.content +
        content[3];

      // inject modalHtml into page
      $('#modal-wrapper').append(modalHtml);

      var modal = $('#' + id);

      modal
        .on('hide.bs.modal', function(e) {
          window.location = data.link;
        });

      return (autoShow && modal.modal('show'));
    });
  }

})();
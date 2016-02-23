(function($) {
  $('#delete-image-btn').on('click', function(e) {
    e.preventDefault();
    var url = e.traget.href;
    var urlRegExp = new RegExp('\/certifications\/([a-zA-Z0-9_.]*)');
    var filename = urlRegExp.exec(url)[1];
    var deleteURL = '/uploads/intro/' + filename;
    Messenger().ajax({
      successMessage: '删除成功',
      errorMessage: '删除失败, 请重试',
      progressMessage: '删除中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: deleteURL,
      type: 'DELETE',
      success: function() {
        location.reload();
      }
    })
  });

  $('#fileupload').fileupload({
  });
}(jQuery));

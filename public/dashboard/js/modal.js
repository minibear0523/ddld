(function($) {
  $('#inputContent').summernote({
    height: '900px',
    width: '100%',
    lang: 'zh-CN'
  });

  function updateModalContent() {
    var data = {
      title: $('#inputTitle').val(),
      content: $('#inputContent').summernote('code'),
      link: $('#inputLink').val()
    }

    Messenger().ajax({
      successMessage: '更新成功',
      errorMessage: '更新失败, 请重试',
      progressMessage: '更新中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: '/modal_content',
      type: 'POST',
      data: data,
      success: function(data, status, _) {
        if (status == 'success') {
          $('#inputTitle').val(data.title);
          $('#inputLink').val(data.link);
          $('#inputContent').summernote('code', data.content);
        }
      }
    });
  }

  function getModalContent() {
    $.get('/modal_content', function(data, status, _) {
      if (status == 'success') {
        $('#inputTitle').val(data.title);
        $('#inputLink').val(data.link);
        $('#inputContent').summernote('code', data.content);
      }
    });
  }

  function deleteModalContent() {
    Messenger().ajax({
      successMessage: '删除成功',
      errorMessage: '删除失败, 请重试',
      progressMessage: '删除中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: '/modal_content',
      type: 'DELETE',
      success: function() {
        $('#inputTitle').val('');
        $('#inputLink').val('');
        $('#inputContent').summernote('code', null);
      }
    });
  }

  $(function() {
    getModalContent();

    $('#submit-btn').on('click', function(e) {
      e.preventDefault();
      updateModalContent();
    });

    $('#delete-btn').on('click', function(e) {
      e.preventDefault();
      deleteModalContent();
    });
  });
})(window.jQuery);

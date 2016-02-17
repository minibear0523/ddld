(function($) {
  $('.textarea').summernote({
    height: '900px',
    width: '100%',
    lang: 'zh-CN',
    callbacks: {
      onImageUpload: function(files) {
        uploadImageToServer(files[0]);
      },
      onMediaDelete: function(node, editor) {
        deleteImageFromServer(node.attr('filename'));
      }
    }
  });

  $('#tags.select2').select2({
    tags: true,
    theme: 'classic'
  });

  $('#checkbox.minimal-red').iCheck({
    checkboxClass: 'icheckbox_minimal-red',
    increaseArea: '20%'
  });

  /**
   * 上传图片到服务器
   */
  function uploadImageToServer(file) {
    var formData = new FormData();
    formData.append('file', file)
    NProgress.start();
    Messenger().ajax({
      successMessage: '上传成功',
      errorMessage: '上传失败, 请重试',
      progressMessage: '上传中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: '/uploads/news',
      type: 'POST',
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
      success: function(content, status, xhr) {
        if (status == 'success') {
          $('.textarea').summernote('insertImage', content.url, content.filename);
        }
      },
      complete: function() {
        NProgress.done();
      }
    })
  }

  /**
   * 删除图片
   */
  function deleteImageFromServer(filename) {
    var url = '/uploads/news/' + filename;
    Messenger().ajax({
      successMessage: '删除成功',
      errorMessage: '删除失败, 请重试',
      progressMessage: '删除中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: url,
      type: 'DELETE'
    });
  }

  /**
   * 解析NewsId
   */
  function parseNewsId() {
    var url = location.search;
    var newsId = undefined;
    var dict = new Object();
    if (url.indexOf('?') != -1) {
      var str = url.substr(1);
      var strs = str.split('&');
      for (var i = 0; i < strs.length; i++) {
        dict[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
      newsId = dict['id'];
    }
    return newsId;
  }

  function publishNews() {
    var title = $('#form-editor > input').val();
    var detail = $('.textarea').summernote('code');
    var source = $('#inputSource').val() || '大道隆达';
    var tags = $('#tags.select2').val();
    var kind = $('#kind').val();
    var published = Boolean($('div.icheckbox_minimal-red').attr('aria-checked'));
    if (!title || !detail || !source || !tags) {
      Messenger().error({
        message: '信息不完整, 请检查后重新提交',
        showCloseButton: false,
        hideAfter: 3
      });
    } else {
      var data = {
        title: title,
        detail: detail,
        source: source,
        tags: tags,
        kind: kind,
        published: published
      }
      Messenger().ajax({
        successMessage: '提交成功',
        errorMessage: '提交失败, 请重试',
        progressMessage: '提交中...',
        showCloseButton: false,
        hideAfter: 3
      }, {
        url: '/news',
        type: 'POST',
        data: data,
        success: function(url) {
          location.replace('/dashboard/news');
        }
      });
    }
  }

  /**
   * 更新已有新闻的详情
   */
  function updateNewsDetail(newsId) {
    var url = '/news?id=' + newsId;
    $.get(url, function(news, status, xhr) {
      if (status == 'success') {
        $('#form-editor > input').val(news.title);
        var rootNode = document.createElement('div')
        rootNode.innerHTML = news.detail;
        for (var i = 0; i < rootNode.childNodes.length; i++) {
          $('.textarea').summernote('insertNode', rootNode.childNodes[i]);
        }
        $('#kind').val(news.kind);
        $('#tags').val(news.tags).trigger('change');
        $('#checkbox').iCheck('check');
      }
    });
  }

  $(function() {
    if (parseNewsId()) {
      updateNewsDetail(parseNewsId());
    }
  });
})(window.jQuery);
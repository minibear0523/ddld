(function($) {
  'use strict'

  $('#delete-image-btn').on('click', function(e) {
    e.preventDefault();
    var url = e.target.parentElement.href;
    var urlRegExp = new RegExp('\/certifications\/images\/([a-zA-Z0-9_.]*)');
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

  /**
   * javascript-load-image插件相关函数
   */
  var result = $('#result');
  var currentFile;
  function replaceResults (img) {
    var content;
    if (!(img.src || img instanceof HTMLCanvasElement)) {
      content = $('<span>加载图片失败</span>');
    } else {
      content = $('<a target="_blank">').append(img)
        .attr('download', currentFile.name)
        .attr('href', img.src || img.toDataURL());
    }
    result.children().replaceWith(content);
  }

  /**
   * 上传图片相关函数
   */
  // var videoResult = $('#video-result');
  // var currentVideoFile;
  // function replaceVideoResults(video) {
  //   // 模仿replaceResults函数, 替换video内容
  //   var content;
  //   if (!(video.src || video instanceof HTMLCanvasElement)) {
  //     content = $('<span>加载视频失败</span>')
  //   } else {
  //     content = $('<a target="_blank"').append(video)
  //       .attr('src', video.src || video.toDataURL());
  //   }
  //   videoResult.children().replaceWith(content);
  // }

  function displayImage (file, options) {
    currentFile = file
    if (!loadImage(
        file,
        replaceResults,
        options
      )) {
      result.children().replaceWith(
        $('<span>Your browser does not support the URL or FileReader API.</span>')
      );
    }
  }

  function dropChangeHandler(e) {
    e.preventDefault();
    e = e.originalEvent;
    var target = e.dataTransfer || e.target;
    var file = target && target.files && target.files[0];
    var options = {
      maxWidth: result.width(),
      canvas: true,
      pixelRatio: window.devicePixelRatio,
      downsamplingRatio: 0.5
    };
    if (!file) return;
    loadImage.parseMetaData(file, function(data) {
      displayImage(file, options);
    });
  }

  /**
   * 上传图片的请求监听器
   */
  function submitHandler(e) {
    e.preventDefault();
    var url = '/uploads/intro';
    // 使用formData对象进行上传, 因为multer只能接收'multipart/form-data'格式的数据
    var data = new FormData($('#fileupload')[0]);
    Messenger().ajax({
      successMessage: '上传成功',
      errorMessage: '上传失败, 请重试',
      progressMessage: '上传中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: url,
      type: 'POST',
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      success: function() {
        // 处理成功之后的逻辑: 清楚result内的数据, 然后隐藏modal
        location.reload();
      }
    });
  }

  /**
   * 为input按钮添加事件监听器
   */
  $('#file-input').on('change', dropChangeHandler);
  $('#submit-btn').on('click', submitHandler);
}(jQuery));

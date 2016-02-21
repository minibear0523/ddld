(function($) {
  function parsePlatformId() {
    var url = location.search;
    var platformId = undefined;
    var dict = new Object();
    if (url.indexOf('?') != -1) {
      var str = url.substr(1);
      var strs = str.split('&');
      for (var i = 0; i < strs.length; i++) {
        dict[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
      platformId = dict['id'];
    }

    return platformId;
  }

  function getPlatformDetail() {
    var url = '/platform?id=' + parsePlatformId();
    $.get(url, function(platform, status, _) {
      if (status == 'success') {
        $('#inputName').val(platform.name);
        $('#inputIntro').val(platform.intro);
      }
    });
  }

  function deletePlatform() {
    var url = '/platform?id=' + parsePlatformId();
    Messenger().ajax({
      successMessage: '删除成功',
      errorMessage: "删除失败, 请重试",
      progressMessage: '删除中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: url,
      type: 'DELETE',
      success: function() {
        location.href = '/dashboard/platforms'
      }
    });
  }

  function submitPlatform() {
    var url = '/platform';
    if (parsePlatformId()) {
      url += '?id=' + parsePlatformId();
    }
    var data = {
      name: $('#inputName').val(),
      intro: $('#inputIntro').val()
    };
    Messenger().ajax({
      successMessage: '提交成功',
      errorMessage: '提交失败, 请重试',
      progressMessage: '提交中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: url,
      type: 'POST',
      data: data,
      success: function() {
        location.href = '/dashboard/platforms';
      }
    });
  }


  $(function() {
    if (parsePlatformId()) {
      getPlatformDetail();
    }
    $('#delete-btn').on('click', function(e) {
      e.preventDefault();
      deletePlatform();
    });
    $('#submit-btn').on('click', function(e) {
      e.preventDefault();
      submitPlatform();
    })
  });
}(jQuery));
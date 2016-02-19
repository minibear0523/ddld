(function($) {

  function parseEmploymentId() {
    var url = location.search;
    var employment = new Object();
    var employmentId = undefined;
    if (url.indexOf('?') != -1) {
      var str = url.substr(1);
      var strs = str.split('&');
      for (var i = 0; i < strs.length; i++) {
        employment[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
      employmentId = employment['id'];
    }

    return employmentId;
  }

  /**
   * 发布招聘信息
   */
  function publishEmployment() {
    var employmentId = parseEmploymentId();
    var url = '/employment';
    if (employmentId) {
      url = url + '?id=' + employmentId;
    }
    var title = $('#inputTitle').val();
    var requirement = $('#inputRequirement').val();
    var duty = $('#inputDuty').val();
    var data = {
      title: title,
      requirement: requirement,
      duty: duty
    };
    Messenger().ajax({
      successMessage: "提交成功",
      errorMessage: '提交失败, 请重试',
      progressMessage: '提交中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: url,
      type: 'POST',
      data: data,
      success: function(result) {
        location.replace('/dashboard/employment');
      }
    });
  }

  /**
   * 获取招聘信息详情
   */
  function getEmploymentDetail() {
    var employmentId = parseEmploymentId();
    var url = '/employment/detail?id=' + employmentId;
    $.get(url, function(employment, status, _) {
      if (status == 'success') {
        $('#inputTitle').val(employment.title);
        $('#inputRequirement').val(employment.requirement.join('\n'));
        $('#inputDuty').val(employment.duty.join('\n'));
      }
    });
  }

  /**
   * 删除招聘信息
   */
  function deleteEmployment() {
    var employmentId = parseEmploymentId();
    var url = '/employment?id=' + employmentId;
    Messenger().ajax({
      successMessage: '删除成功',
      errorMessage: '删除失败, 请重试',
      progressMessage: '删除中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: url,
      type: 'DELETE',
      success: function(result) {
        location.replace('/dashboard/employment');
      }
    });
  }

  $(function() {
    $('#submit-btn').on('click', function(e) {
      e.preventDefault();
      publishEmployment();
    });

    $('#delete-btn').on('click', function(e) {
      e.preventDefault();
      deleteEmployment();
    });

    if (parseEmploymentId()) {
      getEmploymentDetail();
    }
  });
})(window.jQuery);
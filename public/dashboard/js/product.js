(function($) {

  if ($('#inputSubKind').length > 0) {
    var $subKindSelect2 = $('#inputSubKind.select2').select2({
      minimumResultsForSearch: Infinity,
      tags: true,
      theme: 'classic'
    });
  }

  /**
   * 根据URL解析得到产品ID
   */
  function parseProductId() {
    var url = location.search;
    var productId = undefined;
    var dict = new Object();
    if (url.indexOf('?') != -1) {
      var str = url.substr(1);
      var strs = str.split('&');
      for (var i = 0; i < strs.length; i++) {
        dict[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
      productId = dict['id'];
    }
    return productId;
  }

  /**
   * 根据页面的结构分析产品的分类
   */
  function parseProductKind() {
    var kind = '';
    if ($('#form-transfer').length > 0) {
      kind = 'transfer';
    } else if ($('#form-merchant').length > 0) {
      kind = 'merchant';
    }
    return kind;
  }

  /**
   * 提交新的产品或更新已有产品
   */
  function submitProduct(kind) {
    var productId = parseProductId();
    var url = '/products/product';
    if (productId) {
      url = url + '/' + productId;
    }
    console.log(url);
    var name = $('#inputName').val();
    var nameCo = $('#inputNameCo').val();
    var detail = $('#inputDetail').val();
    var data = {
      name: name,
      detail: detail,
      kind: kind
    };
    if (nameCo) {
      data['name_co'] = nameCo;
    } else {
      data['name_co'] = "";
    }
    if ($('#inputSubKind').length > 0) {
      data['sub_kind'] = $('#inputSubKind').val()
    } else {
      data['sub_kind'] = '';
    }
    Messenger().ajax({
      successMessage: '提交成功',
      errorMessage: '提交失败, 请重试',
      progressMessage: '发布中...',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: url,
      type: 'POST',
      data: data,
      success: function(content) {
        var kind = parseProductKind();
        location.href = '/dashboard/products/' + kind;
      }
    });
  }

  /**
   * 获取已有产品的详情, 更新页面
   */
  function getProductDetail(productId) {
    var url = '/products/product?id=' + productId;
    $.get(url, function(product, status, xhr) {
      if (status == 'success') {
        $('#inputName').val(product.name);
        $('#inputNameCo').val(product.nameCo);
        $('#inputDetail').val(product.detail);
        if (parseProductKind() == 'merchant') {
          $('#inputSubKind').val(product.sub_kind).trigger('change');
        }
      }
    })
  }

  /**
   * 删除已有产品
   */
  function deleteProduct() {
    var url = '/products/product?id=' + parseProductId();
    Messenger().ajax({
      successMessage: '产品已删除',
      errorMessage: '删除失败, 请重试',
      progressMessage: '删除中, 请稍后',
      retry: false,
      showCloseButton: false,
      hideAfter: 3
    }, {
      url: url,
      type: 'DELETE',
      success: function(content) {
        location.href = '/dashboard/products/' + parseProductKind();
      }
    });
  }

  $(function() {
    if ($('#form-transfer').length > 0) {
      $('#submit-btn').on('click', function(e) {
        e.preventDefault();
        submitProduct('transfer');
      })
    } else if ($('#form-merchant').length > 0) {
      $('#submit-btn').on('click', function(e) {
        e.preventDefault();
        submitProduct('merchant');
      })
    }

    if (parseProductId()) {
      getProductDetail(parseProductId());
      $('#delete-btn').on('click', function(e) {
        e.preventDefault();
        deleteProduct();
      })
    }
  });
})(window.jQuery);
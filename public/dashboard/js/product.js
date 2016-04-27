(function($) {
  if (parseProductKind() == 'transfer') {
    $('#inputIntroduction').summernote({
      height: '200px',
      width: '100%',
      lang: 'zh-CN'
    });

    $('#inputMarket').summernote({
      height: '200px',
      width: '100%',
      lang: 'zh-CN'
    });

    $('#inputIntellectualProperty').summernote({
      height: '200px',
      width: '100%',
      lang: 'zh-CN'
    });
  } else if (parseProductKind() == 'merchant') {
    $('#inputManual').summernote({
      height: '500px',
      width: '100%',
      lang: 'zh-CN'
    });
  }

  if ($('#inputKind').length > 0) {
    var $subKindSelect2 = $('#inputKind.select2').select2({
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
      url = url + '?id=' + productId;
    }
    console.log(url);
    var data = {};
    if (parseProductKind() == 'merchant') {
      data = {
        type: 'merchant',
        name: $('#inputName').val(),
        name_co: $('#inputNameCo').val(),
        abstract: $('#inputAbstract').val(),
        specification: $('#inputSpecification').val(),
        package: $('#inputPackage').val(),
        wholesale_price: $('#inputWholesalePrice').val(),
        investment_price: $('#inputInvestmentPrice').val(),
        production_company: $('#inputProductionCompany').val(),
        manual: $('#inputManual').summernote('code'),
        other: $('#inputOther').val(),
        kind: $('#inputKind').val()
      }
    } else if (parseProductKind() == 'transfer') {
      data = {
        type: 'transfer',
        name: $('#inputName').val(),
        abstract: $('#inputAbstract').val(),
        registration_class: $('#inputRegistrationClass').val(),
        indication: $('#inputIndication').val(),
        specification: $('#inputSpecification').val(),
        advantage: $('#inputAdvantage').val(),
        transfer_target: $('#inputTransferTarget').val(),
        introduction: $('#inputIntroduction').summernote('code'),
        market: $('#inputMarket').summernote('code'),
        intellectual_property: $('#inputIntellectualProperty').summernote('code'),
        other: $('#inputOther').val(),
        kind: $('#inputKind').val()
      }
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
    var url = '/products/product/' + parseProductKind() + '?id=' + productId;
    $.get(url, function(product, status, xhr) {
      if (status == 'success') {
        if (parseProductKind() == 'merchant') {
          $('#inputName').val(product.name);
          $('#inputNameCo').val(product.nameCo);
          $('#inputAbstract').val(product.abstract);
          $('#inputSpecification').val(product.specification);
          $('#inputPackage').val(product.package);
          $('#inputWholesalePrice').val(product.wholesale_price);
          $('#inputInvestmentPrice').val(product.investment_price);
          $('#inputProductionCompany').val(product.production_company);
          $('#inputOther').val(product.other);
          $('#inputKind').val(product.kind).trigger('change');
          var manualNode = document.createElement('div');
          manualNode.innerHTML = product.manual;
          for (var i = 0; i < manualNode.childNodes.length; i++) {
            $('#inputManual') .summernote('insertNode', manualNode.childNodes[i]);
          }
        } else if (parseProductKind() == 'transfer') {
          $('#inputName').val(product.name);
          $('#inputAbstract').val(product.abstract);
          $('#inputSpecification').val(product.specification);
          $('#inputRegistrationClass').val(product.registration_class);
          $('#inputIndication').val(product.indication);
          $('#inputAdvantage').val(product.advantage);
          $('#inputTransferTarget').val(product.transfer_target);
          $('#inputOther').val(product.other);
          $('#inputKind').val(product.kind).trigger('change');
          var introductionNode = document.createElement('div');
          introductionNode.innerHTML = product.introduction;
          for (var i = 0; i < introductionNode.childNodes.length; i++) {
            $('#inputIntroduction') .summernote('insertNode', introductionNode.childNodes[i]);
          }
          var marketNode = document.createElement('div');
          marketNode.innerHTML = product.market;
          for (var i = 0; i < marketNode.childNodes.length; i++) {
            $('#inputMarket') .summernote('insertNode', marketNode.childNodes[i]);
          }
          var intellectualPropertyNode = document.createElement('div');
          intellectualPropertyNode.innerHTML = product.intellectual_property;
          for (var i = 0; i < intellectualPropertyNode.childNodes.length; i++) {
            $('#inputIntellectualProperty') .summernote('insertNode', intellectualPropertyNode.childNodes[i]);
          }
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

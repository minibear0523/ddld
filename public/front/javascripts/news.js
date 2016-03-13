(function($) {
  /**
   * 异步获取tags
   */
  function getTags() {
    var url = '/news/tags';
    $.get(url, function(tags, status, _) {
      if (status == 'success') {
        var tagsRootNode = document.getElementById('tags-list');
        var tagTemplateNode = tagsRootNode.firstElementChild;
        for (var i = 0; i < tags.length; i++) {
          var tagNode = tagTemplateNode.cloneNode(true);
          tagNode.removeAttribute('style');
          var aNode = tagNode.firstElementChild;
          aNode.innerHTML = tags[i];
          tagsRootNode.appendChild(tagNode);
        }
      }
    });
  }

  $(function(){
    getTags();
  });
}(jQuery));

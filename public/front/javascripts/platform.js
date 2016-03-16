(function($) {
  function getSlideShare() {
    // var url = 'http://www.slideshare.net/api/oembed/2?url=http://www.slideshare.net/Shadowdai/ss-59612739&format=json';
    // $.get(url, function(data) {
    //   var body = $('#collapse4 > div');
    //   var html = data['html'];
    //   body.prepend(html);
    // });
    
    var html =  '<div style="text-align:center;"><iframe src="https://www.slideshare.net/slideshow/embed_code/key/3mADqQo6dQwCna" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="https://www.slideshare.net/Shadowdai/ss-59612739" title="仿制药一致性评价业务介绍" target="_blank">仿制药一致性评价业务介绍</a> </strong> from <strong><a target="_blank" href="http://www.slideshare.net/Shadowdai">大道隆达</a></strong> </div></div>';
    var body = $('#collapse4 > div');
    body.prepend(html);
  }

  $(document).ready(function() {
    getSlideShare();
  })
}(jQuery));

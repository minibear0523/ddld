(function($){
	function googleTranslateElementInit() {
		new google.translate.TranslateElement({
			pageLanguage: 'zh-CN', 
			includedLanguages: 'en', 
			layout: google.translate.TranslateElement.InlineLayout.SIMPLE
		}, 'google_translate_element');
	}

	$(function() {

    "use strict";

    // ROUTER
	var pathname = location.pathname;
	var page = pathname.slice(1, pathname.length).split('/')[0];
	page = page.length > 0 ? page : 'home';
	var hash = location.hash;

	var navbar = $('#nav').find('.navbar-nav');

	navbar.find('li.'+page).addClass('active');

	// REMOVE # FROM URL
	$( 'a[href="#"]' ).click( function(e) {
		e.preventDefault();
	});

	// CAMERA SLIDER
	$("#camera_wrap_1").camera({
		alignment: 'center',
		autoAdvance: false,
		mobileAutoAdvance: true,
		barDirection: 'leftToRight',
		barPosition: 'bottom',
		loader: 'none',
		opacityOnGrid: false,
		cols: 12,
		height: '31%',
		playPause: false,
		pagination: false,
		time: 7000,
		imagePath: '/plugins/camera/images/'
	});

	// NEWS CAROUSEL
	$("#news-carousel, #comments-carousel, #products-carousel").carousel({
		interval: false
	});

	// ACCORDION
	var toggleActive = function(event) {
		// find panel-heading
		$(event.target).prev()
		// toggle active class
		.toggleClass('active')
		// toggle sign
		.find('.fa').toggleClass('fa-plus fa-minus');
	};

	$("#accordion, #accordion-faqs")
	.on("show.bs.collapse hide.bs.collapse", toggleActive);

	// plarform submenu toggle content collapse
	if (page === 'platform') {
		var mainContainerOffset = $('.main-container').offset();
		var $this, href;

		$('.platform').find('.dropdown-menu').find('a').each(function (index) {
			$this = $(this);
			href = '#' + $this.attr('href').split('#')[1];

			$this
			// update platform submenu to trigger the collapse
			.attr({
				'data-toggle': 'collapse',
				'data-parent': '#accordion-faqs',
				'href': href
			})
			// scroll to the content
			.on('click', function(event) {
				$('body').animate({
					scrollTop: mainContainerOffset.top,
				}, 500);
			});
		})

		// simulate click to open the 
		if (hash.length > 0) {
			// save active accodtion id into history
			var state = {
				hash: hash,
				url: location.url
			};
			history.pushState(state, 'platform', '');
		} else {
			hash = '#collapse0';
		}

		// TODO: find a way to replace the click event,
		// which might not functional on mobile platform
		$('.panel-title').find('a[href=' + hash + ']').trigger('click');
	}

	// broswer back button handler
	window.onpopstate = function(event) {
		if ((page === 'platform') && (hash.length > 0)) {
			// back again if hash is shown in address bar
			history.back();
		}
	};

	// DOCTORS FILTERS
	var $grid = $('#products-grid');
	$grid.shuffle({
		itemSelector: '.products-grid', // the selector for the items in the grid
		speed: 500 // Transition/animation speed (milliseconds)
	});
	/* reshuffle when user clicks a filter item */
	$('#products-filter li a').click(function (e) {
		// set active class
		$('#products-filter li a').removeClass('active');
		$(this).addClass('active');
		// get group name from clicked item
		var groupName = $(this).attr('data-group');
		// reshuffle grid
		$grid.shuffle('shuffle', groupName );
	});

	//MAGNIFIC POPUP
	$('.gallery-grid').magnificPopup({
		delegate: 'a.zoom',
		type: 'image',
		gallery: {
			enabled: true
		}
	});
	Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-top',
    theme: 'flat'
  }
  
	// Newsletter SignUp Form
	$('#newsletter-signup-form > btn').click(function(e) {
		e.preventDefault();
		var url = '/newsletter/signup';
		var data = $('#newsletter-signup-form').serialize();
		$.post(url, data, function(result, status, _) {
			if (status == 'success') {
				Messenger().success({
					message: result,
					hideAfter: 3,
					showCloseButton: false
				});
			} else {
				Messenger().error({
					message: result,
					hideAfter: 3,
					showCloseButton: false
				});
			}
		});
	});
});
}(jQuery))

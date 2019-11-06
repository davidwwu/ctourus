'use strict'

var mySwiper;

$(function() {
  $('section#pricing-details table').addClass('scroll');

  var slideImages = $('.swiper-container .swiper-wrapper img');
  mySwiper = new Swiper ('.swiper-container', {
    on: {
      init: function() {
        $('.swiperControl a').eq(0).addClass('active');
      }
    },
    loop: slideImages.length > 1 ? true : false,
    // spaceBetween: 25,
    centeredSlides: true,
    autoplay: slideImages.length > 1 ? { delay: 2000 } : false,
  });

  mySwiper.on('slideChangeTransitionStart', function() {
    $('.swiperControl a').removeClass('active');
    $('.swiperControl a').eq(mySwiper.activeIndex).addClass('active');
  });

  $('.swiper-container').mouseenter(function(){
    mySwiper.autoplay.stop();
  }).mouseleave(function(){
    mySwiper.autoplay.start();
  });

  $('.swiperControl a').hover(function(){
    var _index = $(this).data('index');
    mySwiper.slideTo(_index);
  });

  // if no swiper-slide class is present inside highlight-container
  // we wrap each image with a swiper-slide class div
  // if($('.highlight-container .swiper-slide').length === 0) {
  //   slideImages.each(
  //     function(index) {
  //       $(this).wrap('<div class="swiper-slide"><a data-fancybox="slide" href="'+ $(this).attr('src') +'"></a></div>');
  //     }
  //   );
  // }
  
  // build query string based on filter and then redirect page to the url
  $('.filter input').on('click', function() {
    var query = {};
    var tourList = document.documentElement.dataset.tourList;
    $('.filter input:checked').each(function(e) {
      if($(this).val() !== 'all' && $(this).attr('name') !== 'starting_price')
        query[$(this).attr('name')] = $(this).val();
      else if($(this).val() !== 'all' && $(this).attr('name') === 'starting_price') {
        query[$(this).attr('name')] = $(this).val().split(',');
      }
    });
    var queryString = $.param(query);
    if(queryString.length !== 0)
      queryString = '?'+queryString;
    window.location.href = '/tours/'+tourList+queryString;
  });
  
  $("ul li .is-active").parent().addClass("hovered");

  // front-page menu/list
  var hotProTimer;
  var _hotProIndex = 0;
  $('.hotPro .tab li').click(function(){
      var _index = $(this).data('index');
      $(this).addClass('active').siblings().removeClass('active');
      $('.hotPro .tabCon').eq(_index).removeClass('hidden').siblings('.tabCon').addClass('hidden')
      _hotProIndex = _index;
  })
  $('.hotPro').hover(function(){
      clearInterval(hotProTimer)
  }, function(){
      hotPro();
  })
  function hotPro(){
      hotProTimer = setInterval(function(){
          $('.hotPro .tab li').eq(_hotProIndex).addClass('active').siblings().removeClass('active');
          $('.hotPro .tabCon').eq(_hotProIndex).removeClass('hidden').siblings('.tabCon').addClass('hidden')
          _hotProIndex++;
          if(_hotProIndex == 4){
              _hotProIndex = 0
          }
      }, 4000)
  }
  hotPro();
});


'use strict'

var mySwiper;

$(function() {
  $('section#pricing-details table').addClass('scroll');

  // if no swiper-slide class is present inside highlight-container
  // we wrap each image with a swiper-slide class div
  if($('.highlight-container .swiper-slide').length === 0) {
    $('.highlight-container .swiper-container .swiper-wrapper img').wrap('<div class="swiper-slide"></div>');
  }

  mySwiper = new Swiper ('.swiper-container', {
    loop: true,
    spaceBetween: 25,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
    },
  });
  
  // build query string based on filter and then redirect page to the url
  $('.filter input').on('click', function() {
    var query = {};
    var tourList = document.documentElement.dataset.tourList;
    $('.filter input:checked').each(function(e) {
      if($(this).val() != 'all' && $(this).attr('name') != 'starting_price')
        query[$(this).attr('name')] = $(this).val();
      else if($(this).val() != 'all' && $(this).attr('name') == 'starting_price') {
        query[$(this).attr('name')] = $(this).val().split(',');
      }
    });
    var queryString = $.param(query);
    if(queryString.length != 0)
      queryString = '?'+queryString;
    window.location.href = '/tours/'+tourList+queryString;
  });
  
  $("ul li .is-active").parent().addClass("hovered");
});


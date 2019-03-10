var mySwiper = new Swiper ('.swiper-container', {
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
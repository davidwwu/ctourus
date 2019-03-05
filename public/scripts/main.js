// $(document).foundation();
var mySwiper = new Swiper ('.swiper-container', {
  // Optional parameters
  loop: true,
  spaceBetween: 25,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
  },
});

$('.filter input').on('click', function() {
  var query = {};
  var title = document.documentElement.dataset.tourList;
  $('.filter input:checked').each(function(e) {
    if($(this).val() != 'all')
      query[$(this).attr('name')] = $(this).val();
  });
  var queryString = $.param(query);
  window.location.href = '/tours/'+title+'?'+queryString;
});
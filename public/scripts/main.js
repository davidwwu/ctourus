$(document).foundation();
var mySwiper = new Swiper ('.swiper-container', {
  // Optional parameters
  loop: true,
  spaceBetween: 25,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
  },
});
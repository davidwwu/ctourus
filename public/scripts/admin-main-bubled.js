'use strict'

var tinymce,
    mySwiper;
$(function() {
  var slideImages = $('.highlight-container .swiper-container .swiper-wrapper img');
  // if no swiper-slide class is present inside highlight-container
  // we wrap each image with a swiper-slide class div
  if($('.highlight-container .swiper-slide').length === 0) {
    slideImages.wrap('<div class="swiper-slide"></div>');
  }
  
  mySwiper = new Swiper ('.swiper-container', {
    loop: slideImages.length > 1 ? true : false,
    spaceBetween: 25,
    centeredSlides: true,
    autoplay: slideImages.length > 1 ? { delay: 5000 } : false,
  });

  $('#duration').val($('.trip-day').length);
  
  // document.getElementById('mainForm').addEventListener('submit', function(e) {
  //   e.preventDefault();
  //   console.log(document.getElementsByTagName('input'));
  // });

  initTinymce();
});

var initTinymce = function(reinit) {
  if(reinit) { tinymce.remove(); }

  if($('.editable-header').length > 0) {
    tinymce.init({
      selector: '.editable-header',
      menubar: false,
      inline: true,
      browser_spellcheck: true,
      contextmenu: true,
      entity_encoding : "raw",
      plugins: "powerpaste",
      toolbar: 'undo redo | formatselect fontsizeselect | bold italic underline',
    });
  }

  if($('.editable-block').length > 0) {
    tinymce.init({
      selector: '.editable-block',
      menubar: false,
      inline: true,
      browser_spellcheck: true,
      contextmenu: true,
      entity_encoding : "raw",
      plugins: "table powerpaste lists advlist insertdatetime code",
      table_appearance_options: false,
      toolbar: "undo redo | formatselect fontsizeselect code | cut copy paste pastetext removeformat | bold italic underline strikethrough | alignleft aligncenter alignright | forecolor backcolor | bullist numlist | outdent indent | table"
    });
  }

  if($('.editable-thumbnails').length > 0) {
    var today = new Date(Date.now());
    tinymce.init({
      selector: '.editable-thumbnails',
      menubar: false,
      inline: true,
      contextmenu: true,
      entity_encoding: "raw",
      plugins: "image tinydrive",
      tinydrive_token_provider: '/jwt',
      tinydrive_upload_path: ("/" + (today.getFullYear()) + (today.getMonth()+1 >= 10 ? today.getMonth()+1 : '0'+(today.getMonth()+1)) + (today.getDate())),
      file_picker_types: 'image',
      images_reuse_filename: true,
      toolbar: "image"
    });
  }
}

$('#trip-details').on('click', '.addNewDay', function(e) {
  $(this).closest(".trip-day").after("\n<div id=\"new-day\" class=\"trip-day\">\n  <div class=\"option-btn-group\">\n    <label>Options</label>\n    <button class=\"button addNewDay\" type=\"button\">增加行程</button>\n    <button class=\"button removeDay\" type=\"button\">移除行程</button>\n  </div>\n  <div class=\"trip-day-title\">\n    <div class=\"date-title-icon\">D#</div>\n    <h4 class=\"editable-header\">Some title</h4>\n  </div>\n  <div class=\"trip-content-container\">\n    <div class=\"trip-day-description\">\n      <i class=\"other-icon material-icons\">location_on</i>\n      <div class=\"editable-block\">Some description</div>\n    </div>\n    <div class=\"trip-day-photos\"><i class=\"other-icon material-icons\">camera_alt</i>\n      <div class=\"sight-container\"><span>途徑景點：</span>\n        <div class=\"thumbnails editable-thumbnails\"></div>\n      </div>\n    </div>\n    <div class=\"trip-day-hotel\"><i class=\"other-icon material-icons\">hotel</i>\n      <div class=\"editable-block\">Some hotel</div>\n    </div>\n  </div>\n  <div class=\"separator thin\"></div>\n</div>");
  // update duration
  $('#duration').val($('.trip-day').length);

  Foundation.SmoothScroll.scrollToLoc(
    '#new-day', 
    {
      'animation-duration': 800,
      'animation-easing': "swing",
      'threshold': 50,
      'offset': 60
    }, 
    function() {
      $('#new-day').removeAttr('id');
      // reindex ids
      $('.trip-day').each(function(index) {
        $(this).children('.trip-day-title').children('.date-title-icon').html('D'+(index+1));
        $(this).children('.trip-day-title').children('h4').attr('id', 'd'+index+'_title');
        $(this).children('.trip-content-container').children('.trip-day-description').children('div').attr('id', 'd'+index+'_description');
        $(this).children('.trip-content-container').children('.trip-day-hotel').children('div').attr('id', 'd'+index+'_stay');
      })
      initTinymce(true);
    });
});

$('#trip-details').on('click', '.removeDay', function(e) {
  $(this).closest(".trip-day").remove();
  $('#duration').val($('.trip-day').length);
  $('.trip-day').each(function(index) {
    $(this).children('.trip-day-title').children('.date-title-icon').html('D'+(index+1));
    $(this).children('.trip-day-title').children('h4').attr('id', 'd'+index+'_title');
  });

  initTinymce(true);
})
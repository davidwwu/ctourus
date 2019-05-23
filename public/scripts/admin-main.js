'use strict'

var tinymce,
    mySwiper;
$(function() {
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
  $('#duration').val($('.trip-day').length);
  initTinymce();
});

var initTinymce = function(reinit) {
  if(reinit) tinymce.remove();

  if($('.editable-header').length > 0) {
    tinymce.init({
      selector: '.editable-header',
      menubar: false,
      inline: true,
      browser_spellcheck: true,
      contextmenu: true,
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
      plugins: "table powerpaste lists advlist insertdatetime code",
      table_appearance_options: false,
      toolbar: "undo redo | formatselect fontsizeselect code | cut copy paste pastetext removeformat | bold italic underline strikethrough | alignleft aligncenter alignright | forecolor backcolor | bullist numlist | outdent indent | table"
    });
  }

  if($('.editable-thumbnails').length > 0) {
    tinymce.init({
      selector: '.editable-thumbnails',
      menubar: false,
      inline: true,
      contextmenu: true,
      forced_root_block: '',
      plugins: "image tinydrive",
      tinydrive_token_provider: '/jwt',
      file_picker_types: 'image',
      images_reuse_filename: true,
      toolbar: "image"
    });
  }
}

$('#trip-details').on('click', '.addNewDay', function(e) {
  $(this).closest(".trip-day").after(`
<div id="new-day" class="trip-day">
  <div class="option-btn-group">
    <label>Options</label>
    <button class="button addNewDay" type="button">增加行程</button>
    <button class="button removeDay" type="button">移除行程</button>
  </div>
  <div class="trip-day-title">
    <div class="date-title-icon">D#</div>
    <h4 class="editable-header">Some title</h4>
  </div>
  <div class="trip-content-container">
    <div class="trip-day-description">
      <i class="other-icon material-icons">location_on</i>
      <div class="editable-block">Some description</div>
    </div>
    <div class="trip-day-photos"><i class="other-icon material-icons">camera_alt</i>
      <div class="sight-container"><span>途徑景點：</span>
        <div class="thumbnails editable-thumbnails"></div>
      </div>
    </div>
    <div class="trip-day-hotel"><i class="other-icon material-icons">hotel</i>
      <div class="editable-block">Some hotel</div>
    </div>
  </div>
  <div class="separator thin"></div>
</div>`);
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
'use strict'

$('#duration').val($('.trip-day').length);

var reInitTinymce = function() {
  tinymce.remove();

  tinymce.init({
    selector: '.editable-header',
    menubar: false,
    inline: true,
    browser_spellcheck: true,
    contextmenu: true,
    toolbar: 'undo redo | bold italic underline',
  });
  tinymce.init({
    selector: '.editable-block',
    menubar: false,
    inline: true,
    browser_spellcheck: true,
    contextmenu: true,
    plugins: "table powerpaste lists advlist insertdatetime",
    table_appearance_options: false,
    toolbar: "undo redo | cut copy paste pastetext removeformat | bold italic underline strikethrough | alignleft aligncenter alignright | forecolor backcolor | bullist numlist | table"
  });
}

$('#trip-details').on('click', '.addNewDay', function(e) {
  $(this).closest(".trip-day").after(`
<div id="new-day" class="trip-day">
  <div class="option-btn-group"><label>Options</label>
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
        <div class="thumbnails"></div>
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
      // TODO - image fix
      $('.trip-day').each(function(index) {
        $(this).children('.trip-day-title').children('.date-title-icon').html('D'+(index+1));
        $(this).children('.trip-day-title').children('h4').attr('id', 'd'+index+'_title');
        $(this).children('.trip-content-container').children('.trip-day-description').children('div').attr('id', 'd'+index+'_description');
        $(this).children('.trip-content-container').children('.trip-day-hotel').children('div').attr('id', 'd'+index+'_stay');
      })
      reInitTinymce();
    });
});

$('#trip-details').on('click', '.removeDay', function(e) {
  $(this).closest(".trip-day").remove();
  $('#duration').val($('.trip-day').length);
  $('.trip-day').each(function(index) {
    $(this).children('.trip-day-title').children('.date-title-icon').html('D'+(index+1));
    $(this).children('.trip-day-title').children('h4').attr('id', 'd'+index+'_title');
  });

  window.setTimeout(reInitTinymce(), 1000);
})
import {MDCRipple} from '@material/ripple';
import {MDCDialog} from '@material/dialog';


$(function() {
  const buttonRipple = [].map.call(document.querySelectorAll('.mdc-button'), function(el){
    return new MDCRipple(el)
  });
  const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
  
  dialog.listen('MDCDialog:opened', () => {
    console.log('opened');
  });

  $('#new-tour').on('click', function(e) {
    $('#my-dialog-title').text('新線路');
    $('#modal-form').attr('action', `/admin/create-tour`);
    $('#modal-is-highlight').prop('checked', false);
    $('#modal-tour-id').val('');
    $('#modal-tour-type').val('');
    $('#modal-title').val('');
    $('#modal-duration').val('');
    $('#modal-starting-price').val('');
    $('#modal-start-city').val('');
    $('#modal-end-city').val('');

    $('#modal-is-highlight, #modal-tour-id, #modal-title, #modal-duration, #modal-starting-price, #modal-start-city, #modal-end-city').prop('readonly', false);
    $('#modal-tour-type option').attr('disabled',false);
    
    dialog.open();
  });

  $('.copy-btn').on('click', function(e) {
    let { _id, is_highlight, tour_id, tour_type, name, duration, starting_price, start_city, end_city,  } = $(this).data('tour');
    let menu = $(this).data('menu');
    
    // TODO - make sure to safe check id
    $('#my-dialog-title').text('複製');
    $('#modal-form').attr('action', `/admin/${tour_id}/duplicate`);
    $('#modal-is-highlight').prop('checked', is_highlight);
    $('#modal-tour-id').val(`${tour_id}-COPY`);
    $('#modal-tour-type').val(tour_type);
    $('#modal-title').val(name);
    $('#modal-duration').val(duration);
    $('#modal-starting-price').val(starting_price);
    $('#modal-start-city').val(start_city);
    $('#modal-end-city').val(end_city);

    $('#modal-is-highlight, #modal-tour-id, #modal-title, #modal-duration, #modal-starting-price, #modal-start-city, #modal-end-city').prop('readonly', false);
    $('#modal-tour-type option').attr('disabled',false);
    $('#modal-tour-type option').each(function(index) {
      if($(this).val() === menu.permalink) $(this).prop('selected', true);
    })
    
    dialog.open();
  });

  $('.delete-btn').on('click', function(e) {
    let { _id, is_highlight, tour_id, tour_type, name, duration, starting_price, start_city, end_city } = $(this).data('tour');
    let menu = $(this).data('menu');

    $('#my-dialog-title').text('刪除');
    $('#modal-form').attr('action', `/admin/${tour_id}/delete`);
    $('#modal-is-highlight').prop('checked', is_highlight);
    $('#modal-tour-id').val(tour_id);
    $('#modal-tour-type').val(tour_type);
    $('#modal-title').val(name);
    $('#modal-duration').val(duration);
    $('#modal-starting-price').val(starting_price);
    $('#modal-start-city').val(start_city);
    $('#modal-end-city').val(end_city);

    $('#modal-is-highlight, #modal-tour-id, #modal-title, #modal-duration, #modal-starting-price, #modal-start-city, #modal-end-city').prop('readonly', true);
    $('#modal-tour-type option:not(:selected)').attr('disabled',true);
    $('#modal-tour-type option').each(function(index) {
      if($(this).val() === menu.permalink) $(this).prop('selected', true);
    })
    
    dialog.open();
  });
});

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

  $('.copy-btn').on('click', function(e) {
    let { _id, tour_id, tour_type, name, duration, starting_price, start_city } = $(this).data('tour');
    $('#my-dialog-title').text('複製');
    $('#modal-form').attr('action', `/admin/${tour_id}/duplicate`);
    $('#modal-tour-id').val(tour_id);
    $('#modal-tour-type').val(tour_type);
    $('#modal-title').val(name);
    $('#modal-duration').val(duration);
    $('#modal-starting-price').val(starting_price);
    $('#modal-start-city').val(start_city);
    
    dialog.open();
  });

  $('.delete-btn').on('click', function(e) {
    let { _id, tour_id, tour_type, name, duration, starting_price, start_city } = $(this).data('tour');
    $('#my-dialog-title').text('刪除');
    $('#modal-form').attr('action', `/admin/${tour_id}/delete`);
    $('#modal-tour-id').val(tour_id);
    $('#modal-tour-type').val(tour_type);
    $('#modal-title').val(name);
    $('#modal-duration').val(duration);
    $('#modal-starting-price').val(starting_price);
    $('#modal-start-city').val(start_city);

    $('#modal-tour-id, #modal-tour-type, #modal-title, #modal-duration, #modal-starting-price, #modal-start-city').prop('readonly', true);
    
    dialog.open();
  });
});
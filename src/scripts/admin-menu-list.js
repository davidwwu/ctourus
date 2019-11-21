import { MDCRipple } from '@material/ripple';
import { MDCDialog } from '@material/dialog';

// chinese sorting does not work - comment out for now
// $.extend( $.fn.dataTableExt.oSort, {
//   "chinese-string-asc" : function (s1, s2) {
//     return s1.localeCompare(s2);
//   },

//   "chinese-string-desc" : function (s1, s2) {
//     return s2.localeCompare(s1);
//   }
// } );

$(function () {
  let table = $('.main-list-table').DataTable({
    ajax: {
      url: '/api/tours/admin-dash/no-shopping',
      dataSrc: '',
    },
    columns: [
      { data: null, defaultContent: ':::', className: 'reorder' },
      { data: 'is_highlight' },
      { data: 'tour_id' },
      { data: 'menu_name' },
      { data: 'name' },
      { data: 'duration' },
      { data: 'starting_price' },
      { data: 'start_city' },
      { data: 'end_city' },
      {
        data: null,
        defaultContent: '<button class="tour-copy-btn mdc-button mdc-button--dense no-min-width"><i class="material-icons">file_copy</i></button>',
      },
      {
        data: 'tour_id',
        render: (tour_id) => `<button class="tour-edit-btn mdc-button mdc-button--dense no-min-width" onclick="window.location.href='/admin/${tour_id}/edit';"><i class="material-icons">edit</i></button>`,
      },
      {
        data: null,
        defaultContent: '<button class="tour-delete-btn mdc-button mdc-button--dense no-min-width"><i class="material-icons">delete_forever</i></button>',
      },
    ],
    rowReorder: {
      dataSrc: 1,
    },
    deferRender: true,
    scrollY: 400,
    scrollCollapse: true,
    paging: false,
  });
  table.on('row-reorder', (e, diff, edit) => {
    let result = `Reorder started on row: ${edit.triggerRow.data()[1]}<br>`;

    for (let i = 0, ien = diff.length; i < ien; i++) {
      let rowData = table.row(diff[i].node).data();

      result += `${rowData[1]} updated to be in position ${
        diff[i].newData} (was ${diff[i].oldData})<br>`;
    }

    $('#result').html(`Event result:<br>${result}`);
  });

  // dataTable checkbox sorting plugin
  $.fn.dataTable.ext.order['dom-checkbox'] = function (settings, col) {
    return this.api().column(col, { order: 'index' }).nodes().map((td, i) => ($('input', td).prop('checked') ? '1' : '0'));
  };

  const buttonRipple = [].map.call(document.querySelectorAll('.mdc-button'), (el) => new MDCRipple(el));
  const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));

  dialog.listen('MDCDialog:opened', () => {
    console.log('opened');
  });

  $('#new-tour').on('click', (e) => {
    $('#my-dialog-title').text('新線路');
    $('#modal-form').attr('action', '/admin/create-tour');
    $('#modal-is-highlight').prop('checked', false);
    $('#modal-tour-id').val('');
    $('#modal-tour-type').val('');
    $('#modal-title').val('');
    $('#modal-duration').val('');
    $('#modal-starting-price').val('');
    $('#modal-start-city').val('');
    $('#modal-end-city').val('');

    $('#modal-is-highlight, #modal-tour-id, #modal-title, #modal-duration, #modal-starting-price, #modal-start-city, #modal-end-city').prop('readonly', false);
    $('#modal-tour-type option').attr('disabled', false);

    dialog.open();
  });

  $('.main-list-table tbody').on('click', 'button.tour-copy-btn', function () {
    let { _id, is_highlight, tour_id, tour_type, name, duration, starting_price, start_city, end_city } = table.row($(this).parents('tr')).data();
    // let menu = $(this).data('menu');

    // TODO - make sure to safe check id
    $('#my-dialog-title').text('複製線路');
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
    $('#modal-tour-type option').attr('disabled', false);
    $(`#modal-tour-type option:eq(${tour_type})`).prop('selected', true);

    dialog.open();
  });

  $('.main-list-table tbody').on('click', 'button.tour-delete-btn', function () {
    let { _id, is_highlight, tour_id, tour_type, name, duration, starting_price, start_city, end_city } = table.row($(this).parents('tr')).data();
    let menu = $(this).data('menu');

    $('#my-dialog-title').text('刪除線路');
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
    $('#modal-tour-type option:not(:selected)').attr('disabled', true);
    $(`#modal-tour-type option:eq(${tour_type})`).prop('selected', true);

    dialog.open();
  });

  $('#new-static-page').on('click', (e) => {
    $('#my-dialog-title').text('新靜態頁面');
    $('#modal-form').attr('action', '/admin/create-static-page');
    $('#modal-order').val('');
    $('#modal-title').val('');
    $('#modal-permalink').val('');

    $('#modal-order, #modal-title, #modal-permalink').prop('readonly', false);

    dialog.open();
  });

  $('.static-page-quick-edit').on('click', function (e) {
    let { _id, order, name, permalink } = $(this).data('static-page');

    $('#my-dialog-title').text('快速編輯');
    $('#modal-form').attr('action', `/admin/static-pages/${permalink}/quick-edit`);
    $('#modal-order').val(order);
    $('#modal-title').val(name);
    $('#modal-permalink').val(permalink);

    $('#modal-order, #modal-title, #modal-permalink').prop('readonly', false);

    dialog.open();
  });

  $('.static-page-delete').on('click', function (e) {
    let { _id, order, name, permalink } = $(this).data('static-page');

    $('#my-dialog-title').text('刪除靜態頁面');
    $('#modal-form').attr('action', `/admin/static-pages/${permalink}/delete`);
    $('#modal-order').val(order);
    $('#modal-title').val(name);
    $('#modal-permalink').val(permalink);

    $('#modal-order, #modal-title, #modal-permalink').prop('readonly', true);

    dialog.open();
  });
});

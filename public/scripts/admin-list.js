const MDCRipple = mdc.ripple.MDCRipple;
const MDCDialog = mdc.dialog.MDCDialog;


// DataTable checkbox sorting plugin
$.fn.dataTable.ext.order['dom-checkbox'] = function (settings, col) {
  return this.api().column(col, { order: 'index' }).nodes().map((td, i) => ($('input', td).prop('checked') ? '1' : '0'));
};

// Apply ripple effect to MDC buttons
const buttonRipple = [].map.call(document.querySelectorAll('.mdc-button'), (el) => new MDCRipple(el));
const dialogArr = [].map.call(document.querySelectorAll('.mdc-dialog'), (el) => new MDCDialog(el));
// dialog.listen('MDCDialog:opened', () => {
//   console.log('opened');
// });

$(function () {
  // tour list admin page
  if($('html').data('page') === 'tours') {
    $('.tour-list-table').each(function(index) {
      let table = $(this)
        .on('init.dt', function () {
          [].map.call($(this).find('.mdc-button'), (el) => new MDCRipple(el));
        })
        .DataTable({
          ajax: {
            url: `/api/tours/admin-dash/${$(this).data('permalink')}`,
            dataSrc: '',
          },
          columns: [
            {
              data: null,
              defaultContent: ':::',
              className: 'reorder'
            },
            {
              data: 'is_highlight',
              render: (is_highlight) => `<input class="position-static form-check-input" type="checkbox" ${is_highlight ? 'checked' : ''} readonly/>`,
              className: 'align-center',
            },
            { data: 'tour_id' },
            { data: 'menu_name'},
            { data: 'name' },
            {
              data: 'duration',
              className: 'align-right',
            },
            {
              data: 'starting_price',
              render: (starting_price) => `$${starting_price}`,
              className: 'align-right',
            },
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
          scrollY: 400,
          scrollCollapse: true,
          paging: false,
        });
      table.on('row-reorder', (e, diff, edit) => {
        let result = `Reorder started on row: ${edit.triggerRow.data()[1]}<br>`;
    
        for (let i = 0, ien = diff.length; i < ien; i++) {
          let rowData = table.row(diff[i].node).data();
    
          result += `${rowData[1]} updated to be in position ${diff[i].newData} (was ${diff[i].oldData})<br>`;
        }
    
        $('#result').html(`Event result:<br>${result}`);
      });
  
      $('.new-tour').on('click', function (e) {
        let permalink = $(this).data('permalink');
    
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
        $('#modal-tour-type').val(permalink);
    
        dialogArr[0].open();
      });
    
      $('.tour-list-table tbody').on('click', 'button.tour-copy-btn', function () {
        if(table.row($(this).parents('tr')).data()) {
          let { _id, is_highlight, tour_id, tour_type, name, duration, starting_price, start_city, end_city } = table.row($(this).parents('tr')).data();
      
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
          $('#modal-tour-type').val(tour_type);
      
          dialogArr[0].open();
        }
      });
    
      $('.tour-list-table tbody').on('click', 'button.tour-delete-btn', function () {
        if(table.row($(this).parents('tr')).data()) {
          let { _id, is_highlight, tour_id, tour_type, name, duration, starting_price, start_city, end_city } = table.row($(this).parents('tr')).data();
      
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
          $('#modal-tour-type').val(tour_type);
      
          dialogArr[0].open();
        }
      });
    });
  }

  // front page list admin page
  if($('html').data('page') === 'front-page') {
    let sliderListTable = $('#slider-list-table')
      .on('init.dt', function () {
        [].map.call($(this).find('.mdc-button'), (el) => new MDCRipple(el));
      })
      .DataTable({
        ajax: {
          url: '/api/front-page/highlight_slides',
          dataSrc: 'highlightSlides',
        },
        columns: [
          {
            data: null,
            defaultContent: ':::',
            className: 'reorder'
          },
          {
            data: 'order',
            className: 'align-center',
          },
          { data: 'name' },
          { data: 'image' },
          { data: 'link'},
          {
            data: null,
            defaultContent: '<button class="slider-edit-btn mdc-button mdc-button--dense no-min-width"><i class="material-icons">edit</i></button>',
          },
          {
            data: null,
            defaultContent: '<button class="slider-delete-btn mdc-button mdc-button--dense no-min-width"><i class="material-icons">delete_forever</i></button>',
          },
        ],
        rowReorder: {
          dataSrc: 'order',
        },
        scrollY: 400,
        scrollCollapse: true,
        paging: false,
      });

    $('#new-highlight-slider').on('click', (e) => {
      $('#image-modal-title').text('新滾動大圖');
      $('#image-modal-form').attr('action', '/admin/slider');
      $('#image-modal-order').val('');
      $('#image-modal-title').val('');
      $('#image-modal-image').val('');
      $('#image-modal-url').val('');
  
      $('#image-modal-order, #image-modal-title, #image-modal-permalink').prop('readonly', false);
  
      dialogArr[0].open();
    });

    $('#slider-list-table tbody').on('click', 'button.slider-edit-btn', function () {
      if(sliderListTable.row($(this).parents('tr')).data()) {
        let { _id, order, title, image, link } = sliderListTable.row($(this).parents('tr')).data();
    
        // TODO - make sure to safe check id
        $('#image-modal-title').text('編輯滾動大圖');
        $('#image-modal-form').attr('action', '/admin/slider');
        $('#image-modal-id').val(_id);
        $('#image-modal-order').val(order);
        $('#image-modal-title').val(title);
        $('#image-modal-image').val(image);
        $('#image-modal-url').val(link);
    
        $('#modal-is-highlight, #modal-tour-id, #modal-title, #modal-duration, #modal-starting-price, #modal-start-city, #modal-end-city').prop('readonly', false);
    
        dialogArr[0].open();
      }
    });

    let imageListTable = $('#image-list-table')
      .on('init.dt', function () {
        [].map.call($(this).find('.mdc-button'), (el) => new MDCRipple(el));
      })
      .DataTable({
        ajax: {
          url: '/api/front-page/highlight_images',
          dataSrc: 'highlightImages',
        },
        columns: [
          {
            data: null,
            defaultContent: ':::',
            className: 'reorder'
          },
          {
            data: 'order',
            className: 'align-center',
          },
          { data: 'name' },
          { data: 'image' },
          { data: 'link'},
          {
            data: null,
            defaultContent: '<button class="image-edit-btn mdc-button mdc-button--dense no-min-width"><i class="material-icons">edit</i></button>',
          },
          {
            data: null,
            defaultContent: '<button class="image-delete-btn mdc-button mdc-button--dense no-min-width"><i class="material-icons">delete_forever</i></button>',
          },
        ],
        rowReorder: {
          dataSrc: 'order',
        },
        scrollY: 400,
        scrollCollapse: true,
        paging: false,
      });
    
    $('#new-highlight-image').on('click', (e) => {
      $('#image-modal-title').text('新主打線路圖片');
      $('#image-modal-form').attr('action', '/admin/create-static-page');
      $('#image-modal-order').val('');
      $('#image-modal-title').val('');
      $('#image-modal-permalink').val('');
  
      $('#image-modal-order, #image-modal-title, #image-modal-permalink').prop('readonly', false);
  
      dialogArr[0].open();
    });

    $('#image-list-table tbody').on('click', 'button.image-edit-btn', function () {
      if(imageListTable.row($(this).parents('tr')).data()) {
        let { _id, is_highlight, tour_id, tour_type, name, duration, starting_price, start_city, end_city } = imageListTable.row($(this).parents('tr')).data();
    
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
        $('#modal-tour-type').val(tour_type);
    
        dialogArr[0].open();
      }
    });

    let menuListTable = $('#menu-list-table')
      .on('init.dt', function () {
        [].map.call($(this).find('.mdc-button'), (el) => new MDCRipple(el));
      })
      .DataTable({
        ajax: {
          url: '/api/front-page/highlight_tour_menus',
          dataSrc: 'highlightTourMenu',
        },
        columns: [
          {
            data: null,
            defaultContent: ':::',
            className: 'reorder'
          },
          {
            data: 'order',
            className: 'align-center',
          },
          { data: 'name' },
          { data: 'link'},
          {
            data: null,
            defaultContent: '<button class="menu-edit-btn mdc-button mdc-button--dense no-min-width"><i class="material-icons">edit</i></button>',
          },
          {
            data: null,
            defaultContent: '<button class="menu-delete-btn mdc-button mdc-button--dense no-min-width"><i class="material-icons">delete_forever</i></button>',
          },
        ],
        rowReorder: {
          dataSrc: 'order',
        },
        scrollY: 400,
        scrollCollapse: true,
        paging: false,
      });

    $('#new-highlight-menu').on('click', (e) => {
      $('#menu-modal-title').text('新主打線路選單');
      $('#menu-modal-form').attr('action', '/admin/create-static-page');
      $('#menu-modal-order').val('');
      $('#menu-modal-title').val('');
      $('#menu-modal-permalink').val('');
  
      $('#menu-modal-order, #menu-modal-title, #menu-modal-permalink').prop('readonly', false);
  
      dialogArr[1].open();
    });

    $('#menu-list-table tbody').on('click', 'button.menu-edit-btn', function () {
      if(menuListTable.row($(this).parents('tr')).data()) {
        let { _id, is_highlight, tour_id, tour_type, name, duration, starting_price, start_city, end_city } = menuListTable.row($(this).parents('tr')).data();
    
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
        $('#modal-tour-type').val(tour_type);
    
        dialogArr[1].open();
      }
    });
  }

  // static page list admin page
  if($('html').data('page') === 'static-pages') {
    $('#new-static-page').on('click', (e) => {
      $('#my-dialog-title').text('新靜態頁面');
      $('#modal-form').attr('action', '/admin/create-static-page');
      $('#modal-order').val('');
      $('#modal-title').val('');
      $('#modal-permalink').val('');
  
      $('#modal-order, #modal-title, #modal-permalink').prop('readonly', false);
  
      dialogArr[0].open();
    });
  
    $('.static-page-quick-edit').on('click', function (e) {
      let { _id, order, name, permalink } = $(this).data('static-page');
  
      $('#my-dialog-title').text('快速編輯');
      $('#modal-form').attr('action', `/admin/static-pages/${permalink}/quick-edit`);
      $('#modal-order').val(order);
      $('#modal-title').val(name);
      $('#modal-permalink').val(permalink);
  
      $('#modal-order, #modal-title, #modal-permalink').prop('readonly', false);
  
      dialogArr[0].open();
    });
  
    $('.static-page-delete').on('click', function (e) {
      let { _id, order, name, permalink } = $(this).data('static-page');
  
      $('#my-dialog-title').text('刪除靜態頁面');
      $('#modal-form').attr('action', `/admin/static-pages/${permalink}/delete`);
      $('#modal-order').val(order);
      $('#modal-title').val(name);
      $('#modal-permalink').val(permalink);
  
      $('#modal-order, #modal-title, #modal-permalink').prop('readonly', true);
  
      dialogArr[0].open();
    });
  }

  // menu list admin page
  if($('html').data('page') === 'main-menus') {
    $('.main-menu-edit').on('click', function (e) {
      let { _id, order, name, permalink } = $(this).data('menu');
  
      $('#my-dialog-title').text('編輯選單');
      $('#modal-form').attr('action', `/admin/main-menu/${permalink}/quick-edit`);
      $('#modal-order').val(order);
      $('#modal-title').val(name);
      $('#modal-permalink').val(permalink);
  
      $('#modal-order, #modal-title, #modal-permalink').prop('readonly', false);
  
      dialogArr[0].open();
    });
  
    $('.main-menu-delete').on('click', function (e) {
      let { _id, order, name, permalink } = $(this).data('menu');
  
      $('#my-dialog-title').text('刪除選單');
      $('#modal-form').attr('action', `/admin/main-menu/${permalink}/delete`);
      $('#modal-order').val(order);
      $('#modal-title').val(name);
      $('#modal-permalink').val(permalink);
  
      $('#modal-order, #modal-title, #modal-permalink').prop('readonly', true);
  
      dialogArr[0].open();
    });
  }

});

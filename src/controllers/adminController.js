const axios = require('axios');
const _ = require('lodash');

const port = process.env.PORT || 3000;
const serverUrl = `http://${process.env.HOST || '0.0.0.0'}:${port}`;

exports.get_tours_list = async (req, res) => {
  try {
    // const listData = await axios.get(`${serverUrl}/api/tours/admin-dash`);
    const menu = await axios.get(`${serverUrl}/api/tours/tour-menu`);

    res.render('admin_tour_list', {
      page_type: 'tours',
      // data: listData.data,
      menu: menu.data,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.get_static_page_list = async (req, res) => {
  try {
    const pageData = await axios.get(`${serverUrl}/api/static-pages/page-menu`);

    res.render('admin_static_page_list', {
      page_type: 'static-pages',
      data: pageData.data,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.get_edit_static_page = async (req, res) => {
  try {
    const pageData = await axios.get(`${serverUrl}/api/static-pages/${req.params.page}`);

    res.render('static_page_edit', {
      name: pageData.data.name,
      content: pageData.data.content,
      permalink: pageData.data.permalink,
      tiny_api: process.env.TINYMCE_API,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.get_main_menu_list = async (req, res) => {
  try {
    const pageData = await axios.get(`${serverUrl}/api/tours/tour-menu`);

    res.render('admin_menu_list', {
      page_type: 'main-menus',
      data: pageData.data,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.get_edit_tour = async (req, res) => {
  try {
    const tourData = await axios.get(`${serverUrl}/api/admin/${req.params.tourId}`);
    const menu = await axios.get(`${serverUrl}/api/tours/tour-menu`);

    res.render('tour_details_edit', {
      page_type: 'tour',
      tour_list: req.params.tourList,
      data: tourData.data,
      menu: menu.data,
      tiny_api: process.env.TINYMCE_API,
    });
  } catch (error) {
    console.error(error);
    res.redirect(`/admin/${req.params.tourId}/edit`);
  }
};

exports.post_edit_static_page_save = async (req, res) => {
  // TODO - safe check id
  console.log('posted data: ', req.body);
  const data = {
    name: req.body.name,
    content: req.body.content,
    permalink: req.params.page,
  };

  console.log('serialized data:', data);
  try {
    const post = await axios.post(`${serverUrl}/api/admin/static-pages/${req.params.page}/edit`, data);
    console.log('response:', post);
    res.flash('success', 'Page saved successfully.');
    res.redirect(`/admin/static-pages/${req.params.page}/edit`);
  } catch (error) {
    // TODO - flash error
    console.error(error);
    res.flash('error', error);
    res.redirect(`/admin/static-pages/${req.params.page}/edit`);
  }
};

exports.post_edit_static_page_save_and_quit = async (req, res) => {
  // TODO - safe check id
  console.log('posted data: ', req.body);
  const data = {
    name: req.body.name,
    content: req.body.content,
    permalink: req.params.page,
  };

  console.log('serialized data:', data);
  try {
    const post = await axios.post(`${serverUrl}/api/admin/static-pages/${req.params.page}/edit`, data);
    console.log('response:', post);
    res.flash('success', 'Page saved successfully.');
    res.redirect('/admin/static-pages');
  } catch (error) {
    // TODO - flash error
    console.error(error);
    res.flash('error', error);
    res.redirect(`/admin/static-pages/${req.params.page}/edit`);
  }
};

const extractUrl = (DOMString, wrapperStart, wrapperEnd) => {
  let index = 0;
  let urls = [];

  try {
    while (DOMString.indexOf(wrapperStart, index) > -1) {
      const beginning = DOMString.indexOf(wrapperStart, index) + wrapperStart.length;
      const end = DOMString.indexOf(wrapperEnd, beginning);
      urls.push(DOMString.slice(beginning, end));
      index = end;
    }
  } catch (e) {
    console.error(`extraUrl error: ${e}`);
    console.error(`Params: DOMString: ${DOMString}, wrapperStart: ${wrapperStart}, wrapperEnd: ${wrapperEnd}.`);
  }

  return urls;
};

exports.post_edit_tour_save = async (req, res) => {
  // TODO - safe check id
  console.log('posted data: ', req.body);
  const data = {
    name: req.body.name,
    tour_id: req.body.tour_id.toUpperCase(),
    tour_type: req.body.tour_type,
    is_highlight: req.body.is_highlight !== undefined ? (req.body.is_highlight === 'on') : false,
    schedule_table: req.body.schedule_table,
    images: extractUrl(req.body.images, 'src="', '"'),
    duration: parseInt(req.body.duration),
    short_description: '',
    starting_price: parseInt(req.body.starting_price),
    full_description: req.body.full_description,
    tour_plan: [],
    pickup_service: req.body.pickup_service,
    price_breakdown: req.body.price_breakdown,
    notice: req.body.notice,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    start_city: req.body.start_city,
    end_city: req.body.end_city,
  };
  for (let i = 0; i < data.duration; i++) {
    data.tour_plan.push({
      title: req.body[`d${i}_title`],
      description: req.body[`d${i}_description`],
      sights: extractUrl(req.body[`d${i}_thumbs`], 'src="', '"'),
      stay: req.body[`d${i}_stay`],
    });
  }

  console.log('serialized data:', data);
  try {
    const post = await axios.post(`${serverUrl}/api/admin/${req.params.tourId}/edit`, data);
    console.log('response:', post);
    res.flash('success', 'Tour saved successfully.');
    res.redirect(`/admin/${req.params.tourId}/edit`);
  } catch (error) {
    // TODO - flash error
    console.error(error);
    res.flash('error', error);
    res.redirect(`/admin/${req.params.tourId}/edit`);
  }
};

exports.post_edit_tour_save_and_quit = async (req, res) => {
  // TODO - safe check id
  console.log('posted data: ', req.body);
  const data = {
    name: req.body.name,
    tour_id: req.body.tour_id.toUpperCase(),
    tour_type: req.body.tour_type,
    is_highlight: req.body.is_highlight !== undefined ? (req.body.is_highlight === 'on') : false,
    schedule_table: req.body.schedule_table,
    images: extractUrl(req.body.images, 'src="', '"'),
    duration: parseInt(req.body.duration),
    short_description: '',
    starting_price: parseInt(req.body.starting_price),
    full_description: req.body.full_description,
    tour_plan: [],
    pickup_service: req.body.pickup_service,
    price_breakdown: req.body.price_breakdown,
    notice: req.body.notice,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    start_city: req.body.start_city,
    end_city: req.body.end_city,
  };
  for (let i = 0; i < data.duration; i++) {
    data.tour_plan.push({
      title: req.body[`d${i}_title`],
      description: req.body[`d${i}_description`],
      sights: extractUrl(req.body[`d${i}_thumbs`], 'src="', '"'),
      stay: req.body[`d${i}_stay`],
    });
  }

  console.log('serialized data:', data);
  try {
    const post = await axios.post(`${serverUrl}/api/admin/${req.params.tourId}/edit`, data);
    console.log('response:', post);
    res.flash('success', 'Tour saved successfully.');
    res.redirect('/admin/tours');
  } catch (error) {
    console.error(error);
    res.flash('error', error);
    res.redirect(`/admin/${req.params.tourId}/edit`);
  }
};

exports.post_create_tour = async (req, res) => {
  const { is_highlight, duration, name, start_city, end_city, starting_price, tour_id, tour_type } = req.body;

  const data = {
    name,
    tour_id: tour_id.toUpperCase(),
    tour_type,
    is_highlight: is_highlight !== undefined ? (is_highlight === 'on') : false,
    schedule_table: '',
    images: '',
    duration: parseInt(duration),
    short_description: '',
    starting_price: parseInt(starting_price),
    full_description: '',
    tour_plan: [],
    pickup_service: '',
    price_breakdown: '',
    notice: '',
    start_date: '',
    end_date: '',
    start_city,
    end_city,
  };

  for (let i = 0; i < data.duration; i++) {
    data.tour_plan.push({
      title: '',
      description: '',
      sights: '',
      stay: '',
    });
  }

  try {
    const post = await axios.post(`${serverUrl}/api/admin/${data.tour_id}/edit`, data);
    console.log('response:', post);
    res.flash('success', 'Tour created successfully.');
    res.redirect(`/admin/${data.tour_id}/edit`);
  } catch (error) {
    // TODO - flash error
    res.flash('error', error);
    console.error(error);
    res.redirect('/admin/tours');
  }
};

exports.post_duplicate_tour = async (req, res) => {
  // get current tour's data
  let { is_highlight, duration, name, start_city, end_city, starting_price, tour_id, tour_type } = req.body;
  duration = parseInt(duration);

  try {
    const temp = await axios.get(`${serverUrl}/api/admin/${req.params.tourId}`);

    // adjust tour plans based on specified duration
    let diff = temp.data.duration;
    const lastDay = temp.data.tour_plan.pop();
    if (diff > duration) {
      temp.data.tour_plan.length = duration - 1; // -1 since we popped the last day
    } else if (diff < duration) {
      while (diff < duration) {
        temp.data.tour_plan.push({
          title: 'Some title',
          description: 'Some description',
          sights: [],
          stay: 'Some hotel',
        });

        ++diff;
      }
    }
    temp.data.tour_plan.push(lastDay);

    // post with combined data
    delete temp.data._id;
    temp.data.is_highlight = is_highlight !== undefined ? (is_highlight === 'on') : false,
    temp.data.duration = duration;
    temp.data.name = name;
    temp.data.start_city = start_city;
    temp.data.end_city = end_city;
    temp.data.starting_price = starting_price;
    temp.data.tour_id = tour_id;
    temp.data.tour_type = tour_type;

    const post = await axios.post(`${serverUrl}/api/admin/${tour_id}/edit`, temp.data);
    const { data } = await axios.get(`${serverUrl}/api/tours/${tour_type}/${tour_id}`);

    // go to the new tour in edit mode
    res.flash('success', 'Tour created successfully.');
    res.redirect(`/admin/${data.tour_id}/edit`);
  } catch (error) {
    console.error(error);
    res.flash('error', error);
    res.redirect('/admin/tours');
  }
};

exports.post_delete_tour = (req, res) => {
  axios.post(`${serverUrl}/api/admin/${req.params.tourId}/delete`, req.body)
    .then(({ data }) => {
      res.flash('success', 'Tour has been deleted.');
      res.redirect('/admin/tours');
    })
    .catch((error) => {
      console.error(error);
      res.flash('error', error);
      res.redirect('/admin/tours');
    });
};

exports.post_update_slider = (req, res) => {
  axios.post(`${serverUrl}/api/admin/front-page/slider/update`, req.body)
    .then(({ data }) => {
      res.redirect('/admin');
    })
    .catch((error) => {
      console.error(error);
      res.redirect('/admin');
    });
};

exports.post_add_main_menu = (req, res) => {
  axios.post(`${serverUrl}/api/admin/main-menus/add`, req.body)
    .then(({ data }) => {
      res.flash('success', 'Menu has been added.');
      res.redirect('/admin/main-menus');
    })
    .catch((error) => {
      console.error(error);
      res.flash('error', error);
      res.redirect('/admin/main-menus');
    });
};

exports.post_edit_main_menu = (req, res) => {
  axios.post(`${serverUrl}/api/admin/main-menus/${req.params.permalink}/edit`, req.body)
    .then(({ data }) => {
      res.flash('success', 'Menu info has been saved.');
      res.redirect('/admin/main-menus');
    })
    .catch((error) => {
      console.error(error);
      res.flash('error', error);
      res.redirect('/admin/main-menus');
    });
};

exports.post_delete_main_menu = (req, res) => {
  axios.post(`${serverUrl}/api/admin/main-menus/${req.params.permalink}/delete`, req.body)
    .then(({ data }) => {
      res.flash('success', 'Menu has been deleted.');
      res.redirect('/admin/main-menus');
    })
    .catch((error) => {
      console.error(error);
      res.flash('error', error);
      res.redirect('/admin/main-menus');
    });
};
const axios = require('axios');
const _ = require('lodash');

const port = process.env.PORT || 3000;
const serverUrl = `http://${process.env.HOST || '0.0.0.0'}:${port}`;

exports.get_tours_list = async (req, res) => {
    try {
        let listData = await axios.get(`${serverUrl}/api/tours/admin-dash`);
        let menu = await axios.get(`${serverUrl}/api/tours/tour-menu`);
        
        res.render('admin_dashboard', {
            page_type: 'tour',
            data: listData.data,
            menu: menu.data
        })
    } catch(error) {
        console.error(error);
    }
};

exports.get_static_page_list = async (req, res) => {
    try {
        let pageData = await axios.get(`${serverUrl}/api/static-pages/page-menu`);

        res.render('admin_static_page_list', {
            data: pageData.data
        })
    } catch(error) {
        console.error(error);
    }
};

exports.get_edit_static_page = async (req, res) => {
    try {
        let pageData = await axios.get(`${serverUrl}/api/static-pages/${req.params.page}`);

        res.render('static_page_edit', {
            name: pageData.data.name,
            content: pageData.data.content,
            permalink: pageData.data.permalink,
            tiny_api: process.env.TINYMCE_API
        })
    } catch(error) {
        console.error(error);
    }
};

exports.get_edit_tour = async (req, res) => {
    try {
        let tourData = await axios.get(`${serverUrl}/api/admin/${req.params.tourId}`);
        let menu = await axios.get(`${serverUrl}/api/tours/tour-menu`);

        res.render('tour_details_edit', {
            page_type: 'tour',
            tour_list: req.params.tourList,
            data: tourData.data,
            menu: menu.data,
            tiny_api: process.env.TINYMCE_API
        });
    } catch(error) {
        console.error(error);
        res.redirect(`/admin/${req.params.tourId}/edit`);
    }
};

exports.post_edit_static_page_save = async (req, res) => {
    // TODO - image logic fix
    // TODO - safe check id
    console.log('posted data: ', req.body);
    let data = {
        name: req.body.name,
        content: req.body.content,
        permalink: req.params.page
    }

    console.log('serialized data:', data);
    try {
        let post = await axios.post(`${serverUrl}/api/admin/static-pages/${req.params.page}/edit`, data);
        console.log('response:', post);
        res.redirect(`/admin/static-pages/${req.params.page}/edit`);
    } catch(error) {
        // TODO - flash error
        console.error(error);
        res.redirect(`/admin/static-pages/${req.params.page}/edit`);
    }
};

exports.post_edit_static_page_save_and_quit = async (req, res) => {
    // TODO - image logic fix
    // TODO - safe check id
    console.log('posted data: ', req.body);
    let data = {
        name: req.body.name,
        content: req.body.content,
        permalink: req.params.page
    }

    console.log('serialized data:', data);
    try {
        let post = await axios.post(`${serverUrl}/api/admin/static-pages/${req.params.page}/edit`, data);
        console.log('response:', post);
        res.redirect(`/admin/static-pages`);
    } catch(error) {
        // TODO - flash error
        console.error(error);
        res.redirect(`/admin/static-pages/${req.params.page}/edit`);
    }
};

exports.post_edit_tour_save = async (req, res) => {
    // TODO - image logic fix
    // TODO - safe check id
    console.log('posted data: ', req.body);
    let data = {
        name: req.body.name,
        tour_id: req.body.tour_id.toUpperCase(),
        tour_type: req.body.tour_type,
        is_highlight: req.body.is_highlight !== undefined ? req.body.is_highlight : false,
        schedule_table: req.body.schedule_table,
        images: ['Shengyanggugong.jpg', 'songjiangzhonglu.png', 'ccdb08-changbaishan-Small.jpg'],
        duration: parseInt(req.body.duration),
        short_description: "",
        starting_price: parseInt(req.body.starting_price),
        full_description: req.body.full_description,
        tour_plan: [],
        pickup_service: req.body.pickup_service,
        price_breakdown: req.body.price_breakdown,
        notice: Array.isArray(req.body.notice) ? req.body.notice[0] : req.body.notice,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        start_city: req.body.start_city,
        end_city: req.body.end_city
    }
    for(let i = 0; i < data.duration; i++) {
        // TODO - also need to fix sights logic
        data.tour_plan.push({
            title: req.body[`d${i}_title`],
            description: req.body[`d${i}_description`],
            sights: i+1 !== data.duration ? ['Shengyanggugong.jpg', 'songjiangzhonglu.png', 'ccdb08-changbaishan-Small.jpg'] : [],
            stay: req.body[`d${i}_stay`]
        });
    }

    console.log('serialized data:', data);
    try {
        let post = await axios.post(`${serverUrl}/api/admin/${req.params.tourId}/edit`, data);
        console.log('response:', post);
        res.redirect(`/admin/${req.params.tourId}/edit`);
    } catch(error) {
        // TODO - flash error
        console.error(error);
        res.redirect(`/admin/${req.params.tourId}/edit`);
    }
};

exports.post_edit_tour_save_and_quit = async (req, res) => {
    // TODO - image logic fix
    // TODO - safe check id
    console.log('posted data: ', req.body);
    let data = {
        name: req.body.name,
        tour_id: req.body.tour_id.toUpperCase(),
        tour_type: req.body.tour_type,
        is_highlight: req.body.is_highlight !== undefined ? req.body.is_highlight : false,
        schedule_table: req.body.schedule_table,
        images: ['Shengyanggugong.jpg', 'songjiangzhonglu.png', 'ccdb08-changbaishan-Small.jpg'],
        duration: parseInt(req.body.duration),
        short_description: "",
        starting_price: parseInt(req.body.starting_price),
        full_description: req.body.full_description,
        tour_plan: [],
        pickup_service: req.body.pickup_service,
        price_breakdown: req.body.price_breakdown,
        notice: Array.isArray(req.body.notice) ? req.body.notice[0] : req.body.notice,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        start_city: req.body.start_city,
        end_city: req.body.end_city
    }
    for(let i = 0; i < data.duration; i++) {
        // TODO - also need to fix sights logic
        data.tour_plan.push({
            title: req.body[`d${i}_title`],
            description: req.body[`d${i}_description`],
            sights: i+1 !== data.duration ? ['Shengyanggugong.jpg', 'songjiangzhonglu.png', 'ccdb08-changbaishan-Small.jpg'] : [],
            stay: req.body[`d${i}_stay`]
        });
    }

    console.log('serialized data:', data);
    try {
        let post = await axios.post(`${serverUrl}/api/admin/${req.params.tourId}/edit`, data);
        console.log('response:', post);
        res.redirect(`/admin`);
    } catch(error) {
        // TODO - flash error
        console.error(error);
        res.redirect(`/admin/${req.params.tourId}/edit`);
    }
};

exports.post_create_tour = async (req, res) => {
    let { is_highlight, duration, name, start_city, end_city, starting_price, tour_id, tour_type } = req.body;

    let data = {
        name: name,
        tour_id: tour_id.toUpperCase(),
        tour_type: tour_type,
        is_highlight: is_highlight,
        schedule_table: '',
        images: [],
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
        start_city: start_city,
        end_city: end_city
    }

    for(let i = 0; i < data.duration; i++) {
        // TODO - also need to fix sights logic
        data.tour_plan.push({
            title: '',
            description: '',
            sights: [],
            stay: ''
        });
    }

    try {
        let post = await axios.post(`${serverUrl}/api/admin/${data.tour_id}/edit`, data);
        console.log('response:', post);
        res.redirect(`/admin/${data.tour_id}/edit`);
    } catch(error) {
        // TODO - flash error
        console.error(error);
    }
};

exports.post_duplicate_tour = async (req, res) => {
    // get current tour's data
    let { is_highlight, duration, name, start_city, end_city, starting_price, tour_id, tour_type } = req.body;
    
    try {
        let temp = await axios.get(`${serverUrl}/api/admin/${req.params.tourId}`);
        
        // adjust tour plans based on inputed duration
        let diff = temp.data.duration;
        if(diff > duration) {
            while(diff > duration) {
                temp.data.tour_plan.shift();   
                diff--;
            }
        } else if (diff < duration) {
            let firstDay = _.cloneDeep(temp.data.tour_plan[0])
            while(diff < duration) {
                temp.data.tour_plan.unshift(_.cloneDeep(firstDay));
                diff++;
            }
        }

        // post with combined data
        delete temp.data._id;
        temp.data.is_highlight = is_highlight,
        temp.data.duration = duration;
        temp.data.name = name;
        temp.data.start_city = start_city;
        temp.data.end_city = end_city;
        temp.data.starting_price = starting_price;
        temp.data.tour_id = tour_id;
        temp.data.tour_type = tour_type;

        let post = await axios.post(`${serverUrl}/api/admin/${tour_id}/edit`, temp.data);
        let { data } = await axios.get(`${serverUrl}/api/tours/${tour_type}/${tour_id}`);

        // go to the new tour in edit mode
        res.redirect(`/admin/${data.tour_id}/edit`);
    } catch(error) {
        console.error(error);
        res.redirect(`/admin`);
    }
};

exports.post_delete_tour = (req, res) => {
    axios.post(`${serverUrl}/api/admin/${req.params.tourId}/delete`, req.body)
    .then(({ data }) => {
        res.redirect(`/admin`);
    })
    .catch(error => {
        console.error(error);
        res.redirect(`/admin`);
    });
};
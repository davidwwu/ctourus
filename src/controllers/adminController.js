const axios = require('axios');

const port = process.env.PORT || 3000;
const serverUrl = `http://${process.env.HOST || '0.0.0.0'}:${port}`;

exports.get_tours_list = (req, res) => {
    
}

exports.get_edit_tour = (req, res) => {

}

exports.post_edit_tour = (req, res) => {
    let data = {
        name: req.body.name,
        tour_id: req.body.tour_id.toUpperCase(),
        tour_type: req.body.tour_type,
        is_highlight: true,
        schedule_table: req.body.schedule_table,
        images: [],
        duration: parseInt(req.body.duration),
        short_description: "",
        starting_price: parseInt(req.body.starting_price),
        full_description: req.body.full_description,
        tour_plan: [],
        pickup_service: req.body.pickup_service,
        price_breakdown: req.body.price_breakdown,
        notice: req.body.notice,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        start_city: req.body.start_city,
        end_city: req.body.end_city
    }
    for(let i = 0; i < data.duration; i++) {
        data.tour_plan.push({
            title: req.body[`d${i}_title`],
            description: req.body[`d${i}_description`],
            sights: [],
            stay: req.body[`d${i}_stay`]
        });
    }

    console.log(data);
    axios.post(`${serverUrl}/api/admin/${req.params.tourId}/edit`, data)
    .then((res) => {
        console.log(res);
        res.redirect(`/admin`);
    })
    .catch((error) => {
        console.log(error);
    })
}

exports.post_duplicate_tour = async(req, res) => {
    // get current tour's data
    try {
        let { duration, name, start_city, starting_price, tour_id, tour_type} = req.body;
        let temp = await axios.get(`${serverUrl}/api/admin/${req.params.tourId}`);
        
        // post with combined data
        delete temp.data._id;
        temp.data.duration = duration;
        temp.data.name = name;
        temp.data.start_city = start_city;
        temp.data.starting_price = starting_price;
        temp.data.tour_id = tour_id;
        temp.data.tour_type = tour_type;

        let post = await axios.post(`${serverUrl}/api/admin/${tour_id}/edit`, temp.data);
        let { data } = await axios.get(`${serverUrl}/api/tours/${tour_type}/${tour_id}`);

        // go to the new tour in edit mode
        res.redirect(`/admin/${data.tour_id}/edit`);
    } catch(error) {
        console.log(error);
    }

}

exports.post_delete_tour = (req, res) => {
    axios.post(`${serverUrl}/api/admin/${req.params.tourId}/delete`, req.body)
    .then(({ data }) => {
        res.redirect(`/admin`);
    })
    .catch(error => {
        console.log(error);
    });
}
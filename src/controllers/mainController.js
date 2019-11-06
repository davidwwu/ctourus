var axios = require('axios');
var express = require('express');


var router = express.Router();

router.get('/:tourList/:tourId?', function (req, res) {
  if(!req.params.tourId) {
    axios.get(`/api/tours/${req.params.tourList}`)
      .then((data) => {
        res.render('tour-list', {
          data: data.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    axios.get(`/api/tours/${req.params.tourList}/${req.params.tourId}`)
      .then(({ data }) => {
        res.render('tour_details', {
          data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

module.exports = router;
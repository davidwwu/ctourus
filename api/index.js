var express = require('express');

// output dummy data for now
var data = require('../src/data/dummy-data.json');

// mongo here
const connectMongo_async = require('../src/controllers/dbController.mjs');
let mdb;
connectMongo_async().then((data) => {
  mdb = data;
});

var router = express.Router();


router.get('/tours/tour-menu', function (req, res) {
  mdb.collection('tour_menu')
    .find({})
    .toArray((err, data) => {
      res.send(data);
    });
  // res.json(data['tour_menu']);
});

router.get('/tours', function (req, res) {
  mdb.collection('tours').findOne({}, (err, data) => {
    res.send(data);
  });
  // res.json(data);
});

router.get('/tours/highlight-tours', async function (req, res) {
  let highlightTours,
      highlightSlides;
  try {
    highlightTours = await mdb.collection('tours')
      .find(
        {'is_highlight': true }
      )
      .project({ 
        name: true,
        images: true,
        starting_price: true,
        tour_id: true,
        tour_type: true,
        duration: true
      })
      .toArray();

  } catch(err) {
    console.error(err);
  }
  
  try {
    highlightSlides = await mdb.collection('highlight_slides')
      .find({})
      .toArray();
  } catch(err) {
    console.error(err);
  }

  res.send({ 
    tours: highlightTours,
    tour_slides: highlightSlides 
  });
  // res.json(data['highlight_tours']);
});

router.get('/tours/:tourList/:tourId?', function (req, res) {
  if(!req.params.tourId){
    mdb.collection('tours')
      .find({tour_type: req.params.tourList})
      .toArray((err, data) => {
        res.send(data);
      });
  } else {
    mdb.collection('tours')
    .findOne({
      $and: [
        {tour_type: req.params.tourList},
        {tour_id: req.params.tourId}
      ]
    },
    (err, data) => {
      res.send(data);
    });
  }
  // res.json(data['regular_tours'][req.params.tourList]);
});

module.exports = router;
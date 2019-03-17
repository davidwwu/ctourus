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
    .sort({
      order: 1
    })
    .toArray((err, data) => {
      res.send(data);
    });
});

router.get('/tours', function (req, res) {
  mdb.collection('tours').findOne({}, (err, data) => {
    res.send(data);
  });
});

router.get('/tours/highlight-tours', async function (req, res) {
  let highlightTours,
      highlightSlides;
  try {
    highlightTours = await mdb.collection('tours')
      .find({
        'is_highlight': true
      })
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
      .sort({
        order: 1
      })
      .toArray();
  } catch(err) {
    console.error(err);
  }

  res.send({ 
    tours: highlightTours,
    tour_slides: highlightSlides 
  });
});

router.get('/tours/:tourList', function (req, res) {
  if(Object.keys(req.query).length === 0) {
    mdb.collection('tours')
      .find({tour_type: req.params.tourList})
      .project({ 
        name: true,
        images: true,
        starting_price: true,
        tour_id: true,
        tour_type: true,
        duration: true,
        start_city: true
      })
      .sort({
        tour_id: 1
      })
      .toArray((err, data) => {
        res.send(data);
      });
  } else {
    // Build AND query condition
    let andCondition = [];
    for (let [key, value] of Object.entries(req.query)) {
      andCondition.push({[key]: value});
    }

    mdb.collection('tours')
      .find({
        $and: andCondition
      })
      .project({ 
        name: true,
        images: true,
        starting_price: true,
        tour_id: true,
        tour_type: true,
        duration: true,
        start_city: true
      })
      .toArray((err, data) => {
        res.send(data);
      });
  }
});

router.get('/tours/:tourList/:tourId', function (req, res) {
  mdb.collection('tours')
    .findOne({
      $and: [
        { tour_type: req.params.tourList },
        { tour_id: req.params.tourId }
      ]
    },
    (err, data) => {
      res.send(data);
    });
});

module.exports = router;
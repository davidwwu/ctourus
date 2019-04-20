var express = require('express');
const bodyParser = require('body-parser');

// output dummy data for now
var data = require('../src/data/dummy-data.json');

// mongo here
const connectMongo_async = require('../src/controllers/dbController');
let mdb;
let ObjectId;
connectMongo_async().then((data) => {
  mdb = data.db;
  ObjectId = data.ObjectId;
});

var router = express.Router();

// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

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
  mdb.collection('tours')
    .find({}, (err, data) => {
      res.send(data);
    });
});

router.get('/tours/admin-dash', function (req, res) {
  mdb.collection('tours')
    .find({})
    .project({ 
      is_highlight: true,
      name: true,
      starting_price: true,
      tour_id: true,
      tour_type: true,
      duration: true,
      start_city: true,
      end_city: true
    })
    .sort({
      tour_type: 1,
      tour_id: 1
    })
    .toArray((err, data) => {
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
        tour_id: 1,
        start_city: 1,
        duration: 1
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
  if(req.params.tourList != 'all') {
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
  } else {
    mdb.collection('tours')
      .findOne({
        tour_id: req.params.tourId
      },
      (err, data) => {
        res.send(data);
      });
  }
});

router.get('/admin/:tourId', jsonParser, (req, res) => {
  mdb.collection('tours')
    .findOne({
      'tour_id': req.params.tourId
    },
    (err, data) => {
      res.send(data);
    });
});

router.post('/admin/:tourId/create', jsonParser, (req, res) => {
  mdb.collection('tours')
    .insertOne(
      { ...req.body },
      (err, msg) => {
        res.send(msg);
      }
    );
});

router.post('/admin/:tourId/edit', jsonParser, (req, res) => {
  mdb.collection('tours')
    .updateOne(
      { 'tour_id': req.body.tour_id },
      { $set: req.body },
      { upsert: true },
      (err, msg) => {
        res.send(msg);
      }
    );
});

router.post('/admin/:tourId/delete', jsonParser, (req, res) => {
  mdb.collection('tours')
    .deleteOne(
      { 'tour_id': req.body.tour_id },
      (err, msg) => {
        res.send(msg);
      }
    );
});

router.post('/admin/add-menu', jsonParser, (req, res) => {
  mdb.collection('tour_menu')
    .insertOne(
      { $set: req.body },
      (err, msg) => {
        res.send(msg);
      }
    );
});

module.exports = router;
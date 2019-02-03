var express = require('express');

// output dummy data for now
var data = require('../src/data/dummy-data.json')

var router = express.Router();

router.get('/tours', function (req, res) {
  res.json(data);
});

router.get('/tours/tour-menu', function (req, res) {
  res.json(data['tour_menu']);
});

router.get('/tours/highlight-tours', function (req, res) {
  res.json(data['highlight_tours']);
});

router.get('/tours/regular-tours/:tourList', function (req, res) {
  res.json(data['regular_tours'][req.params.tourList]);
});

router.get('/tours/regular-tours/:tourList/:tourId', function (req, res) {
  res.json(data['regular_tours'][req.params.tourList][req.params.tourId]);
});

module.exports = router;
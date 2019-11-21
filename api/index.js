const express = require('express');
const bodyParser = require('body-parser');

// output dummy data for now
// var data = require('../src/data/dummy-data.json');

// mongo here
const connectMongo_async = require('../src/controllers/dbController');

let mdb;
let ObjectId;
connectMongo_async().then((data) => {
  mdb = data.db;
  ObjectId = data.ObjectId;
});

const router = express.Router();

// create application/json parser
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/static-pages/page-menu', (req, res) => {
  mdb.collection('static_pages')
    .find({})
    .project({
      name: true,
      order: true,
      permalink: true,
    })
    .sort({
      order: 1,
    })
    .toArray((err, data) => {
      res.send(data);
    });
});

router.get('/static-pages/:page', (req, res) => {
  mdb.collection('static_pages')
    .findOne({
      permalink: req.params.page,
    },
    (err, data) => {
      res.send(data);
    });
});

router.get('/tours/tour-menu', (req, res) => {
  mdb.collection('tour_menu')
    .aggregate([
      {
        $lookup:
          {
            from: 'tours',
            let: { menu_permalink: '$permalink' },
            pipeline: [
              {
                $match:
                  {
                    $expr: { $eq: ['$tour_type', '$$menu_permalink'] },
                  },
              },
              {
                $project: { duration: 1, start_city: 1, end_city: 1 },
              },
              {
                $sort: { duration: 1 },
              },
            ],
            as: 'sub_menus',
          },
      },
    ])
    .sort({
      order: 1,
    })
    .toArray((err, data) => {
      res.send(data);
    });
});

router.get('/tours', (req, res) => {
  mdb.collection('tours')
    .find({})
    .toArray((err, data) => {
      res.send(data);
    });
});

const getHighlightSlides = async () => {
  try {
    return await mdb.collection('orders')
      .findOne({ id: 'highlight_slides' });
  } catch (err) {
    console.error(err);
    return {
      status: 'error',
      message: err,
    };
  }
};

const getHighlightImages = async () => {
  try {
    return await mdb.collection('orders')
      .findOne({ id: 'highlight_images' });
  } catch (err) {
    console.error(err);
    return {
      status: 'error',
      message: err,
    };
  }
};

const getHighlightTourMenu = async () => {
  try {
    return await mdb.collection('orders')
      .findOne({ id: 'highlight_tour_menu' });
  } catch (err) {
    console.error(err);
    return {
      status: 'error',
      message: err,
    };
  }
};

router.get('/front-page', async (req, res) => {
  let highlightSlides;
  let highlightImages;
  let highlightTourMenu;

  try {
    highlightSlides = await getHighlightSlides();
    highlightImages = await getHighlightImages();
    highlightTourMenu = await getHighlightTourMenu();
  } catch (err) {
    console.error(err);
    res.send(err);
  }

  res.send({
    highlightSlides,
    highlightImages,
    highlightTourMenu,
  });
});

router.get('/tours/admin-dash', (req, res) => {
  mdb.collection('tours')
    .aggregate([
      {
        $lookup:
          {
            from: 'tour_menu',
            localField: 'tour_type',
            foreignField: 'permalink',
            as: 'menus',
          },
      },
      { 
        $project:
          {
            _id: 1,
            name: 1,
            menu_name: { $arrayElemAt: [ "$menus.name", 0 ] },
            tour_id: 1,
            tour_type: 1,
            is_highlight: 1,
            starting_price: 1,
            duration: 1,
            start_date: 1,
            end_date: 1,
            start_city: 1,
            end_city: 1,
            order: 1
          }
      },
    ])
    // .project({
    //   is_highlight: true,
    //   name: true,
    //   starting_price: true,
    //   tour_id: true,
    //   tour_type: true,
    //   duration: true,
    //   start_city: true,
    //   end_city: true,
    // })
    // .sort({
    //   order: 1,
    // })
    .toArray((err, data) => {
      res.send(data);
    });
});

router.get('/tours/admin-dash/:tourType', (req, res) => {
  mdb.collection('tours')
    .aggregate([
      {
        $match: { tour_type: req.params.tourType },
      },
      {
        $lookup:
          {
            from: 'tour_menu',
            localField: 'tour_type',
            foreignField: 'permalink',
            as: 'menus',
          },
      },
      { 
        $project:
          {
            _id: 1,
            name: 1,
            menu_name: { $arrayElemAt: [ "$menus.name", 0 ] },
            tour_id: 1,
            tour_type: 1,
            is_highlight: 1,
            starting_price: 1,
            duration: 1,
            start_date: 1,
            end_date: 1,
            start_city: 1,
            end_city: 1,
            order: 1
          }
      },
    ])
    // .project({
    //   is_highlight: true,
    //   name: true,
    //   starting_price: true,
    //   tour_id: true,
    //   tour_type: true,
    //   duration: true,
    //   start_city: true,
    //   end_city: true,
    // })
    // .sort({
    //   order: 1,
    // })
    .toArray((err, data) => {
      res.send(data);
    });
});

router.get('/tours/highlight-tours', async (req, res) => {
  let highlightTours;
  let highlightSlides;

  try {
    highlightTours = await mdb.collection('tours')
      .find({
        is_highlight: true,
      })
      .project({
        name: true,
        images: true,
        starting_price: true,
        tour_id: true,
        tour_type: true,
        duration: true,
        start_city: true,
      })
      .sort({
        tour_id: 1,
        start_city: 1,
        duration: 1,
      })
      .toArray();
  } catch (err) {
    console.error(err);
  }

  try {
    highlightSlides = await mdb.collection('highlight_slides')
      .find({})
      .sort({
        order: 1,
      })
      .toArray();
  } catch (err) {
    console.error(err);
  }

  res.send({
    tours: highlightTours,
    tour_slides: highlightSlides,
  });
});

router.get('/tours/front-page', async (req, res) => {
  try {
    highlightSlides = await mdb.collection('highlight_slides')
      .find({})
      .sort({
        order: 1,
      })
      .toArray();
  } catch (err) {
    console.error(err);
  }

  res.send({
    tour_slides: highlightSlides,
  });
});

router.get('/tours/:tourList', (req, res) => {
  if (Object.keys(req.query).length === 0) {
    mdb.collection('tours')
      .find({ tour_type: req.params.tourList })
      .project({
        name: true,
        images: true,
        starting_price: true,
        tour_id: true,
        tour_type: true,
        duration: true,
        start_city: true,
      })
      .sort({
        tour_id: 1,
        start_city: 1,
        duration: 1,
      })
      .toArray((err, data) => {
        res.send(data);
      });
  } else {
    // Build AND query condition
    const andCondition = [];
    for (const [key, value] of Object.entries(req.query)) {
      andCondition.push({ [key]: value });
    }

    mdb.collection('tours')
      .find({
        $and: andCondition,
      })
      .project({
        name: true,
        images: true,
        starting_price: true,
        tour_id: true,
        tour_type: true,
        duration: true,
        start_city: true,
      })
      .toArray((err, data) => {
        res.send(data);
      });
  }
});

router.get('/tours/:tourList/:tourId', (req, res) => {
  if (req.params.tourList !== 'all') {
    mdb.collection('tours')
      .findOne({
        $and: [
          { tour_type: req.params.tourList },
          { tour_id: req.params.tourId },
        ],
      },
      (err, data) => {
        res.send(data);
      });
  } else {
    mdb.collection('tours')
      .findOne({
        tour_id: req.params.tourId,
      },
      (err, data) => {
        res.send(data);
      });
  }
});

router.get('/admin/:tourId', jsonParser, (req, res) => {
  mdb.collection('tours')
    .findOne({
      tour_id: req.params.tourId,
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
      },
    );
});

router.post('/admin/:tourId/edit', jsonParser, (req, res) => {
  mdb.collection('tours')
    .updateOne(
      { tour_id: req.body.tour_id },
      { $set: req.body },
      { upsert: true },
      (err, msg) => {
        res.send(msg);
      },
    );
});

router.post('/admin/:tourId/delete', jsonParser, (req, res) => {
  mdb.collection('tours')
    .deleteOne(
      { tour_id: req.body.tour_id },
      (err, msg) => {
        res.send(msg);
      },
    );
});

router.post('/admin/add-menu', jsonParser, (req, res) => {
  mdb.collection('tour_menu')
    .insertOne(
      { $set: req.body },
      (err, msg) => {
        res.send(msg);
      },
    );
});

router.post('/admin/static-pages/:page/edit', jsonParser, (req, res) => {
  mdb.collection('static_pages')
    .updateOne(
      { permalink: req.body.permalink },
      { $set: req.body },
      { upsert: true },
      (err, msg) => {
        res.send(msg);
      },
    );
});

router.post('/admin/static-pages/:permalink/delete', jsonParser, (req, res) => {
  mdb.collection('static_pages')
    .deleteOne(
      { permalink: req.body.permalink },
      (err, msg) => {
        res.send(msg);
      },
    );
});

module.exports = router;

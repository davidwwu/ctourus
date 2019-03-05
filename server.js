// ----------------------------------------------------------------------------

// core
const http = require('http');
const path = require('path');
const querystring = require('querystring');

// npm
require('dotenv').config();
if(process.env.NODE_ENV === 'dev') {
  var morgan = require('morgan');
}

const express = require('express');
const favicon = require('serve-favicon');
const sassMiddleware = require('node-sass-middleware');
const axios = require('axios');


// ----------------------------------------------------------------------------
// setup
const api = require('./api');

const production = {
  contact: true,
  about: true,
  'tour-details': true
};

// Filter an obj based on provided query.
// Returns true if all queries are met, else return false
let filterObjByQuery = (obj, query) => {
  let flag = true;
  for(let [key, value] of Object.entries(query)) {
    if(obj[key] != value) flag = false;
  }

  return flag;
}

let removeObjArrDuplicate = (objArr, targetKey) => {
  let uniqueArr = Array.from(new Set(objArr.map(obj => obj[targetKey])));
  
  return uniqueArr;
}

// ----------------------------------------------------------------------------
// application

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));
app.enable('strict routing');
app.enable('case sensitive routing');
app.disable('x-powered-by');

app.use(sassMiddleware({
  src: path.join(__dirname, 'src/styles'),
  dest: path.join(__dirname, 'public/styles'),
  outputStyle: 'compressed',
  prefix: '/styles'
}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/api', api);
app.use(express.static('public'));

if(process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

// load default data
app.use(
  (req, res, next) => {
    res.locals.title = 'CTOURUS 盛事假期';

    next();
  },
  (req, res, next) => {
    axios.get(`${serverUrl}/api/tours/tour-menu`)
      .then(({ data }) => {
        res.locals.tour_menu = data;

        next();
      })
  }
);

app.get("/", (req, res) => {
  axios.get(`${serverUrl}/api/tours/highlight-tours`)
    .then(({ data }) => {
      res.render('index', {
        page_type: 'home',
        tour_slides: data.tour_slides,
        highlight_tours: data.tours
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/about", (req, res) => {
  res.render('about');
});

app.get("/tour-terms", (req, res) => {
  res.render('tour-terms');
});

app.get("/faq", (req, res) => {
  res.render('faq');
});

app.get("/contact", (req, res) => {
  res.render('contact');
});

app.get('/tours/:tourList', function (req, res) {
  axios.get(`${serverUrl}/api/tours/${req.params.tourList}`)
    .then(({ data }) => {
      let filteredData = data;
      if(Object.keys(req.query).length != 0) {
        filteredData = data.filter(trip => filterObjByQuery(trip, req.query));
      }
      
      res.render('tour-list', {
        page_type: 'tour',
        tour_list: req.params.tourList,
        filter: req.query,
        query_str: querystring.stringify(req.query),
        start_cities: removeObjArrDuplicate(data, 'start_city'),
        durations: removeObjArrDuplicate(data, 'duration'),
        data: filteredData
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/tours/:tourList/:tourId', function (req, res) {
  axios.get(`${serverUrl}/api/tours/${req.params.tourList}/${req.params.tourId}`)
    .then(({ data }) => {
      res.render('tour-details', {
        page_type: 'tour',
        data
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

// TODO: fix 404 catching
app.use('*', (req, res) => {
  res.set('Content-Type', 'text/plain')
  res.status(404).send('404 - Not Found\n')    
});

// ----------------------------------------------------------------------------
// server

// listen for requests
const port = process.env.PORT || 3000;
const server = http.createServer();
const serverUrl = `http://${process.env.HOST || '0.0.0.0'}:${port}`;

server.on('request', app);
server.listen(port, () => {
  console.log('Your app is listening on port ' + port)
});


// ----------------------------------------------------------------------------


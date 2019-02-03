// ----------------------------------------------------------------------------

// core
const http = require('http');
const path = require('path');

// npm
require('dotenv').config();
if(process.env.NODE_ENV === 'development')
  var morgan = require('morgan');

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

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// load default data
app.use(
  (req, res, next) => {
    res.locals.title = 'CTOURUS 盛事假期'
    next();
  },
  (req, res, next) => {
    axios.get(`${serverUrl}/api/tours/tour-menu`)
      .then(({ data }) => {
        
        res.locals.tour_menu = data

        next();
      })
  }
);

app.get("/", (req, res) => {
  axios.get(`${serverUrl}/api/tours/highlight-tours`)
    .then(({ data }) => {
      res.render('index', {
        page_type: 'home',
        data
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

app.get('/:tourList/:tourId?', function (req, res) {
  if(!req.params.tourId) {
    axios.get(`${serverUrl}/api/tours/regular-tours/${req.params.tourList}`)
      .then(({ data }) => {
        res.render('tour-list', {
          page_type: 'tour',
          tour_list: req.params.tourList,
          data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    axios.get(`${serverUrl}/api/tours/regular-tours/${req.params.tourList}/${req.params.tourId}`)
      .then(({ data }) => {
        res.render('tour-details', {
          page_type: 'tour',
          data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

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


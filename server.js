// ----------------------------------------------------------------------------

// core
const http = require('http');
const path = require('path');
const querystring = require('querystring');

// npm
require('dotenv').config();
if(process.env.NODE_ENV === 'development') {
  var morgan = require('morgan');
}

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const sassMiddleware = require('node-sass-middleware');
const axios = require('axios');
const multer = require('multer');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash-2');

// json web token configuration for tiny drive
const jwt = require('jsonwebtoken');
let privateKey;
if(process.env.NODE_ENV === 'production') {
  privateKey = JSON.parse(process.env.RSA_PRIVATE);
} else {
  privateKey = process.env.RSA_PRIVATE;
}


// ----------------------------------------------------------------------------
// setup
const api = require('./api');
const adminController = require('./src/controllers/adminController');
const authController = require('./src/controllers/authController');

// Filter an obj based on provided query.
// Returns true if all queries are met, else return false
let filterObjByQuery = (obj, query) => {
  let flag = true;
  for(let [key, value] of Object.entries(query)) {
    // special case for price filter
    if(key === 'starting_price') {
      value.forEach((q) => {
        let qArr = q.split('-');
        let opr = qArr[0],
            num = qArr[1];
        
        if(opr === 'gte' && obj[key] < num)
          flag = false;
        else if(opr === 'lte' && obj[key] > num)
          flag = false;
      });
    } else {
      if(obj[key] != value) flag = false;
    }
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

// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(sassMiddleware({
  src: path.join(__dirname, 'src/styles'),
  includePaths: ['./node_modules/'],
  dest: path.join(__dirname, 'public/styles'),
  outputStyle: 'compressed',
  prefix: '/styles'
}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/api', api);
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat', 
  cookie: { maxAge: 86400e3 },
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(authController.authStrategy);
passport.serializeUser(authController.authSerializer);
passport.deserializeUser(authController.authDeserializer);

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

var storage = multer.diskStorage({
  destination: './public/images/userUpload/',
  filename: function (req, file, cb) {
    console.log(req);
    console.log(file);
    let filename = file.originalname;
    cb(null, filename);
  }
});
 
var upload = multer({ storage: storage })

// load default data
app.use(
  (req, res, next) => {
    res.locals.title = 'CTOURUS 盛事假期';

    next();
  },
  (req, res, next) => {
    axios.get(`${serverUrl}/api/static-pages/page-menu`)
      .then(({ data }) => {
        res.locals.static_pages = data;

        next();
      });
  },
  (req, res, next) => {
    axios.get(`${serverUrl}/api/tours/tour-menu`)
      .then(({ data }) => {
        res.locals.tour_menu = data;
        res.locals.tour_menu.forEach(function(menuItem) {
          menuItem.durations = removeObjArrDuplicate(menuItem.sub_menus, 'duration');
          menuItem.start_cities = removeObjArrDuplicate(menuItem.sub_menus, 'start_city');
          menuItem.end_cities = removeObjArrDuplicate(menuItem.sub_menus, 'end_city');
        })

        next();
      });
  }
);

app.get("/", (req, res) => {
  axios.get(`${serverUrl}/api/tours/front-page`)
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

app.get("/highlight-tours", (req, res) => {
  axios.get(`${serverUrl}/api/tours/highlight-tours`)
    .then(({ data }) => {
      res.render('index', {
        page_type: 'home',
        highlight_tours: data.tours
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/static-pages/:page" , (req, res) => {
  axios.get(`${serverUrl}/api/static-pages/${req.params.page}`)
    .then(({ data }) => {
      // TODO - better 404 handling
      if(!data) {
        res.render('static_page', {
          content: 'Sorry, no page found',
          name: 'Oops...'
        });
      } else {
        res.render('static_page', {
          content: data.content,
          name: data.name
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/tours/:tourList', (req, res) => {
  // Always request full data from the list category
  // and do filtering here, reason being that we want
  // to show the full filter for the list category,
  // otherwise we could move the filtering logic to
  // the api.
  // In the future, perhaps we could make apis to
  // extract filter options from the db or even create
  // a new collection/document to hold all filters,
  // but that's for another time.
  axios.get(`${serverUrl}/api/tours/${req.params.tourList}`)
    .then(({ data }) => {
      let filteredData = data;
      if(Object.keys(req.query).length !== 0) {
        filteredData = data.filter(trip => filterObjByQuery(trip, req.query));
      }
      
      res.render('tour-list', {
        page_type: 'tour',
        tour_list: req.params.tourList,
        filter: req.query,
        query_str: querystring.stringify(req.query),
        data: filteredData
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/tours/:tourList/:tourId', (req, res) => {
  axios.get(`${serverUrl}/api/tours/${req.params.tourList}/${req.params.tourId}`)
    .then(({ data }) => {
      res.render('tour-details', {
        page_type: 'tour',
        tour_list: req.params.tourList,
        data
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/new-user', (req, res) => {
  res.render('new_user');
});
app.post('/new-user', [urlencodedParser], authController.user_create_post);

app.get('/admin-login', (req, res) => {
  res.render('admin_login');
});
app.post('/admin-login', [urlencodedParser], authController.login);

app.get('/admin-logout', authController.logout);

app.get('/admin', [authController.restrict], adminController.get_tours_list);

app.get('/admin/:tourId/edit', [authController.restrict], adminController.get_edit_tour);
app.get('/admin/static-pages', [authController.restrict], adminController.get_static_page_list);
app.get('/admin/static-pages/:page/edit', [authController.restrict], adminController.get_edit_static_page);

app.post('/admin/:tourId/save-and-quit', [authController.restrict, urlencodedParser], adminController.post_edit_tour_save_and_quit);
app.post('/admin/:tourId/save', [authController.restrict, urlencodedParser], adminController.post_edit_tour_save);
app.post('/admin/create-tour', [authController.restrict, urlencodedParser], adminController.post_create_tour);
app.post('/admin/:tourId/duplicate', [authController.restrict, urlencodedParser], adminController.post_duplicate_tour);
app.post('/admin/:tourId/delete', [authController.restrict, urlencodedParser], adminController.post_delete_tour);
app.post('/admin/image/upload', upload.single("file"), (req, res) => {
  res.send({ location : `/images/userUpload/${req.file.filename}` });
});
app.post('/admin/static-pages/:page/save', [authController.restrict, urlencodedParser], adminController.post_edit_static_page_save);
app.post('/admin/static-pages/:page/save-and-quit', [authController.restrict, urlencodedParser], adminController.post_edit_static_page_save_and_quit);

app.post('/jwt', [authController.restrict], function (req, res) {
  const payload = {
    // Unique user id string
    sub: req.cookies.userInfo.id,

    // Full name of user
    name: req.cookies.userInfo.username,

    // Optional custom user root path
    // 'https://claims.tiny.cloud/drive/root': '/johndoe',

    // 1 day expiration
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
  };

  try {
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256'});
    res.set('content-type', 'application/json');
    res.status(200);
    res.send(JSON.stringify({
      token: token
    }));
  } catch (e) {
    res.status(500);
    res.send(e.message);
  }
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


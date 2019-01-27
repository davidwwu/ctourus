// ----------------------------------------------------------------------------

// core
const http = require('http')
const path = require('path')

// npm
const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const sassMiddleware = require('node-sass-middleware')


// ----------------------------------------------------------------------------
// setup
const apiRouter = require('./api/apiRouter');

const production = {
  contact: true,
  about: true
}

// ----------------------------------------------------------------------------
// application

const app = express()
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'src/views'));
app.enable('strict routing')
app.enable('case sensitive routing')
app.disable('x-powered-by')

app.use(sassMiddleware({
  src: path.join(__dirname, 'src/styles'),
  dest: path.join(__dirname, 'public/styles'),
  outputStyle: 'compressed',
  prefix: '/styles'
}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use('/api', apiRouter);
app.use(express.static('public'))

app.use(morgan('dev'))

app.use((req, res, next) => {
  res.locals.title = 'Pug Site'
  next()
})

app.get("/", (req, res) => {
  res.render('index')
})

app.get("/:name", (req, res) => {
  if ( req.params.name in production ) {
    res.render(req.params.name)
  }
  else {
    res.set('Content-Type', 'text/plain')
    res.status(404).send('404 - Not Found\n')    
  }
})

// ----------------------------------------------------------------------------
// server

// listen for requests
const port = process.env.PORT || 3000;
const server = http.createServer()
server.on('request', app)
server.listen(port, () => {
  console.log('Your app is listening on port ' + port)
})

// ----------------------------------------------------------------------------


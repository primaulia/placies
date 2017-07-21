// before everything else. load the .env file
require('dotenv').config()

// all the modules we install and we need to require
const mongoose = require('mongoose')
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const bodyParser = require('body-parser')

// heroku addon way
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/placies'

// self adding
// const url = process.env.MLAB_URI || 'mongodb://localhost:27017/placies'

mongoose.Promise = global.Promise
mongoose.connect(url, {
  useMongoClient: true
}).then(
  function () { // resolve cb
    console.log('connected successfully')
  },
  function (err) { // reject cb
    console.log(err)
  }
)

// this is the express itself
const app = express()

// set middleware
app.use(express.static('public'))
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: process.env.MONGODB_URI
  })
}))

// setup all files that the proj needs to require
const placesRoute = require('./routes/placeRoute')
const usersRoute = require('./routes/userRoute')

// setup app.locals variables

app.locals = {
  GOOGLE_PLACE_KEY: process.env.GOOGLE_PLACE_KEY
}

// setup your project routes
// NO REQUIRING AFTER THIS LINE
// public paths
app.get('/', function (req, res) {
  req.flash('message', 'from the bottle')
  res.render('home')
})

// non public paths
app.use('/places', placesRoute)
app.use('/users', usersRoute)

// and this is opening the port
const port = process.env.PORT || 5000
app.listen(port, function () {
  console.log(`express is running on ${port}`)
})

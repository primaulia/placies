const express = require('express')
const router = express.Router()
const request = require('request')

const placesController = require('../controllers/places_controller')

router.get('/flash', function (req, res) {
  res.send({
    'flash': req.flash('message')
  })
})

router.get('/', function (req, res) {
  // const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'
  // const qString = 'query=hotels in singapore'
  // const apiKey = '&key=AIzaSyCxNyn5I2Me-fv147nnW5uqrRmhVrabebI'
  //
  // const finalUrl = `${apiUrl}${qString}${apiKey}`

  // request(finalUrl, function (err, response, data) {
  //   if (err) throw err
  //
  //   // console.log(JSON.parse(data.results[0]))
  //   var data = JSON.parse(data)
  //   var results = data.results
  //   res.send(JSON.parse(data))
  //
  //   res.render('places')
  // })

  res.render('places/index')
})

// implementation / calling the fn
router.post('/', placesController.create)

module.exports = router

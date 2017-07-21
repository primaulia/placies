
$(function () {
// $(document).ready(function() { // same thing as above

  const $placeSearch = $('#placeSearch')
  const $searchResults = $('#searchResults')
  const $keywordSearch = $('#keywordSearch')
  const $spinner = $('#spinner')
  const $newUserForm = $('#newUserForm')

  const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'
  const apiKey = `&key=${GOOGLE_PLACE_KEY}`

  $newUserForm.on('submit', function (e) {
    e.preventDefault()

    $formData = $(this).serializeArray()

    var newUser = {
      user: {
        name: $formData[0].value,
        email: $formData[1].value,
        password: $formData[2].value
      }
    }

    $.ajax({
      url: '/users',
      type: 'post',
      data: JSON.stringify(newUser),
      dataType: 'json',
      contentType: 'application/json',
      success: function (output) {
        console.log(output)
      }
    })

    // $.post('/users', newUser, 'json').done(function (output) {
    //   console.log(output)
    // })
  })

  $searchResults.on('click', '.addBttn', function (e) {
    e.preventDefault()

    const theBttn = $(this)

    var newPlace = {
      name: theBttn.data('name'),
      address: theBttn.data('address'),
      reference: theBttn.data('reference')
    }

    // send the ajax to OUR OWN SERVER

    // console.log('sending new place', newPlace)
    // $.post(url, object)
    $.post('/places', newPlace).done(function (data) {
      if (data.status === 'ok') {
        alert('Hurray! ' + data.message)
      }
    })
  })

  // accessing data for spinner
  $('#spinner').data('speed')

  $placeSearch.on('submit', function (e) {
    e.preventDefault()

    var keywordObj = $(this).serializeArray()
    var keyword = keywordObj[0].value
    var qString = `query=${keyword}`

    var finalUrl = `http://crossorigin.me/${apiUrl}${qString}${apiKey}`
    ajaxTextSearch(finalUrl, keyword)
  })

  function ajaxTextSearch (finalUrl, keyword) {
    $spinner.fadeIn()

    $.get(finalUrl).done(function (data) {
      $spinner.fadeOut()

      var results = data.results

      $keywordSearch.text(`Results for keyword: ${keyword}`)

      if ($searchResults.find('li').length) $searchResults.html('')

      results.forEach(function (place) {
        var $newLi = $('<li>')
        var $newH2 = $('<h2>')
        var $newP = $('<p>')

        var photoReference = ''

        if (!place.photos) {
          photoReference = ''
        } else {
          photoReference = place.photos[0].photo_reference
        }

        var $addBttn = $(`<button class="addBttn"
          data-name="${place.name}"
          data-address="${place.formatted_address}"
          data-reference="${photoReference}"
        >add</button>`)

        $newH2.text(place.name)
        $newP.text(place.formatted_address)

        $newLi.append($newH2, $newP, $addBttn)
        $searchResults.append($newLi)
      })
    })
  }
})

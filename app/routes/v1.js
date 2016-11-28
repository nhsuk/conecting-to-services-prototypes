var express = require('express')
var router = express.Router()

var request = require('request')
var naturalSort = require('javascript-natural-sort')
var postcode_api = process.env.POSTCODE_API

// V1 prototype. Sprints 0-3. Simple recreation of GMS1

// URL structure is /v1/ROUTE

// Start page ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/start', function (req, res) {
  req.session.destroy();
  res.render('v1/start', {
    suppressServiceName: true
  });
});

// Name ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/example', function (req, res) {
  res.render('v1/example', {
    session: req.session
  });
});

router.post('/find-a-pharmacy', function (req, res) {

  req.session.postcode = {
    'postcode': req.body['postcode']
  };

})

router.post('/name', function (req, res) {

  var passed = true;
  var errors = {};

  req.session.example = {
    'firstName': req.body['first-name'],
    'middleNames': req.body['middle-names'],
    'lastName': req.body['last-name'],
    'nameChanged': req.body['name-changed'],
    'firstNamePrev': req.body['first-name-previous'],
    'middleNamesPrev': req.body['middle-names-previous'],
    'lastNamePrev': req.body['last-name-previous']
  };

  if (req.body['first-name'] === '' || req.body['last-name'] === '') {
    errors['name'] = 'Please enter your full name';
    passed = false;
  }

  if (!req.body['name-changed']) {
    errors['name-changed'] = 'Please answer this question';
    passed = false;
  }

  if (req.body['name-changed'] === 'yes' && !req.body['first-name-previous'] && !req.body['last-name-previous']) {
    errors['previous-name'] = 'Please enter your previous name';
    passed = false;
  }

  if (passed === false) {
    res.render('v1/name', {
      errors,
      session: req.session
    });
  } else {
    if (req.session.edit === true) {
      res.redirect('confirm-details')
    } else {
      res.redirect('date-of-birth')
    }
  }

})

module.exports = router

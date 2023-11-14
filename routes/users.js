var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/teste', function(req, res, next) {
  res.send('AAAAAAAAAAAAAAA');
});

module.exports = router;

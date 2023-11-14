var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Essa é a rota de funcionários!');
});

module.exports = router;
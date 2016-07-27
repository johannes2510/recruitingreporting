var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = require(path.join(__dirname,'../','../', 'config'));
var models = require('../../node_modules/.bin/models/index')

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../','../', 'client', 'views', 'employee.html'));
});



module.exports = router;

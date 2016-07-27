var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = require(path.join(__dirname,'../','../', 'config'));
var models = require('../../node_modules/.bin/models/index')

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../','../', 'client', 'views', 'newEmp.html'));
});


// create new employee

router.post('/employees', function(req, res) {
  models.Employee.create({
    emp_name: req.body.emp_name,
    emp_firstname: req.body.emp_firstname,
    emp_role: req.body.emp_role,
    VellowId: req.body.VellowId
    //vellow_id: req.body.vellow_id      
    //emp_counselor: req.body.counselor_id
  }).then(function(employee) {
    res.json(vellow);
  });
});



module.exports = router;

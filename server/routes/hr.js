var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname,'../','../', 'config'));

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../','../', 'client', 'views', 'hr.html'));
});



router.put('/hr/placeholder/:emp_id', function(req, res) {
    
    var results = [];
    
    var id = req.params.emp_id;

    var data = {id: req.body.emp_id};
    
    pg.connect(connectionString, function(err, client, done) {
      
        if(err) {
            done();
            console.log(err);
            return res.status(500).send(json({ success: false, data:err}));
        }
        
        client.query("UPDATE employee set emp_counselor='Test' where emp_id =($1);", [id]);
        
        var query = client.query("SELECT * from employees");
        
        query.on('row', function(row){
            results.push(row);
        });
        
        query.on('end', function(){
            done();
            return res.json(results);
        });
    });
});
module.exports = router;

var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname,'../','../', 'config'));


router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../','../', 'client', 'views', 'index.html'));
});


router.post('/api/v1/todos', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {text: req.body.text, complete: false};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        //client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM active_emp ORDER BY id ASC");
        

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            console.log(results);
            return res.json(results[0]);
        });


    });
});

router.get('/api/v1/todos', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM incoming_per_month");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});

router.get('/api/v1/emps', function(req, res) {
    var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        // SQL Query > Select Data
        var query = client.query("SELECT emp_name ||', ' || emp_firstname AS emp_name, to_char(emp_start_date, 'DD-MM-YYYY') AS emp_start, emp_role FROM active_emp WHERE emp_start_date < current_date ORDER BY emp_start_date DESC LIMIT 5;");
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });    
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});


router.get('/api/v1/stats', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM rec_steps_org where phase <>'Gesamt';");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});


router.get('/api/v1/group', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT recruiter_group, sum, round(round*100,2) As round FROM rec_per_group_success;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});

router.get('/api/v1/recs', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT introduced_list, anzahl, round(round*100,2) As round FROM rec_per_recruiter_success order by round DESC LIMIT 5;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});


router.get('/api/v1/gender', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT round from f_quota where emp_gender = 'f';");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});


router.get('/api/v1/attrition', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("select a.year, ROUND((a.sum / (select count(emp_id) from active_emp where emp_start_date < '31.12.2015')*100),1) as emp_count from            sum_leavers a where a.year = '2015';");
        
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});

router.get('/api/v1/currentEmps', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("select count(*) as anzahl from active_emp where emp_start_date <= current_date;");
        
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});

router.get('/api/v1/incomingCV', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("select sum(sum) as incoming from incoming_per_month where incoming LIKE '%2015';");
        
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});

router.get('/api/v1/runningApps', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("select anzahl from rec_asses_overall where assessment_status = 'Running';");
        
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});

router.get('/api/v1/newEmps', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("select count(*) as new_emps from employee where emp_start_date >= '01.01.2015' AND emp_start_date <='31.12.2015';");
        
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});

router.get('/api/v1/counseling', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("select distinct(a.emp_counselor), emp.emp_name, count(a.emp_counselor) from employee a left join (select emp_id, emp_name ||', ' || emp_firstname as emp_name from employee) emp on a.emp_counselor = emp.emp_id where a.emp_status = 'active' and a.emp_counselor <> 0 group by a.emp_counselor, emp.emp_name order by count(a.emp_counselor) DESC LIMIT 5;");
        
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});

router.get('/api/v1/fullList', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("select a.emp_id, a.emp_name, a.emp_firstname, to_char(a.emp_birthday,'DD.MM.YYYY') as emp_birthday, a.emp_gender, to_char(a.emp_start_date, 'DD.MM.YYYY') as emp_start_date, to_char(a.emp_end_date, 'DD.MM.YYYY') as emp_end_date, a.emp_role, a.emp_status, b.emp_counselor from employee a left join (select emp_id, emp_name ||', '|| emp_firstname AS emp_counselor from employee) b on a.emp_counselor = b.emp_id group by a.emp_id, b.emp_counselor order by a.emp_id;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });
});


module.exports = router;

var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = require(path.join(__dirname,'../','../', 'config'));
var models = require('../../node_modules/.bin/models/index')
var sequelize = require('sequelize');

pg.default = require('pg');

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../','../', 'client', 'views', 'index.html'));
});

router.get('/employees', function(req, res) {
    models.Employee.findAll({ include: [models.Vellow, models.Counselor]
    }).then(function(employees){
        res.json(employees);
        console.log(employees);
    });
    
});

// get all candidates
router.get('/candidates', function(req, res) {
    models.Candidate.findAll({ include: [models.Recruiter]
    }).then(function(candidates){
        res.json(candidates);
        console.log(candidates);
    });
    
});

router.get('/candidate/:id', function(req, res){
    models.Candidate.find({
        where: {
        id: req.params.id
    }
    }).then(function(candidate){
        res.json(candidate);
    });
});

//insert a new vellow

router.post('/vellows', function(req, res) {
  models.Vellow.create({
    vellow_firstname: req.body.vellow_firstname,
    vellow_name: req.body.vellow_name,
    vellow_status: req.body.vellow_status  
  }).then(function(vellow) {
    res.json(employee);
  });
});

// create new employee

router.post('/employees', function(req, res, $scope) {
  models.Employee.create({
    emp_name: req.body.emp_name,
    emp_firstname: req.body.emp_firstname,
    emp_role: req.body.emp_role,
    emp_start_date: req.body.emp_start_date,
    emp_address: req.body.emp_address,
    emp_email: req.body.emp_email,  
    emp_phone: req.body.emp_phone,
    emp_mobile: req.body.emp_mobile,
    emp_emergency: req.body.emp_emergency,
    emp_birthday: req.body.emp_birthday, 
    emp_contract_no: req.body.emp_contract_no,
    emp_contract: req.body.emp_contract, 
    emp_gender: req.body.emp_gender,
    emp_status: 'active',  
    VellowId: req.body.VellowId,
    CounselorId: 3 
    //vellow_id: req.body.vellow_id      
    //emp_counselor: req.body.counselor_id
  }).then(function(employee) {
    res.json(employee);
  });
});


router.get('/vellows', function(req, res) {
    models.Vellow.findAll({}).then(function(vellows){
        res.json(vellows);
    });
    
});

router.get('/employee/:id', function(req, res){
    models.Employee.find({
        where: {
        id: req.params.id
    }
    }).then(function(employee){
        res.json(employee);
    });
});




router.get('/vellow/:id', function(req, res){
    models.Vellow.find({
        where: {
        id: req.params.id
    }
    }).then(function(vellow){
        res.json(vellow);
    });
});

router.put('/employee/:id', function(req, res){
    models.Employee.find({
        where: {
            id: req.params.id
        }
    }).then(function(employee){
        if(employee){
            employee.updateAttributes({
                emp_name: req.body.emp_name,
                emp_firstname: req.body.emp_firstname,
                emp_role: req.body.emp_role,
                VellowId: req.body.VellowId
            }).then(function(employee){
                res.send(employee);
            });
        }
    });
});

router.put('/vellows/:id', function(req, res){
    models.Vellow.find({
        where: {
            id: req.params.id
            
        }
    }).then(function(vellow){
        if(vellow){
            vellow.updateAttributes({
            vellow_firstname: req.body.vellow_firstname,
            vellow_name: req.body.vellow_name,
            vellow_status: req.body.vellow_status
            
            }).then(function(vellow1){
                res.send(vellow1);
            });
        }
    });
});

router.delete('/employee/:id', function(req,res){
    models.Employee.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(employee){
        res.json(employee);
    });
});


// get all recruiters
router.get('/recruiters', function(req, res) {
    models.Recruiter.findAll({ include: [models.Recruitergroup]
    }).then(function(recruiters){
        res.json(recruiters);
        console.log(recruiters);
    });
    
});

router.get('/recruiters/:id', function(req, res){
    models.Recruiter.find({
        where: {
        id: req.params.id
    }
    }).then(function(recruiter){
        res.json(recruiter);
    });
});

// get recruiter stats
router.get('/recruiterstats', function(req, res) {
var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }
        // Die letzten fünf Einstellungen
        var query = client.query("SELECT recruiter_name, recruitergroup_name, gesamt::real, running::real, nojobaftercv::real, stepbackcv::real, stepbackti::real, stepbackpi::real, endti::real, endpi::real, contract_denied::real, contract_signed::real, sleep::real  from recruiters_all");
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


//old stuff starts here


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
        
        // Eingehende Bewerbungen pro Monat
        var query = client.query("SELECT to_char(incoming, 'MM-YYYY') as incoming, sum FROM incoming_per_month;");

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
  models.Employee.findAll({ where: { emp_start_date: {$ne: null} }, limit: 5, order: '"emp_start_date" DESC'            
                             
                             }).then(function(candidates){
        res.json(candidates);
        //console.log(candidates);
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

        // Anzahl pro Prozessschritt
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

        // Einstellungen je Recruiter Gruppe
        var query = client.query("SELECT recruitergroup_name, anzahl, round(round*100,2) As round FROM rec_per_group_success order by round DESC;");

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

        // Einstellungen je Recruiter
        var query = client.query("SELECT introduced_list, anzahl, round(round*100,2)::real As round FROM rec_per_recruiter_success order by anzahl DESC;");

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

        var query = client.query("select round from f_quota where emp_gender = 'f';");
        
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

        // Attrition Rate
        var query = client.query("select a.year, ROUND((a.sum / (select count(id) from active_emp where emp_start_date < '31.12.2015')*100),2) as emp_count from sum_leavers a where a.year = '2015';");
        
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

        // Anzahl Mitarbeiter
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
        var query = client.query("select sum(sum) as incoming from incoming_per_month where incoming > (current_date - INTERVAL '12 Months');");
        
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
        var query = client.query("select anzahl from rec_assess_overall where assessment_status = 'Running';");
        
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
        var query = client.query("select new_emps from count_new_emps;");
        
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
        var query = client.query("select counselor_firstname, counselor_name, anzahl::real from counselors;");
        
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

router.get('/api/v1/fullList/:emp_id', function(req, res) {
  models.Todo.find({
    where: {
      id: req.params.id
    }
  }).then(function(todo) {
    res.json(todo);
  });
});

router.put('/api/v1/fullList/:emp_id', function(req, res, $scope) {

    //var results = [];

    // Grab data from the URL parameters
    var id = req.params.emp_id;
    var newVellow = employeeModel.emp_vellow;
    var newRole = 'PM3 Test'; //$scope.employeeModel.role;

    // Grab data from http request
    var data = {text: $scope.employeeModel.emp_vellow, complete: newRole};
    
    console.log(newVellow);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE employee SET emp_vellow=($1), emp_counselor=($2) WHERE emp_id=($3)", [data.text, data.complete, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM employee ORDER BY emp_id ASC");

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

router.get('/api/v1/lqincoming', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // Incoming CVs letztes Quartal
        var query = client.query("select sum(sum) from incoming_per_month where quarter = extract(quarter from date_trunc('quarter', current_date)::date - 1) group by quarter, date_trunc('year', incoming);");
        
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
        var query = client.query("select a.emp_id,a.emp_name,a.emp_firstname,to_char(a.emp_birthday,'DD.MM.YYYY') as emp_birthday,a.emp_gender,to_char(a.emp_start_date, 'DD.MM.YYYY') as emp_start_date,to_char(a.emp_end_date, 'DD.MM.YYYY') as emp_end_date,a.emp_role,a.emp_status, a.emp_counselor,a.emp_vellow, a.emp_contract, date_part('year',age(emp_birthday)) as emp_age , (CASE WHEN emp_end_date is null THEN 'seit ' || date_part('year',age(emp_start_date))::text || ' Jahren bei Ventum' ELSE 'nicht mehr bei Ventum' END) AS emp_duration  from employee a group by a.emp_id order by a.emp_id;");

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

router.get('/api/v1/hiresLQ', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }

        // Hires last quarter
        var query = client.query("SELECT * FROM hired_last_quarter");

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

    // check.
    router.get('/api/v1/hiresAbsLQ', function(req, res) {
    models.Candidate.findAll({ where: {
                candidate_name: 'Huml, Dominik' }            
                             
                             }).then(function(candidates){
        res.json(candidates);
        //console.log(candidates);
    });

    });
module.exports = router;

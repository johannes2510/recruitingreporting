'use strict';

google.load('visualization', '1', {packages:['corechart', 'orgchart']});

var nodeTodo = angular.module('nodeTodo', ['angularUtils.directives.dirPagination']);

//angular.module('nodeTodo', ['angularUtils.directives.dirPagination']);

    nodeTodo.controller('mainController', ['$scope', '$http', function($scope, $http) {

    $scope.formData = {};
    $scope.todoData = {};
    $scope.employeeModel = {};    
    
    // Get database input
    $http.get('/api/v1/todos')
        .success(function(data) {
    
        var chartInput = angular.toJson(data);
        var incomingData =[];

        var chartData = new google.visualization.DataTable();
        chartData.addColumn('string', 'Monat');
        chartData.addColumn('number', 'Bewerbungen');
        for(var i=0;i<data.length; i++){
            incomingData.push([data[i].incoming, parseInt(data[i].sum)]);
        }
        chartData.addRows(incomingData);
        var chart = new google.visualization.LineChart(document.getElementById('chartdiv'));
     var options = {
     legend: 'none',
     backgroundColor: 'whitesmoke',
     curveType: 'function',
     pointSize: 10,
     series: {0:{color:'F38921',lineWidth:2}},
     animation:{
         "startup": true,
         duration: 1000,
         easing: 'out',
     }
      };  
        chart.draw(chartData, options);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        })
}]);

// neuer Controller für Recruiter

nodeTodo.controller('recruiterController', ['$scope', '$http', function($scope, $http){
    $http.get('/recruiterstats')
    .success(function(data) {
    $scope.recruiteralls = data;
        console.log(data);
    })
    $scope.sort = function(keyname){
    $scope.sortKey = keyname;
    $scope.reverse = !$scope.reverse;
}
 
        
    }]);

//controller für Mitarbeiterliste

nodeTodo.controller('mlController', ['$scope', '$http', function($scope, $http){
    $http.get('/employees')
    .success(function(data) {
    $scope.mls = data;
    })
    $scope.sort = function(keyname){
    $scope.sortKey = keyname;
    $scope.reverse = !$scope.reverse;
}
 
        
    }]);
    
nodeTodo.controller('newEmployeeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.createTodo = function(){
            $http.post('/employees', $scope.formData).success(function(data){
                $scope.formData = {};
                $location.absUrl() == 'http://localhost:3000/ml';
                alert("Der neue Mitarbeiter wurde erfolgreich gespeichert");
        }).error(function(error) {
            console.log('Error: ' + error);
        });
    };
}]);  


nodeTodo.controller('groupController', ['$scope', '$http', function($scope, $http){
    // Get database input
    $http.get('/api/v1/group')
        .success(function(data) {
    
    $scope.groups = data;
        })
}]);

nodeTodo.controller('recController', ['$scope', '$http', function($scope, $http){
    // Get database input
    $http.get('/api/v1/recs')
        .success(function(data) {
    
    $scope.recs = data;
        })
    $scope.sort = function(keyname){
    $scope.sortKey = keyname;
    $scope.reverse = !$scope.reverse;
} 
}]
              
                   );


nodeTodo.controller('pieController', ['$scope', '$http', function($scope, $http){
    
    // get data from postgresql
    $http.get('/api/v1/stats')
    .success(function(data){
        var pieData =[];

        var chartData = new google.visualization.DataTable();
        chartData.addColumn('string', 'Status');
        chartData.addColumn('number', 'Summe');
        for(var i=0;i<data.length; i++){
            pieData.push([data[i].phase, parseInt(data[i].rest)]);
            chartData.addRow(pieData[i]);
        }
        var chart = new google.visualization.BarChart(document.getElementById('piediv'));
        var options = 
            {
            legend: 'none',
            backgroundColor: 'whitesmoke',
            series: {0:{color:'F38921',lineWidth:2}},
            animation:{
                "startup": true,
                duration: 1000,
                easing: 'out',
            }
            };  
        chart.draw(chartData, options, {allowHtml:true});
        })
        .error(function(error) {
            console.log('Error: ' + error);    
    })
}]);

    nodeTodo.controller('empController', ['$scope', '$http', function($scope, $http){
        
    // Get database input
    $http.get('/api/v1/emps')
        .success(function(data) {
    
    $scope.employees = data;

         })
    
    
    }]);





    nodeTodo.controller('genderController', ['$scope', '$http', function($scope, $http){
    // Get database input
    $http.get('/api/v1/gender')
        .success(function(data) {
    $scope.genders = data[0].round * 100;

         })
    
    
    }]);

nodeTodo.controller('attrController', ['$scope', '$http', function($scope, $http){
        
    // Get database input
    $http.get('/api/v1/attrition')
        .success(function(data) {
    
    $scope.attr = data[0].emp_count;    
        //console.log(genders[0].round);
         })
    }]);
        
nodeTodo.controller('crEmpsController', ['$scope', '$http', function($scope, $http){
        
    // Get database input
    $http.get('/api/v1/currentEmps')
        .success(function(data) {
    
    $scope.empsNow = data[0].anzahl;    
        //console.log(genders[0].round);
         })
    }]);

nodeTodo.controller('cvController', ['$scope', '$http', function($scope, $http){
        
    // Get database input
    $http.get('/api/v1/incomingCV')
        .success(function(data) {
    $scope.cvIn = data[0].incoming;    
         })
    
    }]);

nodeTodo.controller('appInController', ['$scope', '$http', function($scope, $http){
        
    // Get database input
    $http.get('/api/v1/runningApps')
        .success(function(data) {
    $scope.runCV = data[0].anzahl;    
         })
    
    }]);

nodeTodo.controller('newEmpsController', ['$scope', '$http', function($scope, $http){
        
    // Get database input
    $http.get('/api/v1/newEmps')
        .success(function(data) {
    $scope.newEmps = data[0].new_emps;    
         })
    
    }]);


nodeTodo.controller('counselingController', ['$scope', '$http', function($scope, $http){

    // Get database input
    $http.get('/api/v1/counseling')
        .success(function(data) {
            $scope.counselors = data;
        })
        $scope.sort = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
}
        $scope.getCounselor = function (emp_name) {
            var selectedCounselor = $scope.ddlCounselor;
            console.log(selectedCounselor);
        }
        
        
        

}]);

nodeTodo.controller('fullListController', ['$scope', '$http', function($scope, $http, recVellow){

         nodeTodo.service('recVellow', function(selectedVellow){
            var _vellow = selectedVellow;
            this.getSelectedVellow = function(){
                return _vellow;
            }
            
        }); 
    
        $http.get('/api/v1/fullList')
        .success(function(data) {
            $scope.fulllists = data;
        })
        $scope.sort = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
}
        
        $scope.clickRow = function($index, fulllist) {
        $scope.selectedRow = this.fulllist;
        console.log($scope.selectedRow);
};
        $scope.isActive = function(fulllist) {
            if(fulllist.emp_status == 'active') {
                return true;
            }
            return false;
        };

            $scope.getVellow = function(emp_name){
            var selectedVellow = $scope.employeeModel.emp_vellow;
            //recVellow.getSelectedVellow(selectedVellow);    
};

            

        $scope.onSubmit = function(empID) {
        var emp_id = empID;    
        console.log($scope.employeeModel);    
        $http.put('/api/v1/fullList/'+emp_id, $scope.employeeModel).success(function(data) {
            console.log("success");
        }).error(function(data) {
            console.log(data);
        });    
    };
}]);

nodeTodo.controller('incomingLQController', ['$scope', '$http', function($scope, $http){

    // Get database input
    $http.get('/api/v1/lqincoming')
        .success(function(data) {
             $scope.LQIn = data[0].sum;  
        })

}]);

nodeTodo.controller('hiresLQController', ['$scope', '$http', function($scope, $http){

    // Get database input
    $http.get('/api/v1/hiresLQ')
        .success(function(data) {
             $scope.HQIn = data[0].gesamt;  
        })
}]);   

nodeTodo.controller('hiresLQAbsController', ['$scope', '$http', function($scope, $http){

    // Get database input
    $http.get('/api/v1/hiresAbsLQ')
        .success(function(data) {
             $scope.HQAbsIn = data[0].gesamt;  
        })
}]);   
 



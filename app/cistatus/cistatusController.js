// Controller for CIStatus overview page
angular.module('devops').controller('cistatusController', cistatusController);

function cistatusController($http) {
  var self = this;
  var updateSpeed = 2.5;
  self.loading = true;

  angular.forEach(self.checkModel, function(value, key) {
    if (value) {
      self.checkResults.push(key);
    }
  });
  angular.forEach(self.checkModelLayer, function(value, key) {
    if (value) {
      self.checkResults.push(key);
    }
  });

  self.show = false;

  self.applications = applications[0];
  self.webapps = self.applications.webapps;
  self.service = self.applications.service;
  self.db = self.applications.db;
  console.log(self.webapps);
  console.log(self.service);
  console.log(self.db);

  self.environments = [];
  self.environments =
    self.environments.concat(self.db, self.service, self.webapps);

  console.log(self.environments);

  // Makes request to cistatus API endpoint, sets self.jobs to response and
  // recalls itself at dynamic interval
  self.getData = function() {
    $http.get('/api/cistatus')
      .then(function(response) {
        var searchit = [];
        self.jobs = response.data.jobs;
        self.timestamp = response.data.timestamp;
        self.yearVersions = response.data.yearVersions;
        console.log(self.yearVersions);
        self.useDetailsPage = response.data.useDetailsPage;
        self.loading = false;
        setTimeout(self.getData, updateSpeed * 60000);
      });
  };

  // Invokes method on controller load
  self.getData();
}

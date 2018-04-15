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


  self.getData = function() {
    $http.get('/api/cistatus')
      .then(function(response) {
        self.oneDayAgo = moment().add(-1, 'days');
        self.twoDaysAgo = moment().add(-2, 'days');
        self.jobStatus = {};
        self.jobStatus.blue = {};
        self.jobStatus.redDeploy = {};
        self.jobStatus.redReview = {};
        self.jobStatus.notbuilt = {};
        self.jobStatus.unstable = {};
        self.jobStatus.failed1Day = {};
        self.jobStatus.failed1DayLessThan2 = {};
        self.jobs = response.data.jobs;
        self.timestamp = response.data.timestamp;
        self.yearVersions = response.data.yearVersions;
        //console.log(self.yearVersions);
        self.jobs.forEach(function(job) {
          var result = job;
          self.yearVersions.forEach(function(yv) {
            //deployStatus
            if(job[yv].deployStatus){
              if (job[yv]['deployStatus'] == 'blue') {
                if (!self.jobStatus.blue[yv]){
                  self.jobStatus.blue[yv] = 0;
                }
                self.jobStatus.blue[yv] += 1;
              } else if (job[yv]['deployStatus'] == 'red'){
                  if (!self.jobStatus.redDeploy[yv]){
                  self.jobStatus.redDeploy[yv] = 0;
                } else if (self.oneDayAgo > job[yv]['deployLast']) {
                  if (!self.jobStatus.failed1Day[yv]){
                    self.jobStatus.failed1Day[yv] = 0;
                  }
                  self.jobStatus.failed1Day[yv] += 1;
                  if (job[yv]['deployLast'] > self.twoDaysAgo) {
                    if (!self.jobStatus.failed1DayLessThan2[yv]){
                      self.jobStatus.failed1DayLessThan2[yv] = 0;
                    }
                    self.jobStatus.failed1DayLessThan2[yv] += 1;
                  }
                }
                self.jobStatus.redDeploy[yv] += 1;
              } else if (job[yv]['deployStatus'] == 'notbuilt'){
                if (!self.jobStatus.notbuilt[yv]){
                  self.jobStatus.notbuilt[yv] = 0;
                }
                self.jobStatus.unstable[yv] += 1;
              } else if (job[yv]['deployStatus'] == 'yellow'){
                if (!self.jobStatus.unstable[yv]){
                  self.jobStatus.unstable[yv] = 0;
                }
                self.jobStatus.unstable[yv] += 1;
              }
            }
            // reviewStatus
            if(job[yv].reviewStatus){
              if (job[yv]['reviewStatus'] == 'blue') {
                if (!self.jobStatus.blue[yv]){
                  self.jobStatus.blue[yv] = 0;
                }
                self.jobStatus.blue[yv] += 1;
              } else if (job[yv]['reviewStatus'] == 'red'){
                if (!self.jobStatus.redReview[yv]){
                  self.jobStatus.redReview[yv] = 0;
                } else if (self.oneDayAgo > job[yv]['reviewLast']) {
                  if (!self.jobStatus.failed1Day[yv]){
                    self.jobStatus.failed1Day[yv] = 0;
                  }
                  self.jobStatus.failed1Day[yv] += 1;
                  if (job[yv]['reviewLast'] > self.twoDaysAgo) {
                    if (!self.jobStatus.failed1DayLessThan2[yv]){
                      self.jobStatus.failed1DayLessThan2[yv] = 0;
                    }
                    self.jobStatus.failed1DayLessThan2[yv] += 1;
                  }
                }
                self.jobStatus.redReview[yv] += 1;
              } else if (job[yv]['reviewStatus'] == 'notbuilt'){
                  if (!self.jobStatus.notbuilt[yv]){
                    self.jobStatus.notbuilt[yv] = 0;
                  }
                  self.jobStatus.notbuilt[yv] += 1;
              } else if (job[yv]['reviewStatus'] == 'yellow'){
                  if (!self.jobStatus.unstable[yv]){
                    self.jobStatus.unstable[yv] = 0;
                  }
                  self.jobStatus.unstable[yv] += 1;
              }
            }
          })
        })

        //self.useDetailsPage = response.data.useDetailsPage;
        self.loading = false;
        setTimeout(self.getData, updateSpeed * 60000);
      });
  };

  // Invokes method on controller load
  self.getData();
}

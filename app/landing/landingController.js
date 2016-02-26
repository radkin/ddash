// Controller for the landing page
angular.module('devops').controller('landingController', landingController);

function landingController($http) {
  var self = this;
  var updateSpeed = 2.5;
  self.loading = true;

  // refactor categories into hash table
  self.categories = categories;

  // Makes request to landing API endpoint, sets self.results to response and
  // recalls itself at dynamic interval
  self.getData = function() {
    $http.get('/api/landing')
      .then(function(response) {

        // console.log(response.data.results);
        // self.results = response.data.results;
        self.results = JSON.parse(JSON.stringify(response.data.results));
        var current = [];
        for (var i = 0; i < self.results[0].length; i++) {
          var result = self.results[0][i];
          var subject = result.subject;
          var machine = subject.split(':')[2];
          machine = machine.trim();
          for (var cat in self.categories) {
            var category = self.categories[cat];
            for (var link in category.links) {
              if (typeof category.links[link].zabName != "undefined" &&
                category.links[link].zabName === machine) {
                // filter out previous alerts

                var resultClock = parseInt(result.clock);
                if (typeof category.links[link].clock == 'undefined') {
                  category.links[link].clock = resultClock;
                  // console.log('setting displayed clock to ' + resultClock);
                }
                if (result.status === "1" &&
                  result.message.split(':')[0] == 'PROBLEM' &&
                  category.links[link].clock < resultClock) {
                  // console.log(resultClock + ' is greater than ' +
                  // category.links[link].clock);
                  category.links[link].icon = 'red';
                  category.links[link].subject = subject;
                  category.links[link].clock = resultClock;
                } else {
                  category.links[link].icon = 'blue';
                }
              }
            }
          }
        }
        // console.log(self.results);
      })
      .catch(function(error) {
        console.log('error gathering zabbix host data', error);
      });
  };

  console.log('gathering zabbix host data');

  // Invokes method on controller load
  self.getData();
}

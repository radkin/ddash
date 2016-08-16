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
          console.log(result);
          var description = result.description;
          var machine = result.host;
          machine = machine.trim();
          for (var cat in self.categories) {
            var category = self.categories[cat];
            for (var link in category.links) {
              if (typeof category.links[link].zabName != "undefined" &&
                category.links[link].zabName === machine) {
                category.links[link].icon = 'red';
                category.links[link].description = description;
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

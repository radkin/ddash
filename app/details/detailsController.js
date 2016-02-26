// Controller for details page
angular.module('devops').controller('detailsController', detailsController);

function detailsController($routeParams, $http) {
  var self = this;
  var updateSpeed = 2.5;

  // Grabbing title from Route paramaters
  self.title = $routeParams.id + ' ' + $routeParams.version;
  self.loading = true;
  self.builds = [];

  // Makes request to details API endpoint with the route params, sets
  // self.builds to response and recalls itself at dynamic interval
  self.getData = function() {
    $http.get('/api/details/' + $routeParams.id + '/' + $routeParams.version)
      .then(function(response) {
        self.builds = response.data.builds;
        self.builds[0].open = true;
        self.timestamp = response.data.timestamp;
        self.loading = false;
        setTimeout(self.getData, updateSpeed * 60000);
      })
      .catch(function(err) {
        console.log(err);
        self.loading = false;
      });
  };

  // Invokes method on controller load
  self.getData();
}

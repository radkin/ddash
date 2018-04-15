angular.module('devops').controller('buildfinderController', buildfinderController);

function buildfinderController($http) {
  var self = this;
  var updateSpeed = 2.5;
  self.loading = true;
  self.buildObjects = [];


  self.getData = function() {
    $http.get('/api/buildfinder')
      .then(function(response) {
        //console.log(response.data.hits);
        self.hits = JSON.parse(JSON.stringify(response.data.hits));
        for (var i = 0; i < self.hits.length; i++) {
          var hit = self.hits[i];
          //console.log(hit._source);
          self.buildObjects.push(hit._source);
        }
        //console.log(self.buildObjects)
      })
      .catch(function(error) {
        console.log('error gathering jenkins build data', error);
      });
  };

  console.log('gathering jenkins build data');
  self.getData();
}

// Controller for the landing page
angular.module('devops').controller('landingController', landingController);

function landingController() {
  var self = this;

  // refactor categories into hash table
  self.categories = categories;
}

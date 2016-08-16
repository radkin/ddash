
// Heart of the Angular application
angular
  .module('devops', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'ngResource', 'ngCookies', 'ngMessages'])
  .controller('mainController', mainController)
  .config(mainConfig);

function mainConfig($routeProvider) {
  // Setting up routing using ngRoute
  $routeProvider.when('/', {
      templateUrl: 'app/landing/landingView.html',
    })
    .when('/cistatus', {
      templateUrl: 'app/cistatus/cistatusView.html',
    })
    .when('/cistatusnoc', {
      templateUrl: 'app/cistatusNoc/cistatusNocView.html',
    })
    .when('/cistatussearch', {
      templateUrl: 'app/cistatusSearch/cistatusSearchView.html',
    })
    .when('/feedback', {
      templateUrl: 'app/feedback/feedbackView.html',
    })
    .when('/login', {
      templateUrl: 'app/login/loginView.html',
    })
    .when('/cistatus/:id/:version', {
      templateUrl: 'app/details/detailsView.html',
    })
    .otherwise('/');
}

function mainController() {
  var self = this;
  // Default state of sidebar
  self.showSidebar = true;
}

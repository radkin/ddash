// Heart of the Angular application
angular
  .module('devops', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'ngResource', 'ngCookies', 'ngMessages'])
  .controller('mainController', mainController)
  .config(mainConfig)
  .directive('tooltip', function(){
      return {
          restrict: 'A',
          link: function(scope, element, attrs){
              $(element).hover(function(){
                  $(element).tooltip('show');
              }, function(){
                  $(element).tooltip('hide');
              });
          }
      };
  });

function mainConfig($routeProvider) {
  // Setting up routing using ngRoute
  $routeProvider.when('/', {
      templateUrl: 'app/landing/landingView.html',
    })
    .when('/cistatus', {
      templateUrl: 'app/cistatus/cistatusView.html',
    })
    .when('/cistatus1', {
      templateUrl: 'app/cistatus/cistatusView1.html',
    })
    .when('/cistatus2', {
      templateUrl: 'app/cistatus/cistatusView2.html',
    })
    .when('/cistatus3', {
      templateUrl: 'app/cistatus/cistatusView3.html',
    })
    .when('/cistatusFailed', {
      templateUrl: 'app/cistatus/cistatusFailedView.html',
    })
    .when('/cistatusSuccess', {
      templateUrl: 'app/cistatus/cistatusSuccessView.html',
    })
    .when('/cistatusNotBuilt', {
      templateUrl: 'app/cistatus/cistatusNotBuiltView.html',
    })
    .when('/cistatusUnstable', {
      templateUrl: 'app/cistatus/cistatusUnstableView.html',
    })
    .when('/cistatus1Failed', {
      templateUrl: 'app/cistatus/cistatus1FailedView.html',
    })
    .when('/cistatus1Success', {
      templateUrl: 'app/cistatus/cistatus1SuccessView.html',
    })
    .when('/cistatus1NotBuilt', {
      templateUrl: 'app/cistatus/cistatus1NotBuiltView.html',
    })
    .when('/cistatus1Unstable', {
      templateUrl: 'app/cistatus/cistatus1UnstableView.html',
    })
    .when('/cistatus2Failed', {
      templateUrl: 'app/cistatus/cistatus2FailedView.html',
    })
    .when('/cistatus2Success', {
      templateUrl: 'app/cistatus/cistatus2SuccessView.html',
    })
    .when('/cistatus2NotBuilt', {
      templateUrl: 'app/cistatus/cistatus2NotBuiltView.html',
    })
    .when('/cistatus2Unstable', {
      templateUrl: 'app/cistatus/cistatus2UnstableView.html',
    })
    .when('/cistatus3Failed', {
      templateUrl: 'app/cistatus/cistatus3FailedView.html',
    })
    .when('/cistatus3Success', {
      templateUrl: 'app/cistatus/cistatus3SuccessView.html',
    })
    .when('/cistatus3NotBuilt', {
      templateUrl: 'app/cistatus/cistatus3NotBuiltView.html',
    })
    .when('/cistatus3Unstable', {
      templateUrl: 'app/cistatus/cistatus3UnstableView.html',
    })
    .when('/buildfinder', {
      templateUrl: 'app/buildfinder/buildfinderView.html',
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

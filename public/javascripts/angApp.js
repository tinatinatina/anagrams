var angApp = angular.module('AngApp', ['ngRoute', 'AppController']);

angApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'client/views/home.html',
        controller: 'homeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
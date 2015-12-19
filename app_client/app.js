'use strict';

var servicesModule = angular.module('app.services', []);

// Declare app level module which depends on views, and components
var app = angular.module('app.csvGenerator', [
  // 'templates',
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'ngMaterial',
  'app.services',
  // 'ui.bootstrap'
])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider
//   .otherwise({redirectTo: '/'});
// }]);
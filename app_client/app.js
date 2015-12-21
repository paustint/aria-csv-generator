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
]);

app.factory('Page', function(){
  var title = 'default';
  return {
    title: function() { return title; },
    setTitle: function(newTitle) { title = newTitle; }
  };
});

app.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}]);
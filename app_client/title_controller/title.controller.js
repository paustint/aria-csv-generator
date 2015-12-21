'use strict'

app.controller('TitleController', ['$scope', '$location', 'Page', function($scope, $location, Page) {
  $scope.Page = Page;
  
  $scope.navigate = function(pageString) {
    $location.path(pageString);
  }
  
  $scope.path = function(pathString) {
    if ($location.path() === pathString || $location.path() === pathString + '/') {
      return true;
    } else {
      return false;
    }
  }
  
}]);
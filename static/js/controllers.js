var app = angular.module('AppControllers', []);

app.controller('MovieQuotesCtrl', function($scope, $rootScope) {

  var setStatus = function(status) {
  	$rootScope.status = status;
  }

});

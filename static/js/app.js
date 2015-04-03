'use strict';

var app = angular.module('App', ['AppControllers', 'AppServices']);

app.run(function($rootScope, cloudEndpoints){
  $rootScope.status = "Endpoints Loaded!";
});

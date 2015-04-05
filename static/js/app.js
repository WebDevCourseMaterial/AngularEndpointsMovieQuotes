'use strict';

var app = angular.module('App', ['ui.bootstrap', 'AppControllers']);

app.run(function($rootScope){
  $rootScope.status = "Endpoints Loaded!";
});

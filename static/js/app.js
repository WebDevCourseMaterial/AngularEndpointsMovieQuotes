'use strict';

var app = angular.module('App', [ 'ui.bootstrap', 'AppControllers' ]);

app.run(function($rootScope) {
  $rootScope.status = "Endpoints Loaded!";
  angular.element( document.querySelector( '.hidden.container' ) ).removeClass('hidden');
  // TODO: Make a backend request.
});

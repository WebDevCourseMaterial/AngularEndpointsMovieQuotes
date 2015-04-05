"use strict";

(function() {
  var app = angular.module("App", [ "ui.bootstrap" ]);

  app.controller("MovieQuotesCtrl", function($scope, $rootScope) {

    this.items = movies;

  });

  var movies = [{"quote": "Quote 1", "movie": "Movie 1", "key": {"urlsafe": function(){return "myKey1"} }},
                {"quote": "Quote 2", "movie": "Movie 2", "key": {"urlsafe": function(){return "myKey2"} }},
                {"quote": "Quote 3", "movie": "Movie 3", "key": {"urlsafe": function(){return "myKey3"} }},
                ];

  app.run(function($rootScope) {
    angular.element(document.querySelector(".hidden.container")).removeClass("hidden");
    angular.element(document.querySelectorAll(".hidden.nav.navbar-nav")).removeClass("hidden");
    angular.element(document.querySelector("#loading-message")).addClass("hidden");

    // TODO: Make a backend request.
  });
})();

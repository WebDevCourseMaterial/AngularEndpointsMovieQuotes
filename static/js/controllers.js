var app = angular.module('AppControllers', []);

app.controller('MovieQuotesCtrl', function($scope, $rootScope) {

  this.items = movies;

  var setStatus = function(status) {
    $rootScope.status = status;
  }

});

var movies = [{"quote": "Quote 1", "movie": "Movie 1", "key": {"urlsafe": function(){return "myKey1"} }},
              {"quote": "Quote 2", "movie": "Movie 2", "key": {"urlsafe": function(){return "myKey2"} }},
              {"quote": "Quote 3", "movie": "Movie 3", "key": {"urlsafe": function(){return "myKey3"} }},
              ]

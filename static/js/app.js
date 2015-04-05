var app = angular.module("App", [ "ui.bootstrap" ]);

app.controller("MovieQuotesCtrl", function($scope) {
  $scope.items = [];



  $scope.listMovieQuotes = function (limit, pageToken) {
    var bindResult = function(movieQuoteCollection) {
        $scope.items = movieQuoteCollection.items || [];
        $scope.$apply();
      };
    gapi.client.moviequotes.moviequote.list({"order": "-last_touch_date_time", "limit": limit}).execute(
      function (resp) {
        if (!resp.code) {
          bindResult(resp);
        }
    });
  };

  $scope.insertMovieQuote = function (movieTitle, quote) {
    // TODO: Add the movie quote right now, then fire the Endpoints call.
    var postJson = {
        'movie_title': movieTitle,
        'quote': quote
      };
      gapi.client.moviequotes.quote.insert(postJson).execute(function (resp) {
        if (!resp.code) {
        }
      });
    };

  $scope.deleteMovieQuote = function (movieQuoteId) {
    gapi.client.moviequotes.quote.delete({
      'id': movieQuoteId
    }).execute(function (resp) {
        if (!resp.code) {
          console.log("Deleting now remove from DOM");
        }
      });
  };

  // Make the initial backend request.
  $scope.listMovieQuotes(10);
});

app.run(function() {
  angular.element(document.querySelector(".hidden.container")).removeClass("hidden");
  angular.element(document.querySelectorAll(".hidden.nav.navbar-nav")).removeClass("hidden");
  angular.element(document.querySelector("#loading-message")).addClass("hidden");
});

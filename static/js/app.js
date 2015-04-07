var app = angular.module("App", [ "ui.bootstrap" ]);

app.controller("MovieQuotesCtrl", function($scope, $modal) {
  $scope.items = [];

  $scope.showInsertQuoteDialog = function (size) {
      var modalInstance = $modal.open({
        templateUrl: "/static/partials/insertQuoteModal.html",
        controller: 'InsertQuoteModalCtrl'
      });
      modalInstance.result.then(function (movieQuote) {
          $scope.items.unshift(movieQuote);
      });
    };

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


  $scope.deleteMovieQuote = function (movieQuoteId) {
    gapi.client.moviequotes.moviequote.delete({
      "id": movieQuoteId
    }).execute(function (resp) {
        if (!resp.code) {
          console.log("Deleting now remove from DOM");
        }
      });
  };

  // Make the initial backend request.
  $scope.listMovieQuotes(10);
});


app.controller("InsertQuoteModalCtrl", function ($rootScope, $scope, $modalInstance) {
  $scope.insertQuote = function () {
    var movieQuote = {
            "quote": $scope.quote,
            "movie": $scope.movie,
            "entityKey": $scope.entityKey
          };
    gapi.client.moviequotes.moviequote.insert(movieQuote).execute(function (resp) {
      if (!resp.code) {
        movieQuote.entityKey = resp.entityKey;
      }
    });
    $modalInstance.close(movieQuote);
  };

  $scope.cancel = function () {
     $modalInstance.dismiss("cancel");
  };
});

app.run(function() {
  angular.element(document.querySelector(".hidden.container")).removeClass("hidden");
  angular.element(document.querySelectorAll(".hidden.nav.navbar-nav")).removeClass("hidden");
  angular.element(document.querySelector("#loading-message")).addClass("hidden");
});

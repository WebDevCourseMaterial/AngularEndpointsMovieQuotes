var app = angular.module("App", [ "ui.bootstrap" ]);

app.controller("MovieQuotesCtrl", function($scope, $modal) {
  $scope.items = [];

  $scope.showInsertQuoteDialog = function (movieQuoteFromRow) {
      var modalInstance = $modal.open({
        templateUrl: "/static/partials/insertQuoteModal.html",
        controller: "InsertQuoteModalCtrl",
        resolve: {
            movieQuoteInModal: function () {
              return movieQuoteFromRow;
            }
        }
      });
      modalInstance.result.then(function (movieQuoteFromModal) {
        if (movieQuoteFromRow == null) {
          $scope.items.unshift(movieQuoteFromModal);
        }
        $scope.isEditing = false;
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


/* ### Modal Controllers ### */

app.controller("InsertQuoteModalCtrl", function ($scope, $modalInstance, $timeout, movieQuoteInModal) {
  $scope.isNewQuote = movieQuoteInModal == undefined;
  $scope.movieQuote = movieQuoteInModal;
  $scope.insertQuote = function () {
    gapi.client.moviequotes.moviequote.insert($scope.movieQuote).execute(function (resp) {
      if (!resp.code) {
        $scope.movieQuote.entityKey = resp.entityKey;
      }
    });
    $modalInstance.close($scope.movieQuote);
  };

  $scope.cancel = function () {
     $modalInstance.dismiss("cancel");
  };

  $modalInstance.opened.then(function() {
    $timeout(function() {
      // Note the opened promise is still too early.  Added a 100mS delay to give Chrome time to put the DOM in place.
      document.querySelector("#quote-input").focus();
    }, 100);
  });
});

app.run(function() {
  angular.element(document.querySelector(".hidden.container")).removeClass("hidden");
  angular.element(document.querySelectorAll(".hidden.nav.navbar-nav")).removeClass("hidden");
  angular.element(document.querySelector("#loading-message")).addClass("hidden");
});

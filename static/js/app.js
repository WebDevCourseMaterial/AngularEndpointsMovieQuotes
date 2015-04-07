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

  $scope.showDeleteQuoteDialog = function (movieQuoteFromRow) {
    var modalInstance = $modal.open({
      templateUrl: "/static/partials/deleteQuoteModal.html",
      controller: "DeleteQuoteModalCtrl",
      resolve: {
          movieQuoteInModal: function () {
            return movieQuoteFromRow;
          }
      }
    });
    modalInstance.result.then(function (movieQuoteFromModal) {
      var index = $scope.items.indexOf(movieQuoteFromModal);
      if (index > -1) {
        $scope.items.splice(index, 1);
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

  // Make the initial backend request.
  $scope.listMovieQuotes(10);
});


/* ### Modal Controllers ### */

app.controller("InsertQuoteModalCtrl", function ($scope, $modalInstance, $timeout, movieQuoteInModal) {
  if (movieQuoteInModal == undefined) {
    $scope.isNewQuote = true;
  } else {
    $scope.quoteValue = movieQuoteInModal.quote;
    $scope.movieValue = movieQuoteInModal.movie;
  }

  $scope.insertQuote = function () {
    movieQuoteInModal = movieQuoteInModal || {};
    movieQuoteInModal.quote = $scope.quoteValue;
    movieQuoteInModal.movie = $scope.movieValue;
    gapi.client.moviequotes.moviequote.insert(movieQuoteInModal).execute(function (resp) {
      if (!resp.code) {
        // Update the fields that the server modified when the MovieQuote was put into the Datastore.
        movieQuoteInModal.last_touch_date_time = resp.last_touch_date_time;
        movieQuoteInModal.entityKey = resp.entityKey;
      }
    });
    $modalInstance.close(movieQuoteInModal);
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

app.controller("DeleteQuoteModalCtrl", function ($scope, $modalInstance, movieQuoteInModal) {
  $scope.movieQuote = movieQuoteInModal;
  $scope.deleteQuote = function () {
    console.log("Deleting quote");
    gapi.client.moviequotes.moviequote.delete({"entityKey": movieQuoteInModal.entityKey}).execute(function (resp) {
      if (!resp.code) {
        console.log("Delete MovieQuote on backend as well.");
      }
    });
    $modalInstance.close($scope.movieQuote);
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

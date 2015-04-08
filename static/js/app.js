var app = angular.module("App", [ "ui.bootstrap" ]);

app.controller("MovieQuotesCtrl", function($scope, $modal) {
  this.items = [];
  this.DEFAULT_LIMIT = 40;

  this.showInsertQuoteDialog = function(movieQuoteFromRow) {
    var modalInstance = $modal.open({
      templateUrl: "/static/partials/insertQuoteModal.html",
      controller: "InsertQuoteModalCtrl",
      controllerAs: "insertModal",
      resolve: {
          movieQuoteInModal: function () {
            return movieQuoteFromRow;
          }
      }
    });
    var movieQuotesCtrl = this;
    modalInstance.result.then(function(movieQuoteFromModal) {
      if (movieQuoteFromRow != null) {
        var index = movieQuotesCtrl.items.indexOf(movieQuoteFromModal);
        if (index > -1) {
          movieQuotesCtrl.items.splice(index, 1);
        }
      }
      movieQuotesCtrl.items.unshift(movieQuoteFromModal);
      movieQuotesCtrl.isEditing = false;
    });
  };


  this.showDeleteQuoteDialog = function(movieQuoteFromRow) {
    var modalInstance = $modal.open({
      templateUrl: "/static/partials/deleteQuoteModal.html",
      controller: "DeleteQuoteModalCtrl",
      controllerAs: "deleteModal",
      resolve: {
          movieQuoteInModal: function () {
            return movieQuoteFromRow;
          }
      }
    });
    var movieQuotesCtrl = this;
    modalInstance.result.then(function (movieQuoteFromModal) {
      var index = movieQuotesCtrl.items.indexOf(movieQuoteFromModal);
      if (index > -1) {
        movieQuotesCtrl.items.splice(index, 1);
      }
      movieQuotesCtrl.isEditing = false;
    });
  };


  this.listMovieQuotes = function(pageToken, limit) {
    var movieQuotesCtrl = this;
    var queryParameters = {"order": "-last_touch_date_time",
                           "limit": limit || this.DEFAULT_LIMIT,
                           "pageToken": pageToken || null};
    gapi.client.moviequotes.moviequote.list(queryParameters).execute(
      function (resp) {
        if (!resp.code) {
          movieQuotesCtrl.items.push.apply(movieQuotesCtrl.items, resp.items || []);
          movieQuotesCtrl.pageToken = resp.nextPageToken;
          $scope.$apply();
        }
    });
  };

  // Make the initial backend request.
  this.listMovieQuotes();

  // Check to see if more quotes need to be loaded.
  var movieQuotesCtrl = this;
  window.addEventListener("scroll", function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (movieQuotesCtrl.pageToken) {
        movieQuotesCtrl.listMovieQuotes(movieQuotesCtrl.pageToken);
      }
    }
  });

});


/* ### Modal Controllers ### */

app.controller("InsertQuoteModalCtrl", function ($modalInstance, $timeout, movieQuoteInModal) {
  this.isNewQuote = movieQuoteInModal == undefined;
  this.quoteValue = movieQuoteInModal.quote || "";
  this.movieValue = movieQuoteInModal.movie || "";

  this.insertQuote = function () {
    movieQuoteInModal = movieQuoteInModal || {};
    movieQuoteInModal.quote = this.quoteValue;
    movieQuoteInModal.movie = this.movieValue;
    gapi.client.moviequotes.moviequote.insert(movieQuoteInModal).execute(function (resp) {
      if (!resp.code) {
        // Update the fields that the server modified when the MovieQuote was put into the Datastore.
        movieQuoteInModal.last_touch_date_time = resp.last_touch_date_time;
        movieQuoteInModal.entityKey = resp.entityKey;
      }
    });
    $modalInstance.close(movieQuoteInModal);
  };

  this.cancel = function () {
     $modalInstance.dismiss("cancel");
  };

  $modalInstance.opened.then(function() {
    $timeout(function() {
      // Note the opened promise is still too early.  Added a 100mS delay to give Chrome time to put the DOM in place.
      document.querySelector("#quote-input").focus();
    }, 100);
  });
});


app.controller("DeleteQuoteModalCtrl", function ($modalInstance, movieQuoteInModal) {
  this.deleteQuote = function () {
    gapi.client.moviequotes.moviequote.delete({"entityKey": movieQuoteInModal.entityKey}).execute(function (resp) {
      if (!resp.code) {
        console.log("Deleted MovieQuote on backend as well.");
      }
    });
    $modalInstance.close(movieQuoteInModal);
  };

  this.cancel = function () {
     $modalInstance.dismiss("cancel");
  };
});


app.run(function() {
  // Using simple jQuery commands to hide the Loading message container and show the real page.
  angular.element(document.querySelector(".hidden.container")).removeClass("hidden");
  angular.element(document.querySelectorAll(".hidden.nav.navbar-nav")).removeClass("hidden");
  angular.element(document.querySelector("#loading-message")).addClass("hidden");
});

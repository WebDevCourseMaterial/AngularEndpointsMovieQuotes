/* ### Modal Controllers ### */
(function() {
  var app = angular.module("modal-controllers", [ "ui.bootstrap"]);

  app.controller("InsertQuoteModalCtrl", function ($modalInstance, $timeout, movieQuoteInModal) {
    this.isNewQuote = movieQuoteInModal == undefined;
    movieQuoteInModal = movieQuoteInModal || {};
    this.quoteValue = movieQuoteInModal.quote || "";
    this.movieValue = movieQuoteInModal.movie || "";
  
    this.insertQuote = function () {
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

})();

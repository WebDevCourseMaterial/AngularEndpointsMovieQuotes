var app = angular.module("App", [ "ui.bootstrap" ]);

app.controller("MovieQuotesCtrl", function() {
  this.items = [{"quote": "Quote 1", "movie": "Movie 1", "key": {"urlsafe": function(){return "myKey1"} }},
                {"quote": "Quote 2", "movie": "Movie 2", "key": {"urlsafe": function(){return "myKey2"} }},
                {"quote": "Quote 3", "movie": "Movie 3", "key": {"urlsafe": function(){return "myKey3"} }},
               ];

  this.listMovieQuotes = function (limit, pageToken) {
      gapi.client.moviequotes.moviequote.list({"order": "-last_touch_date_time", "limit": limit}).execute(
        function (resp) {
          if (!resp.code) {
            this.items = resp.items || []; // Create an empty array if the field is null.
            // TODO: Figure out why this isn't displaying in the UI
            console.log("I was hoping that any modification to this.items would update the UI.  Guess I don't get it yet. ;)");

            // Loop through in reverse order since the newest goes on top.
            for (var i = resp.items.length - 1; i >= 0; i--) {
              var movieQuote = resp.items[i];
              console.log("Received quote: " + movieQuote.quote);
              console.log("    from movie: " + movieQuote.movie);
            }
          }
        });
  };

  this.insertMovieQuote = function (movieTitle, quote) {
    var postJson = {
        'movie_title': movieTitle,
        'quote': quote
      };
      gapi.client.moviequotes.quote.insert(postJson).execute(function (resp) {
        if (!resp.code) {
        }
      });
    };
  this.deleteMovieQuote = function (movieQuoteId) {
    gapi.client.moviequotes.quote.delete({
      'id': movieQuoteId
    }).execute(function (resp) {
        if (!resp.code) {
          console.log("Deleting now remove from DOM");
        }
      });
  };

  // TODO: Make the initial backend request.
  this.listMovieQuotes(10);
});

app.run(function() {
  angular.element(document.querySelector(".hidden.container")).removeClass("hidden");
  angular.element(document.querySelectorAll(".hidden.nav.navbar-nav")).removeClass("hidden");
  angular.element(document.querySelector("#loading-message")).addClass("hidden");
});

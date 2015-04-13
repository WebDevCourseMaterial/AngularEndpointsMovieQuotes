init = function() {
  var apisToLoad;
  var apiRoot = '//' + window.location.host + '/_ah/api';
  var callback = function() {
    if (--apisToLoad == 0) {
      // Bootstrap AngularJS manually AFTER our Endpoints API has been loaded.
      angular.bootstrap(document, [ "app" ]);
    }
  }
  apisToLoad = 1; // must match number of calls to gapi.client.load()
  gapi.client.load('moviequotes', 'v1', callback, apiRoot);
};

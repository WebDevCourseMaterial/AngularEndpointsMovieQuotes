
init = function() {
  var apisToLoad;
  var apiRoot = '//' + window.location.host + '/_ah/api';
	var callback = function() {
		if (--apisToLoad == 0) {
			//bootstrap manually angularjs AFTER our api is loaded
			angular.bootstrap(document, [ "App" ]);
		}
	}
	apisToLoad = 1; // must match number of calls to gapi.client.load()
	gapi.client.load('moviequotes', 'v1', callback, apiRoot);
};

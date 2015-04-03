
//Below is for the deployed
CLIENT_ID = 'TODO Add';

//Below is for localhost testing
//CLIENT_ID = 'TODO Figure out how to use only one.';

/**
 * Scopes used by the application.
 *
 * @type {string}
 */
SCOPES = 'https://www.googleapis.com/auth/userinfo.email';

/**
 * Response type of the auth token.
 *
 * @type {string}
 */
RESPONSE_TYPE = 'token id_token';


init = function() {
  var apisToLoad;
  var apiRoot = '//' + window.location.host + '/_ah/api';
	var callback = function() {
		if (--apisToLoad == 0) {
			//bootstrap manually angularjs after our api are loaded
			angular.bootstrap(document, [ "App" ]);
		}
	}
	apisToLoad = 1; // must match number of calls to gapi.client.load()
	gapi.client.load('moviequotes', 'v1', callback, apiRoot);
};

var app = angular.module('AppServices', []);
var apiCallInProgress = false;

app.factory('codeTypes', function() {
  return ['Braille', 'Sign Language', 'Text'];
});

app.service('cloudEndpoints', function ($q, $rootScope) {
  this.doCall = function() {
	  if(!apiCallInProgress) {
	    var p = $q.defer();
	    apiCallInProgress = true;
	    gapi.auth.authorize({
	      client_id: CLIENT_ID,
	      scope: SCOPES,
	      immediate: true
	    }, function(){
	      var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
	        if (!resp.code) {
	          p.resolve(gapi);
	        } else {
	          p.reject(gapi);
	        }
	        apiCallInProgress = false;
	      });
	    });
	    return p.promise;
	  }
  };

  this.signin = function(callback) {
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: false
    }, callback);
  };
});

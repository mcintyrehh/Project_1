/*exported OAuthConfig*/
var OAuthConfig = (function() {
  'use strict';

  /* replace these values with yours obtained in the
  "My Applications" section of the Spotify developer site */
  var clientId = '2e12ca59d482427694678b6f76ce6cac';
  var redirectUri = 'http://localhost:8888/callback.html';

  if (location.href.indexOf('https://mcintyrehh.github.io') === 0) {
    redirectUri = 'https://mcintyrehh.github.io/Project_1/callback.html';
  }

  var host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];

  return {
    clientId: clientId,
    redirectUri: redirectUri,
    host: host,
    stateKey: 'spotify_auth_state'
  };
})();

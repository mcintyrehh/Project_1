/*exported OAuthConfig*/
var OAuthConfig = (function() {
  'use strict';

  /* replace these values with yours obtained in the
  "My Applications" section of the Spotify developer site */
  var clientId = '2e12ca59d482427694678b6f76ce6cac';
  var redirectUri = 'https://mcintyrehh.github.io/Project_1/';

  if (location.href.indexOf('http://jmperezperez.com') === 0) {
    redirectUri = 'http://jmperezperez.com/spotify-web-api-start-template/callback.html';
  }

  var host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];

  return {
    clientId: clientId,
    redirectUri: redirectUri,
    host: host,
    stateKey: 'spotify_auth_state'
  };
})();

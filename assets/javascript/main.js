(function () {
  'use strict';

  var ViewModel = function () {
    this.isLoggedIn = ko.observable(false);
    this.login = function () {
      var self = this;
      this.loginErrorMessage(null);
      OAuthManager.obtainToken({
        scopes: [
          "streaming",
          "user-read-birthdate",
          "user-read-email",
          "user-read-private",
          "user-modify-playback-state",
          "user-read-playback-state",
        ]
        /*
          the permission for reading public playlists is granted
          automatically when obtaining an access token through
          the user login form
          */
      }).then(function (token) {
        onTokenReceived(token);
        console.log(token);
      }).catch(function (error) {
        self.loginError(error);
      });
    };

    this.logout = function () {
      localStorage.removeItem(accessTokenKey);
      this.isLoggedIn(false);
    };

    this.loginError = function (errorCode) {
      switch (errorCode) {
        case 'access_denied':
          this.loginErrorMessage('You need to grant access in order to use this website.');
          break;
        default:
          this.loginErrorMessage('There was an error trying to obtain authorization. Please, try it again later.');
      }
    };

    this.loginErrorMessage = ko.observable(null);

    this.user = ko.observable(null);

    this.playlists = ko.observableArray([]);
  };

  var viewModel = new ViewModel();
  ko.applyBindings(viewModel);

  var spotifyApi = new SpotifyWebApi(),
    accessTokenKey = 'sp-access-token';

  function onTokenReceived(token) {
    viewModel.isLoggedIn(true);
    localStorage.setItem(accessTokenKey, token);

    // do something with the token
    spotifyApi.setAccessToken(token);
    spotifyApi.getMe().then(function (data) {
      viewModel.user(data);

    });
    // initialize webplayback SDK! //
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log(localStorage.getItem(accessTokenKey))
      var playToken = localStorage.getItem(accessTokenKey);
      var player = new Spotify.Player({
        name: 'Carly Rae Jepsen Player',
        getOAuthToken: callback => {
          // Run code to get a fresh access token

          callback(playToken);
        },
        volume: 0.5
      });
      //initializing the spotify web api wrapper
      var userID = 124239502;
      var happyPlaylist = '70Vhwte8On581mDvi2F98F'
      var spotifyApi = new SpotifyWebApi();

      var my_client_id = '2e12ca59d482427694678b6f76ce6cac'
      var redirect_uri = 'https://mcintyrehh.github.io/Project_1/'
      var player = new Spotify.Player({
        name: 'Carly Rae Jepsen Player',
        getOAuthToken: callback => {
          // Run code to get a fresh access token
          callback(localStorage.getItem(accessTokenKey));
        },
        volume: 0.5
      });
      player.addListener('ready', ({ device_id }) => {
        console.log('The Web Playback SDK is ready to play music!');
        console.log('Device ID', device_id);
      })
      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });
      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });
      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });
      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });
      // Connect to the player!
      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });
      //is this node.js????? how can i get it to work w/o haha
      $('div').on("click", ".playbtn", function () {
        console.log("PLAY TOKEN: ", playToken)
        $.ajax({
        //   url: 'https://api.spotify.com/v1/users/124239502/playlists/70Vhwte8On581mDvi2F98F',
        //   // https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}
        //   type: 'GET',
        //   headers: {
        //     'Authorization': 'Bearer ' + playToken,
        //   },
        //   ContentType: 'application/json',
        //   Accept: 'application/json',
        //   success: function (data) {
        //     console.log("DATA: ", data)
        //   }
        // })
        //   .done(function (data) {
              url: 'https://api.spotify.com/v1/me/player/play?device_id=22dc7f75b1abd6b1252720ef5c76bddbb9165ccc',
              type: 'PUT',
              // data: {
              //   "context_uri": "spotify:user:124239502:playlist:70Vhwte8On581mDvi2F98F"
              // },
              data: {
                "context_uri":"spotify:user:124239502:playlist:70Vhwte8On581mDvi2F98F",
              },
              headers: {
                'Authorization': 'Bearer ' + playToken,
              },
              ContentType: 'application/json',
              Accept: 'application/json',
            })
              .done(function (data) {
                console.log("number 2 worked!!")
              })
          
      });
      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      })
      player.addListener('ready', ({ device_id }) => {
        console.log('The Web Playback SDK is ready to play music!');
        console.log('Device ID', device_id);
      })
    }
  }
  /**
   * Uses the stored access token
   */
  function initAccessToken() {
    var storedAccessToken = localStorage.getItem(accessTokenKey);
    if (storedAccessToken) {
      onTokenReceived(storedAccessToken);
    }
  }
  initAccessToken();

})();

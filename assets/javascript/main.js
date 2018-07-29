(function () {
  'use strict';

  var ViewModel = function () {
    this.isLoggedIn = ko.observable(false);
    this.login = function () {
      var self = this;
      this.loginErrorMessage(null);
      OAuthManager.obtainToken({
        scopes: [
          /*
            the permission for reading public playlists is granted
            automatically when obtaining an access token through
            the user login form
            */
          'user-read-private',
          // 'user-read-email'
        ]
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

      //playlist pull!
      //  $('.playbtn').on('click', function() {
      //   console.log('at least the click worked');
      //   var userInfo = '/users/124239502'
      //   var happyPlaylist = '/playlists/70Vhwte8On581mDvi2F98F'
      //   var queryURL = 'https://api.spotify.com/v1' + userInfo + happyPlaylist;
      //   $.ajax({
      //     url: queryURL,
      //     method: "GET"
      //   }).then(function (response) {
      //     console.log(response);
      //   });
      //   });
      // spotifyApi.getUserPlaylists(data.id).then(function (playlists) {
      //   console.log(playlists);
      //   viewModel.playlists(playlists.items);
      // });
    });
    // initialize webplayback SDK! //
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log(localStorage.getItem(accessTokenKey))
      var player = new Spotify.Player({
        name: 'Carly Rae Jepsen Player',
        getOAuthToken: callback => {
          // Run code to get a fresh access token

          callback(localStorage.getItem(accessTokenKey));
        },
        volume: 0.5
      });
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
        // fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        play({
          playerInstance: 'Carly Rae Jepsen Player',
          spotify_uri: 'spotify:playlist:70Vhwte8On581mDvi2F98F'
        });
      });
        // const play = ({
        //     spotify_uri,
        //     playerInstance: {
        //       _options: {
        //         getOAuthToken,
        //         id
        //       }
        //     }
        //   }) => {
        //     getOAuthToken(access_token => {
        //       fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        //         method: 'PUT',
        //         body: JSON.stringify({ uris: [spotify_uri] }),
        //         headers: {
        //           'Content-Type': 'application/json',
        //           'Authorization': `Bearer ${access_token}`
        //         },
        //       });
        //     });
        //   };
        //   play({
        //     playerInstance: new Spotify.Player({ name: "..." }),
        //     spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
        //   });
        // });
        //   $.ajax({
        //     url: 'https://api.spotify.com/v1/me',
        //     headers: {
        //         'Authorization': 'Bearer ' + accessToken
        //     },
        //     success: function(response) {
        //     }
        //   });
        // }) 
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

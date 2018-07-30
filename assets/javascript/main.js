(function () {
  'use strict';
  'robustness';
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
      var deviceId;
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
        deviceId = device_id; 
      });
      // Connect to the player!
      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });
      //is this node.js????? how can i get it to work w/o haha
      $('div').on("click", ".playbtn", function () {
        var happyPlaylist = '{"context_uri":"spotify:user:124239502:playlist:70Vhwte8On581mDvi2F98F"}';
        var angryPlaylist = '{"context_uri":"spotify:user:124239502:playlist:2tZ2YeQt0GqmmkzzOft3qf"}';
        var neutralPlaylist = '{"context_uri":"spotify:user:124239502:playlist:2W3ETN59x9kSWizCUilvyR"}';
        var scaryPlaylist = '{"context_uri":"spotify:user:124239502:playlist:36lRfT88Pf3irhXTEcBcJQ"}';
        var disgustPlaylist = '{"context_uri":"spotify:user:124239502:playlist:1VNKdTLTa3h1pWSwRUP3Tm"}';
        var contemptPlaylist = '{"context_uri":"spotify:user:124239502:playlist:20kq7mkGlkUavx9TBVJDGZ"}';
        var surprisePlaylist = '{"context_uri":"spotify:user:124239502:playlist:6IeumRfE38bjbtS0q3eIJ3"}';
        console.log("PLAY TOKEN: ", playToken)
        $.ajax({
          url: 'https://api.spotify.com/v1/me/player/play?device_id=' + device_id,
          type: 'PUT',
          processData: false,
          // data: '{"context_uri":"spotify:user:124239502:playlist:70Vhwte8On581mDvi2F98F"}',
          data: angryPlaylist,
          headers: {
            'Authorization': 'Bearer ' + playToken,
          },
          ContentType: 'application/json',
          Accept: 'application/json',
        })
          .done(function (data) {
            var object = data;
            console.log("number 2 worked!!")
            console.log("image link: " + object.track_window.current_track.album.images["0"].url)
            console.log("artist name: " + object.track_window.current_track.artists["0"].name)
            console.log("song name: " + object.track_window.current_track.name)
            var imgSRC = object.track_window.current_track.album.images["0"].url;
            var artistName = object.track_window.current_track.artists["0"].name;
            var songName = object.track_window.current_track.name;
              $('.now-playing').html(
            '<div class="card mx-auto p-3" style="width: 18rem;">' +
                '<img class="card-img-top" src="' + imgSRC + '" alt="Song image cap">' +
                '<div class="card-body text-center">' +
                    '<h5 class="card-title">' + artistName + '</h5>' +
                    '<h6 class="card-subtitle text-muted">' + songName + '</h6>' +
                '</div>' +
            '</div>')
          })

      });
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

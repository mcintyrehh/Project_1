
$(document).ready(function () {
    window.onSpotifyWebPlaybackSDKReady = () => {
        // You can now initialize Spotify.Player and use the SDK
    };

    var player = new Spotify.Player({
        name: 'Carly Rae Jepsen Player',
        getOAuthToken: callback => {
            // Run code to get a fresh access token

            callback(token);
        },
        volume: 0.5
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
    var my_client_id = '2e12ca59d482427694678b6f76ce6cac'
    var redirect_uri = 'https://mcintyrehh.github.io/Project_1/'

    player.on('initialization_error', ({ message }) => {
        console.error('Failed to initialize', message);
    });
    player.on('authentication_error', ({ message }) => {
        console.error('Failed to authenticate', message);
    });
    player.on('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account', message);
    });
    player.on('playback_error', ({ message }) => {
        console.error('Failed to perform playback', message);
    });
});
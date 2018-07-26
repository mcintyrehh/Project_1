$(document).ready(function () {
    var my_client_id = '2e12ca59d482427694678b6f76ce6cac'
    var redirect_uri = 'https://mcintyrehh.github.io/Project_1/'
    var my_token = 'BQDHlyHtu1sgiMJGaSIK8L7Nzs6G4_-pAERDEeU8tSULTugRGmIkelR-tIaLy63Ja_W3DBPLAh3GdpwdYashljyAKHCVR3gLmqRhJuNVpm1JTd03cU91QUJEnhkOk52H_e2xRwoGnGsVUdDJXQVxDddAF_83aou4JKzC';

    var player = new Spotify.Player({
        name: 'Carly Rae Jepsen Player',
        getOAuthToken: callback => {
            // Run code to get a fresh access token

            callback(my_token);
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
    $('.playbtn').on('click', function () {
        var spotURL = 'https://accounts.spotify.com/authorize?client_id=' + my_client_id + '&redirect_uri=' + redirect_uri + '&response_type=token' 
        window.location.replace(spotURL);
        // $.ajax({
        //     url: 'https://accounts.spotify.com/authorize?client_id=' + my_client_id + '&redirect_uri=' + redirect_uri + '&response_type=token',
        //     headers: {
        //         'Authorization': 'Bearer '
        //     },
        //     success: function (response) {
        //         console.log(response);
        //     }
        // });
        window.ready(console.log(window.location));
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
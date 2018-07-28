
$(document).ready(function () {
    var my_client_id = '2e12ca59d482427694678b6f76ce6cac'
    var redirect_uri = 'https://mcintyrehh.github.io/Project_1/'
});
    // const token = '[My Spotify Web API access token]';
//     const player = new Spotify.Player({
//         name: 'PicMeUp',
//         getOAuthToken: cb => { cb(token); }
//     });

//     // Error handling
//     player.addListener('initialization_error', ({ message }) => { console.error(message); });
//     player.addListener('authentication_error', ({ message }) => { console.error(message); });
//     player.addListener('account_error', ({ message }) => { console.error(message); });
//     player.addListener('playback_error', ({ message }) => { console.error(message); });

//     // Playback status updates
//     player.addListener('player_state_changed', state => { console.log(state); });

//     // Ready
//     player.addListener('ready', ({ device_id }) => {
//         console.log('Ready with Device ID', device_id);
//     });

//     // Not Ready
//     player.addListener('not_ready', ({ device_id }) => {
//         console.log('Device ID has gone offline', device_id);
//     });

//     // Connect to the player!
//     player.connect();
// });
// var my_token = 'BQDHlyHtu1sgiMJGaSIK8L7Nzs6G4_-pAERDEeU8tSULTugRGmIkelR-tIaLy63Ja_W3DBPLAh3GdpwdYashljyAKHCVR3gLmqRhJuNVpm1JTd03cU91QUJEnhkOk52H_e2xRwoGnGsVUdDJXQVxDddAF_83aou4JKzC';
    // var authenticated = false;
//     if (!authenticated) {
//         console.log("should be false: " + authenticated)
//         var player = new Spotify.Player({
//             name: 'Carly Rae Jepsen Player',
//             getOAuthToken: callback => {
//                 // Run code to get a fresh access token

//                 callback(my_token);
//             },
//             volume: 0.5
//         });
//         player.addListener('ready', ({ device_id }) => {
//             console.log('The Web Playback SDK is ready to play music!');
//             console.log('Device ID', device_id);
//         })
//         // Error handling
//         player.addListener('initialization_error', ({ message }) => { console.error(message); });
//         player.addListener('authentication_error', ({ message }) => { console.error(message); });
//         player.addListener('account_error', ({ message }) => { console.error(message); });
//         player.addListener('playback_error', ({ message }) => { console.error(message); });

//         // Playback status updates
//         player.addListener('player_state_changed', state => { console.log(state); });

//         // Ready
//         player.addListener('ready', ({ device_id }) => {
//             console.log('Ready with Device ID', device_id);
//         });

//         // Not Ready
//         player.addListener('not_ready', ({ device_id }) => {
//             console.log('Device ID has gone offline', device_id);
//         });

//         // Connect to the player!
//         player.connect().then(success => {
//             if (success) {
//                 console.log('The Web Playback SDK successfully connected to Spotify!');
//             }
//         });
//     }
//     else {
//         console.log("Should be true: " + authenticated);
//         $.ajax({
//             url: 'https://api.spotify.com/v1/me',
//             headers: {
//                 'Authorization': 'Bearer ' + accessToken
//             },
//             success: function (response) {
//                 console.log(response);
//             }
//         })
//         window.ready(console.log(window.location));

//     }

//     //is this node.js????? how can i get it to work w/o haha
//     $('.playbtn').on('click', function () {
//         authenticated = true;
//         var spotURL = 'https://accounts.spotify.com/authorize?client_id=' + my_client_id + '&redirect_uri=' + redirect_uri + '&response_type=token&state=123'
//         // window.location.replace(spotURL);
//         window.onSpotifyWebPlaybackSDKReady = () => { }
//         $.ajax({
//             url: spotURL,
//             type: "GET",

//             success: function (response) {
//                 window.location.replace(response);
//                 // Function to get token and other hash information from URL
//                 function getHashParams() {
//                     let hashParams = {};
//                     let e, r = /([^&;=]+)=?([^&;]*)/g,
//                         q = window.location.hash.substring(1);
//                     while (e = r.exec(q)) {
//                         hashParams[e[1]] = decodeURIComponent(e[2]);
//                     }
//                     return hashParams;
//                 }
//             }
//         })

//     });
// });
//         // const play = ({
//         //     spotify_uri,
//         //     playerInstance: {
//         //       _options: {
//         //         getOAuthToken,
//         //         id
//         //       }
//         //     }
//         //   }) => {
//         //     getOAuthToken(access_token => {
//         //       fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
//         //         method: 'PUT',
//         //         body: JSON.stringify({ uris: [spotify_uri] }),
//         //         headers: {
//         //           'Content-Type': 'application/json',
//         //           'Authorization': `Bearer ${access_token}`
//         //         },
//         //       });
//         //     });
//         //   };

//         //   play({
//         //     playerInstance: new Spotify.Player({ name: "..." }),
//         //     spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
//         //   });
//     // });

//     //   $.ajax({
//     //     url: 'https://api.spotify.com/v1/me',
//     //     headers: {
//     //         'Authorization': 'Bearer ' + accessToken
//     //     },
//     //     success: function(response))
$(document).ready(function () {
  var my_client_id = '2e12ca59d482427694678b6f76ce6cac'
  var device_id = '942655c43a66b4a2c5a999247bb030619a632d0a'
  var player = new Spotify.Player({
    name: 'Carly Rae Jepsen Player',
    getOAuthToken: callback => {
      // Run code to get a fresh access token

      callback('BQA2GY3wuP5wunS4wbFp1hYJ1KhRVo3TQuebTDuPApeb6-fIzc6bQhQg5bh_eSjaTRseyvWeseGeSNDutBJz-KadLknrp94clivBDQeDEQx2dBHJA4FMyhAo1UDvJLzTtc_5WxfkHOgDnjURPtoZA925TZdvFDdn6_ow');
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
  // $.get(https://accounts.spotify.com/authorize/?client_id=2e12ca59d482427694678b6f76ce6cac&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-private%20user-read-email&state=34fFs29kd09)
  // $.ajax({
  //   url: 'https://api.spotify.com/v1/me',
  //   headers: {
  //       'Authorization': 'Bearer ' + accessToken
  //   },
  //   success: function(response) {
        
  //   }
  // });
});
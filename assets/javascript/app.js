
$(document).ready(function () {
    $('.playbtn').click(function () {
        console.log('at least the click worked');
        var userInfo = '/users/124239502'
        var happyPlaylist = '/playlists/70Vhwte8On581mDvi2F98F'
        var queryURL = 'https://api.spotify.com/v1' + userInfo + happyPlaylist;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        });
    });
});
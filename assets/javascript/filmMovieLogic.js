$( document ).ready(function() {

  
  

  // var displayFilmListNode = $("#displayFilmListNode");   
  
displayFilmButtons("neutral");

function displayFilmButtons(mood) {
   var displayButtonNode = $("#displayButtonNode"); 
   console.log(displayButtonNode);
   var moodKey = { "anger": ["adventure","action","thriller"],
                "contempt": ["crime", "drama", "horror"],
                "disgust": ["crime", "horror", "war"],
                "fear": ["crime", "horror", "thriller"],
                "happiness": ["adventure", "comedy", "romance"],
                "neutral": ["action", "adventure", "comedy", "crime", "drama", "horror", "romance", "science fiction", "thriller", "war"],
                "surprise": ["adventure", "science fiction", "thriller"]
               }
   var genres =  moodKey[mood.toLowerCase()];    
   var nGenres = genres.length;
   var buttonStr = "";
   
   for (let i=0; i<nGenres; i++) {
      buttonStr += '<button class="btn btn-success mx-2" data-genre="' + genres[i] + '">' +
                   toCamelCase(genres[i]) + 
                   '</button>';
   }
   console.log(buttonStr);
   displayButtonNode.html(buttonStr);
}

function toCamelCase(wd) {
   return wd;
}

function displayFilmList(genre) {
  // to be determined
}

});

function newCard(x) {
  // var cardTitle = array.Search[x].Title;
  // var cardYear = array.Search[x].Year;
  var cardPoster = array.Search[x].Poster;
  $(".posters").append('<div class="card m-2 bg-dark text-center text-white">'+
  '<img class="card-img" src="'+ cardPoster + '" alt="test poster">'+
  '<div class="card-img-overlay d-flex flex-column justify-content-end hover-text">'+
      '<h5 class="card-title movie-name hide">'+ array.Search[x].Title + '</h5>'+
      '<p class="card-text movie-year hide">' + array.Search[x].Year + '</p>'+
      '<p class="card-text col-small movie-IMDb hide"> IMDb id: ' + array.Search[x].imdbID + '</p>' +
      '<button  class="btn btn-success hide">Add Movie</button>' +
      '</div>'+
'</div>');
  $(".hide").hide();
 
}  
for (var i = 0; i<10; i++){  
  newCard(i);
}
$(".card" ).hover(
  function() {
    $(this).find(".card-img").css("opacity", "0.2");
    $(this).find(".hide").show();
  }, function() {
    $(this).find(".card-img").css("opacity", "1");
    $(this).find(".hide").hide();
  //   $(this).find(".movie-year").hide();
  }
);
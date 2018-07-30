$(document).ready(function () {


    // uncomment out this line to test the functions on this page
    // displayFilmButtons("anger");
 
    function displayFilmButtons(mood) {
       var displayButtonNode = $("#displayButtonNode"); // TO DO when transferring file: have a UI element with this name
       console.log(displayButtonNode);
       var moodKey = { "anger": ["Adventure","Action","Thriller"],
                    "contempt": ["Crime", "Drama", "Horror"],
                    "disgust": ["Crime", "Horror", "War"],
                    "fear": ["Crime", "Horror", "Thriller"],
                    "happiness": ["Adventure", "Comedy", "Romance"],
                    "neutral": ["Action", "Adventure", "Comedy", "Crime", "Drama", "Horror", "Romance", "Science fiction", "Thriller"],
                    "surprise": ["Adventure", "Science fiction", "Thriller"]
                   }
       var genres =  moodKey[mood];    
       var nGenres = genres.length;
       var buttonStr = "";
       
       for (let i=0; i<nGenres; i++) {
          buttonStr += '<button class="btn btn-success mx-2 filmBtn" value="' + genres[i].toLowerCase() + '">' +
                       genres[i] + 
                       '</button>';
       }
       displayButtonNode.html(buttonStr);
    }
 
    $("#displayButtonNode").on("click", "button.filmBtn", function(event) {
       var thisBtn = $(this);
       var genre = thisBtn.attr("value");
       getFilms(genre);
 
    });
       
 
    function getFilms(genre) {
       console.log(genre);
       var genreKey = {
          "adventure": 12, "animation": 16, "comedy": 35, "crime": 80, "documentary": 99, "drama": 18, "family": 10751, "fantasy": 14,
          "history": 36, "horror": 27, "music": 10402, "mystery": 9648, "romance": 10749, "science fiction": 878, "tv movie": 10770,
          "thriller": 53, "war": 10752, "western": 37
       };
  
       var page = Math.floor(15 * Math.random());
       var genreID = genreKey[genre];
       var theBaseURL = `https://api.themoviedb.org/3/discover/movie?`;
       var apiKey = `api_key=bc6ec211df5b4bd6958f005e93feb3d4`;
       var restOfURL = `&language=en-US&sort_by=vote_average.desc&include_adult=true&include_video=true&page=${page}&
                          vote_count.gte=100&vote_average.gte=7&with_genres=${genreID}&with_original_language=en`;
 
       $.ajax({
          url: theBaseURL + apiKey + restOfURL,
          type: "GET",
          method: "GET",
          dataType: 'jsonp',
          success: function (data) {
             var films = data.results;
             function isGoodChoice(film) {
                var myPat = /[-a-zA-Z0-9,:\w\']+/g;
                return film["poster_path"] && 
                       film["release_date"] &&
                       film["title"] &&
                       film["original_title"] &&
                       myPat.test(film["original_title"]) && 
                       myPat.test(film["title"]);
             }
             films = films.filter(isGoodChoice);
             films.splice(6);
             displayFilmInfo(films);
          }
       });
    }
 
 
    function displayFilmInfo(filmArr) {
       var baseImageURL = "http://image.tmdb.org/t/p/";
       var baseSiteURL = "https://www.themoviedb.org/movie/";
       // Can also use secure path below as a base image url; non non-secure path for ease of use
       // var secureImageBaseURL = "https://image.tmdb.org/t/p/";
       var imagePath, thisFilm, thisTitle, thisSummary, thisPoster, thisDate, thisInfoPage;
       // Note: some other valid image sizes are w45, w92, w154, w300, and w500
       var imageSize = "w300";
       var nFilms = filmArr.length;
       var cardStr = ``;
      
       
       for (var i=0; i<nFilms; i++) {
          thisFilm = filmArr[i];
          thisTitle = thisFilm.title;
          thisSummary = thisFilm.overview;
          thisPoster = baseImageURL + imageSize + thisFilm["poster_path"];
          thisDate = thisFilm["release_date"];
          thisID = thisFilm.id;
          thisInfoPage = baseSiteURL + thisFilm.id;
          
          cardStr += `<div class="col">
          <span class="card bg-dark mb-5 text-center text-white" style="width:320">
           <a href="${thisInfoPage}"><img src="${thisPoster}"></a>
           <h5 class="card-title"><a href="${thisInfoPage}">${thisTitle}</a></h5>
           <p class="card-text">Release Date: ${thisDate}</p>
           </span></div>`
       }
 
      
 
       $("#filmContent").html(cardStr);
 
    }
 
 });
//global var to pass to main.js
var moodMusic;
$(document).ready(function () {


   // uncomment out this line to test the functions on this page
   // displayFilmButtons("anger");
   
   

   $("#process-image-url-button").on("click", function () {
      var imageURL = $("#image-url-field").val();
      clearUI();
      getFaceData(imageURL, "url");
   });

   $("#local-image-file-field").on("change", function () {
      var file = this.files[0];
      clearUI();
      getFaceData(file, "file");
   });

   function clearUI() {
      $("#source-image").attr("src","");
      $("#displayButtonNode").empty();
      $("#filmContent").empty();
      $("#errMsgNode").empty();
   }


   // Overloaded function - The first arg "imageRef" can be a string url to a remote image, or a file object that
   // points to a local image. The second arg is "url" or "file" for extra clarity.
   function getFaceData(imageRef, imageRefType) {

      var reader, imageType, imageURL, file;
      var responseArea = $("#response-text-area"); 
      var imageArea = $("#source-image") 
      var myOutputField = $("#custom-text-area"); 
      var subscriptionKey = "7744436205a4423eb8ca1acfde55d449";
      var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
      var params = {
         "returnFaceId": "true",
         "returnFaceAttributes": "age,gender,smile,emotion"
      }

      // remove past responses from UI
      responseArea.val("");
      myOutputField.val("");

      if (imageRefType === "file") {

         file = imageRef;
         imageType = file.type;
         reader = new FileReader();

         reader.onload = function () {
            var processImage = function (binaryImage, imageType) {
               var err = "";
               var result = "";

               $.ajax({
                  url: uriBase + "?" + $.param(params),
                  method: "POST",
                  type: "POST",
                  beforeSend: function (xhrObj) {
                     xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                  },
                  contentType: "application/octet-stream",
                  mime: "application/octet-stream",
                  data: makeBlob(binaryImage, imageType),
                  cache: false,
                  processData: false
               }).done(function (data) {
                  // Show Formatted JSON on webpage
                  // responseArea.val(JSON.stringify(data, null, 2));
                  processFaceResult(data, "");
               }).fail(function (jqXHR, textStatus, errorThrown) {
                  // Display error message.
                  var errorString = (errorThrown === "") ?
                     "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                  err += (jqXHR.responseText === "") ?
                     "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                     jQuery.parseJSON(jqXHR.responseText).message :
                     jQuery.parseJSON(jqXHR.responseText).error.message;
                  theErrorMsg = errorString;
                  processFaceResult("", errorString);
               });
            }

            var resultData = this.result;
            resultData = resultData.split(",")[1];
            processImage(resultData, imageType);


         };

         reader.readAsDataURL(file);
      }

      // display the image
    
      imageURL = (imageRefType === "url") ? imageRef :
         (window.URL) ? window.URL.createObjectURL(file) : window.webkitURL.createObjectURL(file);

      imageArea.attr("src", imageURL);
      

      


      if (imageRefType === "url") { // remote image url case
         $.ajax({
               url: uriBase + "?" + $.param(params),
               beforeSend: function (xhrObj) {
                  xhrObj.setRequestHeader("Content-Type", "application/json");
                  xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
               },
               type: "POST",
               data: '{"url": ' + '"' + imageURL + '"}',
            })
            .done(function (data) {
               // Show formatted JSON on webpage.
               // responseArea.val(JSON.stringify(data, null, 2));
               processFaceResult(data, "");
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
               // Display error message.
               var errorString = (errorThrown === "") ?
                  "Error. " : errorThrown + " (" + jqXHR.status + "): ";
               errorString += (jqXHR.responseText === "") ?
                  "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                  jQuery.parseJSON(jqXHR.responseText).message :
                  jQuery.parseJSON(jqXHR.responseText).error.message;
               processFaceResult("", errorString);

            });
      } // end if clause 



   } // end function




   function processFaceResult(result, err) {
      // var myOutputField = $("#custom-text-area"); // TO DO WHEN MOVING FILE: delete this line, unless it is still desired
      var resultObj = {};


      if (err) {
         resultObj.success = false;
         if (err.indexOf("Bad Request (400)") !== -1 || err.indexOf("404") !== -1) {
            resultObj.errMsg = "That image URL or image path is not valid. " +
               "Please ensure that the URL or path is valid and that it points to a .GIF, .PNG, or .JPEG image."
         } else {
            resultObj.errMsg = err;
         }
      } else if (result.length > 1) {
         resultObj.success = false;
         resultObj.errMsg = "This image has more than one face. Please choose an image with only one face.";
      } else if (result.length === 0) {
         resultObj.success = false;
         resultObj.errMsg = "A human face cannot be detected in this image. Please choose a different image."
      } else {
         var emotions = result[0].faceAttributes.emotion;
         resultObj.success = true;
         resultObj.faceId = result[0].fadeId;
         resultObj.gender = result[0].faceAttributes.gender;
         resultObj.age = result[0].faceAttributes.age;
         resultObj.emotion = "";
         resultObj.emotionAmount = 0;

         for (var emotion in emotions) {
            if (emotions[emotion] > resultObj.emotionAmount) {
               resultObj.emotion = emotion;
               resultObj.emotionAmount = emotions[emotion];
            }
         }
    
      }
      
      // myOutputField.val(JSON.stringify(resultObj, null, 2));
      processResultObj(resultObj);
   }


   function processResultObj(resultObj) {
      if (resultObj.errMsg) {
         $("#errMsgNode").text(resultObj.errMsg);
      } else if (resultObj.age < 16) {
         $("#errMsgNode").text("Sorry, you must be at least 16 to use this application");
      } else {
         displayFilmButtons(resultObj.emotion);
         moodMusic = (resultObj.emotion);
      }

   }
 
   // CREDIT NOTE: this code is mostly not our own
   // This function is modifified only slightly from a stack overflow answer given on this page:
   // https://stackoverflow.com/questions/48201395/how-to-post-image-instead-of-url-in-microsoft-azure-analyze-image-api-using-java
   function makeBlob(b64Data, contentType, sliceSize) {
      var contentType = contentType || '';
      var sliceSize = sliceSize || 512;
      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
         var slice = byteCharacters.slice(offset, offset + sliceSize);
         var byteNumbers = new Array(slice.length);
         for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
         }

         var byteArray = new Uint8Array(byteNumbers);
         byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, {
         type: contentType
      });
      return blob;
   }





   function displayFilmButtons(mood) {
      var textStr = `<div>Based on your current mood of ${mood}, here are some film genres you may enjoy exploring.</div><br>`;
      var displayButtonNode = $("#displayButtonNode"); 
      var moodKey = {
         "anger": ["Action", "Adventure", "Documentary", "Thriller", "Western"],
         "contempt": ["Crime", "Drama", "Horror", "Mystery", "Thriller"],
         "disgust": ["Crime", "Horror", "Fantasy", "War", "Western"],
         "fear": ["Crime", "Drama", "Horror", "Thriller", "War"],
         "happiness": ["Adventure", "Comedy", "Drama", "Family", "Romance"],
         "neutral": ["Action", "Adventure", "Comedy", "Crime", "Drama", "Horror", "Romance", "Science Fiction", "Thriller"],
         "sadness": ["Comedy", "Documentary", "Drama","Family", "War"],
         "surprise": ["Adventure", "Fantasy", "Mystery", "Science Fiction", "Thriller"]
      }

      var genres = moodKey[mood];
      var nGenres = genres.length;
      var buttonStr = "";

      for (let i = 0; i < nGenres; i++) {
         buttonStr += '<button class="btn btn-success mx-2 filmBtn" value="' + genres[i].toLowerCase() + '">' +
            genres[i] +
            '</button>';
      }
      displayButtonNode.html(textStr + buttonStr);
   }

   $("#displayButtonNode").on("click", "button.filmBtn", function (event) {
      var thisBtn = $(this);
      var genre = thisBtn.attr("value");
      getFilms(genre);

   });


   function getFilms(genre) {
      // console.log(genre);
      var genreKey = {
         "action": 28,
         "adventure": 12,
         "animation": 16,
         "comedy": 35,
         "crime": 80,
         "documentary": 99,
         "drama": 18,
         "family": 10751,
         "fantasy": 14,
         "history": 36,
         "horror": 27,
         "music": 10402,
         "mystery": 9648,
         "romance": 10749,
         "science fiction": 878,
         "tv movie": 10770,
         "thriller": 53,
         "war": 10752,
         "western": 37
      };

      var page = Math.floor(25 * Math.random());
      var genreID = genreKey[genre];
      var theBaseURL = `https://api.themoviedb.org/3/discover/movie?`;
      var apiKey = `api_key=bc6ec211df5b4bd6958f005e93feb3d4`;
      var restOfURL = `&language=en-US&include_adult=false&include_video=true&page=${page}&
                          vote_count.gte=50&vote_average.gte=7&with_genres=${genreID}&with_original_language=en`;

      $.ajax({
         url: theBaseURL + apiKey + restOfURL,
         type: "GET",
         method: "GET",
         dataType: 'jsonp',
         success: function (data) {
            var films = data.results;
            // console.log("before filtering films: ", films)

            function isGoodChoice(film) {
               var myPat = /[-a-zA-Z0-9,:\w\']+/g;
               return film["poster_path"] &&
                  film["release_date"] &&
                  film["title"] &&
                  film["original_title"] &&
                  myPat.test(film["original_title"]) &&
                  myPat.test(film["title"]);
            }
            // console.log("all film data is: ", data);
            films = films.filter(isGoodChoice);
            // console.log("filtered films: ", films);

            if (films.length > 6) {
               var nFilms = films.length;
               // e.g.: 8 films, spliceStart will be 0, 1, or 2
               var sliceStart = Math.floor(Math.random() * (nFilms - 5));
               var films = films.slice(sliceStart, sliceStart + 6);
            } 
               
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


      for (var i = 0; i < nFilms; i++) {
         thisFilm = filmArr[i];
         thisTitle = thisFilm.title;
         thisSummary = thisFilm.overview;
         thisPoster = baseImageURL + imageSize + thisFilm["poster_path"];
         thisDate = thisFilm["release_date"];
         thisID = thisFilm.id;
         thisInfoPage = baseSiteURL + thisFilm.id;

         cardStr += `<div class="col">
          <span class="card bg-dark mb-5 p-1 text-center text-white" style="width:320">
           <a target="_blank" href="${thisInfoPage}"><img src="${thisPoster}" class="pt-4 pb-1"></a>
           <h5 class="card-title"><a target="_blank" href="${thisInfoPage}">${thisTitle}</a></h5>
           <p class="card-text">Release Date: ${thisDate}</p>
           </span></div>`
      }



      $("#filmContent").html(cardStr);

   }

});

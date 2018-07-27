// TO DO: fix bug where user selects a file that is not an image file. Right now, there is a 
// 400 error in console without a helpful error message to the user


$( document ).ready(function() {

 // UI EVENTS
      // TO DO WHEN MOVING CODE: Change theis reference to the correct name


      $("#process-image-url-button").on( "click", function() {
         var imageURL = $("#image-url-field").val();
         getFaceData(imageURL,"url");
       });

         // TO DO WHEN MOVING CODE: Change UI reference below to be correct
      $("#local-image-file-field").on( "change", function() {
         var file = this.files[0];
         getFaceData(file, "file");
       });


       // Overloaded function - The first arg "imageRef" can be a string url to a remote image, or a file object that
       // points to a local image. The second arg is "url" or "file" for extra clarity.
       function getFaceData(imageRef, imageRefType) {

          var reader, imageType, imageURL, file;
          var responseArea =  $("#response-text-area"); // TO DO: fix this reference when transferring this to new file
          var imageArea  = $("#source-image")  // TO DO: fix this reference when transferring this to new file
          var myOutputField = $("#custom-text-area"); // TO DO WHEN MOVING FILE: delete this line, unless it is still desired
          var subscriptionKey = "26075440faf6440597e1e144b2245eea"; 
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
                  var processImage = function(binaryImage, imageType) {
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
                        responseArea.val(JSON.stringify(data, null, 2));
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
               responseArea.val(JSON.stringify(data, null, 2));
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
         var myOutputField = $("#custom-text-area"); // TO DO WHEN MOVING FILE: delete this line, unless it is still desired
         var resultObj = {};
         

         if (err) {
            resultObj.success = false;
            if (err.indexOf("Bad Request (400)") !== -1 || err.indexOf("404") !==- 1) {
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

            for (var emotion in emotions ) {
               if (emotions[emotion] > resultObj.emotionAmount) {
                  resultObj.emotion = emotion;
                  resultObj.emotionAmount = emotions[emotion];
               }
            }
         }

         myOutputField.val(JSON.stringify(resultObj, null, 2));

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

   
   

   }); // end of document ready jquery block

$(document).ready(function () {
  ////////////////////////////copied code/////////////////////////////
  // Event listener for all button elements
  $(".form-inline").on("submit", function (event) {
    event.preventDefault();
    console.log("I got submitted!");
    var apiKey = "776c0666fbe2923375cece8f53ee0a8c";

    //FIXME: Get the city name from the user's form input
    var searchTerm = $(this).val();
    console.log("searchTerm", searchTerm);
    ///////////TEST CODE TO FILL THIS VARIABLE UNTIL I FIX FORM GRABBING////////////////
    searchTerm = "Austin";
    // // Constructing a URL to search openWeatherAPI for the city entered by the user
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&APPID=" + apiKey;

    // // Performing our AJAX GET request
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      // After the data comes back from the API
      .then(function (response) {
        console.log("response", response);
        console.log("queryURL", queryURL);
        // Storing searched city's weather and temperature objects
        var weatherResults = response.weather;
        var tempResults = response.main;
        var windResults = response.wind;
        console.log("weather results", weatherResults);
        console.log("tempResults", tempResults);
        // temp is in Kelvin at this point
        var currentTemp = tempResults.temp;
        var currentHumidity = tempResults.humidity;
        var currentWindSpeed = windResults.speed;
        var currentWindAngle = windResults.deg;
        var currentLat = response.coord.lat;
        var currentLon = response.coord.lon;
        // var UVQueryURL = (("http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "" &lat = { lat } & lon = { lon });
        var UVQueryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${currentLat}&lon=${currentLon}`;

        $.ajax({ url: UVQueryURL, method: "GET" }).then(function (response) {
          var currentUVIndex = response.value;
          console.log("currentUVIndex", currentUVIndex);
        });
        // Looping over every result item
        // for (var i = 0; i < results.length; i++) {
        //   // Only taking action if the photo has an appropriate rating
        //   if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
        //     // Creating a div for the gif
        //     var gifDiv = $("<div>");
        //     // Storing the result item's rating
        //     var rating = results[i].rating;
        //     // Creating a paragraph tag with the result item's rating
        //     var p = $("<p>").text("Rating: " + rating);
        //     // Creating an image tag
        //     var personImage = $("<img>");
        //     // Giving the image tag an src attribute of a proprty pulled off the
        //     // result item
        //     personImage.attr("src", results[i].images.fixed_height.url);
        //     // Appending the paragraph and personImage we created to the "gifDiv" div we created
        //     gifDiv.append(p);
        //     gifDiv.append(personImage);
        //     // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
        //     $("#gifs-appear-here").prepend(gifDiv);
        //   }
        // }
      });
  });

  ////////////////////////////copied code/////////////////////////////
});

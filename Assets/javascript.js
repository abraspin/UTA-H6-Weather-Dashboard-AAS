var apiKey = "776c0666fbe2923375cece8f53ee0a8c";
$(document).ready(function () {
  ////////////////////////////copied code/////////////////////////////
  // Event listener for all button elements

  $(".form-inline").on("submit", function (event) {
    event.preventDefault();
    //FIXME: Get the city name from the user's form input
    var searchedCity = $(this).val();
  });

  ///////////TEST CODE TO FILL THIS VARIABLE UNTIL I FIX FORM GRABBING////////////////
  searchTerm = "Austin";
  ////////////////////////////////////////////////////////////////////////////////////

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
      var currentTemp = parseInt(tempResults.temp);
      // convert currentTemp from kelvin to farenheit
      currentTemp = (((currentTemp - 273.15) * 9) / 5 + 32).toFixed(2);
      var currentHumidity = tempResults.humidity;
      var currentWindSpeed = windResults.speed;
      var currentWindAngle = windResults.deg;
      var currentLat = response.coord.lat;
      var currentLon = response.coord.lon;
      var currentClouds = response.clouds.all;
      //declaring currentUVIndex here so it can be set out of the below call's scope
      var currentUVIndex;
      // var UVQueryURL = (("http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "" &lat = { lat } & lon = { lon });
      var UVQueryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${currentLat}&lon=${currentLon}`;

      $.ajax({ url: UVQueryURL, method: "GET" }).then(function (response) {
        currentUVIndex = response.value;
        console.log("currentUVIndex", currentUVIndex);
      });
      var weatherDataEl = $("#weather-data");
      var currentDate = moment().format("l");
      // TODO: add a conditional looking at cloud coverage and adding an icon
      weatherDataEl.append($(`<h2>${searchTerm} (${currentDate})</h2>`));

      weatherDataEl.append($(`<h5>Temperature: ${currentTemp} <sup>o</sup>F</h5>`));
      weatherDataEl.append($(`<h5>Humidity: ${currentHumidity}%</h5>`));
      weatherDataEl.append($());
      weatherDataEl.append($());
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
  //TODO: https://getbootstrap.com/docs/4.1/components/list-group/ FOR ACTIVE SELECTION STYLING
  ////////////////////////////copied code/////////////////////////////
});

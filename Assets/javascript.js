// Declaring statis variables
var apiKey = "776c0666fbe2923375cece8f53ee0a8c";
var savedCitiesEl = $("#saved-cities");

// Main executing script
$(document).ready(function () {
  // Event listener for adding new cities
  $(".form-inline").on("submit", function (event) {
    event.preventDefault();
    //FIXME: Get the city name from the user's form input
    var searchedCity = $(this).val();

    /////////dummy variable/////////////
    searchedCity = "Austin";
    /////////dummy variable/////////////

    // generate each user inputted city
    savedCitiesEl.append($(`<li class="list-group-item city-button my-1">${searchedCity}</li>`));
  });

  /////////////event listener for clicking on a city button////////////////////////

  //This is listening for a click on any element of type "li" as long as it's WITHIN THE ASIDE ELEMENT
  $("aside").on("click", "li", function (event) {
    //TODO: add error checking for the user entering a city they already added
    console.log("city button clicked");

    //TODO: make the rendering into a function bc you also need code to highlight the active button
    //TODO: add a spinner while the API call waits

    //ajax call search term is the name of the city this "button" represents
    searchTerm = event.currentTarget.innerHTML;

    // // Constructing a URL to search openWeatherAPI for the city entered by the user
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&APPID=" + apiKey;

    // // Performing our AJAX GET request
    callAPIAndRender(queryURL);
  });
  //////////////////////FUNCTIONS///////////////////////////////////
  function callAPIAndRender(queryURL) {
    //
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

        var UVQueryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${currentLat}&lon=${currentLon}`;

        var weatherDataEl = $("#weather-data");
        var currentDate = moment().format("l");

        // TODO: add a conditional looking at cloud coverage and adding an icon
        weatherDataEl.append($(`<h2>${searchTerm} (${currentDate})</h2>`));

        weatherDataEl.append($(`<h5>Temperature: ${currentTemp} <sup>o</sup>F</h5>`));
        weatherDataEl.append($(`<h5>Humidity: ${currentHumidity}%</h5>`));
        console.log("callAPIAndRender -> currentTemp", currentTemp);
        console.log("callAPIAndRender -> currentHumidity", currentHumidity);
        weatherDataEl.append($(`<h5>Wind Speed: ${currentWindSpeed} MPH</h5>`));

        // is it ridiculous to have a ajax within an ajax?
        $.ajax({ url: UVQueryURL, method: "GET" }).then(function (response) {
          var currentUVIndex = response.value;
          // TODO: convert UV index into a dynamically styled badge thingy
          weatherDataEl.append($(`<h5>UV Index: ${currentUVIndex}</h5>`));
        });

        console.log("callAPIAndRender -> currentWindSpeed", currentWindSpeed);
      });
  }

  //TODO: https://getbootstrap.com/docs/4.1/components/list-group/ FOR ACTIVE SELECTION STYLING
});

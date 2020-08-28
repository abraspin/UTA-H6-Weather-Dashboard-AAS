// Declaring statis variables
var apiKey = "776c0666fbe2923375cece8f53ee0a8c";
var savedCitiesEl = $("#saved-cities");

var weatherDataEl = $("#weather-data");
var forecastEl = $("#forecast-data");

var localStoredCitiesArray = [];
// Main executing script
$(document).ready(function () {
  //
  //

  //Fill the list right away with any previously saved cities
  preFillCities();

  //TODO: set the selected city with the "active" class in the UL
  // Event listener for adding new cities
  //TODO:TODO:TODO:TODO:TODO:TODO: UNCOMMENT ME
  $(".form-inline").on("submit", function (event) {
    // UNCOMMENT ME TOO TODO:
    event.preventDefault();

    //TODO: need error checking to make sure the api gets the right format search term
    //TODO: add error checking for the user entering a city they already added
    //TODO: reach goal: return an error message on API 404 return

    //check for empty string

    //set searched city to the form value
    var searchedCity = $(`#city-search-form`).val();
    ///////////////dummy value//////////////////////
    //   searchedCity = "Austin";
    ///////////////dummy value//////////////////////
    if (searchedCity) {
      console.log("searchedCity", searchedCity);

      localStoredCitiesArray.push(searchedCity);
      console.log("localStoredCitiesArray", localStoredCitiesArray);
      localStorage.setItem("localStoredCitiesArray", JSON.stringify(localStoredCitiesArray));

      // generate each user inputted city as a "button" line item
      savedCitiesEl.append($(`<li class="list-group-item city-button my-1">${searchedCity}</li>`));
    }
    //TODO:TODO:TODO:TODO:TODO:TODO: UNCOMMENT ME
  });

  /////////////event listener for clicking on a city button////////////////////////

  //This is listening for a click on any element of type "li" as long as it's WITHIN THE ASIDE ELEMENT
  //TODO:TODO:TODO:TODO:TODO:TODO: UNCOMMENT ME
  $("aside").on("click", "li", function (event) {
    //   First we clear out any old weather info that might be in the right side
    $("#weather-data").empty();
    $("#forecast-data").empty();
    // $("#forecast-data").innerHTML = `<div id="forecast-header-element"  </div>;`;

    // display the loading spinner, it will be cleared when the ajax call goes through
    displayLoadingSpinner();
    //ajax call search term is the name of the city this "button" represents
    //TODO:TODO:TODO:TODO:TODO:TODO: UNCOMMENT ME
    searchTerm = event.currentTarget.innerHTML;
    ////////////////dummy variable/////////////////////
    //   searchTerm = "Austin";
    ////////////////dummy variable/////////////////////
    // // Constructing a URL to search openWeatherAPI for the city entered by the user
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&APPID=" + apiKey;

    // // Performing our AJAX GET request
    callAPIAndRender(queryURL);
    // render the 5 day forecast
    renderFiveDayForecast(searchTerm);
    //TODO:TODO:TODO:TODO:TODO:TODO: UNCOMMENT ME
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
        //clear spinner outta there
        $("#weather-data").empty();

        // Storing searched city's weather and temperature objects
        var weatherResults = response.weather;
        var tempResults = response.main;
        var windResults = response.wind;

        // temp is in Kelvin at this point
        var currentTemp = parseInt(tempResults.temp);
        //TODO:
        // convert currentTemp from kelvin to farenheit
        currentTemp = (((currentTemp - 273.15) * 9) / 5 + 32).toFixed(2);
        var currentHumidity = tempResults.humidity;
        var currentWindSpeed = windResults.speed;
        var currentWindAngle = windResults.deg;
        var currentLat = response.coord.lat;
        var currentLon = response.coord.lon;
        var currentClouds = response.clouds.all;

        //declaring currentUVIndex here so it can be set out of the below call's scope

        var UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${currentLat}&lon=${currentLon}`;

        var currentDate = moment().format("l");

        var currentWeatherIconLink = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        var weatherIconEl = $(`<img src='${currentWeatherIconLink}'></img>`);
        //FIXME: I can't get the dang weather icon to go inline!
        weatherDataEl.append($(`<h2 style='font-weight: bold'>${searchTerm} (${currentDate}) </h2>`));
        weatherDataEl.append(weatherIconEl);

        weatherDataEl.append($(`<h5 class='my-4' >Temperature: ${currentTemp} <sup>o</sup>F</h5>`));
        weatherDataEl.append($(`<h5 class='my-4'>Humidity: ${currentHumidity}%</h5>`));
        weatherDataEl.append($(`<h5 class='my-4'>Wind Speed: ${currentWindSpeed} MPH</h5>`));

        // is it ridiculous to have a ajax within an ajax?
        $.ajax({ url: UVQueryURL, method: "GET" }).then(function (response) {
          var currentUVIndex = response.value;
          // TODO: convert UV index into a dynamically styled badge thingy
          var UVIndexColor;
          if (currentUVIndex < 0) {
            //no styling, something is wrong.
          } else if (currentUVIndex < 2) {
            UVIndexColor = "green";
          } else if (currentUVIndex < 5) {
            UVIndexColor = "yellow";
          } else if (currentUVIndex < 7) {
            UVIndexColor = "orange";
          } else if (currentUVIndex < 10) {
            UVIndexColor = "red";
          } else {
            UVIndexColor = "#993299";
          }
          console.log("callAPIAndRender -> UVIndexColor", UVIndexColor);
          weatherDataEl.append($(`<h5>UV Index: <span class='rounded p-1' id='UVColor'>${currentUVIndex}</span></h5>`));
          var UVColorSpan = $("#UVColor");
          UVColorSpan.css("background-color", UVIndexColor);
          UVColorSpan.css("background-color", UVIndexColor);
        });
      });
  }

  function renderFiveDayForecast(city) {
    //   moved this into the HTML
    // $("#forecast-header-element").append($("<h2>y For5-Daecast:</h2>"));

    //first show the header element, we hid it prior to rendering this info
    $("#forecast-header").show();

    forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    console.log(forecastQueryURL);

    $.ajax({ url: forecastQueryURL, method: "GET" }).then(function (response) {
      console.log(response);
      console.log(response.list[0]);

      for (var i = 0; i < 5; i++) {
        var responseArrayEl = response.list[i];

        var forecastCard = $(
          `<div style = 'width: auto' class='day${i} container col bg-primary rounded text-white font-weight-bold border mx-2'></div>;`
        );
        forecastCard.append($(`<h5 class='font-weight-bold'>${moment().add(i, "days").format("l")}</h5>`));
        // forecastCard.append($(`<h5>${responseArrayEl.weather}</h5>`));

        console.log(responseArrayEl.weather);
        console.log(responseArrayEl.weather[0].icon + ".png");
        forecastCard.append($(`<img src="http://openweathermap.org/img/wn/${responseArrayEl.weather[0].icon}@2x.png">;`));
        var temp = (((responseArrayEl.main.temp - 273.15) * 9) / 5 + 32).toFixed(2);
        forecastCard.append($(`<h5>Temp: ${temp}</h5>`));
        forecastCard.append($(`<h5>Humidity: ${responseArrayEl.main.humidity}%</h5>`));
        forecastEl.append(forecastCard);
      }
    });
  }

  ////////////FUNCTION TO DISPLAY SPINNER WHILE LOADING
  function displayLoadingSpinner() {
    var spinnerEl = $("<div class='text-center mt-5'><i class='fa fa-spinner fa-spin ' style='size:36px'></i> </div>");
    $("#weather-data").append(spinnerEl);
  }

  function preFillCities() {
    var citiesArray = JSON.parse(localStorage.getItem("localStoredCitiesArray"));
    for (var i = 0; i < citiesArray.length; i++) {
      savedCitiesEl.append($(`<li class="list-group-item city-button my-1">${citiesArray[i]}</li>`));
    }
  }
  //TODO: https://getbootstrap.com/docs/4.1/components/list-group/ FOR ACTIVE SELECTION STYLING
});

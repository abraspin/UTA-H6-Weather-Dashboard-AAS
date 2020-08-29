// Declaring static variables
var apiKey = "776c0666fbe2923375cece8f53ee0a8c";
var savedCitiesEl = $("#saved-cities");
var weatherDataEl = $("#weather-data");
var forecastEl = $("#forecast-data");

var localStoredCitiesArray = JSON.parse(localStorage.getItem("localStoredCitiesArray")) || [];
console.log("localStoredCitiesArray", localStoredCitiesArray);

// Main executing script
$(document).ready(function () {
  //
  //
  //Fill the list right away with any previously saved cities
  preFillCities();

  //TODO: put this inside of the prefill cities function?
  //Prefill forecast data with most recently searched city, if there was one
  if (localStoredCitiesArray.length > 0) {
    var latestSearchedCity = localStoredCitiesArray[localStoredCitiesArray.length - 1];

    callAPIAndRender(
      `https://api.openweathermap.org/data/2.5/weather?q=${latestSearchedCity}&APPID=${apiKey}`,
      latestSearchedCity
    );
    renderFiveDayForecast(latestSearchedCity);
    console.log(`https://api.openweathermap.org/data/2.5/weather?q=${latestSearchedCity}&APPID=${apiKey}`);

    //set the first city on the list to .active styling
    $("a:first").addClass("active");
  }

  ///////////////////////////// EVENT LISTENER FOR ADDING NEW CITIES/////////////////////////////
  // adding a new city will also immediately run the ajax call for the inputted city
  $(".form-inline").on("submit", function (event) {
    event.preventDefault();

    //TODO: need error checking to make sure the api gets the right format search term?
    //TODO: add error checking for the user entering a city they already added
    //TODO: return an error message on API 404 return?
    //TODO: what does it mean when my url has a "?" at the end of it? It...breaks some stuff, with the search?

    //set searched city to the form value
    var searchedCity = $(`#city-search-form`).val();
    // // Constructing a URL to search openWeatherAPI for the city entered by the user
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&APPID=" + apiKey;

    callAPIAndRender(queryURL, searchedCity);
    renderFiveDayForecast(searchedCity);

    //reset search field to blank after submitting a city
    $(`#city-search-form`).val("");
  });

  //OPTIONAL  ///////////event listener for "exing out" of an existing city LI//////
  //   $(".close-btn").on("click", function (event) {
  //     console.log(event.currentTarget);
  //   });

  /////////////////////////////EVENT LISTENER FOR CLEAR ALL CITIES BUTTON/////////////////////////
  $("#clear-cities-btn").on("click", function (event) {
    event.preventDefault;
    $("#saved-cities").empty();
    localStorage.setItem("localStoredCitiesArray", "[]");
  });

  ///////////////////////////EVENT LISTENER FOR CLICKING ON A CITY BUTTON////////////////////////////////
  $("aside").on("click", "button", function (event) {
    //This is listening for a click on any element of type "a" as long as it's WITHIN THE ASIDE ELEMENT

    //First remove the active class from all the "buttons" in this element
    $("button").removeClass("active");

    // then assign active class to clicked button
    $(this).addClass("active");

    //    clear out any old weather info that might be in the right side
    $("#weather-data").empty();
    $("#forecast-data").empty();

    // display the loading spinner, it will be cleared when the ajax call goes through
    displayLoadingSpinner();

    //ajax call search term is the name of the city this "button" represents
    searchTerm = event.currentTarget.innerHTML;

    // // Constructing a URL to search openWeatherAPI for the city entered by the user
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&APPID=" + apiKey;

    // // Performing our AJAX GET request
    callAPIAndRender(queryURL, searchTerm);
    // render the 5 day forecast
    renderFiveDayForecast(searchTerm);
  });
  //TODO: maybe don't need queryurl arg, just make it inside the function
  //////////////////////FUNCTIONS///////////////////////////////////
  function callAPIAndRender(queryURL, searchTerm) {
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
        var tempResults = response.main;
        var windResults = response.wind;

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
        //TODO: add the city to local array variable HERE instead of at click event for submit button, so it only saves
        //Now we do the ajax call to get UV information for this location

        // add the new city to the local "list of cities" variable
        if (localStoredCitiesArray.indexOf(searchTerm) === -1) {
          localStoredCitiesArray.push(searchTerm);
          console.log(localStoredCitiesArray);

          //push the new array with new city on top to local storage
          localStorage.setItem("localStoredCitiesArray", JSON.stringify(localStoredCitiesArray));
          preFillCities();
        }
        var UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${currentLat}&lon=${currentLon}`;

        var currentDate = moment().format("l");

        //grab the icon link for weather visualization
        var currentWeatherIconLink = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        var weatherIconEl = $(`<img src='${currentWeatherIconLink}'></img>`);

        //append the current weather card header
        weatherDataEl.append($(`<h2 style='font-weight: bold'>${searchTerm} (${currentDate}) </h2>`));

        //FIXME: WHY DO MY ICONS LOOK SO CRUMMY COMPARED TO THE EXAMPLE
        //append the fancy icon
        weatherDataEl.append(weatherIconEl);

        //render the rest of the current weather card
        weatherDataEl.append($(`<h5 class='my-4' >Temperature: ${currentTemp} <sup>o</sup>F</h5>`));
        weatherDataEl.append($(`<h5 class='my-4'>Humidity: ${currentHumidity}%</h5>`));
        weatherDataEl.append($(`<h5 class='my-4'>Wind Speed: ${currentWindSpeed} MPH</h5>`));

        // is it ridiculous to have a ajax within an ajax?
        $.ajax({ url: UVQueryURL, method: "GET" }).then(function (response) {
          var currentUVIndex = response.value;
          var UVIndexColor;

          //set color for severity of UV index
          if (currentUVIndex < 0) {
            //no styling, bc something is wrong if you're here.
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
          // add the UV index line to the current weather card
          weatherDataEl.append(
            $(`<h5>UV Index: <span class='rounded py-1 px-2' id='UVColor'>${currentUVIndex.toFixed(2)}</span></h5>`)
          );

          //set the fancy color background of our UV index
          var UVColorSpan = $("#UVColor");
          UVColorSpan.css("background-color", UVIndexColor);
        });
      });
  }

  function renderFiveDayForecast(city) {
    // get ready for API query for forecast
    forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    console.log(forecastQueryURL);

    $.ajax({ url: forecastQueryURL, method: "GET" }).then(function (response) {
      console.log(response);

      //Now that we know the http request has been responded to,
      //first show the header element, we hid it prior to rendering this info
      $("#forecast-header").show();

      // counter used to render next 5 calendar dates
      var dayCounter = 0;

      // then render each of the 5 day forecast cards
      // add 8 each time so we get the same time each day, each subsequent array el is 3 hours later
      for (var i = 0; i < response.list.length; i += 8) {
        // We want to skip ahead 8 elements at a time, this gives us 00:00:00 on each day for 5 days.
        var responseArrayEl = response.list[i];

        //build the card body
        var forecastCard = $(
          `<div style = 'width: auto' class='day${i} container col bg-primary rounded text-white font-weight-bold  m-2'></div>;`
        );
        //FIXME: these card respond positionally, but they are taking up the whole element when they go to the next row.
        //TODO: Try media queries to set a fixed width at small screen size
        forecastCard.append($(`<h5 'class='font-weight-bold'>${moment().add(dayCounter, "days").format("l")}</h5>`));

        //increment counter used to render next 5 calendar dates
        dayCounter++;
        console.log(dayCounter);

        //grab our nice weather icon
        forecastCard.append($(`<img src="https://openweathermap.org/img/wn/${responseArrayEl.weather[0].icon}@2x.png">;`));

        //put the temp and humidity on
        var temp = (((responseArrayEl.main.temp - 273.15) * 9) / 5 + 32).toFixed(2);
        forecastCard.append($(`<h5>Temp: ${temp}</h5>`));
        forecastCard.append($(`<h5>Humidity: ${responseArrayEl.main.humidity}%</h5>`));

        // put the card in the row element
        forecastEl.append(forecastCard);
      }
    });
  }

  ////////////FUNCTION TO DISPLAY SPINNER WHILE LOADING
  function displayLoadingSpinner() {
    var spinnerEl = $("<div class='text-center mt-5'><i class='fa fa-spinner mb-5 fa-spin fa-4x' ></i> </div>");
    $("#weather-data").append(spinnerEl);
  }

  ////////////////FUNCTION TO PREFILL THE SAVED CITIES UL///////////////////
  function preFillCities() {
    var citiesArray = localStorage.getItem("localStoredCitiesArray") || [];
    if (citiesArray.length > 0) {
      var citiesArray = JSON.parse(citiesArray) || [];

      savedCitiesEl.empty();
      for (var i = 0; i < citiesArray.length; i++) {
        //build new button to add to left pane
        newButton = $(`<button class="list-group-item city-button list-group-item-action">${citiesArray[i]}</button>`);

        //assign active class to the first item in the list (most recently searched city)
        if (i === citiesArray.length - 1) {
          newButton.addClass("active");
        }
        //optional: to add an x button.
        //   newButton.append($(`<i class='close-btn border p-1 fa fa-times fa-2x my-auto float-right'></i>`));

        //append the button the list
        savedCitiesEl.prepend(newButton);
      }
    }
  }
});

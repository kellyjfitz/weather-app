let apiKey = "cbe5c0663f180c0503c859907df27f18";

function updateHtml(selector, textToAdd) {
  document.querySelector(selector).innerHTML = textToAdd;
}

function showTime() {
  document.querySelector("#time").innerHTML = destinationTime;
}

function showDate() {
  document.querySelector("#date").innerHTML = destinationDate;
}

// adding event listener to the form submit
let citySearch = document.querySelector("#city-search");
citySearch.addEventListener("submit", getCity);

//this function takes the form input for the city and sends it to the
// geolocator to get the longitude and latitude

function getCity(event) {
  event.preventDefault();

  let cityInput = document.querySelector("#city-input");
  let city = cityInput.value;
  let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
  axios.get(`${apiUrl}${city}&appid=${apiKey}`).then(getCityDetails);
}

//this gets the coordinates of the current location when the user presses the button
//it sends it to the reverse geo api so we can get the city name to later put into the h1

function getUserLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiUrl3 = "https://api.openweathermap.org/geo/1.0/reverse?";

  axios
    .get(`${apiUrl3}lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
    .then(getCityDetails);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(getUserLocation);
}

//adding event listener to the locator button
let getLocation = document.querySelector("#current-location");
getLocation.addEventListener("click", getCurrentLocation);

//this function replaces the city name in the h1 and gets
//the longitude and latitude and sends it to the second api for extra data
function getCityDetails(response) {
  let country = response.data[0].country;
  let city = response.data[0].name;
  let latitude = response.data[0].lat;
  let longitude = response.data[0].lon;
  getWeatherData(latitude, longitude);
  //putting the city name into the h1
  updateHtml("h1", `${city}, <span class="country">${country}</span>`);
}
//getting all of the weather info from the other api

function getWeatherData(latitude, longitude) {
  let apiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?";
  axios
    .get(
      `${apiUrl2}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    )
    .then(getExtraInfo);
}

// these functions are used on the weather array to set the sevenday forecast
function sevenDayForecast() {
  let forecast = document.querySelector("#seven-day-forecast");
  let forecastHtml = `<div class="row  text-center">`;

  weather.forEach(function (day, index) {
    if (index > 0) {
      forecastHtml =
        forecastHtml +
        `<div class="col col-sm-auto"><p>
   ${getDayNames(timeZone, day.dt)} <br />
        <h3 class="smaller-icon">${setIcon(day.weather[0].main)}</h3>
        <strong>${Math.round(
          day.temp.min
        )}°<span class="separator">/</span>${Math.round(day.temp.max)}°</strong>
    </p></div>`;
    }
  });
  forecastHtml = forecastHtml + `</div>`;
  forecast.innerHTML = forecastHtml;
}

function sevenDayForecastFahrenheit() {
  let forecast = document.querySelector("#seven-day-forecast");
  let forecastHtml = `<div class="row  text-center">`;

  weather.forEach(function (day, index) {
    if (index > 0) {
      forecastHtml =
        forecastHtml +
        `<div class="col col-sm-auto"><p>
   ${getDayNames(timeZone, day.dt)} <br />
        <h3 class="smaller-icon">${setIcon(day.weather[0].main)}</h3>
        <strong>${convertTemp(
          day.temp.min
        )}°<span class="separator">/</span>${convertTemp(
          day.temp.max
        )}°</strong>
    </p></div>`;
    }
  });
  forecastHtml = forecastHtml + `</div>`;
  forecast.innerHTML = forecastHtml;
}

//this gets the info from the second weather api
function getExtraInfo(response) {
  weather = response.data.daily;

  celsiusTemp = Math.round(response.data.current.temp);
  fahrenheitTemp = convertTemp(celsiusTemp);
  todayMin = Math.round(response.data.daily[0].temp.min);
  todayMinF = convertTemp(todayMin);
  todayMax = Math.round(response.data.daily[0].temp.max);
  todayMaxF = convertTemp(todayMax);
  let chanceRain = Math.round(response.data.daily[0].pop * 100);
  let rain = response.data.daily[0].rain;
  if (rain === undefined) {
    rain = 0;
  }
  let humidity = response.data.daily[0].humidity;
  let uvIndex = response.data.daily[0].uvi;
  // default metric units for wind speed are metres per second, need to convert to km/h by multiplying by 3.6
  let wind = Math.round(response.data.daily[0].wind_speed * 3.6);
  timeZone = response.data.timezone;
  destinationTime = getDestinationTime(timeZone);
  destinationDate = getDestinationDate(timeZone);
  let sunrise = sunTimes(response.data.daily[0].sunrise, timeZone);
  let sunset = sunTimes(response.data.daily[0].sunset, timeZone);
  setTheme(destinationTime, sunset, sunrise);
  sevenDayForecast();
  showTime();
  showDate();

  //updating the bit above the sevenday forecast
  addForecast(sunrise, sunset, chanceRain, rain, wind, uvIndex, humidity);

  //updating the weather and icons for the now and today part
  updateHtml("#now-temp", `${celsiusTemp}°`);
  updateHtml("#min-temp", `${todayMin}°`);
  updateHtml("#max-temp", `${todayMax}°`);
  updateHtml("#now-weather", response.data.current.weather[0].main);
  updateHtml("#now-icon", setIcon(response.data.current.weather[0].main));
  updateHtml("#today-icon", setIcon(response.data.daily[0].weather[0].main));
}

function setIcon(weather) {
  let icon = "☀️";
  if (weather === "Clear") {
    icon = "☀️";
  } else if (weather === "Rain" || weather === "Drizzle") {
    icon = "🌧️";
  } else if (weather === "Clouds") {
    icon = "☁️";
  } else if (weather === "Snow") {
    icon = "❄️";
  } else if (weather === "Thunderstorm") {
    icon = "🌩️";
  } else if (
    weather === "Mist" ||
    weather === "Fog" ||
    weather === "Smoke" ||
    weather === "Haze" ||
    weather === "Dust" ||
    weather === "Sand" ||
    weather === "Ash"
  ) {
    icon = "🌫️";
  } else if (weather === "Squall" || weather === "Tornado") {
    icon = "🌪️";
  }
  return icon;
}

function addForecast(
  sunrise,
  sunset,
  chanceRain,
  rain,
  wind,
  uvIndex,
  humidity
) {
  let forecast = document.querySelector(".forecast");
  forecast.innerHTML = `<p>
  🌞 Sunrise: ${sunrise} 🌚 Sunset: ${sunset}  
  <br />☔ Chance of rain: ${chanceRain}% 🌧️ Rain: ${rain}mm
    <br />
    💨 Wind: ${wind}km/h ☀️ UV index: ${uvIndex} 💦 Humidity: ${humidity}%
  </p>`;
}
function setTheme(destinationTime, sunset, sunrise) {
  if (destinationTime > sunset || destinationTime < sunrise) {
    document.querySelector("body").classList.add("night-theme-body");
    document.querySelector("footer a").classList.add("night-theme-text");
  } else {
    document.querySelector("body").classList.remove("night-theme-body");
    document.querySelector("footer a").classList.remove("night-theme-text");
  }
}
// converting to fahrenheit
function convertTemp(temp) {
  temp = Math.round(temp * 1.8 + 32);
  return temp;
}

function convertF(event) {
  event.preventDefault;
  celsiusNow.classList.remove("display");
  fahrenheitNow.classList.add("display");
  weather.forEach(sevenDayForecastFahrenheit);
  updateHtml("#now-temp", `${fahrenheitTemp}°`);
  updateHtml("#min-temp", `${todayMinF}°`);
  updateHtml("#max-temp", `${todayMaxF}°`);
}
function convertC(event) {
  event.preventDefault;
  celsiusNow.classList.add("display");
  fahrenheitNow.classList.remove("display");
  weather.forEach(sevenDayForecast);
  updateHtml("#now-temp", `${celsiusTemp}°`);
  updateHtml("#min-temp", `${todayMin}°`);
  updateHtml("#max-temp", `${todayMax}°`);
}

//these set the temps so we're able to convert them celsius to fahrenheit
let celsiusTemp = null;
let fahrenheitTemp = null;
let weather = null;
let todayMin = null;
let todayMinF = null;
let todayMax = null;
let todayMaxF = null;
let timeZone = null;

// these variable make it clearer how we are setting the time and date in our functions

let now = new Date();
let destinationTime = null;
let destinationDate = null;
function getDestinationTime(timezone) {
  destinationTime = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone: timezone,
    hc: "h24",
  }).format(now);
  return destinationTime;
}
function getDestinationDate(timezone) {
  //this one is US format so it will display as month, date
  destinationDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  }).format(now);
  return destinationDate;
}
function sunTimes(time, timezone) {
  let sunTime = new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone: timezone,
    hc: "h24",
  }).format(time * 1000);
  return sunTime;
}

function getDayNames(timezone, date) {
  let day = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    timeZone: timezone,
    hc: "h24",
  }).format(date * 1000);
  return day;
}
// adding event listener to the now F
let fahrenheitNow = document.querySelector("#fahrenheit-now");
fahrenheitNow.addEventListener("click", convertF);

// //adding event listener to the now C
let celsiusNow = document.querySelector("#celsius-now");
celsiusNow.addEventListener("click", convertC);

//setting the weather for Sydney Australia on load
getWeatherData("-33.8688", 151.2093);

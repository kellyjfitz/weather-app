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

// these functions is used on the weather array to set the sevenday forecast
function sevenDayForecast(weather) {
  document.querySelector(
    weather.selector
  ).innerHTML = `${weather.dayName} <br />
        <h3 class="smaller-icon">${weather.icon}</h3>
        <strong>${weather.minTemp}°<span class="separator">/</span>${weather.maxTemp}°</strong>`;
}
function sevenDayForecastFahrenheit(weather) {
  document.querySelector(
    weather.selector
  ).innerHTML = `${weather.dayName} <br />
        <h3 class="smaller-icon">${weather.icon}</h3>
        <strong>${weather.minTempF}°<span class="separator">/</span>${weather.maxTempF}°</strong>`;
}

//this gets the info from the second weather api
function getExtraInfo(response) {
  weather = [
    {
      //tomorrow
      dayName: "Tomorrow",
      minTemp: Math.round(response.data.daily[1].temp.min),
      maxTemp: Math.round(response.data.daily[1].temp.max),
      minTempF: convertTemp(response.data.daily[1].temp.min),
      maxTempF: convertTemp(response.data.daily[1].temp.max),
      icon: setIcon(response.data.daily[1].weather[0].main),
      selector: "#tomorrow",
    },
    {
      //plus 2 days
      dayName: days[now.getDay() + 2],
      minTemp: Math.round(response.data.daily[2].temp.min),
      maxTemp: Math.round(response.data.daily[2].temp.max),
      minTempF: convertTemp(response.data.daily[2].temp.min),
      maxTempF: convertTemp(response.data.daily[2].temp.max),
      icon: setIcon(response.data.daily[2].weather[0].main),
      selector: "#plus-2",
    },
    {
      //plus 3 days
      dayName: days[now.getDay() + 3],
      minTemp: Math.round(response.data.daily[3].temp.min),
      maxTemp: Math.round(response.data.daily[3].temp.max),
      minTempF: convertTemp(response.data.daily[3].temp.min),
      maxTempF: convertTemp(response.data.daily[3].temp.max),
      icon: setIcon(response.data.daily[3].weather[0].main),
      selector: "#plus-3",
    },
    {
      //plus 4 days
      dayName: days[now.getDay() + 4],
      minTemp: Math.round(response.data.daily[4].temp.min),
      maxTemp: Math.round(response.data.daily[4].temp.max),
      minTempF: convertTemp(response.data.daily[4].temp.min),
      maxTempF: convertTemp(response.data.daily[4].temp.max),
      icon: setIcon(response.data.daily[4].weather[0].main),
      selector: "#plus-4",
    },
    {
      //plus 5 days
      dayName: days[now.getDay() + 5],
      minTemp: Math.round(response.data.daily[5].temp.min),
      maxTemp: Math.round(response.data.daily[5].temp.max),
      minTempF: convertTemp(response.data.daily[5].temp.min),
      maxTempF: convertTemp(response.data.daily[5].temp.max),
      icon: setIcon(response.data.daily[5].weather[0].main),
      selector: "#plus-5",
    },
    {
      //plus 6 days
      dayName: days[now.getDay() + 6],
      minTemp: Math.round(response.data.daily[6].temp.min),
      maxTemp: Math.round(response.data.daily[6].temp.max),
      minTempF: convertTemp(response.data.daily[6].temp.min),
      maxTempF: convertTemp(response.data.daily[6].temp.max),
      icon: setIcon(response.data.daily[6].weather[0].main),
      selector: "#plus-6",
    },
    {
      //plus 7 days
      dayName: days[now.getDay() + 7],
      minTemp: Math.round(response.data.daily[7].temp.min),
      maxTemp: Math.round(response.data.daily[7].temp.max),
      minTempF: convertTemp(response.data.daily[7].temp.min),
      maxTempF: convertTemp(response.data.daily[7].temp.max),
      icon: setIcon(response.data.daily[7].weather[0].main),
      selector: "#plus-7",
    },
  ];

  weather.forEach(sevenDayForecast);
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
  let timeZone = response.data.timezone;
  destinationTime = getDestinationTime(timeZone);
  destinationDate = getDestinationDate(timeZone);
  let sunrise = sunTimes(response.data.daily[0].sunrise, timeZone);
  let sunset = sunTimes(response.data.daily[0].sunset, timeZone);
  setTheme(destinationTime, sunset, sunrise);
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

//this sets the days and months so we can convert them from numbers to words
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
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

// these variable make it clearer how we are setting the time and date in our functions

let now = new Date();
let currentDay = days[now.getDay()];
let currentDate = now.getDate();
let currentMonth = months[now.getMonth()];
let currentHour = now.getHours();
let currentMinute = now.getMinutes();

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
  destinationDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
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

// adding event listener to the now F
let fahrenheitNow = document.querySelector("#fahrenheit-now");
fahrenheitNow.addEventListener("click", convertF);

// //adding event listener to the now C
let celsiusNow = document.querySelector("#celsius-now");
celsiusNow.addEventListener("click", convertC);

//calling functions for date and time on page load

//setting the weather for Sydney Australia on load
getWeatherData("-33.8688", 151.2093);

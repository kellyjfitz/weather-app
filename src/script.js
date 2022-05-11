let apiKey = "cbe5c0663f180c0503c859907df27f18";

function updateHtml(selector, textToAdd) {
  document.querySelector(selector).innerHTML = textToAdd;
}

//this sets the current time underneath the date
function showTime() {
  let nowTime = document.querySelector("#now");
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }
  nowTime.innerHTML = `Now: ${currentHour}:${currentMinute}`;
}

//this sets the current day, month, date under the city
function showDate() {
  document.querySelector(
    "h2"
  ).innerHTML = `${currentDay}, ${currentMonth} ${currentDate}`;
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

// this functions is used on the weather array to set the sevenday forecast
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

  //updating the bit above the sevenday forecast
  addForecast(chanceRain, rain, wind, uvIndex, humidity);

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
  }
  if (weather === "Rain" || weather === "Drizzle") {
    icon = "🌧️";
  }
  if (weather === "Clouds") {
    icon = "☁️";
  }
  if (weather === "Snow") {
    icon = "❄️";
  }
  if (weather === "Thunderstorm") {
    icon = "🌩️";
  }
  if (
    weather === "Mist" ||
    weather === "Fog" ||
    weather === "Smoke" ||
    weather === "Haze" ||
    weather === "Dust" ||
    weather === "Sand" ||
    weather === "Ash"
  ) {
    icon = "🌫️";
  }
  if (weather === "Squall" || weather === "Tornado") {
    icon = "🌪️";
  }
  return icon;
}

function addForecast(chanceRain, rain, wind, uvIndex, humidity) {
  let forecast = document.querySelector(".forecast");
  forecast.innerHTML = `<p>
    ☔ Chance of rain: ${chanceRain}% 🌧️ Rain: ${rain}mm
    <br />
    💨 Wind: ${wind}km/h ☀️ UV index: ${uvIndex} 💦 Humidity: ${humidity}%
  </p>`;
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

// adding event listener to the now F
let fahrenheitNow = document.querySelector("#fahrenheit-now");
fahrenheitNow.addEventListener("click", convertF);

// //adding event listener to the now C
let celsiusNow = document.querySelector("#celsius-now");
celsiusNow.addEventListener("click", convertC);

//calling functions for date and time on page load
showTime();
showDate();
//setting the weather for Sydney Australia on load
getWeatherData("-33.8688", 151.2093);
if (currentHour >= 20 || currentHour < 5) {
  document.querySelector("body").style.background =
    "linear-gradient(114.9deg, rgb(34, 34, 34) 8.3%, rgb(0, 40, 60) 41.6%, rgb(0, 143, 213) 93.4%)";
  document.querySelector("body").style.color = "white";
  document.querySelector(".convert .display").style.color = "white";
  document.querySelector("footer a").style.color = "white";
}

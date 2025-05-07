// API Key
const key = "340b8b62d723d40fef66995557c1a447";
const KELVIN = 273.15;

// Select elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// Weather data object
const weather = {
  temperature: {
    unit: "celsius",
  },
};

// Check for geolocation support
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  showNotification("Browser doesn't support geolocation.");
}

// Set user's location
function setPosition(position) {
  const { latitude, longitude } = position.coords;
  getWeather(latitude, longitude);
}

// Show error
function showError(error) {
  showNotification(error.message);
}

// Display notification
function showNotification(message) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${message}</p>`;
}

// Fetch weather data
async function getWeather(latitude, longitude) {
  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  try {
    const response = await fetch(api);
    const data = await response.json();

    weather.temperature.value = Math.floor(data.main.temp - KELVIN);
    weather.description = data.weather[0].description;
    weather.iconId = data.weather[0].icon;
    weather.city = data.name;
    weather.country = data.sys.country;

    displayWeather();
  } catch (error) {
    showNotification("Unable to retrieve weather data.");
  }
}

// Display weather to UI
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" alt="weather icon"/>`;
  tempElement.innerHTML = `${weather.temperature.value}<span>°C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// Celsius to Fahrenheit conversion
const celsiusToFahrenheit = (tempC) => Math.floor((tempC * 9) / 5 + 32);

// Toggle temperature unit
tempElement.addEventListener("click", () => {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "celsius") {
    const fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    tempElement.innerHTML = `${fahrenheit}<span>°F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}<span>°C</span>`;
    weather.temperature.unit = "celsius";
  }
});
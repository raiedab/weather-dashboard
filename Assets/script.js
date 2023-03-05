const apiKey = "3755c4c1b231d4d78320371fee6cbbce";

const searchForm = document.getElementById("form");
const searchInput = document.querySelector("input[type='text']");
const cityNameEl = document.getElementById("city-name");
const dateEl = document.getElementById("date");
const weatherIconEl = document.getElementById("weather-icon");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");
const forecastEl = document.getElementById("forecast");
const searchHistoryEl = document.getElementById("search-history");

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// add event listener to search form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const cityName = searchInput.value.trim();

  getWeather(cityName);
});

// update search history section
function renderSearchHistory() {
  searchHistoryEl.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
    const historyItem = document.createElement("input");
    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", true);
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", searchHistory[i]);
    historyItem.addEventListener("click", function () {
      getWeather(historyItem.value);
    });
    searchHistoryEl.append(historyItem);
  }
}

function getWeather(cityName) {
  // make API call to OpenWeatherMap
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // update current weather section
      cityNameEl.textContent = data.name;
      dateEl.textContent = new Date().toLocaleDateString();
      weatherIconEl.setAttribute(
        "src",
        `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
      );
      temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
      humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
      windSpeedEl.textContent = `Wind Speed: ${Math.round(
        data.wind.speed
      )} m/s`;

      // add searched city to search history array
      searchHistory.push(cityName);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

      // make API call to get 5-day forecast
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // update 5-day forecast section
      forecastEl.innerHTML = "";
      for (let i = 0; i < data.list.length; i += 8) {
        const forecastItem = data.list[i];
        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");
        forecastCard.innerHTML = `
          <h4>${new Date(forecastItem.dt * 1000).toLocaleDateString()}</h4>
          <img src="https://openweathermap.org/img/w/${forecastItem.weather[0].icon}.png" alt="weather icon">
          <p>Temperature: ${Math.round(forecastItem.main.temp)}°C</p>
          <p>Humidity: ${forecastItem.main.humidity}%</p>
        `;
        forecastEl.appendChild(forecastCard);
      }

      // update search history section
      updateSearchHistory();
    })
    .catch((error) => {
      console.log.error(error);
    });
}

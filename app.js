const cityTimezones = require("city-timezones");
var unique = require("uniq");
const key = "9302a69eb83ac8da83def37be0ee66e8";
const main = document.getElementById("main");
const form = document.getElementById("weatherform");
const search = document.getElementById("search");
const currentDate = document.getElementById("date");
const moment = require("moment-timezone");

const url = (location, apikey) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`;

async function getWeatherByLocation(location) {
  const resp = await fetch(url(location), { origin: "cors" });
  const respData = await resp.json();
  addWeatherToPage(respData);
}

function addWeatherToPage(data) {
  const temp = Math.floor(KtoC(data.main.temp));

  const weather = document.createElement("div");
  weather.classList.add("weather");

  weather.innerHTML = `
    <h2><span>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
    </span>${temp} °C <span>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
    </span></h2>
    <p>in ${search.value}</p>
    <p> ${data.weather[0].description} </p>
    `;
  main.innerHTML = "";

  main.appendChild(weather);
}
function KtoC(K) {
  return (K - 273.15).toFixed(2);
}
var time;
var timeForBck;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = search.value;
  const timezone = cityTimezones.lookupViaCity(location)[0].timezone;
  time = moment().tz(timezone).format("HH:mm:ss");
  timeForBck = moment().tz(timezone).format("HH");
  if (location) {
    getWeatherByLocation(location);
    changeBackground(timeForBck);
    addDayToPage(time);
  }
});

var today = new Date();

function changeBackground(timeForBck) {
  console.log(timeForBck);
  if (timeForBck >= 22 || timeForBck < 6) {
    document.getElementById("body").style.background = "black";
    document.getElementById("body").style.color = "white";
  } else if (timeForBck < 22 && timeForBck > 17) {
    document.getElementById("body").style.background = "#00008B";
    document.getElementById("body").style.color = "white";
  } else if (timeForBck >= 6 && timeForBck < 12) {
    document.getElementById("body").style.background = "#FFD700";
    document.getElementById("body").style.color = "black";
  } else if (timeForBck >= 12 && timeForBck <= 17) {
    document.getElementById("body").style.background = "#87CEEB";
    document.getElementById("body").style.color = "black";
  }
}

function currentDay(today) {
  return (
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  );
}
function currentTime(today) {
  if (today.getHours() >= 10 && today.getMinutes() >= 10) {
    return `${today.getHours()}:${today.getMinutes()}`;
  } else if (today.getHours() < 10 && today.getMinutes() < 10) {
    return `0${today.getHours()}:0${today.getMinutes()}`;
  } else if (today.getHours() >= 10 && today.getMinutes() <= 10) {
    return `${today.getHours()}:0${today.getMinutes()}`;
  } else if (today.getHours() <= 10 && today.getMinutes() >= 10) {
    return `0${today.getHours()}:${today.getMinutes()}`;
  }
}

function addDayToPage() {
  const date = document.createElement("div");
  date.classList.add("currentDate");

  date.innerHTML = `
    <h2>Today is ${currentDay(today)} </h2>
    <small>Current time is ${time}</small>`;

  currentDate.innerHTML = "";
  currentDate.appendChild(date);
}

currentDay(today);

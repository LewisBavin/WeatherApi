import { format } from "https://cdn.skypack.dev/date-fns";
import {
  insertHourlyHTML,
  insertDailyHTML,
  clearWeather,
} from "./DomInserts.js";
import { qs, qsa } from "./DomMethods.js";
import {
  weather5day3Hour,
  weatherCurrent,
  airPolution4day,
  weatherDaily,
  getWeather,
  geoQuery,
} from "./apiMethods.js";

const { log, clear } = console;
const Coords = { txt: null, lon: null, lat: null };
var jumpButtonsInitialised = false;

document.addEventListener("DOMContentLoaded", () => {
  const locations = document.getElementById("location"),
    hereButton = document.getElementById("get-location"),
    lastUpdated = document.getElementById("last-updated-val"),
    suggestions = document.getElementById("autocompleteOff"),
    locationHeader = qs(".location-header"),
    weatherContainer = qs(".weather-container"),
    spinnerNav = qs(".loading.nav"),
    spinnerWeather = qs(".loading.weather");

  function getAllWeather() {
    clearWeather();
    Promise.all([importCurrent(), importHourly(), importDaily()]).then(() => {
      qs(".daily").firstChild.click();
      !jumpButtonsInitialised
        ? (() => {
            qsa(".jump.button-12").forEach((button) => {
              button.addEventListener("click", () => {
                qs(`.${button.classList[2]}`, qs(".daily")).click();
              });
            });
            jumpButtonsInitialised = true;
          })()
        : null;
      lastUpdated.innerHTML = format(new Date(), "HH:mm");
    });
    locationHeader.innerHTML = Coords.txt;
    locations.value = "";
    weatherContainer.classList.add("show");
  }

  (function PopulateLocationSuggestions() {
    locations.addEventListener("input", async (ev) => {
      if (locations.value.length >= 3) {
        Coords.txt = locations.value;
        try {
          let data = (await geoQuery("autocomplete", Coords)).data;
          if (
            ev.inputType == "insertText" ||
            ev.inputType == "deleteContentBackward"
          ) {
            suggestions.innerHTML = null;
            let apiReturns = data.features;
            apiReturns.forEach((place) => {
              suggestions.innerHTML += `<option value="${place.properties.formatted.replace(
                "yes, ", //weird bug with the api
                ""
              )}">`;
            });
          } else {
            suggestions.innerHTML = null;
          }
        } catch {}
      } else {
        suggestions.innerHTML = null;
      }
    });
  })();

  (function LocationInputTrigger() {
    locations.addEventListener("change", async () => {
      if (locations.value.length >= 3) {
        weatherContainer.classList.remove("show");
        spinnerWeather.style.display = "block";
        let sendLocation = (await geoQuery("autocomplete", Coords)).data
          .features[0].properties;
        Coords.txt = sendLocation.formatted;
        Coords.lat = sendLocation.lat;
        Coords.lon = sendLocation.lon;
        getAllWeather();
        spinnerWeather.style.display = "none";
      }
    });
  })();

  (function CurrentLocationClick() {
    hereButton.addEventListener("click", async () => {
      weatherContainer.classList.remove("show");
      qs("svg", hereButton).style.display = "none";
      spinnerNav.style.display = null;

      try {
        let data = await getNavLocation();
        Coords.lon = data.coords.longitude;
        Coords.lat = data.coords.latitude;
        Coords.txt = (
          await geoQuery("reverse", Coords)
        ).data.features[0].properties.formatted;
        locations.value = Coords.txt;
        getAllWeather();
      } catch {
      } finally {
        spinnerNav.style.display = "none";
        qs("svg", hereButton).style.display = null;
      }
    });
  })();
});

async function importDaily() {
  try {
    let data = (await getWeather(weatherDaily, Coords, "hourly,minutely")).data
      ;
    let pollList = (await getWeather(airPolution4day, Coords)).data.list;
    log("daily", data)
    insertDailyHTML(data.daily, pollList);
  } catch {}
}

async function importHourly() {
  try {
    let data = (await getWeather(weather5day3Hour, Coords)).data;
    log("houtly", data)
    insertHourlyHTML(data);
  } catch {}
}

async function importCurrent() {
  try {
    let data = (await getWeather(weatherCurrent, Coords)).data;
    log("current", data)
    insertHourlyHTML(data, true);
  } catch {}
}

function getNavLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(success, error);
    function success(GeolocationPosition) {
      resolve(GeolocationPosition);
    }
    function error(GeolocationPositionError) {
      reject(GeolocationPositionError);
    }
  });
}

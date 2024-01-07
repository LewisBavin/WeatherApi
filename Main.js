import { format } from "https://unpkg.com/date-fns/format.mjs";
import {
  insertHourlyHTML,
  insertDailyHTML,
  clearWeather,
} from "./DomInserts.js";
import { qs, qsa, getById } from "./DomMethods.js";
import {
  weather5day3Hour,
  weatherCurrent,
  airPolution4day,
  weatherDaily,
  getWeather,
  geoQuery,
} from "./apiMethods.js";

const { log, clear } = console;
const Coords = {
  txt: null,
  lon: null,
  lat: null,
};

var jumpButtonsInitialised = false;

document.addEventListener("DOMContentLoaded", () => {
  const locations = getById("location"),
    hereButton = getById("get-location"),
    lastUpdated = getById("last-updated-val"),
    suggestions = getById("autocompleteOff"),
    locationHeader = getById("location-header"),
    weatherContainer = qs(".weather-container"),
    spinnerNav = qs(".loading.nav"),
    spinnerWeather = qs(".loading.weather");

  (function CurrentLocationClick() {
    hereButton.addEventListener("click", async () => {
      weatherContainer.classList.remove("show");
      qs("svg", hereButton).style.display = "none";
      spinnerNav.style.display = null;

      try {
        let data = await getNavLocation();
        Coords.lon = data.coords.longitude;
        Coords.lat = data.coords.latitude;
        let geoData = await geoQuery("reverse", Coords);
        Coords.txt = geoData.data.features[0].properties.formatted;
        locations.value = Coords.txt;
        getAllWeather();
      } catch (err) {
        fadeAlert(err, 3000, "couldn't get current location");
      } finally {
        spinnerNav.style.display = "none";
        qs("svg", hereButton).style.display = null;
      }
    });
  })();

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
        } catch (err) {
          fadeAlert(err, 3000, "Could not get autocomplete data");
        }
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
        try {
          let sendLocation = (await geoQuery("autocomplete", Coords)).data
            .features[0].properties;
          Coords.txt = sendLocation.formatted;
          Coords.lat = sendLocation.lat;
          Coords.lon = sendLocation.lon;
          getAllWeather();
        } catch (err) {
          log(err);
          fadeAlert(
            err,
            3000,
            "Please select a valid location from the dropdown",
            true
          );
        }
        spinnerWeather.style.display = "none";
      }
    });
  })();

  function getAllWeather() {
    clearWeather();
    Promise.all([
      importData(weatherCurrent),
      importData(weather5day3Hour),
      importData(weatherDaily, "hourly,minutely"),
    ])
      .then((val) => {
        qs(".daily").firstChild.click();
        !jumpButtonsInitialised
          ? (function initialiseButtons() {
              qsa(".jump.button-12").forEach((button) => {
                button.addEventListener("click", () => {
                  qs(`.${button.classList[2]}`, qs(".daily")).click();
                });
              });
              jumpButtonsInitialised = true;
            })()
          : null;
        lastUpdated.innerHTML = format(new Date(), "HH:mm");
        locationHeader.innerHTML = Coords.txt;
        locations.value = "";
        weatherContainer.classList.add("show");
        setNull(Coords);
      })
      .catch((err) => fadeAlert(err, 3000, "could not import data"));
  }
});

function importData(getType, exclude = "") {
  return new Promise((resolve, reject) => {
    getWeather(getType, Coords, exclude)
      .then(async (data) => {
        if (getType == weatherCurrent) insertHourlyHTML(data.data, true);
        if (getType == weather5day3Hour) insertHourlyHTML(data.data);
        if (getType == weatherDaily) {
          let pollList = (await getWeather(airPolution4day, Coords)).data.list;
          insertDailyHTML(data.data, pollList);
        }
        resolve(data.data);
      })
      .catch((err) => reject(err));
  });
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

function fadeAlert(err, ms, customMessage = "", overide = false) {
  let el = getById("alert");
  el.innerHTML = !customMessage
    ? err.message
    : overide
    ? customMessage
    : err.message + "\n" + customMessage;
  el.classList.add("show");
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => {
      el.innerHTML = null;
    }, 1000);
  }, ms);
}

let setAll = (obj, val) => Object.keys(obj).forEach((k) => (obj[k] = val));
let setNull = (obj) => setAll(obj, null);

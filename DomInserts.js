import { differenceInDays } from "https://unpkg.com/date-fns/differenceInDays.mjs";
import { format } from "https://unpkg.com/date-fns/format.mjs";
import { startOfDay } from "https://unpkg.com/date-fns/startOfDay.mjs";
import {
  qs,
  qsa,
  setScrollPosition,
  createHtmlNode,
  getById,
} from "./DomMethods.js";

import {
  rainDescription,
  windDescription,
  uvDescription,
  qualityColours,
  pollutionDescription,
} from "./weatherDescriptions.js";
import {
  dateSame,
  gasDay,
  differenceInGasDays,
  getDayName,
} from "./moreDateFunctions.js";

const { log } = console;

const buttonBefore = getById("jump-before"),
  buttonAfter = getById("jump-after"),
  localZone = getById("local-zone"),
  pollVal = getById("pollution-val"),
  pollIco = getById("pollution-ico"),
  uvVal = getById("uv-val"),
  uvIco = getById("uv-ico"),
  sunriseVal = getById("sunrise-val"),
  sunriseValLocal = getById("sunrise-val-local"),
  sunsetVal = getById("sunset-val"),
  sunsetValLocal = getById("sunset-val-local"),
  noData = getById("no-data");

export function clearWeather() {
  for (let node of qsa(`div[class*="data d_"]`)) {
    node.remove();
  }
  localZone.innerHTML = null;
  sunriseVal.innerHTML = null;
  sunsetVal.innerHTML = null;
  sunriseValLocal.innerHTML = null;
  sunsetValLocal.innerHTML = null;
  uvVal.innerHTML = null;
  pollVal.innerHTML = null;
  buttonBefore.className = `jump button-12`;
  buttonAfter.className = `jump button-12`;
}

function setToggleBehavior(el, innerQuery, innerToggle, outerAdd = "") {
  let hiddenChild = qs(innerQuery, el);
  qsa(innerQuery, el.parentNode).forEach((otherHidden) => {
    if (hiddenChild == otherHidden) {
      hiddenChild.classList.toggle(innerToggle);
      !!outerAdd ? el.classList.add(outerAdd) : null;
    } else {
      otherHidden.classList.remove(innerToggle);
      !!outerAdd ? otherHidden.parentNode.classList.remove(outerAdd) : null;
    }
  });
}

export function insertHourlyHTML(apiData, isCurrent = false) {
  let frag = document.createDocumentFragment();
  let iCount = isCurrent ? 1 : apiData.list.length;
  let timeZoneOffset = isCurrent ? apiData.timezone : apiData.city.timezone;

  for (let i = 0; i < iCount; i++) {
    // I'm going to create each nested html node on the fly.
    // I've found this easier than having the html already existing and
    // then drilling down into it to assign values
    // and also through my createHTMLNode function I now have a way of consistently
    // creating nested html nodes that I can use for the future.
    // its also helpful having the js code visualy emmulate what the html structure would
    // look like
    let iData = isCurrent ? apiData : apiData.list[i];
    let iDate = new Date(iData.dt * 1000);
    let iDateLocal = new Date((iData.dt + timeZoneOffset) * 1000);
    let offsetGasDay = differenceInDays(
      startOfDay(iDate),
      startOfDay(new Date())
    );
    let windDirection = iData.wind.deg;
    let windSpeed = Math.round(iData.wind.speed * 10) / 10;
    let rainProb = iData.pop * 100;
    createHtmlNode(frag, {
      class: `flx hour data d_${offsetGasDay} h_${isCurrent ? "current" : i}`,
      doWith: (el) => {
        el.addEventListener("click", () => {
          setToggleBehavior(el, ".hidden-inner", "show");
        });
      },
      children: [
        {
          class: "flx visible col",
          children: [
            {
              class: "timestamp",
              children: [
                {
                  class: "timestamp-time",
                  innerHTML: format(iDate, "HH:mm"),
                },
                {
                  class: "timestamp-time local",
                  innerHTML:
                    timeZoneOffset == 0 ? null : format(iDateLocal, "HH:mm"),
                },
                {
                  class: "timestamp-day",
                  innerHTML: isCurrent
                    ? "now"
                    : iDate.getHours() == 0
                    ? getDayName(iDate, "en", "short")
                    : null,
                },
              ],
            },
            {
              class: "weather-ico",
              children: [
                {
                  tag: "img",
                  atts: {
                    src: `https://openweathermap.org/img/wn/${iData.weather[0].icon}@2x.png`,
                    alt: "weather-icon",
                    width: "50px",
                    height: "50px",
                  },
                },
              ],
            },
            {
              class: "temps",
              children: [
                {
                  class: "temp-max",
                  innerHTML: `&uarr;${Math.round(
                    iData.main.temp_max - 273.15
                  )}&deg;`,
                },
                {
                  class: "temp-avg",
                  innerHTML: `${Math.round(iData.main.temp - 273.15)}&deg;`,
                },
                {
                  class: "temp-min",
                  innerHTML: `&darr;${Math.round(
                    iData.main.temp_min - 273.15
                  )}&deg;`,
                },
              ],
            },
            isCurrent
              ? {}
              : {
                  class: "flx rain col",
                  children: [
                    {
                      tag: "svg",
                      atts: {
                        fill: Math.round(rainProb) == 0 ? "grey" : "lightblue",
                        width: "25px",
                        height: "25px",
                      },
                      children: [{ tag: "use", attributesNS: "#icon-rain" }],
                    },
                    {
                      class: "rain-pop",
                      innerHTML: isCurrent ? null : `${Math.round(rainProb)}%`,
                    },
                  ],
                },
            {
              class: "flx wind",
              children: [
                {
                  tag: "svg",
                  atts: {
                    width: "50px",
                    height: "50px",
                    transform: `rotate(${windDirection})`,
                  },
                  children: [{ tag: "use", attributesNS: "#wind-direction" }],
                },
                { class: "wind-speed", innerHTML: `${windSpeed}` },
              ],
            },
          ],
        },
        {
          class: "flx hidden-inner col",
          children: [
            { class: "main-descr", innerHTML: iData.weather[0].description },
            {
              class: "flx misc col",
              children: [
                {
                  class: "humidty",
                  innerHTML: "Humidity: ",
                  children: [
                    { tag: "span", innerHTML: `${iData.main.humidity}%` },
                  ],
                },
                {
                  class: "pressure",
                  innerHTML: "Pressure: ",
                  children: [
                    { tag: "span", innerHTML: `${iData.main.pressure} mb` },
                  ],
                },
                {
                  class: "visibility",
                  innerHTML: "Visibility: ",
                  children: [{ tag: "span", innerHTML: iData.visibility }],
                },
              ],
            },
            {
              class: "feels",
              innerHTML: "Feels Like: ",
              children: [
                {
                  tag: "span",
                  innerHTML: `${Math.round(
                    iData.main.feels_like - 273.15
                  )}&deg;`,
                },
              ],
            },
            {
              class: "rain-descr",
              innerHTML: isCurrent ? null : rainDescription(rainProb),
            },
            {
              class: "wind-descr",
              innerHTML: windDescription(windSpeed, windDirection),
            },
          ],
        },
      ],
    });
    isCurrent ? qs(".hourly").prepend(frag) : qs(".hourly").append(frag);
  }
}

export function insertDailyHTML(apiData, apiPollList) {
  let pollutionAvgs = pollutionAvgObj(apiPollList);
  let frag = document.createDocumentFragment();
  let timeZoneOffset = apiData.timezone_offset;
  timeZoneOffset == 0
    ? (function removeLocal() {
        qs(".timezone-local").classList.add("hidden");
      })()
    : (function populateLocal() {
        qs(".timezone-local").classList.remove("hidden");
        localZone.innerHTML =
          timeZoneOffset < 0
            ? `GMT (-${(timeZoneOffset / 3600).toFixed(2)} Hs)`
            : `GMT (+${(timeZoneOffset / 3600).toFixed(2)} Hs)`;
      })();
  let dailyList = apiData.daily;

  for (let i = 0; i < dailyList.length; i++) {
    let iData = dailyList[i];
    let iDate = startOfDay(new Date((iData.dt + timeZoneOffset) * 1000));
    let offsetGasDay = differenceInDays(iDate, startOfDay(new Date()));

    createHtmlNode(frag, {
      class: `flx data d_${offsetGasDay}`,
      doWith: (el) => {
        el.addEventListener("click", () => {
          setToggleBehavior(el, ".hidden-inner", "show", "expanded");
          setScrollPosition(el.parentNode, i, dailyList.length - 1, Math.ceil);
          (function linkHourlyDaily() {
            qsa(".hour").forEach((hourNode) => {
              hourNode.classList.contains(`d_${offsetGasDay}`)
                ? hourNode.classList.remove("hidden")
                : hourNode.classList.add("hidden");
            });
          })();
          (function updateButtonBehavior() {
            buttonBefore.className = `jump button-12 d_${offsetGasDay - 1}`;
            buttonAfter.className = `jump button-12 d_${offsetGasDay + 1}`;
            i == 0
              ? buttonBefore.classList.add("hidden")
              : i == dailyList.length - 1
              ? buttonAfter.classList.add("hidden")
              : null;
          })();
          (function populateDailyFooter() {
            uvVal.innerHTML = `${uvDescription(iData.uvi)}`;
            uvIco.style.fill = qualityColours[uvDescription(iData.uvi)];
            pollVal.innerHTML = pollutionAvgs.hasOwnProperty(
              `d_${offsetGasDay}`
            )
              ? pollutionDescription(pollutionAvgs[`d_${offsetGasDay}`])
              : null;
            pollIco.style.fill =
              qualityColours[
                pollutionDescription(pollutionAvgs[`d_${offsetGasDay}`])
              ];
            sunriseVal.innerHTML = `${format(
              new Date(iData.sunrise * 1000),
              "HH:mm"
            )}`;

            sunsetVal.innerHTML = `${format(
              new Date(iData.sunset * 1000),
              "HH:mm"
            )}`;
            timeZoneOffset == 0
              ? null
              : (function localTimes() {
                  sunriseValLocal.innerHTML = `${format(
                    new Date((iData.sunrise + timeZoneOffset) * 1000),
                    "HH:mm"
                  )}`;
                  sunsetValLocal.innerHTML = `${format(
                    new Date((iData.sunset + timeZoneOffset) * 1000),
                    "HH:mm"
                  )}`;
                })();
          })();
          (function displayNoData() {
            let areAllHidden = qsa(".hour.data").every((el) => {
              return el.classList.contains("hidden");
            });
            areAllHidden ? noData.classList.remove("hidden") : null;
          })();
        });
      },
      children: [
        {
          class: "flx col visible",
          children: [
            {
              class: "day-header",
              innerHTML: iDate.toDateString().slice(0, 10),
            },
            {
              class: "flx visual-summary",
              children: [
                {
                  class: "weather-ico",
                  children: [
                    {
                      tag: "img",
                      atts: {
                        src: `https://openweathermap.org/img/wn/${iData.weather[0].icon}@2x.png`,
                        alt: "weather-ico",
                      },
                    },
                  ],
                },
                {
                  class: "flx col daily-temps",
                  children: [
                    {
                      class: "temp-max",
                      innerHTML: `&uarr;${Math.round(
                        iData.temp.max - 273.15
                      )}&deg;`,
                    },
                    {
                      class: "temp-min",
                      innerHTML: `&darr;${Math.round(
                        iData.temp.min - 273.15
                      )}&deg;`,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          class: "flx hidden-inner",
          children: [
            {
              class: "daily-descr",
              innerHTML: iData.summary,
            },
          ],
        },
      ],
    });
    qs(".daily").append(frag);
  }
}

function pollutionAvgObj(pollList) {
  let obj = {};

  for (let i = 0; i < pollList.length; i++) {
    let offsetGasDay = differenceInGasDays(
      new Date(pollList[i].dt * 1000),
      new Date()
    );
    offsetGasDay = "d_" + offsetGasDay;
    obj[offsetGasDay] == null
      ? (obj[offsetGasDay] = [pollList[i].main.aqi])
      : obj[offsetGasDay].push(pollList[i].main.aqi);
  }

  for (let arr in obj) {
    obj[arr] =
      obj[arr].reduce((acc, cur) => {
        return acc + cur;
      }, 0) / obj[arr].length;
  }

  return obj;
}

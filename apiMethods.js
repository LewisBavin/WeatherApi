export const weatherDaily = "3.0/onecall",
  weatherCurrent = "2.5/weather",
  weather5day3Hour = "2.5/forecast",
  airPolution4day = "2.5/air_pollution/forecast";

export function getWeather(getType, coords, exclude = "") {
  // return getType specific axios.get Promise for use in later async functions
  return axios.get(
    getStringWeather(
      weatherRoot,
      getType,
      coords.lat,
      coords.lon,
      weatherCurrentId,
      exclude
    )
  );
}

export function geoQuery(type, location) {
  let queryString = "";
  if (type == "autocomplete") {
    queryString = `${geoRoot}/autocomplete?text=${location.txt}&apiKey=${geoId}`;
  }
  if (type == "reverse") {
    queryString = `${geoRoot}/reverse?lat=${location.lat}&lon=${location.lon}&apiKey=${geoId}`;
  }

  return axios.get(queryString);
}

const weatherRoot = "https://api.openweathermap.org/data/";
const weatherId1 = "1bdc789a12338e902dbf74a987c1a46c";
const weatherId2 = "ca429587120958372688ff3694ce726b";
const weatherId3 = "b0ac282f0c354b0668435393d621685c";
const weatherCurrentId = weatherId1;
const geoRoot = "https://api.geoapify.com/v1/geocode";
const geoId = "7fe3fded3c304c2fba46a2ab6cc41783";

function getStringWeather(root, type, lat, lon, id, exclude = "") {
  return exclude == ""
    ? `${root}${type}?lat=${lat}&lon=${lon}&appid=${id}`
    : `${root}${type}?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${id}`;
}

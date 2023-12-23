import {
  compareAsc,
  format,
  add,
  parse,
  isBefore,
  startOfDay,
  endOfMonth,
  differenceInDays,
  differenceInYears,
  isSameMonth,
  isThisMonth,
  endOfDecade,
  isValid,
} from "https://cdn.skypack.dev/date-fns";

export function gasDay(D) {
  return D.getHours() >= 0 && D.getHours() < 6
    ? startOfDay(new Date(D - 1000 * 60 * 60 * 24))
    : startOfDay(D);
}

export function dateSame(d1, d2) {
  return d1.getTime() == d2.getTime();
}

export function differenceInGasDays(d1, d2) {
  return differenceInDays(gasDay(d1), gasDay(d2));
}

export function getDayName(date, locale, length) {
  return date.toLocaleDateString(locale, { weekday: length });
}

function test(D){
  console.log(D.getTimezoneOffset())
}

test(new Date())


/* function calcTime(city, offset) {
  // create Date object for current location
  var d = new Date();

  // convert to msec
  // subtract local time zone offset
  // get UTC time in msec
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

  // create new Date object for different city
  // using supplied offset
  var nd = new Date(utc + (3600000*offset));

  // return time as a string
  return "The local time for city"+ city +" is "+ nd.toLocaleString();
}

alert(calcTime("Europe/London", '+5.5')); */
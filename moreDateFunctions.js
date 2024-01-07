import { differenceInDays } from "https://unpkg.com/date-fns/differenceInDays.mjs";
import { startOfDay } from "https://unpkg.com/date-fns/startOfDay.mjs";

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
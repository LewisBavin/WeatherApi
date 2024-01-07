export const qualityColours = {
  L: "green",
  M: "yellow",
  H: "orange",
  VH: "red",
  EX: "darkred",
};

export function rainDescription(val) {
  let str = "";
  if (val < 15) {
    str = "Rain not expected";
  } else if (val < 33) {
    str = "Rain not likely";
  } else if (val < 50) {
    str = "Potential for rain";
  } else if (val < 70) {
    str = "Rain Likely";
  } else if (val < 85) {
    str = "Rain highly likely";
  } else {
    str = "Get ya fkn brolley out";
  }
  return str;
}

export function uvDescription(val) {
  let str = "";
  if (val < 3) {
    str = "L";
  } else if (val < 6) {
    str = "M";
  } else if (val < 8) {
    str = "H";
  } else if (val < 11) {
    str = "VH";
  } else {
    str = "EX!";
  }
  return str;
}

export function pollutionDescription(val) {
  let str = "";
  if (val < 50) {
    str = "L";
  } else if (val < 100) {
    str = "M";
  } else if (val < 150) {
    str = "H";
  } else if (val < 200) {
    str = "VH";
  } else {
    str = "EX!";
  }
  return str;
}

export function windDirection(degree) {
  let str = "";
  if (degree < 90) {
    str = "South West";
  } else if (degree < 180) {
    str = "North West";
  } else if (degree < 270) {
    str = "North East";
  } else {
    str = "South East";
  }
  return str;
}

export function windDescription(val, degree) {
  let str = "";
  let direction = windDirection(degree);
  val = Math.round(val / 1.2);

  switch (val) {
    case 0:
      str = `Calm - No Winds`;
      break;

    case 1:
      str = `Light air from the ` + direction;
      break;

    case 2:
      str = `Light breeze from the ` + direction;
      break;

    case 3:
      str = `Gentle breeze from the ` + direction;
      break;

    case 4:
      str = `Moderate breeze from the ` + direction;
      break;

    case 5:
      str = `Fresh breeze from the ` + direction;
      break;

    case 6:
      str = `Strong breeze from the ` + direction;
      break;

    case 7:
      str = `Near gale from the ` + direction;
      break;

    case 8:
      str = `Gale from the ` + direction;
      break;

    case 9:
      str = `Strong gale from the ` + direction;
      break;
    default:
      str = `Storm from the ` + direction;
      break;
  }
  return str;
}

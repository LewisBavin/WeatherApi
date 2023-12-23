export function rainDescription(pop) {
  let str = "";
  if (pop < 15) {
    str = "Rain not expected";
  } else if (pop < 33) {
    str = "Rain not likely";
  } else if (pop < 50) {
    str = "Potential for rain";
  } else if (pop < 70) {
    str = "Rain Likely";
  } else if (pop < 85) {
    str = "Rain highly likely";
  } else {
    str = "Get ya fkn brolley out";
  }
  return str;
}

export const qualityColours = {
  L: "green",
  M: "yellow",
  H: "orange",
  VH: "red",
  EX: "darkred",
};

export function uvDescription(pop) {
  let str = "";
  if (pop < 3) {
    str = "L";
  } else if (pop < 6) {
    str = "M";
  } else if (pop < 8) {
    str = "H";
  } else if (pop < 11) {
    str = "VH";
  } else {
    str = "EX!";
  }
  return str;
}

export function pollutionDescription(pop) {
  let str = "";
  if (pop < 50) {
    str = "L";
  } else if (pop < 100) {
    str = "M";
  } else if (pop < 150) {
    str = "H";
  } else if (pop < 200) {
    str = "VH";
  } else {
    str = "EX!";
  }
  return str;
}

export function windDirection(deg) {
  let str = "";
  if (deg < 90) {
    str = "South West";
  } else if (deg < 180) {
    str = "North West";
  } else if (deg < 270) {
    str = "North East";
  } else {
    str = "South East";
  }
  return str;
}

export function windDescription(B, deg) {
  let str = "";
  let dir = windDirection(deg);
  B = Math.round(B / 1.2);

  switch (B) {
    case 0:
      str = `Calm - No Winds`;
      break;

    case 1:
      str = `Light air from the ` + dir;
      break;

    case 2:
      str = `Light breeze from the ` + dir;
      break;

    case 3:
      str = `Gentle breeze from the ` + dir;
      break;

    case 4:
      str = `Moderate breeze from the ` + dir;
      break;

    case 5:
      str = `Fresh breeze from the ` + dir;
      break;

    case 6:
      str = `Strong breeze from the ` + dir;
      break;

    case 7:
      str = `Near gale from the ` + dir;
      break;

    case 8:
      str = `Gale from the ` + dir;
      break;

    case 9:
      str = `Strong gale from the ` + dir;
      break;
    default:
      str = `Storm from the ` + dir;
      break;
  }
  return str;
}

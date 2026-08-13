export function calculatePointsForClimb(grade: Grade | null, flashed: boolean) {
  let points = 0;
  switch (grade) {
    case "green":
      points = 1;
      break;
    case "orange":
      points = 4;
      break;
    case "blue":
      points = 10;
      break;
    case "white":
      points = 25;
      break;
  }

  if (flashed) points *= 2;
  return points;
}

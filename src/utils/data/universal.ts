import { Grade, SessionRecord } from "@/types/data";

export const GRADES = [
  "pink",
  "yellow",
  "green",
  "orange",
  "blue",
  "white",
] as const;

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

export function calculateTotalPoints(record?: SessionRecord) {
  if (record === undefined) return 0;
  return Object.entries(record)
    .map(([grade, counts]) => {
      return (
        calculatePointsForClimb(grade as Grade, false) * counts.regular +
        calculatePointsForClimb(grade as Grade, true) * counts.flashed
      );
    })
    .reduce((sum, count) => sum + count, 0);
}

export function calculateAverage(
  totalPoints: number,
  count: number,
): Grade | null {
  const avg = Math.floor(totalPoints / count);
  if (avg < 1) {
    return null;
  } else if (avg < 4) {
    return "green";
  } else if (avg < 10) {
    return "orange";
  } else if (avg < 25) {
    return "blue";
  }
  return "white";
}

export function createEmptySessionRecord(): SessionRecord {
  return GRADES.reduce((acc, grade) => {
    acc[grade] = { regular: 0, flashed: 0 };
    return acc;
  }, {} as SessionRecord);
}

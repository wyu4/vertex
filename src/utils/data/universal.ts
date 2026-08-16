import { Grade, GradeRecord, SessionRecord } from "@/types/data";

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

export function parseStringifiedSession(session: string) {
  let result = createEmptySessionRecord();

  try {
    const parsedSession = JSON.parse(session) as Record<
      string,
      string | GradeRecord
    >;
    for (const [grade, value] of Object.entries(parsedSession)) {
      if (!(GRADES as readonly string[]).includes(grade)) {
        continue;
      }
      const gradeRecord = (
        typeof value === "string" ? JSON.parse(value) : value
      ) as GradeRecord;
      gradeRecord.flashed = gradeRecord.flashed ?? 0;
      gradeRecord.regular = gradeRecord.regular ?? 0;

      result[grade as Grade] = gradeRecord;
    }
  } catch (e) {
    console.error("Could not parse stringified session.", e);
  }
  return result;
}

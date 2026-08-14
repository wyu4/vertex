import { GRADES } from "@/utils/data/universal";

declare type Grade = (typeof GRADES)[number];
declare type GradeRecord = {
  regular: number;
  flashed: number;
};
declare type SessionRecord = Record<Grade, GradeRecord>;
declare type SessionRecordDoc = Record<string, SessionRecord>;
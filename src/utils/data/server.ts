import { Grade, GradeRecord, SessionRecord } from "@/types/data";
import { getUserID } from "../auth/server";

import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createEmptySessionRecord, GRADES } from "./universal";

export const FirebaseCert = cert({
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
});

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: FirebaseCert,
  });
}

const adminApp = getFirebaseAdminApp();
const db = getFirestore(adminApp);

async function getSnapshot(collection: string, doc: string) {
  const recordDoc = db.collection(collection).doc(doc);
  return await recordDoc.get();
}

function parseStringifiedSession(session: string) {
  const parsedSession = JSON.parse(session) as Record<string, string>;
  let result = createEmptySessionRecord();
  for (const [grade, value] of Object.entries(parsedSession)) {
    if (!(GRADES as readonly string[]).includes(grade)) {
      continue;
    }
    const gradeRecord = JSON.parse(value) as GradeRecord;
    gradeRecord.flashed = gradeRecord.flashed ?? 0;
    gradeRecord.regular = gradeRecord.regular ?? 0;

    result[grade as Grade] = gradeRecord;
  }
  return result;
}

export async function getAllRecords(): Promise<Record<string, SessionRecord>> {
  const userID = await getUserID();
  if (!userID) {
    return {};
  }

  let result: Record<string, SessionRecord> = {};

  const snapshot = await getSnapshot("records", userID);
  const data = snapshot.data() as Record<string, string> | undefined;

  if (data === undefined) return {};

  for (const [timestamp, rawSession] of Object.entries(data)) {
    result[timestamp] = parseStringifiedSession(rawSession);
  }

  return result;
}

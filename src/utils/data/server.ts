"use server";

import { SessionRecord } from "@/types/data";
import { FirebaseCert, getUserID } from "../auth/server";

import { App, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { calculateTotalPoints, parseStringifiedSession } from "./universal";

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

export async function uploadRecord(record: SessionRecord) {
  const userID = await getUserID();
  if (!userID) {
    return false;
  }

  if (calculateTotalPoints(record) <= 0) return false;

  const recordDoc = db.collection("records").doc(userID);
  try {
    await recordDoc.set(
      { [new Date().toISOString()]: JSON.stringify(record) },
      { merge: true },
    );
  } catch (error) {
    console.error("Failed to upload record", error);
    return false;
  }

  return true;
}

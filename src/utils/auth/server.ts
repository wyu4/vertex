import { betterAuth } from "better-auth";
import { firestoreAdapter, initFirestore } from "better-auth-firestore";
import { cert } from "firebase-admin/app";

const firestore = initFirestore({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  }),
  projectId: process.env.FIREBASE_PROJECT_ID!,
  name: "vertex",
});

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: firestoreAdapter({ firestore }),
  emailAndPassword: {
    enabled: true,
  },
});

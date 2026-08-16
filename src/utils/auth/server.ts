import { betterAuth } from "better-auth";
import { firestoreAdapter, initFirestore } from "better-auth-firestore";
import { Resend } from "resend";
import { headers } from "next/headers";
import { cert } from "firebase-admin/app";

export const FirebaseCert = cert({
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
});

const firestore = initFirestore({
  credential: FirebaseCert,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  name: "vertex",
});

const resend = new Resend(process.env.RESEND_PRIVATE_KEY!);

function sendEmail(payload: { to: string; subject: string; html: string }) {
  resend.emails.send({
    from: process.env.RESEND_EMAIL!,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: firestoreAdapter({ firestore }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      void sendEmail({
        to: user.email,
        subject: "[Vertex Registration] Verify your email address",
        html: `Click the link to verify your email: ${url}`,
      });
    },
  },
});

export async function getUserID() {
  const data = await auth.api.getSession({ headers: await headers() });
  return data === null ? null : data.user.id;
}
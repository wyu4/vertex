import { betterAuth } from "better-auth";
import { firestoreAdapter, initFirestore } from "better-auth-firestore";
import { cert } from "firebase-admin/app";
import { Resend } from "resend";

const firestore = initFirestore({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  }),
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

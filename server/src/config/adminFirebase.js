import { initializeApp, cert } from "firebase-admin/app";

const admin = initializeApp({
  credential: cert({
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL

  }),
});

export default admin;
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT!, "base64").toString(
      "utf-8"
    )
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

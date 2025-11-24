import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Necesario para poder usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el JSON del service account
const serviceAccountPath = path.join(__dirname, "serviceAccount.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();
export default admin;

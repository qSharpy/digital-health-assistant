import * as admin from "firebase-admin";
import { creds } from "./firebaseServiceAccountKey";

admin.initializeApp({
    credential: admin.credential.cert(creds)
});

export * from './process';
export * from './sendEmail';
export * from './clinics';
export * from './doctors';
export * from './accounts';
export * from './geocoding';

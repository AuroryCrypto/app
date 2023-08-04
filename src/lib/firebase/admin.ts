// "use server";

import { env } from "@/env.mjs";
import * as firebase from "firebase-admin";

const app = firebase.apps.length > 0 ? firebase.apps[0] : firebase.initializeApp({
    credential: firebase.credential.cert({
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY,
        projectId: env.FIREBASE_PROJECT_ID,
    }),
})

export { app };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.FIRE_BASE_apiKey,
    authDomain: process.env.FIRE_BASE_authDomain,
    projectId: process.env.FIRE_BASE_projectId,
    storageBucket: process.env.FIRE_BASE_storageBucket,
    messagingSenderId: process.env.FIRE_BASE_messagingSenderId,
    appId: process.env.FIRE_BASE_appId,
    measurementId: process.env.FIRE_BASE_measurementId
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
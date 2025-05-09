// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export let app: FirebaseApp

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APY_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

try {
  // Initialize Firebase
  app = getApp("app");
} catch (error) {
  app = initializeApp(firebaseConfig);
}
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const firebase = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export default firebase;
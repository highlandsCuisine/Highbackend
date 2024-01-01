const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const admin = require("firebase-admin");
const { getAuth } = require("firebase/auth");
const servideAccount = require("../service.json");

try {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId: "login-a0445",
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASUREMENTID,
  };
  admin.initializeApp({
    credential: admin.credential.cert(servideAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const serviceAuth = admin.auth();
  const db = getFirestore(app);
  const serviceDB = admin.database();
  console.log("☘️  DataBase Connected Successfully!");
  module.exports = { db, auth, admin, serviceAuth, serviceDB };
} catch (error) {
  console.log("🍁  DataBase Connection failed!");
}

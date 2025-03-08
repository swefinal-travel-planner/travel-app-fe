import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKgw4pGnGt4HpIsckxtIHcHb40TV0QuGA",
  authDomain: "travel-app-229d7.firebaseapp.com",
  projectId: "travel-app-229d7",
  storageBucket: "travel-app-229d7.firebasestorage.app",
  messagingSenderId: "490333496504",
  appId: "1:490333496504:web:40bde716d819e6919f004d",
  measurementId: "G-Z359N868X9",
};

// initialize Firebase
const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };

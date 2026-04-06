import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGi_p_I5H1u-Q2GAQcKWHcZ0AXihENDMQ",
  authDomain: "grouping-app-78c18.firebaseapp.com",
  projectId: "grouping-app-78c18",
  storageBucket: "grouping-app-78c18.firebasestorage.app",
  messagingSenderId: "933182055595",
  appId: "1:933182055595:web:29b59447238a83f81ac3ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

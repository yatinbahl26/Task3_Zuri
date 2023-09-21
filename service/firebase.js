import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8CtGIIUXPkszoARwpL4QvFig4dkCwX9M",
  authDomain: "drag-drop-b3261.firebaseapp.com",
  projectId: "drag-drop-b3261",
  storageBucket: "drag-drop-b3261.appspot.com",
  messagingSenderId: "642863583465",
  appId: "1:642863583465:web:c83036bf00840b49da6078",
  measurementId: "G-SEM9Z58KV5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
// const db = getDatabase(app);
const storage = getStorage(app);
export { auth, db, storage };

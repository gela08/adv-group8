//firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAgPWnkCzGonUUpTw18gWlqY9rwwizKSv8",
  authDomain: "blog-app-adv-finals9.firebaseapp.com",
  projectId: "blog-app-adv-finals9",
  storageBucket: "blog-app-adv-finals9.appspot.com", // ⚠️ corrected from `.app` to `.com`
  messagingSenderId: "507872135819",
  appId: "1:507872135819:web:4f2e46621d6ae08fc0628e",
  measurementId: "G-BPYWDXBES3"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

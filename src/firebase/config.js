import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  // Paste your Firebase config here
  apiKey: "AIzaSyBTTydpEcNmRxYNzpUBKrVzBtbnnxk0H58",
  authDomain: "points-management-system-70def.firebaseapp.com",
  projectId: "points-management-system-70def",
  storageBucket: "points-management-system-70def.firebasestorage.app",
  messagingSenderId: "786436439457",
  appId: "1:786436439457:web:64bc16c369c20f98585fe0"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export { db, auth, googleProvider }
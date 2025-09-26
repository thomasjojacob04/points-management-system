// firebase/config.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Validate required config
const requiredFields = ['apiKey', 'authDomain', 'projectId']
for (const field of requiredFields) {
  if (!firebaseConfig[field]) {
    throw new Error(`Firebase ${field} is not configured. Please check your environment variables.`)
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Configure Google Auth Provider (optional)
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export { db, auth, googleProvider, app }
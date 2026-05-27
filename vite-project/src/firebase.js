// src/firebase.js
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDiE8TNXR9id8UzILZ0Bnj0_MMcAnYIcpc",
  authDomain: "fir-learning-8a23f.firebaseapp.com",
  projectId: "fir-learning-8a23f",
  storageBucket: "fir-learning-8a23f.firebasestorage.app",
  messagingSenderId: "763105323488",
  appId: "1:763105323488:web:82fe99daf259789fbde385"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// ── Auth helpers ──────────────────────────────────────────────
export const signUpWithEmail  = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)

export const loginWithEmail   = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const loginWithGoogle  = () =>
  signInWithPopup(auth, googleProvider)

export const logout           = () => signOut(auth)

export const onAuthChange     = (cb) => onAuthStateChanged(auth, cb)
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDElvnpE8PghF2QydZzcwnBHLdcc3cWqUc',
  authDomain: 'shadow-anime-26eb1.firebaseapp.com',
  projectId: 'shadow-anime-26eb1',
  storageBucket: 'shadow-anime-26eb1.firebasestorage.app',
  messagingSenderId: '377013835562',
  appId: '1:377013835562:web:1c0ec34f2b0efc1fc9b053',
  measurementId: 'G-61T4FLSZC5',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (err) {
    console.error('Google sign-in error:', err)
    throw err
  }
}

export async function signOutUser() {
  try {
    await signOut(auth)
  } catch (err) {
    console.error('Sign-out error:', err)
    throw err
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

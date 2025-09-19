import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Copy of main site's firebase config - update if you use environment-specific vars
const firebaseConfig = {
  apiKey: "AIzaSyBqK7rJ-8xK1vNyK8oRCPa5s6W7zR1P2aM",
  authDomain: "sketches-website-db.firebaseapp.com",
  projectId: "sketches-website-db",
  storageBucket: "sketches-website-db.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export default app

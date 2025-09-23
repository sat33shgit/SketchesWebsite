import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    // Try to write a test document
    const testDocRef = doc(db, 'test', 'connection')
    await setDoc(testDocRef, {
      timestamp: new Date(),
      message: 'Firebase connection test successful'
    })
    
    // Try to read it back
    const docSnap = await getDoc(testDocRef)
    
    if (docSnap.exists()) {
      console.log('✅ Firebase connection successful:', docSnap.data())
      return true
    } else {
      console.log('❌ Test document not found')
      return false
    }
  } catch (error) {
    console.error('❌ Firebase connection failed:', error)
    return false
  }
}

// Call this function to test connection (you can remove this after testing)
// testFirebaseConnection()

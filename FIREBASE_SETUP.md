# Firebase Setup Instructions

## Setting up Firebase for Your Sketches Website

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `sketches-website-db`
4. Continue through the setup (you can disable Google Analytics for this project)

### Step 2: Enable Firestore Database

1. In your Firebase project console, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for now (we'll secure it later)
4. Choose a location closest to your users

### Step 3: Get Configuration

1. In project settings (gear icon), scroll to "Your apps"
2. Click "Add app" > Web app
3. Register your app with name: `sketches-website`
4. Copy the Firebase config object

### Step 4: Update Firebase Config

Replace the placeholder values in `src/config/firebase.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

### Step 5: Security Rules (Optional but Recommended)

In Firestore Rules, you can use these basic rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to sketch-ratings collection
    match /sketch-ratings/{document} {
      allow read, write: if true;
    }
  }
}
```

### Step 6: Test the Integration

1. Run your local development server: `npm run dev`
2. Try liking/disliking sketches
3. Check the Firestore console to see data being created
4. Test from different devices/browsers to verify sync

## Features

✅ **Cross-device synchronization** - Likes/dislikes sync across all devices  
✅ **Real-time updates** - Changes appear instantly  
✅ **Offline fallback** - Falls back to localStorage if Firebase is unavailable  
✅ **Device tracking** - Prevents multiple votes from same device  
✅ **Atomic operations** - Uses Firestore transactions to prevent race conditions  

## Database Structure

Each sketch rating document looks like:
```json
{
  "likes": 5,
  "dislikes": 1,
  "likedBy": ["device_abc123", "device_def456"],
  "dislikedBy": ["device_ghi789"]
}
```

## Current Status

- ✅ Firebase SDK installed
- ✅ Database service created with fallback to localStorage
- ✅ Component updated to handle async operations  
- ⏳ Firebase project needs to be created and configured
- ⏳ Replace placeholder config with real Firebase credentials

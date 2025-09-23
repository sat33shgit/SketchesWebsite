#!/bin/bash

# Firebase Setup Script for Sketches Website
# Run this script after setting up your Firebase project

echo "🔥 Firebase Setup for Sketches Website"
echo "======================================"
echo ""

echo "📋 Pre-requisites checklist:"
echo "[ ] Created Firebase project at https://console.firebase.google.com/"
echo "[ ] Enabled Firestore Database in test mode"
echo "[ ] Added a web app to your Firebase project"
echo "[ ] Copied your Firebase configuration object"
echo ""

echo "🔧 Next steps:"
echo "1. Replace the placeholder config in src/config/firebase.js"
echo "2. Test the connection by running: npm run dev"
echo "3. Check browser console for Firebase connection messages"
echo "4. Test like/dislike functionality from multiple devices"
echo ""

echo "🚀 Once configured, your website will have:"
echo "✅ Cross-device like/dislike synchronization"
echo "✅ Real-time updates across all users"
echo "✅ Persistent data storage in the cloud"
echo "✅ Automatic fallback to localStorage if Firebase is unavailable"
echo ""

echo "📖 For detailed instructions, see: FIREBASE_SETUP.md"
echo ""

echo "🎉 Ready to deploy! Your likes/dislikes will work across all devices!"

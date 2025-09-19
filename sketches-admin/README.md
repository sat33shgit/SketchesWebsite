# Sketches Admin

This is a minimal admin interface for the Sketches Website. It connects to the same Firebase project used by the main site. It provides two pages:

- Comments: view comments grouped by sketch ID, mark as invisible, or delete
- Messages: view messages submitted through the Contact page

How to use locally

1. Install dependencies

   npm install

2. Run the dev server

   # If your main site dev server runs on port 5173/3000, set API base so admin can call its /api endpoints
   # Example: main site running at http://localhost:5173
   set VITE_API_BASE=http://localhost:5173
   npm run dev

Notes on Firebase credentials

- This project currently copies the Firebase config from the main site found in `src/config/firebase.js`.
- For production, use environment variables (Vite define or .env) and secure your Firebase rules.

Pushing to a new remote repo

1. Create a new empty repository on GitHub (or any Git provider).
2. In this folder run:

   git init
   git add -A
   git commit -m "Initial admin scaffold"
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main

Security

- This admin app does not implement authentication. Before using it in production, add admin auth (Firebase Auth + role checks) and tighten Firestore rules.

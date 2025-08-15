# 🚀 Vercel Deployment Guide

## Step 1: Test Locally
Your local dev server is already running at `http://localhost:5174/SketchesWebsite/`

The new Vercel API endpoints will work once deployed, but for now it falls back to localStorage.

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: pencil-sketches-website  
# - Directory: ./
# - Build command: npm run build
# - Output directory: dist
```

### Option B: GitHub Integration (Easiest)
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project"
3. Import your GitHub repository: `SketchesWebsite`
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

## Step 3: Set Up Database (Later)
Once deployed, you can add Vercel Postgres:
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database" → PostgreSQL
5. Connect to your project

## Step 4: Update API Endpoints
After database setup, update the API files to use real PostgreSQL instead of mock data.

## Current Status
✅ Vercel config ready (`vercel.json`)  
✅ API endpoints created (`/api/sketches/[id]/*`)  
✅ Frontend updated to use Vercel APIs  
✅ Fallback to localStorage if APIs unavailable  
✅ Ready for deployment  

## Benefits After Deployment
🎯 **True cross-device sync** - likes/dislikes work across all browsers  
🎯 **Fast global CDN** - website loads quickly worldwide  
🎯 **API endpoints ready** - foundation for comments and other features  
🎯 **Professional setup** - scales as your portfolio grows  
🎯 **Custom domain support** - use your own domain name  

## Migration Complete!
Your GitHub Pages workflow still works, but now you also have Vercel as an option with database capabilities.

# Git Commands to Check-in Your Project

Run these commands in your terminal in order:

## 1. Initialize Git Repository
```bash
git init
```

## 2. Configure Git (replace with your actual email)
```bash
git config user.name "Sateesh"
git config user.email "your-email@gmail.com"
```

## 3. Add All Files
```bash
git add .
```

## 4. Check Status (optional)
```bash
git status
```

## 5. Make Initial Commit
```bash
git commit -m "Initial commit: Modern pencil sketches gallery website

- Built with React, Vite, and Tailwind CSS
- Gallery view with sketch cards
- Individual sketch detail pages with comments
- About page with artist information
- Contact form for inquiries
- Responsive design for all devices
- Professional no-image placeholders
- Ready for deployment"
```

## 6. Create GitHub Repository

### Option A: Using GitHub CLI (if installed)
```bash
gh repo create pencil-sketches-website --public --push --source=.
```

### Option B: Using GitHub Web Interface
1. Go to https://github.com/new
2. Repository name: `pencil-sketches-website`
3. Description: `A modern website showcasing pencil sketch artwork`
4. Make it **Public**
5. Don't initialize with README (we already have one)
6. Click "Create repository"

Then run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/pencil-sketches-website.git
git branch -M main
git push -u origin main
```

## 7. Deploy to Vercel (Recommended)
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your `pencil-sketches-website` repository
4. Click Deploy - it will auto-detect Vite and deploy
5. Your site will be live at `https://your-project-name.vercel.app`

## 8. Deploy to Netlify (Alternative)
1. Go to https://netlify.com
2. Sign in with GitHub
3. New site from Git
4. Choose your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy site

Your website will be live and accessible to everyone!

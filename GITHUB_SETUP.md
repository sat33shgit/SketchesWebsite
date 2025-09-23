# GitHub Setup Instructions

## Creating the GitHub Repository

### Option 1: Using GitHub CLI (Recommended)

If you have GitHub CLI installed:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Pencil sketches website with React, Vite, and Tailwind CSS"

# Create GitHub repository and push
gh repo create pencil-sketches-website --public --push --source=.
```

### Option 2: Using GitHub Web Interface

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `pencil-sketches-website`
5. Description: `A modern website showcasing pencil sketch artwork`
6. Make it Public
7. Don't initialize with README (we already have one)
8. Click "Create repository"

Then in your terminal:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Pencil sketches website with React, Vite, and Tailwind CSS"

# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/pencil-sketches-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Option 3: Import Existing Repository

1. Go to [GitHub.com/new/import](https://github.com/new/import)
2. Enter your local repository path or upload as ZIP
3. Follow the import wizard

## Deployment to Hosting Platforms

### Deploy to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your `pencil-sketches-website` repository
5. Vercel will auto-detect it's a Vite project
6. Click "Deploy"
7. Your site will be live at `https://your-project-name.vercel.app`

**Custom Domain (Optional):**
- In your Vercel dashboard, go to Project Settings > Domains
- Add your custom domain and follow DNS setup instructions

### Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign in with your GitHub account
3. Click "New site from Git"
4. Choose GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"
7. Your site will be live at `https://random-name.netlify.app`

**Custom Domain (Optional):**
- In your Netlify dashboard, go to Site Settings > Domain Management
- Add custom domain and follow DNS instructions

### Deploy to GitHub Pages

1. Install gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

4. Enable GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Your site will be at `https://your-username.github.io/pencil-sketches-website`

## Repository Settings

### Enable Issues and Discussions (Optional)
- Go to repository Settings
- Enable Issues for bug reports and feature requests
- Enable Discussions for community interaction

### Add Topics/Tags
In your GitHub repository:
- Add topics: `react`, `vite`, `tailwindcss`, `portfolio`, `art-gallery`, `pencil-sketches`

### Repository Description
Set a clear description: "A modern website showcasing pencil sketch artwork by Sateesh, built with React, Vite, and Tailwind CSS"

## Continuous Deployment

Once connected to Vercel or Netlify:
- Every push to the `main` branch will automatically trigger a new deployment
- Preview deployments are created for pull requests
- No manual deployment needed!

## Environment Variables (If Needed Later)

If you add backend features or API integrations:

**Vercel:**
- Go to Project Settings > Environment Variables
- Add variables like `VITE_API_URL`, `VITE_CONTACT_EMAIL`, etc.

**Netlify:**
- Go to Site Settings > Environment Variables
- Add the same variables

## Monitoring and Analytics (Optional)

### Google Analytics
1. Create a Google Analytics account
2. Add the tracking code to `index.html`
3. Or use a React GA library

### Vercel Analytics
- Enable in Vercel dashboard for visitor insights

### Netlify Analytics
- Enable in Netlify dashboard for traffic data

## Next Steps

1. **Add your actual sketch images** to `public/images/`
2. **Update contact information** in the Contact page
3. **Customize the about section** with your real bio
4. **Add your actual social media links**
5. **Set up a custom domain** if desired
6. **Add more sketches** as you create them

Your website is now ready to showcase your beautiful pencil artwork to the world! 🎨

# GitHub Pages Deployment Guide

## Overview
This guide will help you deploy your pencil sketches website to GitHub Pages for free hosting. GitHub Pages is perfect for static websites and works great with React + Vite projects.

## Prerequisites
✅ Your code is already pushed to GitHub repository: `sat33shgit/SketchesWebsite`  
✅ You have a Vite React project with proper build configuration  
✅ All dependencies are installed and the project runs locally  

## Step 1: Install GitHub Pages Deployment Package

Open your terminal in the project directory and install the `gh-pages` package:

```bash
cd "C:\Sateesh\Projects\Pencil Sketches Web Site\WebSite"
npm install --save-dev gh-pages
```

## Step 2: Update package.json Configuration

Add the following configurations to your `package.json`:

1. **Add homepage field** (add this at the top level, after "name"):
```json
"homepage": "https://sat33shgit.github.io/SketchesWebsite",
```

2. **Add deployment scripts** to the "scripts" section:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

Your scripts section should look like this:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

## Step 3: Update Vite Configuration for GitHub Pages

Create or update `vite.config.js` in your project root to set the correct base path:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SketchesWebsite/', // This should match your GitHub repository name
})
```

## Step 4: Update Router Configuration for GitHub Pages

Since GitHub Pages serves from a subdirectory, update your `src/App.jsx` to handle the base path:

```jsx
import { BrowserRouter } from 'react-router-dom'

// Update the BrowserRouter to include basename
<BrowserRouter basename="/SketchesWebsite">
  {/* Your existing routes */}
</BrowserRouter>
```

## Step 5: Test Local Build

Before deploying, test that your build works correctly:

```bash
npm run build
npm run preview
```

Visit the preview URL and make sure all pages work correctly and there are no 404 errors.

## Step 6: Deploy to GitHub Pages

Run the deployment command:

```bash
npm run deploy
```

This command will:
- Build your project (`npm run build`)
- Create a `gh-pages` branch in your repository
- Push the built files to the `gh-pages` branch

## Step 7: Configure GitHub Pages Settings

1. **Go to your GitHub repository**: https://github.com/sat33shgit/SketchesWebsite
2. **Click on "Settings"** tab
3. **Scroll down to "Pages"** section in the left sidebar
4. **Under "Source"**, select **"Deploy from a branch"**
5. **Under "Branch"**, select **"gh-pages"** and **"/ (root)"**
6. **Click "Save"**

## Step 8: Wait for Deployment

- GitHub will automatically deploy your site
- It may take a few minutes for the site to be available
- You'll see a green checkmark when deployment is complete

## Your Live Website URL

Once deployed, your website will be available at:
**https://sat33shgit.github.io/SketchesWebsite**

## Future Updates

To update your deployed website:
1. Make changes to your code
2. Commit and push changes to main branch:
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```
3. Deploy the updates:
   ```bash
   npm run deploy
   ```

## Troubleshooting

### Common Issues and Solutions:

**1. 404 Errors on Page Refresh**
- GitHub Pages doesn't support client-side routing by default
- Add a `404.html` file in your `public` folder that redirects to `index.html`

**2. Assets Not Loading**
- Make sure `base: '/SketchesWebsite/'` is correctly set in `vite.config.js`
- Ensure all asset paths are relative, not absolute

**3. Deployment Fails**
- Check that `gh-pages` package is installed
- Ensure you have write permissions to the repository
- Try running `npm run build` manually to check for build errors

**4. Site Not Updating**
- Clear your browser cache
- Wait a few minutes for GitHub's CDN to update
- Check the Actions tab in GitHub for deployment status

## Alternative: Using GitHub Actions (Advanced)

For more control, you can use GitHub Actions instead of `gh-pages` package. This requires creating a `.github/workflows/deploy.yml` file, but gives you more flexibility and better error reporting.

## Security Note

GitHub Pages sites are always public, even if your repository is private. Make sure you don't include any sensitive information in your deployed site.

## Custom Domain (Optional)

If you own a custom domain, you can configure it in the Pages settings to use your domain instead of the github.io URL.

---

## Quick Command Summary

```bash
# Install deployment package
npm install --save-dev gh-pages

# Test build locally
npm run build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

Your pencil sketches website will be live and accessible to anyone on the internet! 🎨✨

# Custom Domain Setup for GitHub Pages

## Overview
You can use your own custom domain (like `www.yoursketchgallery.com`) instead of the default `sat33shgit.github.io/SketchesWebsite` URL. GitHub Pages supports both apex domains and subdomains.

## Domain Options

### 1. **Subdomain** (Recommended for beginners)
- Example: `sketches.yourdomain.com` or `www.yourdomain.com`
- Easier to set up
- Better performance with GitHub's CDN

### 2. **Apex Domain** 
- Example: `yourdomain.com`
- Looks cleaner but slightly more complex setup

## Prerequisites

✅ **You own a domain name** (purchase from providers like Namecheap, GoDaddy, Google Domains, etc.)  
✅ **Access to your domain's DNS settings** (through your domain registrar)  
✅ **Your GitHub Pages site is already deployed** ✅  

## Step 1: Configure GitHub Pages for Custom Domain

1. **Go to your GitHub repository**: https://github.com/sat33shgit/SketchesWebsite
2. **Click "Settings" tab**
3. **Click "Pages" in the left sidebar**
4. **In the "Custom domain" section**:
   - Enter your domain (e.g., `www.yoursketchgallery.com`)
   - Click "Save"
5. **Enable "Enforce HTTPS"** (recommended for security)

This will create a `CNAME` file in your repository.

## Step 2: Configure DNS Records

### For Subdomain (www.yourdomain.com)

In your domain registrar's DNS settings, add a **CNAME record**:

```
Type: CNAME
Name: www (or your chosen subdomain)
Value: sat33shgit.github.io
TTL: 3600 (or default)
```

### For Apex Domain (yourdomain.com)

Add **4 A records** pointing to GitHub's IP addresses:

```
Type: A
Name: @ (or leave blank)
Value: 185.199.108.153
TTL: 3600

Type: A  
Name: @ (or leave blank)
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @ (or leave blank)
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @ (or leave blank)
Value: 185.199.111.153
TTL: 3600
```

**Plus** add a CNAME record for www subdomain:
```
Type: CNAME
Name: www
Value: sat33shgit.github.io
TTL: 3600
```

## Step 3: Update Your Project Configuration

Since you're using a custom domain, you need to update your Vite configuration:

### Update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Change from '/SketchesWebsite/' to '/' for custom domain
})
```

### Update `src/App.jsx`:
```javascript
// Remove the basename since you're using a custom domain
<Router> {/* Remove basename="/SketchesWebsite" */}
```

### Update `package.json`:
```json
"homepage": "https://www.yoursketchgallery.com", // Your custom domain
```

## Step 4: Redeploy Your Site

After making the configuration changes:

```bash
npm run deploy
```

## Common Domain Registrars DNS Setup

### **Namecheap**
1. Login to Namecheap
2. Go to Domain List → Manage
3. Advanced DNS tab
4. Add the DNS records as shown above

### **GoDaddy**
1. Login to GoDaddy
2. My Products → DNS
3. Add the DNS records

### **Google Domains**
1. Login to Google Domains
2. My domains → DNS
3. Custom resource records section
4. Add the DNS records

### **Cloudflare** (if using Cloudflare DNS)
1. Login to Cloudflare
2. Select your domain
3. DNS → Records
4. Add the DNS records
5. Make sure proxy status is "DNS only" (gray cloud)

## Step 5: Verification and Troubleshooting

### Check DNS Propagation
Use online tools like:
- https://dnschecker.org/
- https://whatsmydns.net/

DNS changes can take 24-48 hours to fully propagate worldwide.

### Verify Setup
```bash
# Check if your domain points to GitHub
nslookup www.yourdomain.com

# Should return one of GitHub's IP addresses
```

## Domain Name Suggestions for Your Sketches Website

If you don't have a domain yet, here are some ideas:

### Professional Options
- `yourname-sketches.com`
- `yourname-art.com`
- `pencilworks-yourname.com`
- `sketches-by-yourname.com`

### Creative Options
- `graphiteandpaper.com`
- `pencilmasterpiece.com`
- `sketchbooksecrets.com`
- `drawingdimensions.com`

## Cost Considerations

### Domain Registration
- **.com domains**: $10-15/year
- **.art domains**: $15-20/year
- **.gallery domains**: $20-25/year

### GitHub Pages
- **Free** with custom domain
- No additional hosting costs

## Benefits of Custom Domain

✅ **Professional appearance**: `www.yoursketchgallery.com` vs `sat33shgit.github.io/SketchesWebsite`  
✅ **Better for SEO**: Search engines prefer custom domains  
✅ **Easier to remember**: Simpler URLs for sharing  
✅ **Brand building**: Establishes your artistic brand  
✅ **Email possibilities**: Can set up `contact@yourdomain.com`  

## Security Considerations

- ✅ **Always enable HTTPS** in GitHub Pages settings
- ✅ **Use strong passwords** for domain registrar account
- ✅ **Enable two-factor authentication** where available

## Troubleshooting Common Issues

### "Domain not verified" error
- Wait 24-48 hours for DNS propagation
- Double-check DNS records are correct
- Try removing and re-adding the custom domain in GitHub

### SSL certificate issues
- Enable "Enforce HTTPS" in GitHub Pages settings
- Wait for certificate provisioning (can take 24 hours)

### Site not loading
- Check if DNS records are correct
- Verify CNAME file exists in repository
- Clear browser cache

## Alternative: Using a Subdirectory Approach

If you already own a domain and want to use a subdirectory:
- Keep current configuration with `base: '/sketches/'`
- Set up a redirect from your main domain to the GitHub Pages URL

---

## Quick Setup Checklist

□ Purchase/own a domain name  
□ Add custom domain in GitHub Pages settings  
□ Configure DNS records with your registrar  
□ Update vite.config.js (base: '/')  
□ Update App.jsx (remove basename)  
□ Update package.json homepage  
□ Redeploy with `npm run deploy`  
□ Wait for DNS propagation (24-48 hours)  
□ Enable HTTPS in GitHub settings  
□ Test your custom domain  

Your sketches website will look much more professional with a custom domain! 🎨✨

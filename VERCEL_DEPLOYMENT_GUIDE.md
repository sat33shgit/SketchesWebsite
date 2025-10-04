# Production Deployment Guide for Vercel

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables Setup
Add these in **Vercel Dashboard → Project Settings → Environment Variables**:

**Required:**
- `POSTGRES_URL` - Your Vercel Postgres connection string ✅ (Already added)

**Optional (if using email features):**
- `VITE_EMAILJS_SERVICE_ID` - EmailJS service ID
- `VITE_EMAILJS_TEMPLATE_ID` - EmailJS template ID  
- `VITE_EMAILJS_PUBLIC_KEY` - EmailJS public key
- `WEB3FORMS_ACCESS_KEY` - Web3Forms access key

**Automatic:**
- `NODE_ENV=production` - Set automatically by Vercel

### 2. Database Setup (One-time)
After your first deployment, run the database setup:

```bash
# Run this once to set up your production database
node scripts/setup-production-db.js
```

This creates all necessary tables:
- ✅ configurations
- ✅ page_visits (analytics)
- ✅ contact_messages
- ✅ sketch_reactions (likes/dislikes)
- ✅ sketches (metadata storage)

### 3. Deployment Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: production-ready configuration"
   git push origin main
   ```

2. **Vercel Auto-Deploy:**
   - Vercel will automatically deploy when you push to main branch
   - Check deployment status in Vercel Dashboard

3. **Verify Deployment:**
   - Visit your Vercel domain: `https://your-project.vercel.app`
   - Test API endpoints: `/api/sketches/11/stats`
   - Test like functionality on sketch detail pages

## 🔧 Production Features

### Performance Optimizations
- ✅ **Static Assets:** Automatically optimized by Vercel
- ✅ **API Functions:** Configured with appropriate timeouts
- ✅ **Database:** Connection pooling via @vercel/postgres
- ✅ **Caching:** Browser caching for static assets

### Security Features
- ✅ **Rate Limiting:** Basic rate limiting utility included
- ✅ **Security Headers:** Added to API routes
- ✅ **Input Validation:** Sanitization in contact forms
- ✅ **SQL Injection Protection:** Parameterized queries

### Monitoring & Analytics
- ✅ **Page Visit Tracking:** Built-in analytics
- ✅ **Error Logging:** Console errors logged to Vercel Functions
- ✅ **Performance Metrics:** Available in Vercel Dashboard

## 🚨 Post-Deployment Tasks

### 1. Database Health Check
```bash
# Check if all tables were created successfully
node scripts/check-configs.js
```

### 2. Test Critical Features
- [ ] Sketch gallery loading
- [ ] Sketch detail pages
- [ ] Like/dislike functionality  
- [ ] Contact form submission
- [ ] Analytics tracking

### 3. Configure Domain (Optional)
If using a custom domain:
1. Add domain in Vercel Dashboard
2. Update DNS records
3. Update `homepage` in package.json

## 🔄 Ongoing Maintenance

### Database Maintenance
```bash
# Check configurations
node scripts/check-configs.js

# Update message settings
node scripts/update-message-config.js Y  # Disable
node scripts/update-message-config.js N  # Enable

# Update comment settings  
node scripts/update-comments-config.js Y  # Disable
node scripts/update-comments-config.js N  # Enable
```

### Analytics
- View page visit statistics: `/api/analytics/stats`
- Monitor function performance in Vercel Dashboard
- Check error logs in Vercel Functions tab

## 🆘 Troubleshooting

### Common Issues
1. **API 404 Errors:** Check Vercel function deployment status
2. **Database Connection:** Verify POSTGRES_URL environment variable
3. **Like Button Not Working:** Check browser console for API errors
4. **Contact Form Issues:** Verify email service environment variables

### Debug Commands
```bash
# Test API endpoints locally
npm run dev

# Check database connection
node -e "import('@vercel/postgres').then(({sql})=>sql\`SELECT 1\`).then(console.log)"
```

## 📊 Success Metrics

Your deployment is successful when:
- ✅ Main site loads at your Vercel domain
- ✅ Sketch gallery displays properly
- ✅ Like buttons work on sketch details
- ✅ Contact form submits successfully
- ✅ No console errors in browser
- ✅ API endpoints return proper responses

---

🎉 **Congratulations!** Your sketch gallery is now live on Vercel with full production features!
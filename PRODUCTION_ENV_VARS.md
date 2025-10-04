# Production Environment Variables for Vercel
# Add these in Vercel Dashboard → Project Settings → Environment Variables

# Database (Already Added)
POSTGRES_URL=your_vercel_postgres_url

# Email Services (Optional)
# For comment notifications - only need Web3Forms:
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key

# Alternative email service (not currently used):
# VITE_EMAILJS_SERVICE_ID=your_service_id
# VITE_EMAILJS_TEMPLATE_ID=your_template_id  
# VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Node Environment (Vercel sets this automatically)
NODE_ENV=production

# Optional: Analytics Configuration
REACT_APP_ENABLE_ANALYTICS=true
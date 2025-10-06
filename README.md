# Pencil Sketches Website

A modern, responsive website showcasing pencil sketch artwork by Sateesh Kumar Bo     category: "Portrait" // Choose appropriate category
   }
   ```, built with React, Vite, and Tailwind CSS.

## 🌐 Live Website
**Production URL**: https://sketches-website.vercel.app/

## ✅ Current Status
- **✅ Fully deployed** on Vercel with automatic deployments
- **✅ Cross-device like/dislike system** with localStorage fallback
- **✅ View tracking system** with real-time analytics
- **✅ Professional gallery** with optimized image loading
- **✅ Individual sketch pages** with detailed views
- **✅ About page** with artist information and profile
- **✅ Contact form** with database storage and email notifications
- **✅ Privacy-compliant analytics** with country-level geolocation
- **✅ Responsive design** optimized for all devices
- **✅ Modern UI/UX** with smooth interactions and hover effects

## 🎨 Features

### Gallery & Artwork
- **Interactive Gallery**: Grid layout with hover effects and image optimization
- **Like/Dislike System**: Cross-device persistence for sketch ratings
- **View Count Display**: Real-time view tracking with eye icon display
- **Sketch Categories**: Organized artwork by themes (Cuteness, Portrait, etc.)
- **High-Quality Images**: Optimized loading with fallback placeholders

### User Experience  
- **Sketch Detail Pages**: Individual pages with full descriptions and metadata
- **User Avatar Comments**: Personalized circular avatars with first letter of commenter names
- **Interactive Comments**: Comment system with real-time posting and display
- **Artist Profile**: Professional about page with biography and artist statement
- **Contact Database**: Full contact form with PostgreSQL storage and email notifications
- **Privacy-Compliant Analytics**: Country-level geolocation without IP storage
- **Mobile-First Design**: Fully responsive across all device sizes

### Analytics & Views System
- **Real-time View Tracking**: Automatic page visit tracking for all sketches
- **View Count Display**: Eye icon with current view count on each sketch page
- **Privacy-Focused**: Uses hashed IP addresses for visitor tracking
- **Database Analytics**: PostgreSQL backend for reliable data persistence
- **Duplicate Prevention**: Smart handling of same-visitor multiple visits
- **Contact Message Storage**: GDPR-compliant contact form data storage
- **Geographic Analytics**: Country-level visitor insights without IP storage

### Technical Features
- **Fast Loading**: Vite build system with optimized assets
- **Analytics System**: PostgreSQL-based page visit tracking
- **SEO Friendly**: Proper meta tags and semantic HTML structure
- **Cross-Browser**: Compatible with all modern browsers
- **API Ready**: Backend endpoints for database integration

## 🛠️ Tech Stack

- **React 19** - Latest React with functional components and hooks
- **Vite 4.5** - Lightning-fast build tool and development server  
- **React Router 6** - Modern client-side routing
- **Tailwind CSS 3** - Utility-first CSS framework
- **PostgreSQL** - Database for analytics, view tracking, and contact messages
- **Vercel** - Production hosting with serverless functions
- **Web3Forms** - Contact form email notifications
- **JavaScript ES6+** - Modern JavaScript features

## 🚀 Deployment

### Current Deployment
- **Platform**: Vercel
- **URL**: https://sketches-website.vercel.app/
- **Auto-Deploy**: Connected to GitHub main branch
- **Build Status**: ✅ Successful builds

### Deployment Process
1. **Automatic**: Push to main branch triggers deployment
2. **Manual**: Deploy via Vercel dashboard
3. **Preview**: Pull requests create preview deployments

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.jsx       # Navigation with mobile menu
│   ├── Footer.jsx       # Site footer with copyright
│   ├── LikeDislike.jsx  # Interactive rating component
│   ├── ViewCount.jsx    # View count display with analytics
│   ├── UserAvatar.jsx   # Circular avatar with user initials
│   └── CommentsSection.jsx # Comment system with user avatars
├── pages/               # Main page components
│   ├── Gallery.jsx      # Homepage with sketch grid
│   ├── SketchDetail.jsx # Individual sketch pages
│   ├── About.jsx        # Artist biography and statement
│   └── Contact.jsx      # Contact form with EmailJS
├── hooks/               # Custom React hooks
│   └── useAnalytics.js  # Analytics tracking hook
├── data/                # Static data
│   └── sketches.js      # Artwork data and utilities
├── utils/               # Helper functions
│   ├── paths.js         # Asset path utilities
│   └── vercelDatabase.js # API service layer
├── App.jsx              # Main app with routing
└── main.jsx            # Application entry point

public/
├── images/              # Artwork image files
│   ├── *.jpg           # Sketch images
│   └── sateesh-profile.jpg # Artist profile photo
└── index.html          # HTML template

api/                     # Vercel serverless functions
├── contact.js          # Contact form submission with database storage
├── test.js             # API testing endpoint for debugging
├── analytics/           # Analytics tracking endpoints
│   ├── track.js        # Page visit tracking API
│   └── stats.js        # Analytics data retrieval API
└── sketches/           # API endpoints for like/dislike system

database/               # Database schemas and setup
├── contact_messages_schema.sql # Contact form database schema
└── analytics_schema.sql # Analytics database schema
```

## 🎨 Adding New Sketches

To add new artwork to the gallery:

1. **Add Image**: Place high-quality image in `public/images/`
   ```
   public/images/my-new-sketch.jpg
   ```

2. **Update Data**: Add sketch info to `src/data/sketches.js`:
   ```javascript
   {
     id: 13, // Next available ID
     title: "Portrait Study",
     description: "Detailed description of the artwork and process...",
     completedDate: "2025-01-15", // YYYY-MM-DD format
     imagePath: "/images/my-new-sketch.jpg",
     category: "Portrait" // Choose appropriate category
   }I felt really privileged to sketch my son, Oliver Solomon, alongside his mom, Swapna. This piece was one of the most challenging I’ve ever worked on—not just because it’s a double portrait, but because capturing two faces together adds a whole new level of complexity. There are tiny details, subtle expressions, and trying to get the likeness just right for both of them took a lot of focus and patience.

Honestly, it was a huge commitment. I spread the work out over five and a half months, totaling around 84 hours. Some days I’d work for hours and barely make progress, just because I wanted it to be perfect. Other days, I’d suddenly find a groove and see the sketch really coming to life.

But more than just the technical challenges, working on this meant a lot to me personally. So much love and connection in one piece—and it’s almost like every hour spent was worth it to capture that feeling between mother and son.
   ```

3. **Deploy**: Commit and push changes for automatic deployment

## ⚙️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- PostgreSQL database (for analytics)

### Database Schema
The application uses PostgreSQL with the following tables:

#### Analytics System
```sql
CREATE TABLE page_visits (
  id SERIAL PRIMARY KEY,
  page_type VARCHAR(50) NOT NULL,
  page_id VARCHAR(50),
  visit_count INTEGER DEFAULT 1,
  ip_hash VARCHAR(255) NOT NULL,
  user_agent_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_type, page_id, ip_hash, user_agent_hash)
);
```

#### Contact Messages System
```sql
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  country VARCHAR(100),
  user_agent TEXT,
  status VARCHAR(20) DEFAULT 'new',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Local Development
1. **Clone Repository**:
   ```bash
   git clone https://github.com/sat33shgit/SketchesWebsite.git
   cd SketchesWebsite/WebSite
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173`

4. **Build for Production**:
   ```bash
   npm run build
   ```

### Environment Variables
Create `.env` file for local development:
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id  
VITE_EMAILJS_PUBLIC_KEY=your_public_key
POSTGRES_URL=your_postgres_connection_string
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration
- `vite.config.js` - Vite build settings
- `tailwind.config.js` - Tailwind CSS customization
- `package.json` - Dependencies and scripts

## 📈 Performance Features

- **Image Optimization**: Automatic image compression and loading
- **Code Splitting**: Optimized bundle sizes with Vite
- **Caching**: Browser caching for static assets
- **CDN Delivery**: Global content delivery via Vercel
- **Mobile Performance**: Optimized for mobile devices

## 🎯 Future Enhancements

- **Admin Dashboard**: Contact message management interface
- **Advanced Analytics**: Detailed visitor statistics and popular content tracking
- **Database Integration**: Enhanced PostgreSQL features for user management
- **Comment Moderation**: Admin panel for managing user comments
- **User Profiles**: Extended user system with persistent profiles
- **Comment Reactions**: Like/dislike system for individual comments
- **Search & Filter**: Advanced gallery filtering options
- **Social Sharing**: Share individual sketches on social media
- **Artist Blog**: Add blog section for artistic journey
- **E-commerce**: Sell prints and commission services

## 💬 Comments System

## Changelog

- 2025-09-27: Email/contact improvements
   - UI validation: client enforces 1000-character limit and provides better messages
   - Server: accepts Unicode characters and enforces 1000-character max for message
   - Contact messages saved to PostgreSQL and email notifications sent via the server-side integration
   - Dev server updated to match production behavior


### Features
- **User Avatars**: Automatically generated circular avatars with user initials
- **Color Consistency**: Each user gets a consistent color based on their name
- **Real-time Posting**: Instant comment submission and display
- **Visual Layout**: Professional chat-like interface with avatars positioned outside comment boxes
- **Email Notifications**: Automatic email alerts for new comments

### Technical Implementation
- **UserAvatar Component**: Generates colorful circular avatars (28px-44px) with perfect letter centering
- **Hash-based Colors**: 20 different color combinations ensure visual variety
- **Responsive Design**: Adapts beautifully across all device sizes
- **API Integration**: RESTful endpoints for comment CRUD operations

## 📧 Contact System

### Features
- **Database Storage**: All contact messages stored in PostgreSQL database
- **Email Notifications**: Automatic email alerts via Web3Forms integration
- **Privacy Compliant**: GDPR-compliant data collection without IP storage
- **Geographic Analytics**: Country-level visitor insights using real-time IP lookup
- **Form Validation**: Comprehensive input sanitization and validation
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### Privacy Features
- **No IP Storage**: IP addresses used for country lookup but never stored
- **Data Minimization**: Only essential contact information collected
- **Transparent Processing**: Clear data handling practices
- **User Rights**: Easy data access and deletion capabilities
- **Secure Storage**: Encrypted database storage with proper access controls

### Technical Implementation
- **Serverless API**: Vercel serverless functions for scalable processing
- **Real-time Geolocation**: IP-to-country conversion during request processing
- **Database Integration**: PostgreSQL with proper indexing and constraints
- **Email Service**: Web3Forms integration for reliable email delivery
- **Input Sanitization**: XSS protection and SQL injection prevention

## � Security

### Security Headers
The website implements comprehensive security headers to protect against common web vulnerabilities:

- **Content-Security-Policy**: Prevents XSS attacks by controlling resource loading
- **X-Frame-Options**: Protects against clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME-sniffing attacks
- **Referrer-Policy**: Controls referrer information for privacy protection
- **Permissions-Policy**: Disables unnecessary browser features (camera, microphone, etc.)
- **Strict-Transport-Security**: Enforces HTTPS connections with HSTS

### Security Testing Tools
Regular security assessments are performed using these industry-standard tools:

#### 🔍 **SSL/TLS Security**
- **SSL Labs**: https://www.ssllabs.com/ssltest/
  - Tests SSL/TLS configuration and certificate security
  - Provides detailed analysis of encryption strength and vulnerabilities
  - Recommended for checking HTTPS implementation quality

#### 🛡️ **Website Security Scanner**
- **Sucuri SiteCheck**: https://sucuri.net/
  - Comprehensive website security and malware scanner
  - Checks for malware, blacklisting, and security issues
  - Monitors website reputation and safety status

#### 📋 **Security Headers Analysis**
- **Security Headers**: https://securityheaders.com/
  - Analyzes HTTP security headers implementation
  - Provides detailed scoring and recommendations
  - Essential for checking Content-Security-Policy and other headers

### Security Best Practices
- **Regular Scanning**: Weekly security scans using the above tools
- **Header Validation**: Automated testing of security headers on deployment
- **Dependency Updates**: Regular updates of dependencies for security patches
- **Input Sanitization**: All user inputs are sanitized and validated
- **HTTPS Everywhere**: Strict HTTPS enforcement with HSTS headers

## �📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

**Artist**: Sateesh Kumar Boggarapu  
**Website**: https://sketches-website.vercel.app/  
**Email**: bsateeshk@gmail.com

For technical questions about the website, please open an issue on GitHub.

---

**© 2025 Sateesh Sketch Book. All rights reserved.**

*Built with ❤️ using React, Vite, and Tailwind CSS*

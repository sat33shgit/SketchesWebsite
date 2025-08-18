# Pencil Sketches Website

A modern, responsive website showcasing pencil sketch artwork by Sateesh Kumar Bo     category: "Portrait" // Choose appropriate category
   }
   ```, built with React, Vite, and Tailwind CSS.

## 🌐 Live Website
**Production URL**: https://sketches-website.vercel.app/

## ✅ Current Status
- **✅ Fully deployed** on Vercel with automatic deployments
- **✅ Cross-device like/dislike system** with localStorage fallback
- **✅ Professional gallery** with optimized image loading
- **✅ Individual sketch pages** with detailed views
- **✅ About page** with artist information and profile
- **✅ Contact form** ready for inquiries (EmailJS integration)
- **✅ Responsive design** optimized for all devices
- **✅ Modern UI/UX** with smooth interactions and hover effects

## 🎨 Features

### Gallery & Artwork
- **Interactive Gallery**: Grid layout with hover effects and image optimization
- **Like/Dislike System**: Cross-device persistence for sketch ratings
- **Sketch Categories**: Organized artwork by themes (Cuteness, Portrait, etc.)
- **High-Quality Images**: Optimized loading with fallback placeholders

### User Experience  
- **Sketch Detail Pages**: Individual pages with full descriptions and metadata
- **Artist Profile**: Professional about page with biography and artist statement
- **Contact Integration**: EmailJS-powered contact form for commissions
- **Mobile-First Design**: Fully responsive across all device sizes

### Technical Features
- **Fast Loading**: Vite build system with optimized assets
- **SEO Friendly**: Proper meta tags and semantic HTML structure
- **Cross-Browser**: Compatible with all modern browsers
- **API Ready**: Backend endpoints prepared for future database integration

## 🛠️ Tech Stack

- **React 19** - Latest React with functional components and hooks
- **Vite 4.5** - Lightning-fast build tool and development server  
- **React Router 6** - Modern client-side routing
- **Tailwind CSS 3** - Utility-first CSS framework
- **Vercel** - Production hosting with serverless functions
- **EmailJS** - Contact form integration
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
│   └── LikeDislike.jsx  # Interactive rating component
├── pages/               # Main page components
│   ├── Gallery.jsx      # Homepage with sketch grid
│   ├── SketchDetail.jsx # Individual sketch pages
│   ├── About.jsx        # Artist biography and statement
│   └── Contact.jsx      # Contact form with EmailJS
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
└── sketches/           # API endpoints for like/dislike system
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

- **Database Integration**: Replace localStorage with persistent database
- **User Comments**: Allow visitors to comment on sketches  
- **Search & Filter**: Advanced gallery filtering options
- **Social Sharing**: Share individual sketches on social media
- **Artist Blog**: Add blog section for artistic journey
- **E-commerce**: Sell prints and commission services

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

**Artist**: Sateesh Kumar Boggarapu  
**Website**: https://sketches-website.vercel.app/  
**Email**: bsateeshk@gmail.com

For technical questions about the website, please open an issue on GitHub.

---

**© 2025 Sateesh Sketch Book. All rights reserved.**

*Built with ❤️ using React, Vite, and Tailwind CSS*

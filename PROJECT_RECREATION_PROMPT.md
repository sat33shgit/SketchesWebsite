# Complete Project Prompt: Pencil Sketches Gallery Website

## Project Overview
Create a modern, responsive website to showcase pencil sketch artwork. The website should be built with React, Vite, and Tailwind CSS, featuring a professional gallery layout, individual sketch detail pages, artist information, and contact functionality.

## Technical Requirements

### Tech Stack
- **Frontend Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS via CDN (to avoid PostCSS configuration issues)
- **Routing**: React Router DOM for single-page application navigation
- **Package Manager**: npm
- **Deployment Ready**: Vercel, Netlify, or GitHub Pages compatible

### Project Structure
```
src/
├── components/
│   ├── Navbar.jsx          # Navigation header with logo and menu
│   └── Footer.jsx          # Footer with social media links and copyright
├── pages/
│   ├── Gallery.jsx         # Main gallery grid view (homepage)
│   ├── SketchDetail.jsx    # Individual sketch detail pages
│   ├── About.jsx           # Artist profile and statement
│   └── Contact.jsx         # Contact form and information
├── data/
│   └── sketches.js         # Sketch data and helper functions
├── App.jsx                 # Main app component with routing
├── main.jsx               # Application entry point
└── index.css              # Global styles and font imports
```

## Design Requirements

### Overall Design
- **Clean, modern aesthetic** with professional appearance
- **Responsive design** that works on desktop, tablet, and mobile
- **Gray and white color scheme** with subtle shadows and borders
- **Inter font family** for modern typography
- **Smooth hover effects** and transitions (but avoid text blinking)
- **Professional placeholder images** for missing artwork

### Navigation (Navbar.jsx)
- **Logo**: Sateesh's Sketch Book with camera icon
- **Navigation items**: Home, About, Contact
- **Active state indicators** with underlines
- **Mobile responsive** with collapsible menu
- **Social media and search icons** on the right
- **White background** with subtle border

### Footer (Footer.jsx)
- **Social media links**: Instagram, Twitter, Facebook with icons
- **Copyright text**: "© 2024 Sateesh Art. All rights reserved."
- **White background** with top border
- **Centered on mobile**, spread on desktop

## Page Content and Functionality

### Gallery Page (Homepage)
**Header Section:**
- **Title**: "Pencil Sketches"
- **Subtitle**: "A collection of pencil artwork capturing life's beauty through detailed drawings and artistic expression."

**Gallery Grid:**
- **3 columns on desktop**, 2 on tablet, 1 on mobile
- **Each card contains**:
  - Square aspect ratio image placeholder with "No Image Available" icon
  - Sketch title as clickable link
  - Completion date in format "Completed: Month Day, Year"
  - Category tag (Portrait, Landscape, etc.)
- **Hover effects**: Subtle shadow increase on cards
- **Professional placeholders**: Camera icon with "No Image Available" text

### Sketch Detail Pages
**Layout**: Two-column layout (image left, content right)
**Left Column**: 
- Large square image placeholder with camera icon
- "No Image Available" with descriptive text
- Sticky positioning on desktop

**Right Column**:
- **Breadcrumb navigation**: "Sketches / Sketch Title"
- **Sketch title** as large heading
- **Completion date** 
- **Full description** of the artwork

**Comments Section**:
- **3 sample comments** with realistic content praising the artwork
- **Comment form** with textarea and Post button
- **User avatars** as placeholder circles
- **Like counts** and reply buttons

### About Page
**Layout**: Profile image left, content right
**Profile Section**:
- **Circular profile placeholder** (256x256)
- **Name**: "Sateesh"
- **Title**: "Pencil Sketch Artist"

**Content Sections**:
- **Bio paragraph**: "Sateesh is a talented pencil sketch artist based in Bangalore, India. With a passion for capturing the essence of his subjects, Sateesh creates detailed and lifelike portraits, landscapes, and still life drawings. His work showcases a deep understanding of light, shadow, and texture, bringing his art to life on paper."
- **Additional paragraph**: "Sateesh's dedication to his craft and his ability to convey emotion through his art have earned him recognition and appreciation from art enthusiasts and collectors alike."
- **Artist Statement section** with styled background
- **Contact information** with email link
- **Social media icons**

### Contact Page
**Two-column layout**:

**Left Column - Contact Form**:
- **Form fields**: Name, Email, Subject, Message (all required)
- **Styled inputs** with focus states
- **Submit button** with hover effects
- **Form validation** and success message

**Right Column - Contact Information**:
- **Contact details** with icons:
  - Email: sateesh.art@email.com
  - Location: Bangalore, India
  - Response time: Usually within 24 hours
- **Services offered**:
  - Custom Portrait Commissions
  - Landscape Drawings
  - Still Life Compositions
  - Art Consultation
  - Workshops & Tutorials
- **Social media buttons** with platform colors

## Sample Data

### Sketch Data (10 samples)
Create a sketches.js file with 10 sample sketches:

1. **Portrait of a Woman** (Portrait) - May 15, 2023
   - Description: "A detailed portrait capturing the essence and grace of femininity through careful shading and line work."

2. **Still Life with Fruit** (Still Life) - June 20, 2023
   - Description: "A classic still life composition featuring various fruits, showcasing texture and light through pencil techniques."

3. **Landscape with Mountains** (Landscape) - July 10, 2023
   - Description: "A serene mountain landscape capturing the majestic beauty of nature with detailed shading and perspective."

4. **Abstract Shapes** (Abstract) - August 5, 2023
   - Description: "An exploration of geometric forms and abstract compositions, playing with light, shadow, and form."

5. **Cityscape at Night** (Cityscape) - September 12, 2023
   - Description: "An urban nighttime scene showcasing the interplay of artificial light and shadow in a metropolitan setting."

6. **Animal Study** (Animal) - October 20, 2023
   - Description: "A detailed study of animal anatomy and expression, focusing on capturing the essence of the subject."

7. **Floral Composition** (Nature) - November 8, 2023
   - Description: "A delicate arrangement of flowers showcasing botanical details and natural beauty."

8. **Architectural Study** (Architecture) - December 3, 2023
   - Description: "A detailed drawing of architectural elements, focusing on perspective and structural details."

9. **Human Figure Study** (Figure) - January 15, 2024
   - Description: "An anatomical study exploring human form and proportion through careful observation and technique."

10. **Seascape** (Landscape) - February 28, 2024
    - Description: "A coastal scene capturing the movement and power of ocean waves against rocky cliffs."

### Sample Comments for Detail Pages
Create realistic comments for each sketch:
- **Sophia Clark**: "Absolutely stunning work! The level of detail is incredible..."
- **Alex Carter**: "I love the contrast between the light and shadow..."
- **Olivia Bennett**: "This is one of the best pencil sketches I've ever seen..."

## Implementation Guidelines

### Setup Instructions
1. **Create Vite React project**: `npm create vite@latest . --template react`
2. **Install React Router**: `npm install react-router-dom`
3. **Setup Tailwind CSS**: Use CDN approach in index.html to avoid PostCSS issues
4. **Configure fonts**: Import Inter font from Google Fonts
5. **Create folder structure** as specified above

### Styling Approach
- **Use Tailwind CDN script** in index.html head:
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  ```
- **Configure Tailwind** inline with Inter font family
- **Avoid PostCSS compilation** to prevent configuration conflicts
- **Use semantic HTML** with proper ARIA labels
- **Implement responsive breakpoints**: sm, md, lg

### Image Placeholders
- **Create professional "No Image" placeholders** using SVG camera icons
- **Consistent styling** across gallery and detail views
- **Descriptive text** explaining missing images
- **Square aspect ratios** for consistent grid layout

### Performance Considerations
- **Lazy loading** for images
- **Semantic HTML** structure for SEO
- **Mobile-first** responsive design
- **Fast loading** with CDN resources
- **Optimized for deployment** on Vercel/Netlify

## Deployment Preparation
- **Create comprehensive README** with setup instructions
- **Add proper .gitignore** for Node.js projects
- **Include vercel.json** for SPA routing support
- **Git setup instructions** for version control
- **Deployment guides** for Vercel and Netlify

## Success Criteria
The completed website should:
✅ Display a professional gallery of placeholder sketches
✅ Navigate smoothly between all pages
✅ Work perfectly on mobile, tablet, and desktop
✅ Have consistent, modern styling throughout
✅ Include realistic sample content and comments
✅ Be ready for immediate deployment
✅ Allow easy addition of real artwork later
✅ Have no console errors or broken functionality

This prompt should result in a production-ready pencil sketches gallery website that can be immediately deployed and later customized with actual artwork and content.

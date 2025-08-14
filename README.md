npm run dev# Pencil Sketches Website

A modern, responsive website showcasing pencil sketch artwork by Sateesh, built with React, Vite, and Tailwind CSS.

## ✅ Current Status
- **Fully functional** website with modern design
- **Gallery view** with professional no-image placeholders
- **Individual sketch pages** with comment sections
- **About page** with artist information
- **Contact form** ready for inquiries
- **Responsive design** optimized for all devices
- **Ready for deployment** to any hosting platform

## 🎨 Features

- **Gallery View**: Browse all sketches in a beautiful grid layout
- **Sketch Detail Pages**: View individual sketches with descriptions and comments
- **About Page**: Learn about the artist and their artistic journey
- **Contact Form**: Get in touch for inquiries and commissions
- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Clean, professional design with smooth interactions

## Tech Stack

- **React 18** - Modern React with functional components and hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing for single-page application
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **JavaScript ES6+** - Modern JavaScript features

## 🚀 Quick Start

1. **Check in to GitHub:**
   See `GIT_SETUP_COMMANDS.md` for step-by-step instructions

2. **Deploy to Vercel (Recommended):**
   - Connect your GitHub repo to Vercel
   - Auto-deploys on every push
   - Live site in minutes

3. **Add Your Sketches:**
   - Place images in `public/images/` folder
   - Update `src/data/sketches.js` with your artwork details

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pencil-sketches-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   └── Footer.jsx      # Footer component
├── pages/              # Main page components
│   ├── Gallery.jsx     # Homepage/Gallery view
│   ├── SketchDetail.jsx # Individual sketch pages
│   ├── About.jsx       # About the artist
│   └── Contact.jsx     # Contact form
├── data/               # Static data and utilities
│   └── sketches.js     # Sketch data and helper functions
├── App.jsx             # Main app component with routing
├── main.jsx           # App entry point
└── index.css          # Global styles and Tailwind imports
```

## Adding New Sketches

To add new sketches to the gallery:

1. Add your sketch image to `public/images/`
2. Update the `sketches` array in `src/data/sketches.js` with the new sketch information:

```javascript
{
  id: 11, // unique ID
  title: "Your Sketch Title",
  description: "Description of your sketch",
  completedDate: "2024-03-15", // YYYY-MM-DD format
  imagePath: "/images/your-sketch.jpg",
  category: "Portrait" // or other category
}
```

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Deploy automatically with each push

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Or connect your GitHub repo for continuous deployment

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json
3. Run `npm run deploy`

## Customization

### Colors and Styling
- Edit `tailwind.config.js` to customize the color scheme
- Modify components in `src/components/` to change layouts
- Update `src/index.css` for global style changes

### Content
- Update artist information in `src/pages/About.jsx`
- Modify contact details in `src/pages/Contact.jsx`
- Add or remove navigation items in `src/components/Navbar.jsx`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions about the website or the artwork, please visit the [Contact](./src/pages/Contact.jsx) page or reach out to sateesh.art@email.com.

---

Built with ❤️ using React and Tailwind CSS+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

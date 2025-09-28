import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import Gallery from './pages/Gallery'
import SketchDetail from './pages/SketchDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import './App.css'
import { I18nProvider } from './i18n/index.jsx'

function App() {
  return (
    <Router>
      <I18nProvider>
        <ScrollToTop />
        <div className="app">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Gallery />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/sketch/:id" element={<SketchDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </I18nProvider>
    </Router>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Gallery from './pages/Gallery'
import SketchDetail from './pages/SketchDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <Router basename="/SketchesWebsite">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/sketch/:id" element={<SketchDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

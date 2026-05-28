import React from 'react'
import HeroSection from './components/HeroSection'
import ContentsSection from './components/ContentsSection'
import ForWhomSection from './components/ForWhomSection'
import DownloadSection from './components/DownloadSection'
import Footer from './components/Footer'
import './App.css'

function App() {
  const scrollToDownload = () => {
    const el = document.getElementById('download')
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 16
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 16
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="landing" id="top">
      <HeroSection onGetPdf={scrollToDownload} onNav={scrollToId} />
      <ContentsSection />
      <ForWhomSection />
      <DownloadSection />
      <Footer />
    </div>
  )
}

export default App

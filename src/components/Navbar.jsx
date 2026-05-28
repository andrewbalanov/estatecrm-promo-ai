import React from 'react'
import './Navbar.css'

function Navbar({ onGetPdf, onNav }) {
  const handleNav = (id) => (e) => {
    e.preventDefault()
    onNav?.(id)
  }

  const handleGetPdf = (e) => {
    e.preventDefault()
    onGetPdf?.()
  }

  return (
    <header className="nav">
      <a href="#top" className="nav__brand" aria-label="EstateCRM">
        <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="EstateCRM" className="nav__logo" />
      </a>
      <nav className="nav__middle">
        <a className="nav__link" href="#contents" onClick={handleNav('contents')}>Что внутри</a>
        <a className="nav__link" href="#stats" onClick={handleNav('stats')}>Цифры</a>
        <a className="nav__link" href="#download" onClick={handleNav('download')}>Скачать</a>
      </nav>
      <a href="#download" className="nav__btn" onClick={handleGetPdf}>Получить PDF</a>
    </header>
  )
}

export default Navbar

import React from 'react'
import './Footer.css'

function Footer() {
  const base = import.meta.env.BASE_URL

  return (
    <footer className="footer">
      <a href="https://estatecrm.io" target="_blank" rel="noreferrer" className="footer__brand" aria-label="EstateCRM">
        <img src={`${base}images/logo.png`} alt="EstateCRM" className="footer__logo" />
      </a>
      <div className="footer__center">Москва · 2026 · estatecrm.io</div>
      <div className="footer__right">
        <a href="https://estatecrm.io/confidentiality/" target="_blank" rel="noreferrer">Политика</a>
        <span className="footer__dot">·</span>
        <a href="https://estatecrm.io/confidentiality/" target="_blank" rel="noreferrer">Cookies</a>
        <span className="footer__dot">·</span>
        <a href="https://estatecrm.io/company" target="_blank" rel="noreferrer">Контакты</a>
      </div>
    </footer>
  )
}

export default Footer

import React from 'react'
import Navbar from './Navbar'
import './HeroSection.css'

function HeroSection({ onGetPdf, onNav }) {
  const handleCta = (e) => {
    e.preventDefault()
    onGetPdf?.()
  }

  return (
    <section className="hero">
      <div className="hero__glare-center" />
      <div className="hero__glare-side" />
      <div className="hero__glare-violet" />

      <div className="hero__wrap">
        <Navbar onGetPdf={onGetPdf} onNav={onNav} />

        <div className="hero__inner">
          <h1 className="hero__h1">
            <span className="hero__line">Где <span className="hero__accent">AI</span> уже</span>
            <span className="hero__line">приносит прибыль</span>
            <span className="hero__line hero__line--soft">застройщикам</span>
          </h1>

          <p className="hero__lede">
            Карта рынка AI в российском девелопменте<br className="mobile-only" /> на 2026.<br />
            Конкретные цифры, кейсы застройщиков <br className="mobile-only" />и алгоритм внедрения AI.
          </p>

          <div className="hero__stats" id="stats">
            <div className="hero__stat">
              <div className="hero__stat-big">35%</div>
              <div className="hero__stat-sep" />
              <div className="hero__stat-lbl">решений AI<br />на этапе эксплуатации<br />зданий</div>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-big hero__stat-big--accent">17%</div>
              <div className="hero__stat-sep" />
              <div className="hero__stat-lbl">решений AI<br />на этапе<br />продаж</div>
            </div>
            <div className="hero__stat hero__stat--last">
              <div className="hero__stat-big">2,7%</div>
              <div className="hero__stat-sep" />
              <div className="hero__stat-lbl">решений AI<br />на этапе проектирования<br />и стройки</div>
            </div>
          </div>

          <div className="hero__cta-row">
            <a href="#download" className="hero__btn" onClick={handleCta}>
              <span>Получить исследование</span>
              <span className="hero__btn-arrow">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

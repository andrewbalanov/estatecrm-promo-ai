import React from 'react'
import './ContentsSection.css'

const ITEMS = [
  { n: '01', t: '3 ключевых вывода', d: 'Какие процессы девелоперов уже готовы к внедрению AI.' },
  { n: '02', t: 'Почему сейчас нужно начинать внедрение', d: 'Ставка снижается и это меняет логику управления продажами.' },
  { n: '03', t: 'Бенчмарк ведущих застройщиков', d: 'ДОНСТРОЙ, ПИК, ГК «Точно»: что уже внедрили и какой получили результат.' },
  {
    n: '04',
    t: 'Что мешает девелоперам внедрить AI',
    d: (
      <>
        Четыре системных барьера, <br className="mobile-only" />с которыми сталкиваются застройщики.
      </>
    ),
  },
  { n: '05', t: '4 шага для успешного внедрения', d: 'Готовый алгоритм запуска для получения измеримого результата.' },
  { n: '06', t: 'Чек-лист: готов ли ваш бизнес', d: '7 пунктов для проверки готовности ваших процессов к оптимизации с AI.' },
]

function ContentsSection() {
  return (
    <section className="contents" id="contents">
      <div className="contents__glare" />

      <div className="contents__head">
        <div className="section-label">
          <span>СОДЕРЖАНИЕ ИССЛЕДОВАНИЯ</span>
          <div className="section-label__line" />
          <div className="section-label__arrow" aria-hidden="true" />
        </div>
        <h2 className="h2">
          Полный срез рынка<br />
          <span className="h2-accent">по использованию AI</span>
        </h2>
      </div>

      <div className="contents__grid">
        {ITEMS.map((it, i) => (
          <div key={it.n} className={`contents__card ${i === 0 || i === 4 ? 'contents__card--hot' : ''}`}>
            <div className="contents__num">{it.n}</div>
            <div className="contents__title">{it.t}</div>
            <div className="contents__text">{it.d}</div>
            <div className="contents__arrow">→</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ContentsSection

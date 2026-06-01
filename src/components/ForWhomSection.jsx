import React from 'react'
import './ForWhomSection.css'

const ROLES = [
  {
    title: (
      <>
        Коммерческий директор / директор <br className="mobile-only" />по продажам
      </>
    ),
    text: (
      <>
        Покажем, как ведущие застройщики получают 3{'–'}5% к доходности своих проектов.
      </>
    ),
  },
  {
    title: 'Собственник / CEO девелоперской компании',
    text: 'Стратегический контекст: как ваши конкуренты уже используют ИИ и куда движется рынок до 2027 года.',
  },
  {
    title: 'Руководитель IT / директор по продукту',
    text: 'Алгоритм запуска пилота и чек-лист готовности процессов к внедрению.',
  },
]

function ForWhomSection() {
  return (
    <section className="forwhom">
      <div className="forwhom__glare" />
      <div className="forwhom__glare-violet" />

      <div className="forwhom__grid">
        <div className="forwhom__left">
          <div className="section-label">
            <span>ДЛЯ КОГО</span>
            <div className="section-label__line" />
            <div className="section-label__arrow" aria-hidden="true" />
          </div>
          <h2 className="h2">
            Если вы<br />
            отвечаете<span className="mobile-only"> за</span><br />
            <span className="desktop-only">за </span>
            <span className="h2-accent">рост и эффективность</span>
          </h2>
          <p className="forwhom__lede">
            Исследование будет полезно для тех,<br />кто принимает решения о внедрении AI.
          </p>
        </div>

        <div className="forwhom__right">
          {ROLES.map((r, i) => (
            <div className="forwhom__row" key={i}>
              <div className="forwhom__check">✓</div>
              <div>
                <div className="forwhom__row-title">{r.title}</div>
                <div className="forwhom__row-text">{r.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ForWhomSection

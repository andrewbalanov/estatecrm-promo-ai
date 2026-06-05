import React, { useState, useEffect, useRef } from 'react'
import ResultModal from './ResultModal'
import './DownloadSection.css'

const BITRIX_WEBHOOK = 'https://tracebs.bitrix24.ru/rest/2/7det75s26t8s9sz6/'
const PDF_URL = `${import.meta.env.BASE_URL}files/issledovanie-ai-v-developmente-2026.pdf`

// Стандартные UTM-поля Битрикса. Ключ запроса (UTM_SOURCE) → query-параметр (utm_source).
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const UTM_STORAGE_KEY = 'estatecrm_utm'

// Захватываем UTM на ПЕРВОМ заходе и сохраняем в localStorage: если посетитель
// уйдёт по якорю или метки слетят при навигации — они не потеряются к сабмиту.
function captureUtm() {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const fromUrl = {}
  UTM_KEYS.forEach((k) => {
    const v = params.get(k)
    if (v) fromUrl[k] = v
  })
  if (Object.keys(fromUrl).length > 0) {
    try {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl))
    } catch (_) {}
    return fromUrl
  }
  try {
    return JSON.parse(localStorage.getItem(UTM_STORAGE_KEY) || '{}')
  } catch (_) {
    return {}
  }
}

function DownloadSection() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '' })
  const [status, setStatus] = useState('idle') // idle | loading
  const [result, setResult] = useState({ open: false, type: 'success', message: '' })
  const utmRef = useRef({})

  // Ловим метки при монтировании, до любых якорных переходов по странице.
  useEffect(() => {
    utmRef.current = captureUtm()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const triggerDownload = () => {
    const link = document.createElement('a')
    link.href = PDF_URL
    link.download = 'AI в девелопменте — Исследование 2026.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.company || !form.phone || !form.email) return
    setStatus('loading')

    const utm = utmRef.current || {}
    // utm_source → UTM_SOURCE: стандартные UTM-поля лида в Битрикс24.
    const utmFields = {}
    UTM_KEYS.forEach((k) => {
      if (utm[k]) utmFields[k.toUpperCase()] = utm[k]
    })
    const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://promo.estatecrm.io/ai/'

    try {
      const bitrixPromise = fetch(`${BITRIX_WEBHOOK}crm.lead.add.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            TITLE: `AI в девелопменте — ${form.company || form.name}`,
            NAME: form.name,
            COMPANY_TITLE: form.company,
            EMAIL: [{ VALUE: form.email, VALUE_TYPE: 'WORK' }],
            PHONE: [{ VALUE: form.phone, VALUE_TYPE: 'WORK' }],
            SOURCE_ID: 'UC_RP7YY3',
            ...utmFields,
            UF_CRM_1760704782049: pageUrl,
            UF_CRM_1738824489: 'Скачать исследование AI',
            COMMENTS: 'Источник: Лендинг «AI в девелопменте» — форма скачивания исследования',
          },
        }),
      })

      const emailPromise = fetch('/ai/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          consent: true,
          marketing: false,
          formType: 'report',
          url: pageUrl,
          utm,
        }),
      }).catch((err) => console.error('Email notification error:', err))

      const [bitrixResponse] = await Promise.all([bitrixPromise, emailPromise])
      const data = await bitrixResponse.json()

      if (data.result) {
        if (typeof window !== 'undefined' && typeof window.ym === 'function') {
          window.ym(108680226, 'reachGoal', 'spas_str')
        }
        if (typeof window !== 'undefined' && Array.isArray(window._tmr)) {
          window._tmr.push({ type: 'reachGoal', id: 3706885, goal: 'form_subm_ai' })
        }
        setStatus('idle')
        setResult({ open: true, type: 'success', message: '' })
        setTimeout(triggerDownload, 600)
      } else {
        console.error('Bitrix24 error:', data)
        setStatus('idle')
        setResult({
          open: true,
          type: 'error',
          message:
            data.error === 'insufficient_scope'
              ? 'Ошибка настройки CRM. Свяжитесь с нами по телефону.'
              : 'Не удалось отправить заявку. Попробуйте ещё раз.',
        })
      }
    } catch (err) {
      console.error('Network error:', err)
      setStatus('idle')
      setResult({ open: true, type: 'error', message: 'Ошибка сети. Проверьте подключение и попробуйте ещё раз.' })
    }
  }

  const closeResult = () => setResult((r) => ({ ...r, open: false }))

  return (
    <section id="download" className="dl">
      <div className="dl__glare" />
      <div className="dl__glare-violet" />

      <div className="dl__inner">
        <div className="dl__left">
          <h2 className="dl__h2">
            Заполните форму<br />
            и мы отправим<br />
            <span className="h2-accent">исследование</span>
          </h2>
          <p className="dl__lede">
            PDF придёт на email <br className="mobile-only" />в течение минуты. В файле собрана
            актуальная аналитика рынка на 2026 год, кейсы застройщиков
            и алгоритм для успешного запуска AI.
          </p>
        </div>

        <div className="dl__right">
          <div className="dl__card">
            <div className="dl__card-head">
              <div className="dl__card-title">Скачать исследование AI</div>
              <div className="dl__card-meta">EstateCRM · 12 стр. · 4 МБ · PDF</div>
            </div>

            <form className="dl__form" onSubmit={handleSubmit}>
              <label className="dl__field">
                <span className="dl__label">Имя</span>
                <input
                  className="dl__input" type="text" name="name" value={form.name}
                  onChange={handleChange} placeholder="Как вас зовут?" required disabled={status === 'loading'}
                />
              </label>
              <label className="dl__field">
                <span className="dl__label">Компания</span>
                <input
                  className="dl__input" type="text" name="company" value={form.company}
                  onChange={handleChange} placeholder="Как называется ваша компания?" required disabled={status === 'loading'}
                />
              </label>
              <label className="dl__field">
                <span className="dl__label">Телефон</span>
                <input
                  className="dl__input" type="tel" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="+7 (___) ___-__-__" required disabled={status === 'loading'}
                />
              </label>
              <label className="dl__field">
                <span className="dl__label">E-mail для отправки PDF</span>
                <input
                  className="dl__input" type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="you@company.ru" required disabled={status === 'loading'}
                />
              </label>

              <button type="submit" className="dl__btn" disabled={status === 'loading'}>
                <span>{status === 'loading' ? 'Отправляем…' : 'Получить исследование'}</span>
                {status !== 'loading' && <span className="dl__btn-arrow">↓</span>}
              </button>

              <div className="dl__fine">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <a href="https://estatecrm.io/confidentiality/" target="_blank" rel="noreferrer">политикой обработки данных</a>{' '}
                EstateCRM.
              </div>
            </form>
          </div>
        </div>
      </div>

      <ResultModal
        open={result.open}
        type={result.type}
        message={result.message}
        onClose={closeResult}
        onDownload={triggerDownload}
      />
    </section>
  )
}

export default DownloadSection

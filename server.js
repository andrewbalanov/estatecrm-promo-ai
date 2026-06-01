import 'dotenv/config'
import express from 'express'
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// PDF ~26 МБ — не вложение (превышает лимит SMTP), а ссылка на скачивание.
const REPORT_URL = 'https://promo.estatecrm.io/ai/files/issledovanie-ai-v-developmente-2026.pdf'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Vite собран с base: '/ai/' — без trailing slash ассеты ломаются.
// Редиректим /ai → /ai/ только для точного пути (нестрогий роутинг Express
// иначе ловит и /ai/, создавая петлю редиректов).
app.get('/ai', (req, res, next) => {
  if (req.path === '/ai') return res.redirect(301, '/ai/')
  next()
})

// Serve static files from Vite build (both paths for Coolify compatibility)
app.use('/ai', express.static(join(__dirname, 'dist')))
app.use('/', express.static(join(__dirname, 'dist')))

// SMTP transporter for Mail.ru
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'sales@estatecrm.io',
    pass: process.env.SMTP_PASS,
  },
})

function buildEmailHtml({ name, company, email, phone, consent, marketing, url, label }) {
  const fields = [
    ...(label ? [{ label: 'Форма', value: label }] : []),
    { label: 'Имя', value: name },
    { label: 'Название компании', value: company },
    { label: 'Рабочая почта', value: `<a href="mailto:${email}" style="color: #6d5cff; text-decoration: none;">${email}</a>` },
    { label: 'Телефон', value: phone },
    { label: 'Согласие', value: consent ? 'Согласие на обработку персональных данных' : 'Не дано' },
    { label: 'Рассылка', value: marketing ? 'Хочу получать email с новыми кейсами, рекламой и быть в курсе важных событий' : 'Отказ от рассылки' },
    { label: 'URL', value: `<a href="${url}" style="color: #6d5cff; text-decoration: none;">${url}</a>` },
  ]

  const rows = fields.map(({ label, value }) => `
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0 0 8px; font-weight: 700; font-size: 15px; color: #1a1a1a;">${label}</p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #333;">${value}</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;" />
      </td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #f0f0f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f0f0f0; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 4px;">
          ${rows}
          <tr>
            <td style="padding: 32px 40px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #999;">
                Отправлено с сайта <a href="https://estatecrm.io" style="color: #6d5cff; text-decoration: none;">EstateCRM</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildUserEmailHtml({ name }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #f0f0f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f0f0f0; padding: 32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden;">
        <tr><td style="background: linear-gradient(135deg, #6d5cff 0%, #2a1d6b 100%); padding: 36px 40px;">
          <p style="margin: 0; color: #fff; font-size: 22px; font-weight: 700;">AI в девелопменте · 2026</p>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Исследование рынка от EstateCRM</p>
        </td></tr>
        <tr><td style="padding: 32px 40px;">
          <p style="margin: 0 0 16px; font-size: 16px; color: #1a1a1a;">${name ? name + ',' : 'Здравствуйте!'}</p>
          <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #333;">
            Спасибо за интерес к нашему исследованию. В PDF — актуальная аналитика рынка AI
            в девелопменте на 2026 год, кейсы застройщиков и алгоритм успешного внедрения.
            Скачать файл можно по кнопке ниже:
          </p>
          <p style="margin: 0 0 24px; text-align: center;">
            <a href="${REPORT_URL}" style="display: inline-block; background: linear-gradient(135deg, #6d5cff 0%, #2a1d6b 100%); color: #fff; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 32px; border-radius: 12px;">Скачать исследование (PDF)</a>
          </p>
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333;">
            Если возникнут вопросы — просто ответьте на это письмо.
          </p>
        </td></tr>
        <tr><td style="padding: 0 40px 32px; text-align: center;">
          <p style="margin: 0; font-size: 13px; color: #999;">
            <a href="https://estatecrm.io" style="color: #6d5cff; text-decoration: none;">EstateCRM</a> · Москва · 2026
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

const FORM_LABELS = {
  consult: 'Форма "Записаться на консультацию"',
  report: 'Форма "Скачать исследование AI"',
  bottom: 'Форма в нижнем блоке',
}

const sendEmailHandler = async (req, res) => {
  const { name, company, email, phone, consent, marketing, formType } = req.body

  if (!name || !company || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const pageUrl = req.headers.referer || 'https://promo.estatecrm.io/ai/'
  const label = FORM_LABELS[formType] || FORM_LABELS.consult

  try {
    await transporter.sendMail({
      from: '"EstateCRM - Sales" <sales@estatecrm.io>',
      to: 'sales@estatecrm.io',
      subject: `Новая заявка: Лендинг "AI в девелопменте" — ${label}`,
      html: buildEmailHtml({ name, company, email, phone, consent, marketing, url: pageUrl, label }),
    })

    // Для формы скачивания — отправляем пользователю письмо со ссылкой на PDF (best-effort).
    if (formType === 'report') {
      transporter
        .sendMail({
          from: '"EstateCRM" <sales@estatecrm.io>',
          to: email,
          subject: 'Ваше исследование: AI в девелопменте · 2026',
          html: buildUserEmailHtml({ name }),
        })
        .catch((err) => console.error('User email error:', err))
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err)
    res.status(500).json({ error: 'Failed to send email' })
  }
}

app.post('/api/send-email', sendEmailHandler)
app.post('/ai/api/send-email', sendEmailHandler)

// Healthcheck
// - без ?key= → быстрый liveness 200 (для Coolify / Docker healthcheck)
// - с ?key=HEALTH_KEY → полная проверка, включая SMTP (для внешнего uptime-монитора)
const HEALTH_KEY = process.env.HEALTH_KEY || 'estatecrm-mon-2026'

const healthHandler = async (req, res) => {
  if (!req.query.key) {
    return res.status(200).json({ server: 'ok', timestamp: new Date().toISOString() })
  }
  if (req.query.key !== HEALTH_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const status = { server: 'ok', smtp: 'ok', timestamp: new Date().toISOString() }
  try {
    await transporter.verify()
  } catch {
    status.smtp = 'error'
  }
  const httpCode = status.smtp === 'ok' ? 200 : 503
  res.status(httpCode).json(status)
}
app.get('/api/health', healthHandler)
app.get('/ai/api/health', healthHandler)

// SPA fallback
app.get('/ai/*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

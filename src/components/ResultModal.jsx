import React from 'react'
import './ResultModal.css'

function ResultModal({ open, type, message, onClose, onDownload }) {
  if (!open) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="rmodal-overlay" onClick={handleOverlayClick}>
      <div className="rmodal">
        <button className="rmodal__close" type="button" onClick={onClose} aria-label="Закрыть">&times;</button>

        {type === 'success' ? (
          <>
            <div className="rmodal__icon rmodal__icon--ok">✓</div>
            <h3 className="rmodal__title">Готово! Исследование скачивается</h3>
            <p className="rmodal__text">
              Файл загружается на&nbsp;ваше устройство, а&nbsp;ссылку для&nbsp;скачивания мы&nbsp;отправили
              вам на&nbsp;почту. Если загрузка не&nbsp;началась автоматически&nbsp;— нажмите кнопку ниже.
            </p>
            <button className="rmodal__btn" type="button" onClick={onDownload}>
              <span>Скачать исследование</span>
              <span className="rmodal__btn-arrow">↓</span>
            </button>
            <button className="rmodal__btn rmodal__btn--ghost" type="button" onClick={onClose}>Закрыть</button>
          </>
        ) : (
          <>
            <div className="rmodal__icon rmodal__icon--err">!</div>
            <h3 className="rmodal__title">Не удалось отправить</h3>
            <p className="rmodal__text">{message || 'Попробуйте ещё раз или свяжитесь с нами по телефону.'}</p>
            <button className="rmodal__btn" type="button" onClick={onClose}>Попробовать снова</button>
          </>
        )}
      </div>
    </div>
  )
}

export default ResultModal

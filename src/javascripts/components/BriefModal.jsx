import React, { useEffect, useRef } from 'react';

const CONTACTS = {
  phone: '', // Пример: '+79991234567'
  telegram: '', // Пример: 'https://t.me/username'
  vk: '', // Пример: 'https://vk.com/username'
  other: '',
};

function SocialLink({ href, label, abbreviation }) {
  if (!href) {
    return <span className="fz-social is-placeholder" title={`Не задан адрес: ${label}`} aria-label={label}>{abbreviation}</span>;
  }
  return <a className="fz-social" href={href} target="_blank" rel="noreferrer" aria-label={label}>{abbreviation}</a>;
}

export default function BriefModal({ kind, onClose, onReturnToBrief }) {
  const cardRef = useRef(null);
  const isDone = kind === 'done';

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cardRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && cardRef.current) {
        const focusables = Array.from(cardRef.current.querySelectorAll('button, a[href]'));
        if (focusables.length === 0) { event.preventDefault(); return; }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = oldOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  return (
    <div className="fz-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section ref={cardRef} tabIndex={-1} className="fz-modal-card" role="dialog" aria-modal="true" aria-labelledby="fz-modal-title">
        <button className="fz-modal-x" type="button" onClick={onClose} aria-label="Закрыть попап">×</button>
        {isDone ? (
          <>
            <h2 id="fz-modal-title">Готово!</h2>
            <h3>Задача отправлена на обсуждение</h3>
            <p className="fz-modal-small">Мы свяжемся с вами в течение 2-х дней</p>
            <p className="fz-demo-warning">Демо-версия: данные не были отправлены на сервер.</p>
          </>
        ) : (
          <>
            <h2 id="fz-modal-title">Контакты</h2>
            <h3>Если не готовы заполнять бриф</h3>
            <div className="fz-direct-contacts">
              {CONTACTS.phone ? (
                <a className="fz-contact-phone" href={`tel:${CONTACTS.phone.replace(/[^\d+]/g, '')}`}>
                  {CONTACTS.phone}
                </a>
              ) : <p className="fz-contact-phone">[Телефон бюро]</p>}
              <p className="fz-contact-hint">Или напишите в удобном мессенджере</p>
              <div className="fz-social-row">
                <SocialLink href={CONTACTS.telegram} label="Telegram" abbreviation="✈" />
                <SocialLink href={CONTACTS.vk} label="ВКонтакте" abbreviation="VK" />
                <SocialLink href={CONTACTS.other} label="Другой мессенджер" abbreviation="●" />
              </div>
            </div>
            <button className="fz-return-button" type="button" onClick={onReturnToBrief}>Вернуться к брифу</button>
          </>
        )}
      </section>
    </div>
  );
}

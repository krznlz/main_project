import React from 'react';

const navigation = [
  { label: 'Главная', href: './' },
  { label: 'Услуги', href: './#services' },
  { label: 'Команда', href: './#team' },
  { label: 'Проекты', href: './#projects' },
  { label: 'История и опыт', href: './#about' },
];

export default function BriefHeader({ menuOpen, onToggleMenu, onCloseMenu, onGoToBrief }) {
  return (
    <>
      <header className={`fz-header ${menuOpen ? 'is-menu-open' : ''}`}>
        <button
          type="button"
          className={`fz-menu-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={onToggleMenu}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          aria-controls="fz-site-navigation"
        >
          <span className="fz-plus" aria-hidden="true" />
        </button>
        <span className="fz-brand">Форма следует за функцией</span>
        {menuOpen ? (
          <button className="fz-header-cta" type="button" onClick={onGoToBrief}>Обсудить задачу</button>
        ) : <div className="fz-header-placeholder" />}
      </header>
      {menuOpen && (
        <nav id="fz-site-navigation" className="fz-menu-panel" aria-label="Навигация по сайту">
          <div className="fz-menu-column">
            {navigation.slice(0, 3).map((item) => (
              <a key={item.label} href={item.href} onClick={onCloseMenu}>{item.label}</a>
            ))}
          </div>
          <div className="fz-menu-separator" aria-hidden="true">+</div>
          <div className="fz-menu-column">
            {navigation.slice(3).map((item) => (
              <a key={item.label} href={item.href} onClick={onCloseMenu}>{item.label}</a>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}

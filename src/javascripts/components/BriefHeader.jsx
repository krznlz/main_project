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
      <header className={`header ${menuOpen ? 'open' : ''}`}>
        <button
          type="button"
          className={`menu-button ${menuOpen ? 'open' : ''}`}
          onClick={onToggleMenu}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <span className="plus" aria-hidden="true" />
        </button>
        <span className="brand">Форма следует за функцией</span>
        {menuOpen ? (
          <button className="menu-cta" type="button" onClick={onGoToBrief}>Обсудить задачу</button>
        ) : <div className="header-space" />}
      </header>
      {menuOpen && (
        <nav id="site-menu" className="menu" aria-label="Навигация по сайту">
          <div className="menu-col">
            {navigation.slice(0, 3).map((item) => (
              <a key={item.label} href={item.href} onClick={onCloseMenu}>{item.label}</a>
            ))}
          </div>
          <div className="menu-plus" aria-hidden="true">+</div>
          <div className="menu-col">
            {navigation.slice(3).map((item) => (
              <a key={item.label} href={item.href} onClick={onCloseMenu}>{item.label}</a>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
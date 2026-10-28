import React, { useCallback, useEffect, useState } from 'react';
import BriefHeader from './BriefHeader.jsx';
import BriefModal from './BriefModal.jsx';

const TASKS = [
  'Спроектировать новое здание',
  'Разработать концепцию застройки территории',
  'Оценить возможности участка',
  'Реконструировать или расширить здание',
  'Доработать существующий проект',
  'Другая задача',
];

const INITIAL_DATA = {
  task: '',
  object: '',
  requirements: '',
  deadline: '',
  materialsLinks: '',
  name: '',
  company: '',
  phone: '',
  email: '',
  messenger: '',
  consent: false,
};

function TextStep({ title, name, value, placeholder, onChange, tall = true }) {
  return (
    <section className="step">
      <h2>{title}</h2>
      <textarea
        aria-label={title}
        className={`textarea ${tall ? 'tall' : 'short'}`}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </section>
  );
}

function ContactInput({ label, name, value, placeholder, onChange, type = 'text' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'off'}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  );
}

export default function BriefApp() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [files, setFiles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setData((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  }

  function nextStep() {
    if (step === 1 && !data.task) { setError('Выберите, что планируете.'); return; }
    setError('');
    setStep((previous) => Math.min(previous + 1, 6));
  }

  function previousStep() {
    setError('');
    setStep((previous) => Math.max(1, previous - 1));
  }

  function addFiles(event) {
    const selected = Array.from(event.target.files || []);
    setFiles((previous) => [...previous, ...selected]);
    event.target.value = '';
  }

  function removeFile(index) {
    setFiles((previous) => previous.filter((_, i) => i !== index));
  }

  function submitBrief(event) {
    event.preventDefault();
    if (!data.name.trim()) { setError('Укажите имя.'); return; }
    if (![data.phone, data.email, data.messenger].some((s) => s.trim())) {
      setError('Укажите телефон, электронную почту или мессенджер.');
      return;
    }
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      setError('Проверьте адрес электронной почты.'); return;
    }
    if (!data.consent) { setError('Подтвердите согласие на обработку данных.'); return; }

    // В проекте пока нет API. Эти данные остаются только в браузере.
    // Для реальной отправки подключите обработчик через fetch/FormData.
    // files — массив объектов File; data — объект с ответами.
    setError('');
    setMenuOpen(false);
    setModal('done');
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

  const closeModal = useCallback(() => setModal(null), []);
  function openContacts() { setMenuOpen(false); setModal('contacts'); }

  return (
    <div className="brief">
      <BriefHeader
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((previous) => !previous)}
        onCloseMenu={() => setMenuOpen(false)}
        onGoToBrief={() => { setMenuOpen(false); document.querySelector('.form')?.scrollIntoView({ behavior: 'smooth' }); }}
      />
      <main className={`main ${step === 1 ? 'first' : ''}`}>
        <span className="arrow" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
            d="M6 6L34 34M34 6L6 34"
            stroke="currentColor"
            strokeWidth="1.5"
            />
          </svg>
        </span>
        <button type="button" className="outline contact-button" onClick={openContacts}>
          Связаться без брифа
        </button>

        <form className="form" onSubmit={submitBrief} noValidate>
          {step === 1 && (
            <>
              <div className="intro">
                <h1>Расскажите нам о вашей задаче</h1>
                <p>Укажите то, что уже известно. Остальные детали обсудим при первом разговоре</p>
              </div>
              <section className="step first-task">
                <h2>Что вы планируете?</h2>
                <div className="tasks">
                  {TASKS.map((task) => (
                    <label className="option" key={task}>
                      <input type="radio" name="task" value={task} checked={data.task === task} onChange={handleChange} />
                      <span>{task}</span>
                    </label>
                  ))}
                </div>
              </section>
            </>
          )}

          {step === 2 && (
            <TextStep title="Что известно об объекте или участке?" name="object" value={data.object} onChange={handleChange}
              placeholder="Назначение, расположение и примерная площадь. Если каких-то данных пока нет, оставьте их без ответа" />
          )}

          {step === 3 && (
            <TextStep title="Какие требования нужно учесть?" name="requirements" value={data.requirements} onChange={handleChange}
              placeholder="Расскажите, что уже определено: площадь, этажность, состав помещений, бюджет, ограничения участка или требования инвестора" />
          )}

          {step === 4 && (
            <TextStep title="К какому сроку нужен результат?" name="deadline" value={data.deadline} onChange={handleChange} tall={false}
              placeholder="Укажите дату или событие, к которому нужно подготовить проект: презентация инвестору, согласование концепции, начало строительства" />
          )}

          {step === 5 && (
            <section className="step">
              <h2>Материалы для первого обсуждения</h2>
              <label className="upload">
                <span className="upload-icon" aria-hidden="true">↥</span> Прикрепить файлы
                <input type="file" multiple hidden onChange={addFiles} aria-label="Прикрепить файлы" />
              </label>
              {files.length > 0 && (
                <div className="files" aria-label="Прикреплённые файлы">
                  {files.map((file, index) => (
                    <div className="file" key={`${file.name}-${index}`}>
                      <span>{file.name}</span>
                      <button type="button" onClick={() => removeFile(index)} aria-label={`Удалить файл ${file.name}`}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <textarea className="textarea links" name="materialsLinks" value={data.materialsLinks}
                onChange={handleChange} aria-label="Ссылки на материалы" placeholder="Или прикрепите ссылки на материалы" />
              <p className="help">
                Техническое задание, план участка, эскизы, чертежи или существующая проектная документация.
                Если материалов нет, пропустите этот шаг.
              </p>
            </section>
          )}

          {step === 6 && (
            <section className="step contact-step">
              <h2>Оставьте контакты для связи</h2>
              <div className="fields">
                <ContactInput label="Имя" name="name" value={data.name} placeholder="Как к вам обращаться" onChange={handleChange} />
                <ContactInput label="Компания и роль в проекте" name="company" value={data.company}
                  placeholder="Название компании, должность" onChange={handleChange} />
              </div>
              <h3>Телефон или почта для связи</h3>
              <div className="fields">
                <ContactInput label="Телефон" type="tel" name="phone" value={data.phone} placeholder="+7" onChange={handleChange} />
                <ContactInput label="Электронная почта" type="email" name="email" value={data.email}
                  placeholder="name@company.ru" onChange={handleChange} />
              </div>
              <input className="input messenger" type="text" name="messenger" value={data.messenger}
                onChange={handleChange} placeholder="Или оставьте ссылку на соцсеть/мессенджер" aria-label="Ссылка на соцсеть или мессенджер" />
              <label className="consent">
                <input type="checkbox" name="consent" checked={data.consent} onChange={handleChange} />
                <span>Даю согласие на обработку персональных данных</span>
              </label>
            </section>
          )}

          {error && <p className="error" role="alert">{error}</p>}

          <div className="actions">
            <button type="button" className="back" disabled={step === 1} onClick={previousStep}>
              <span aria-hidden="true">←</span>Назад
            </button>
            <span className="count">шаг {step} из 6</span>
            <button type={step === 6 ? 'submit' : 'button'} className="next" onClick={step === 6 ? undefined : nextStep}>
              {step === 6 ? 'Отправить заявку' : 'Далее'}
            </button>
          </div>
        </form>
      </main>
      {modal && <BriefModal kind={modal} onClose={closeModal} onReturnToBrief={closeModal} />}
    </div>
  );
}
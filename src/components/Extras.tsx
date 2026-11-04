import React, { useState } from 'react';
import { useInstall } from '../lib/pwa';
import { Dialog, Icon } from './ui';

/** Кнопка «Установить приложение». На iPhone показывает короткую инструкцию. */
export function InstallButton({ wide = false }: { wide?: boolean }) {
  const { mode, install } = useInstall();
  const [guide, setGuide] = useState(false);
  if (!mode) return null;
  return (
    <>
      <button
        className={`btn ghost small${wide ? ' wide' : ''}`}
        onClick={() => (mode === 'prompt' ? install() : setGuide(true))}
        title="Установить Petuh Party как приложение"
      >
        <Icon name="download" size={16} />
        <span>Установить приложение</span>
      </button>
      {guide && (
        <Dialog title="Установка на iPhone и iPad" onClose={() => setGuide(false)}>
          <ol className="steps">
            <li>
              Откройте сайт в Safari и нажмите <b>«Поделиться»</b> <Icon name="share" size={16} /> внизу экрана.
            </li>
            <li>
              Пролистайте меню и выберите <b>«На экран „Домой“»</b>.
            </li>
            <li>Нажмите «Добавить» — значок петуха появится рядом с другими приложениями.</li>
          </ol>
          <div className="dialog-actions">
            <button className="btn primary" onClick={() => setGuide(false)}>
              Понятно
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}

const KEYS: [string, string][] = [
  ['Пробел или K', 'Пауза и запуск для всех'],
  ['← и →', 'Назад и вперёд на 10 секунд'],
  ['F', 'Во весь экран — реакции видно и там'],
  ['M', 'Выключить или включить звук у себя'],
  ['C', 'Перейти к сообщению в чате'],
  ['?', 'Показать эту подсказку'],
];

export function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog title="Горячие клавиши" onClose={onClose}>
      <dl className="keys-list">
        {KEYS.map(([k, d]) => (
          <div key={k}>
            <dt>
              <kbd>{k}</kbd>
            </dt>
            <dd>{d}</dd>
          </div>
        ))}
      </dl>
      <p className="hint">
        Двойной клик по сообщению ставит 😭, остальные реакции — в кнопках при наведении. На телефоне: двойное нажатие — 😭,
        удержание — меню реакций и ответа.
      </p>
      <p className="hint">Клавиши работают, когда курсор не в поле ввода. Управлять можно и прямо в плеере — действия видят все.</p>
    </Dialog>
  );
}

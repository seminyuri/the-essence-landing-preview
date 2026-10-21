/* Ядро прототипа: экраны, маршрутизация, оболочка the-essence, общие элементы. */
(function () {
  const D = window.DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ── состояние, которое переживает переход между экранами ─────────────────
  const S = {
    offerLive: null,         // какое предложение ведущий показал зрителям
    raised: D.donationGoal.raised,
    trust: 'reversible',     // уровень доверия Юи
    moneyTrust: false,
    camStream: null,
    theme: 'light',
    captionsLang: 'ru',
    paidNext: false,
    live: false,
  };

  // ── мелочи ────────────────────────────────────────────────────────────────
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rub = (n) => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
  const num = (n) => n.toLocaleString('ru-RU');
  const I = (name, size = 'sm', cls = '') => {
    const px = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 }[size] || 16;
    const own = PROTO_ICONS.has(name) ? 'proto-icons.svg' : 'icons.svg';
    return `<svg class="icon icon--${size} ${cls}" width="${px}" height="${px}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#${name}"></use></svg>`;
  };
  const PROTO_ICONS = new Set();
  const person = (id) => D.people[id] || { name: 'Гость', short: 'Гость', photo: '' };
  const av = (id, size = 32, extra = '') => {
    const p = person(id);
    return `<span class="pav ${extra}" style="--s:${size}px">${p.photo ? `<img src="${p.photo}" alt="" loading="lazy">` : `<b>${esc(p.short?.[0] || '?')}</b>`}</span>`;
  };

  // ── реестр экранов ───────────────────────────────────────────────────────
  const screens = [];
  const byId = {};
  function add(def) { screens.push(def); byId[def.id] = def; }

  let current = null;
  let timers = [];
  let cleanups = [];
  const every = (ms, fn) => { const h = setInterval(fn, ms); timers.push(h); return h; };
  const later = (ms, fn) => { const h = setTimeout(fn, ms); timers.push(h); return h; };
  const onLeave = (fn) => cleanups.push(fn);

  function parseHash() {
    const h = location.hash.replace(/^#\/?/, '');
    const [id, q] = h.split('?');
    const params = Object.fromEntries(new URLSearchParams(q || ''));
    return { id: id || 'map', params };
  }

  function go(id, params) {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    const target = `#/${id}${q}`;
    if (location.hash === target) render(); else location.hash = target;
  }

  function render() {
    timers.forEach((h) => { clearInterval(h); clearTimeout(h); });
    timers = [];
    cleanups.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
    cleanups = [];
    closeModal(true);
    const { id, params } = parseHash();
    const def = byId[id] || byId.map;
    current = def;
    current.params = params;
    const root = $('#app');
    root.className = 'proto-root ' + (def.frame === 'phone' ? 'is-phone-screen' : '');
    let html = def.render(params);
    if (def.frame === 'phone') html = phoneFrame(html, def);
    root.innerHTML = html;
    root.scrollTop = 0;
    document.title = `${def.title} · Видеомодуль 2.0 · прототип`;
    try { def.mount && def.mount(root, params); } catch (e) { console.error(e); }
    updateConsole();
  }

  function phoneFrame(inner, def) {
    return `<div class="phone-stage">
      <div class="phone-stage__caption">
        <div class="eyebrow eyebrow--accent">${esc(def.groupTitle || '')}</div>
        <h2>${esc(def.title)}</h2><p>${esc(def.desc || '')}</p>
        ${def.pair ? `<button class="btn btn--secondary btn--sm" data-go="${def.pair}">${I('device-desktop')} Тот же экран на компьютере</button>` : ''}
      </div>
      <div class="phone"><div class="phone__notch"></div><div class="phone__screen" data-theme="dark">${inner}</div></div>
    </div>`;
  }

  // ── оболочка the-essence: шторка модуля, страница, тихий рельс ───────────
  const MODULES = [
    { key: 'pm', icon: 'kanban', label: 'Задачи' },
    { key: 'mail', icon: 'mail', label: 'Почта' },
    { key: 'calendar', icon: 'calendar', label: 'Календарь' },
    { key: 'video', icon: 'video', label: 'Встречи и эфиры', go: 'hub' },
    { key: 'chat', icon: 'messenger', label: 'Мессенджер', go: 'messenger' },
    { key: 'sales', icon: 'wallet', label: 'Продажи', go: 'sales' },
    { key: 'pages', icon: 'template', label: 'Страницы и рассылки', go: 'pages' },
    { key: 'school', icon: 'graduation-cap', label: 'Школа', go: 'school' },
    { key: 'crm', icon: 'crm', label: 'CRM и сценарии', go: 'client' },
    { key: 'yuia', icon: 'sparkles', label: 'Юя', go: 'yuia', yuia: true },
  ];

  function rail(active) {
    const items = MODULES.map((m) => `<a class="shell-apprail__item ${m.key === active ? 'is-active' : ''} ${m.yuia ? 'shell-apprail__item--yuia' : ''}"
        ${m.go ? `data-go="${m.go}"` : `data-act="toast" data-text="Модуль «${m.label}» уже есть в платформе — в прототип видеомодуля не входит"`}
        title="${m.label}" aria-label="${m.label}">${I(m.icon, 'md')}</a>`).join('');
    return `<nav class="shell-apprail proto-rail" aria-label="Модули">
      <button class="shell-apprail__item" data-act="palette" title="Поиск ⌘K">${I('search', 'md')}</button>
      <div class="shell-apprail__div"></div>${items}
      <span class="shell-apprail__spacer"></span><div class="shell-apprail__div"></div>
      <a class="shell-apprail__item" data-go="ops" title="Дежурный пульт">${I('server', 'md')}</a>
      <a class="shell-apprail__item" data-act="toast" data-text="3 новых уведомления: 2 оплаты, 1 вопрос в зале ожидания" title="Уведомления">${I('bell', 'md')}<span class="proto-dot"></span></a>
      <a class="shell-apprail__item" data-go="yuia" title="Настройки Юи">${I('settings', 'md')}</a>
      <a class="shell-apprail__item shell-apprail__item--profile" title="Анна Соколова">${av('anna', 30)}</a>
    </nav>`;
  }

  function shell({ module, active, compose, nav = [], body, aside = '' }) {
    const navHtml = nav.map((n) => n.label ? `<a class="shell-nav__item ${n.on ? 'is-active' : ''}" ${n.go ? `data-go="${n.go}"` : ''} ${n.act ? `data-act="${n.act}"` : ''}>
        <span class="shell-nav__icon">${I(n.icon)}</span><span class="shell-nav__label">${esc(n.label)}</span>
        ${n.live ? '<span class="shell-nav__badge shell-nav__badge--live">LIVE</span>' : ''}${n.count != null ? `<span class="shell-nav__count">${n.count}</span>` : ''}</a>`
      : `<div class="shell-nav-label proto-navlabel">${esc(n.section)}</div>`).join('');
    return `<div class="cal-app proto-shell">
      <div class="proto-mhead"><button class="proto-mhead__burger" data-act="drawer">${I('menu', 'md')}</button>
        <span class="shell-sidebar__name"><span class="shell-sidebar__brandname">Суть</span><span class="shell-sidebar__x">✕</span><span class="shell-sidebar__module">${esc(module)}</span></span></div>
      <div class="cal-body">
        <aside class="shell-sidebar proto-sidebar">
          <a class="shell-sidebar__brand" data-go="map"><img class="shell-sidebar__mark" src="seal-compact.svg" alt="" width="28" height="28">
            <span class="shell-sidebar__name"><span class="shell-sidebar__brandname">Суть</span><span class="shell-sidebar__x">✕</span><span class="shell-sidebar__module">${esc(module)}</span></span></a>
          <div class="shell-sidebar__scroll scroll-area">
            ${compose ? `<div class="shell-action"><button class="shell-compose" ${compose.go ? `data-go="${compose.go}"` : ''} ${compose.act ? `data-act="${compose.act}"` : ''}>${I(compose.icon || 'plus')} ${esc(compose.label)}</button>
              <button class="shell-search-btn" data-act="palette" title="Поиск">${I('search')}</button></div>` : ''}
            <nav class="shell-nav">${navHtml}</nav>${aside}
          </div>
          <div class="shell-ws"><button class="shell-ws__current" data-act="toast" data-text="Рабочее пространство «Практика Анны Соколовой»"><span class="shell-ws__logo">А</span>
            <span class="shell-ws__info"><span class="shell-ws__name">Суть · Анна Соколова</span><span class="shell-ws__role">Специалист · проверен</span></span></button></div>
        </aside>
        <main class="cal-main scroll-area proto-main" id="main-content">${body}</main>
        ${rail(active)}
      </div>
    </div>`;
  }

  const videoNav = (on) => [
    { icon: 'grid', label: 'Обзор', go: 'hub', on: on === 'hub' },
    { icon: 'broadcast', label: 'Сейчас идёт', go: 'stage', live: true },
    { icon: 'calendar', label: 'Запланировано', go: 'hub', count: 5 },
    { icon: 'presentation', label: 'Эфиры', go: 'event', on: on === 'event', count: 2 },
    { icon: 'play', label: 'Записи', go: 'recordings', on: on === 'recordings', count: 48 },
    { icon: 'chart-bar', label: 'Отчёты', go: 'report', on: on === 'report' },
    { section: 'Комнаты' },
    { icon: 'door', label: 'Кабинет Анны', go: 'call' },
    { icon: 'users', label: 'Группа «Опора»', go: 'meeting' },
    { icon: 'leaf', label: 'Практики', go: 'practice' },
    { section: 'Настройки' },
    { icon: 'template', label: 'Шаблоны встреч', go: 'new', on: on === 'new' },
    { icon: 'sparkles', label: 'Юя и доверие', go: 'yuia', on: on === 'yuia' },
  ];

  // ── всплывающие сообщения, окна ──────────────────────────────────────────
  function toast(text, { undo, icon = 'check-circle', tone = '' } = {}) {
    const host = $('#toasts');
    const el = document.createElement('div');
    el.className = `ptoast ${tone}`;
    el.innerHTML = `${I(icon)}<span>${text}</span>${undo ? '<button class="ptoast__undo">Отменить</button>' : ''}`;
    host.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-in'));
    if (undo) el.querySelector('.ptoast__undo').onclick = () => { undo(); el.remove(); toast('Отменено — всё вернулось как было', { icon: 'undo' }); };
    setTimeout(() => { el.classList.remove('is-in'); setTimeout(() => el.remove(), 300); }, undo ? 6000 : 3600);
  }

  function modal(html, { wide = false, dark = false, cls = '' } = {}) {
    closeModal(true);
    const el = document.createElement('div');
    el.className = 'pmodal-wrap';
    el.innerHTML = `<div class="pmodal-backdrop" data-act="close-modal"></div><div class="pmodal ${wide ? 'pmodal--wide' : ''} ${cls}" ${dark ? 'data-theme="dark"' : ''} role="dialog">
      <button class="pmodal__x" data-act="close-modal" aria-label="Закрыть">${I('x', 'md')}</button>${html}</div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-in'));
    return el;
  }
  function closeModal(instant) {
    $$('.pmodal-wrap').forEach((el) => { if (instant) el.remove(); else { el.classList.remove('is-in'); setTimeout(() => el.remove(), 200); } });
  }

  // ── глобальные действия ─────────────────────────────────────────────────
  const globalActs = {
    'close-modal': () => closeModal(),
    toast: (el) => toast(esc(el.dataset.text)),
    drawer: () => document.body.classList.toggle('proto-drawer-open'),
    palette: () => modal(`<div class="palette"><div class="palette__in">${I('search', 'md')}<input autofocus placeholder="Найти встречу, запись, клиента, фразу в расшифровке…"></div>
      <div class="eyebrow">Быстрые действия</div>
      ${[['video', 'Начать встречу сейчас', 'call'], ['broadcast', 'Новый эфир из шаблона', 'new'], ['play', 'Записи: «панические атаки ночью» — 3 совпадения в расшифровках', 'recording'], ['user', 'Мария Иванова — карточка клиента', 'client'], ['sparkles', 'Юя: уровни доверия', 'yuia']]
        .map(([i, t, g]) => `<a class="palette__row" data-go="${g}">${I(i)}<span>${t}</span>${I('arrow-right', 'xs')}</a>`).join('')}</div>`),
  };

  document.addEventListener('click', (ev) => {
    const g = ev.target.closest('[data-go]');
    if (g && !ev.target.closest('[data-act]:not([data-go])')) {
      ev.preventDefault();
      document.body.classList.remove('proto-drawer-open');
      const p = g.dataset.params ? Object.fromEntries(new URLSearchParams(g.dataset.params)) : undefined;
      go(g.dataset.go, p);
      return;
    }
    const a = ev.target.closest('[data-act]');
    if (!a) return;
    const name = a.dataset.act;
    const fn = (current && current.acts && current.acts[name]) || globalActs[name] || ROOM_ACTS[name];
    if (fn) { ev.preventDefault(); fn(a, ev); }
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeModal();
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') { ev.preventDefault(); globalActs.palette(); }
    if (ev.target.matches('input, textarea, [contenteditable]')) return;
    if (ev.key === 'ArrowRight' && ev.altKey) step(1);
    if (ev.key === 'ArrowLeft' && ev.altKey) step(-1);
  });

  // действия комнат, общие для нескольких экранов (наполняются в room.js)
  const ROOM_ACTS = {};

  // ── панель прототипа ─────────────────────────────────────────────────────
  function step(d) {
    const list = screens.filter((s) => !s.hidden);
    const i = list.findIndex((s) => s === current);
    const n = list[(i + d + list.length) % list.length];
    go(n.id);
  }
  function updateConsole() {
    const list = screens.filter((s) => !s.hidden);
    const i = list.indexOf(current);
    $('#pc-title').textContent = current.title;
    $('#pc-count').textContent = `${i + 1} / ${list.length}`;
  }
  function screenList() {
    const groups = {};
    screens.filter((s) => !s.hidden).forEach((s) => { (groups[s.group] = groups[s.group] || []).push(s); });
    return Object.entries(groups).map(([g, items]) => `<div class="pc-group"><div class="eyebrow">${esc(g)}</div>
      ${items.map((s) => `<a class="pc-item ${s === current ? 'is-on' : ''}" data-go="${s.id}">${I(s.icon || 'dot')}<span>${esc(s.title)}</span>${s.phase ? `<em>${esc(s.phase)}</em>` : ''}</a>`).join('')}</div>`).join('');
  }
  function mountConsole() {
    const pc = document.createElement('div');
    pc.className = 'pc';
    pc.innerHTML = `<button class="pc__btn" data-pc="prev" title="Предыдущий экран (Alt ←)">${I('chevron-left')}</button>
      <button class="pc__main" data-pc="list"><span class="pc__dot"></span><span id="pc-title">…</span><span id="pc-count" class="pc__count"></span></button>
      <button class="pc__btn" data-pc="next" title="Следующий экран (Alt →)">${I('chevron-right')}</button>
      <button class="pc__btn" data-pc="info" title="Что это за экран">${I('info-circle')}</button>
      <button class="pc__btn" data-pc="theme" title="Светлая / тёмная тема">${I('moon')}</button>
      <div class="pc__panel"><div class="pc__panel-head"><b>Видеомодуль 2.0 · прототип</b><a data-go="map">Карта экранов</a></div><div class="pc__list"></div></div>`;
    document.body.appendChild(pc);
    pc.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-pc]');
      if (!b) return;
      const k = b.dataset.pc;
      if (k === 'prev') step(-1);
      if (k === 'next') step(1);
      if (k === 'list') { pc.classList.toggle('is-open'); pc.querySelector('.pc__list').innerHTML = screenList(); }
      if (k === 'theme') { S.theme = S.theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = S.theme; }
      if (k === 'info') modal(`<div class="eyebrow eyebrow--accent">${esc(current.group)}${current.phase ? ' · ' + esc(current.phase) : ''}</div>
        <h2 class="pmodal__title">${esc(current.title)}</h2><p class="pmodal__lead">${esc(current.desc || '')}</p>
        ${current.plan ? `<div class="pmodal__note">${I('book')} В плане: ${esc(current.plan)}</div>` : ''}
        ${current.tips ? `<div class="eyebrow">Что попробовать</div><ul class="plist">${current.tips.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}`);
    });
    document.addEventListener('click', (ev) => { if (!ev.target.closest('.pc')) pc.classList.remove('is-open'); });
  }

  // ── запуск ───────────────────────────────────────────────────────────────
  async function boot() {
    const sprites = await Promise.all(['icons.svg', 'proto-icons.svg'].map((u) => fetch(u).then((r) => r.text()).catch(() => '')));
    const holder = document.createElement('div');
    holder.style.display = 'none';
    holder.innerHTML = sprites.map((s) => s.replace(/<\?xml[^>]*>/, '')).join('');
    document.body.prepend(holder);
    $$('symbol', holder).forEach((s) => { /* proto ids are known for completeness */ });
    try { const t = localStorage.getItem('v2proto-theme'); if (t) { S.theme = t; } } catch (e) {}
    document.documentElement.dataset.theme = S.theme;
    new MutationObserver(() => { try { localStorage.setItem('v2proto-theme', document.documentElement.dataset.theme); } catch (e) {} })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    mountConsole();
    window.addEventListener('hashchange', render);
    render();
  }

  window.P = { D, S, $, $$, esc, rub, num, I, av, person, add, go, every, later, onLeave, shell, videoNav, toast, modal, closeModal, ROOM_ACTS, screens, get current() { return current; } };
  document.addEventListener('DOMContentLoaded', boot);
})();

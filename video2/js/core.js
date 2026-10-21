/* Ядро прототипа, редакция 2: экраны, маршруты, оболочка, общие элементы интерфейса. */
(function () {
  const D = window.DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const S = { offerLive: null, raised: D.donationGoal.raised, trust: 'reversible', moneyTrust: false, camStream: null, theme: 'light', paidNext: false, live: false };

  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rub = (n) => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
  const num = (n) => n.toLocaleString('ru-RU');
  const I = (name, size = 'sm', cls = '') => {
    const px = { xs: 14, sm: 18, md: 20, lg: 24, xl: 32 }[size] || 18;
    return `<svg class="icon ${cls}" width="${px}" height="${px}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#${name}"></use></svg>`;
  };
  const person = (id) => D.people[id] || { name: 'Гость', short: 'Гость', photo: '' };
  const av = (id, size = 40, cls = '') => { const p = person(id); return `<span class="av ${cls}" style="--s:${size}px">${p.photo ? `<img src="${p.photo}" alt="" loading="lazy">` : `<b>${esc((p.short || '?')[0])}</b>`}</span>`; };

  // ── небольшие строительные блоки ──────────────────────────────────────
  const attrs = (o = {}) => `${o.go ? `data-go="${o.go}"` : ''} ${o.params ? `data-params="${o.params}"` : ''} ${o.act ? `data-act="${o.act}"` : ''} ${o.data || ''}`;
  // разметка несёт и класс компонента продукта (ButtonComponent, ChipComponent, StatCard, Tabs, Segmented,
  // undo-toast) — разработчик видит, какой компонент брать; размеры и мелочи — классы прототипа
  const BTN = { primary: 'btn--primary', white: 'btn--secondary', ghost: 'btn--ghost', danger: 'btn--danger' };
  const CHIP = { ok: 'chip--success', warn: 'chip--warning', bad: 'chip--danger', accent: 'chip--accent', live: 'chip--danger' };
  const btn = (label, o = {}) => `<button class="btn ${BTN[o.kind] || 'btn--secondary'} btn2 ${o.kind ? 'btn2--' + o.kind : ''} ${o.size ? 'btn2--' + o.size : ''} ${o.block ? 'btn2--block' : ''} ${o.cls || ''}" ${attrs(o)} ${o.id ? `id="${o.id}"` : ''}>${o.icon ? I(o.icon) : ''}${label ? `<span>${label}</span>` : ''}</button>`;
  const chip = (t, tone = '') => `<span class="chip ${CHIP[tone] || 'chip--muted'} chip2 ${tone ? 'chip2--' + tone : ''}">${t}</span>`;
  const sw = (on, o = {}) => `<button class="sw ${on ? 'is-on' : ''}" data-act="${o.act || 'sw'}" ${o.text ? `data-text="${esc(o.text)}"` : ''} aria-label="переключатель"></button>`;
  const opt = (t, s, on, o = {}) => `<div class="opt"><div class="opt__m"><div class="opt__t">${t}</div>${s ? `<div class="opt__s">${s}</div>` : ''}</div>${sw(on, o)}</div>`;
  const seg = (items, on = 0, act = 'seg', o = {}) => `<div class="segmented seg2 ${o.block ? 'seg2--block' : ''}">${items.map((x, i) => { const [label, val] = Array.isArray(x) ? x : [x, i]; return `<button class="segmented__option ${i === on ? 'is-on' : ''}" data-act="${act}" data-v="${val}">${label}</button>`; }).join('')}</div>`;
  const pick = (items, on = 0, act = 'pick') => `<div class="pick">${items.map((x, i) => `<button class="pick__i ${i === on ? 'is-on' : ''}" data-act="${act}" data-v="${x.v ?? i}"><span class="pick__r"></span><span><span class="pick__t">${x.t}</span>${x.s ? `<span class="pick__s" style="display:block">${x.s}</span>` : ''}</span></button>`).join('')}</div>`;
  const li = (o) => `<div class="li ${o.go || o.act ? 'li--click' : ''}" ${attrs(o)}>${o.lead || ''}<div class="li__m"><div class="li__t">${o.t}</div>${o.s ? `<div class="li__s">${o.s}</div>` : ''}</div>${o.right || ''}</div>`;
  const kpi = (l, v, s = '') => `<div class="card kpi stat-card"><div class="kpi__l stat-card__label">${l}</div><div class="kpi__v stat-card__value">${v}</div>${s ? `<div class="kpi__s">${s}</div>` : ''}</div>`;
  const tile = (o) => `<button class="tile-a ${o.primary ? 'tile-a--primary' : ''}" ${attrs(o)}><span class="tile-a__i">${I(o.icon, 'lg')}</span><span><span class="tile-a__t" style="display:block">${o.t}</span>${o.s ? `<span class="tile-a__s" style="display:block">${o.s}</span>` : ''}</span></button>`;
  const tabs = (key, items, on = 0) => `<div class="tabs tabs2" data-tabs="${key}">${items.map((x, i) => `<button class="tabs__tab ${i === on ? 'is-on tabs__tab--current' : ''}" data-act="tab" data-pane="${i}">${x}</button>`).join('')}</div>`;
  const pane = (key, i, html, on = 0) => `<div data-pane-of="${key}" data-pane="${i}" ${i === on ? '' : 'hidden'}>${html}</div>`;
  const yuNote = (html, extra = '') => `<div class="yu-note"><span class="yu2">${I('sparkles')}</span><div class="yu-note__b">${html}</div>${extra}</div>`;
  const note = (icon, html) => `<div class="note">${I(icon)}<div>${html}</div></div>`;
  const page = (o) => `<div class="page ${o.wide ? 'page--wide' : ''} ${o.narrow ? 'page--narrow' : ''}">${o.crumbs ? `<div class="crumbs">${o.crumbs}</div>` : ''}<div class="phead"><div class="phead__t"><h1 class="h1">${o.title}</h1>${o.sub ? `<div class="phead__sub">${o.sub}</div>` : ''}</div>${o.actions ? `<div class="row row--wrap">${o.actions}</div>` : ''}</div>${o.body}</div>`;

  // ── реестр экранов и маршруты ─────────────────────────────────────────
  const screens = [];
  const byId = {};
  // def.after — поставить экран сразу после родственного, чтобы стрелки листали по смыслу
  const add = (def) => { const i = def.after ? screens.findIndex((x) => x.id === def.after) : -1; if (i >= 0) { let j = i + 1; while (screens[j] && screens[j].after === def.after) j++; screens.splice(j, 0, def); } else screens.push(def); byId[def.id] = def; };
  let current = null, timers = [], cleanups = [];
  const every = (ms, fn) => { const h = setInterval(fn, ms); timers.push(h); return h; };
  const later = (ms, fn) => { const h = setTimeout(fn, ms); timers.push(h); return h; };
  const onLeave = (fn) => cleanups.push(fn);
  const parseHash = () => { const h = location.hash.replace(/^#\/?/, ''); const [id, q] = h.split('?'); return { id: id || 'map', params: Object.fromEntries(new URLSearchParams(q || '')) }; };
  const go = (id, params) => { const t = `#/${id}${params ? '?' + new URLSearchParams(params) : ''}`; if (location.hash === t) render(); else location.hash = t; };

  function render() {
    timers.forEach((h) => { clearInterval(h); clearTimeout(h); }); timers = [];
    cleanups.forEach((f) => { try { f(); } catch (e) { console.error(e); } }); cleanups = [];
    closeModal(true);
    document.body.classList.remove('drawer-open');
    const yp = $('#yuia-panel'); if (yp) yp.dataset.state = 'closed';
    const { id, params } = parseHash();
    const def = byId[id] || byId.map;
    current = def; def.params = params;
    let html = def.render(params);
    if (def.frame === 'phone') html = `<div class="stagep"><div class="stagep__cap"><div class="t-sm muted">${esc(def.group)}</div><h2 class="h1">${esc(def.title)}</h2><p>${esc(def.desc || '')}</p>${def.pair ? btn('Тот же экран на компьютере', { icon: 'device-desktop', go: def.pair, kind: 'white' }) : ''}</div><div class="phone2"><div class="phone2__notch"></div><div class="phone2__scr" ${def.dark ? 'data-theme="dark"' : ''}>${html}</div></div></div>`;
    const root = $('#app'); root.innerHTML = html; window.scrollTo(0, 0);
    document.title = `${def.title} · Видеомодуль 2.0`;
    try { def.mount && def.mount(root, params); } catch (e) { console.error(e); }
    P.fitBar && P.fitBar();
    updateNav();
  }

  // ── оболочка — разметка продукта, а не своя ───────────────────────────
  // Классы и порядок взяты из the-essence develop: Shell::SidebarHeaderComponent,
  // Shell::SidebarActionComponent, .shell-nav, Shell::AppRailComponent (MODULES), Shell::YuiaPanelComponent,
  // .wg-launcher поддержки. Стили — css/ds/shell.css, копия продукта. Новые модули плана
  // (§ 1.8) стоят в рельсе рядом с родственными действующими и помечены isNew.
  const RAIL = [
    { icon: 'home', key: 'dashboard', label: 'Главная', hint: 'Главная платформы уже работает. Видео кладёт на неё карточку ближайшей встречи с кнопкой «Войти».' },
    { icon: 'square-check', key: 'tasks', label: 'Задачи · PM', hint: 'Задачник уже работает. Договорённости из итогов встречи Юя ставит сюда задачами со ссылкой на момент записи.', go: 'touchpoints' },
    { icon: 'mail', key: 'mail', label: 'Почта', hint: 'Почта уже работает. Приглашения, напоминания и итоги встречи уходят из вашего ящика.' },
    { icon: 'messenger', key: 'messenger', label: 'Мессенджер', go: 'messenger', isNew: true },
    { icon: 'sparkles', key: 'yuia', label: 'Юя', act: 'yuiapanel', yuia: true },
    { icon: 'calendar', key: 'calendar', label: 'Календарь', hint: 'Календарь уже работает. Каждая встреча видео — его событие, кнопка «Войти» стоит прямо в событии.', go: 'touchpoints' },
    { icon: 'video', key: 'video', label: 'Видео', go: 'hub' },
    { icon: 'users', key: 'crm', label: 'CRM и сценарии', go: 'scenarios' },
    { icon: 'receipt', key: 'sales', label: 'Продажи', go: 'sales', isNew: true },
    { icon: 'template', key: 'pages', label: 'Страницы и рассылки', go: 'pages', isNew: true },
    { icon: 'graduation-cap', key: 'school', label: 'Школа', go: 'school', isNew: true },
    { icon: 'book', key: 'kb', label: 'База знаний', hint: 'База знаний уже работает. Конспект и главы встречи ложатся в неё документом.', go: 'touchpoints' },
    { icon: 'file-text', key: 'reports', label: 'Отчёты', go: 'analytics' },
  ];
  const BELL = [
    ['wallet', 'success', 'Оплата 4 500 ₽ · Мария Иванова', 'Сессия завтра в 10:00 · через ЮKassa', '2 мин'],
    ['door', 'accent', 'Гость ждёт в зале ожидания', 'Кабинет Анны · пустить или написать', '5 мин'],
    ['square-check', 'muted', '3 задачи из итогов встречи', 'Супервизия «Опора» · срок пятница', '1 ч'],
  ];
  const railItem = (m, active) => {
    const tip = `<span class="shell-apprail__tip" aria-hidden="true">${m.label}${m.isNew ? ' · новый модуль' : ''}</span>`;
    const cls = `shell-apprail__item ${m.yuia ? 'shell-apprail__item--yuia' : ''} ${m.key === active ? 'is-active' : ''} ${m.isNew ? 'is-new' : ''}`;
    const act = m.act ? `data-act="${m.act}"` : m.hint ? `data-act="railhint" data-text="${esc(m.hint)}" ${m.go ? `data-to="${m.go}"` : ''}` : `data-go="${m.go}"`;
    return `<a class="${cls}" ${act} aria-label="${esc(m.label)}" ${m.key === active ? 'aria-current="page"' : ''}>${I(m.icon, 'md')}${tip}</a>`;
  };
  const bellMenu = () => `<div class="shell-bell__menu" role="menu"><div class="shell-bell__head"><span class="shell-bell__heading">Уведомления</span><button class="shell-bell__markall" data-act="bellread" title="Прочитать все">${I('list-check')}</button></div>
    <div class="shell-bell__list">${BELL.map(([ic, tone, t, s, w]) => `<div class="shell-bell__row is-unread"><span class="shell-bell__row-flag"></span><a class="shell-bell__row-main" data-go="${ic === 'door' ? 'call' : ic === 'wallet' ? 'sales' : 'end'}"><span class="shell-bell__icon shell-bell__icon--${tone}">${I(ic)}</span><span class="shell-bell__row-body"><span class="shell-bell__row-title">${t}</span><span class="shell-bell__row-sub">${s}</span><span class="shell-bell__row-time">${w} назад</span></span></a></div>`).join('')}</div></div>`;
  const profileMenu = () => `<div class="shell-menu shell-menu--rail" role="menu"><div class="shell-menu__head">${av('anna', 42)}<div style="min-width:0"><div class="shell-menu__name">Анна Соколова</div><div class="shell-menu__email">anna@the-essence.ai</div></div></div><div class="shell-menu__div"></div>
    <a class="shell-menu__item" data-go="specialist-page">${I('user')} Публичная страница</a><a class="shell-menu__item" data-go="yuia">${I('sparkles')} Юя и доверие</a><a class="shell-menu__item" data-go="privacy">${I('shield-check')} Приватность</a><div class="shell-menu__div"></div><a class="shell-menu__item shell-menu__item--danger" data-act="toast" data-text="В прототипе выход не нужен">${I('log-out')} Выйти</a></div>`;
  function shell({ module, active, compose, nav = [], body, search }) {
    if (current) current.shellActive = active;
    // надпись над заголовком, как в продукте («ВИДЕО · ЗАПИСИ»): если экран не задал свою
    if (!/class="phead__t"><span class="eyebrow/.test(body) && !/class="crumbs/.test(body)) { const on = nav.find((n) => n.on); const tail = on ? on.label : (current && current.eyebrow) || ''; body = body.replace('<div class="phead__t">', `<div class="phead__t"><span class="eyebrow">${esc(module)}${tail && tail !== module ? ' · ' + esc(tail) : ''}</span>`); }
    const navHtml = nav.map((n) => n.sec ? `<div class="shell-nav-label"><span>${n.sec}</span></div>` : `<a class="shell-nav__item ${n.on ? 'is-active' : ''}" ${n.go || n.act ? attrs(n) : n.on ? `data-go="${current.id}"` : `data-act="toast" data-text="Раздел «${esc(n.label)}» в прототипе не нарисован — открыт главный экран модуля"`}><span class="shell-nav__icon">${I(n.icon)}</span><span class="shell-nav__label">${n.label}</span>${n.live ? '<span class="shell-nav__badge shell-nav__badge--live">LIVE</span>' : ''}${n.count != null ? `<span class="shell-nav__count">${n.count}</span>` : ''}</a>`).join('');
    const brand = `<a class="shell-sidebar__brand" data-go="map"><img class="shell-sidebar__mark" src="seal-compact.svg" alt="" width="28" height="28"><span class="shell-sidebar__name"><span class="shell-sidebar__brandname">Суть</span> <span class="shell-sidebar__x" aria-hidden="true">✕</span> <span class="shell-sidebar__module">${module}</span></span></a>`;
    const searchBtn = `<button type="button" class="shell-search-btn shell-search-btn--wide" data-act="palette" aria-label="${esc(search || 'Поиск')}">${I('search')}<span class="shell-search-btn__ph">${esc(search || (module === 'Видео' ? 'Поиск встреч, записей, людей' : `Поиск: ${module.toLowerCase()}`))}</span><kbd class="shell-search-btn__kbd" aria-hidden="true">/</kbd></button>`;
    const composeHtml = compose ? `<a class="shell-compose" ${attrs(compose)}>${I(compose.icon || 'plus')}<span>${compose.label}</span></a>` : '';
    // плашки пространства (.shell-ws) нет: у специалиста в видео одно пространство — переключать нечего (решение Юрия 21.10)
    const rail = `<nav class="shell-apprail" aria-label="Модули">
      <div class="shell-apprail__profile"><button type="button" class="shell-apprail__item shell-apprail__item--profile" data-act="railmenu" aria-label="Анна Соколова"><span class="shell-avatar">${person('anna').photo ? `<img class="shell-avatar__img" src="${person('anna').photo}" alt="">` : 'А'}</span></button>${profileMenu()}</div>
      <div class="shell-apprail__bell"><div class="shell-bell"><button type="button" class="shell-bell__trigger" data-act="railmenu" aria-label="Уведомления">${I('bell', 'md')}<span class="shell-bell__badge"><span class="shell-bell__count">${BELL.length}</span></span></button>${bellMenu()}</div></div>
      <div class="shell-apprail__div" aria-hidden="true"></div>
      ${RAIL.map((m) => railItem(m, active)).join('')}
      <span class="shell-apprail__spacer"></span>
      <div class="shell-apprail__div" aria-hidden="true"></div>
      ${active === 'admin' ? railItem({ icon: 'shield-check', key: 'admin', label: 'Админка', go: 'ops' }, active) : ''}
      ${railItem({ icon: 'message-circle', key: 'support', label: 'Помощь', hint: 'Помощь платформы: справка и чат с командой — тот же, что за круглой кнопкой внизу.' }, active)}
      ${railItem({ icon: 'settings', key: 'settings', label: 'Настройки модуля', go: active === 'video' ? 'new' : 'privacy' }, active)}
    </nav>`;
    const mobile = `<header class="mshell" role="banner"><button type="button" class="mshell__btn" data-act="drawer" aria-label="Открыть меню">${I('menu', 'md')}</button><span class="mshell__label">${module}</span><span class="mshell__end"><button type="button" class="mshell__btn" data-act="modswitch" aria-label="Модули">${I('layout-grid', 'md')}</button><button type="button" class="mshell__btn" data-act="toast" data-text="${BELL.length} новых: оплата, гость в зале ожидания, задачи из итогов" aria-label="Уведомления">${I('bell', 'md')}<span class="mshell__dot"></span></button><a class="mshell__btn" data-go="specialist-page" aria-label="Профиль"><span class="shell-avatar" style="width:30px;height:30px">${person('anna').photo ? `<img class="shell-avatar__img" src="${person('anna').photo}" alt="">` : 'А'}</span></a></span></header>`;
    return `<div class="cal-app">${mobile}<div class="shell-drawer-overlay" data-act="drawer"></div><div class="cal-body">
      <aside class="shell-sidebar">${brand}<div class="shell-sidebar__scroll">${searchBtn}${composeHtml}<nav class="shell-nav">${navHtml}</nav></div></aside>
      <main class="cal-main" id="main">${body}</main>${rail}</div>
      <button type="button" class="wg-launcher" data-act="toast" data-text="Чат поддержки платформы — общий для всех модулей" aria-label="Поддержка">${I('message-circle', 'lg')}</button></div>`;
  }

  // ── шторка Юи — Shell::YuiaPanelComponent продукта (.yuia, yuia/_panel.css) ──────────
  // Юя — это чат. Итоги встречи приходят сюда: платформа сама пишет Юе «встреча закончилась,
  // вот расшифровка», Юя делает итоги, кладёт конспект в базу знаний и отвечает здесь.
  const YC = [
    { me: true, t: 'Подготовь меня к встрече с Марией' },
    { t: 'Девятая встреча. В прошлый раз — страх оценки и отказ коллеге 19 октября. Анкета сегодня 6 из 10 (неделю назад 4). Спросите, как прошла планёрка в четверг.' },
    { auto: true, t: 'Встреча закончилась · Мария Иванова · 9-я встреча · 58 мин', s: 'Расшифровка готова — каждый говорящий отдельно' },
    { t: 'Итоги готовы: запрос, темы, техники, динамика и цитаты. Конспект положила в базу знаний → «Клиенты / Мария И.». Поставила задачу «Подобрать статьи о дыхательных практиках» на пятницу.', acts: [['Итоги', 'end'], ['Конспект', 'touchpoints'], ['Запись', 'recording']] },
  ];
  const ycRow = (m) => m.auto ? `<div class="yc__auto">${I('video', 'sm')}<div><b>${m.t}</b><div class="t-xs muted">${m.s} · автосообщение платформы</div></div></div>`
    : `<div class="yc__m ${m.me ? 'yc__m--me' : ''}">${m.t}${m.acts ? `<div class="row row--wrap mt8" style="gap:6px">${m.acts.map(([t, g]) => `<a class="chip chip--accent chip2 chip2--accent" data-go="${g}">${t}</a>`).join('')}</div>` : ''}</div>`;
  function yuiaPanel() {
    let el = $('#yuia-panel');
    if (!el) {
      el = document.createElement('div'); el.className = 'yuia'; el.id = 'yuia-panel'; el.dataset.state = 'closed'; el.dataset.cabinet = 'ready';
      el.innerHTML = `<div class="yuia__scrim" data-act="yuiapanel"></div><aside class="yuia__surface" role="dialog" aria-label="Юя">
        <header class="yuia__head"><span class="yuia__brand"><img class="yuia__seal" src="seal-compact.svg" alt="" width="24" height="24"><span class="yuia__name">Юя</span><span class="yuia__role">Ассистент</span></span>
          <span class="yuia__actions"><button type="button" class="yuia__icon-btn" data-act="toast" data-text="Чат с Юей откроется в отдельном окне" title="Открыть в отдельном окне">${I('external-link', 'sm')}</button><button type="button" class="yuia__icon-btn" data-act="yuiapanel" title="Закрыть">${I('x', 'sm')}</button></span></header>
        <div class="yuia__body"><div class="yc" id="yc">${YC.map(ycRow).join('')}</div></div>
        <div class="yuia__foot yc__foot"><input class="in" id="yc-in" placeholder="Спросите Юю…" aria-label="Сообщение Юе">${btn('', { icon: 'send', kind: 'primary', act: 'ycsend', cls: 'btn2--icon' })}</div></aside>`;
      document.body.appendChild(el);
      $('#yc-in', el).addEventListener('keydown', (e) => { if (e.key === 'Enter') GLOBAL.ycsend(); });
    }
    const open = el.dataset.state !== 'open';
    el.dataset.state = open ? 'open' : 'closed';
    if (open) { const b = $('#yc', el); b.scrollTop = b.scrollHeight; setTimeout(() => $('#yc-in', el)?.focus(), 200); }
  }
  // командная палитра — как «/» и ⌘K в продукте: экраны, люди, действия
  function palette() {
    const m = modal(`<div class="cmdk"><div class="cmdk__in">${I('search', 'md')}<input class="cmdk__q" placeholder="Встречи, записи, люди, экраны…" aria-label="Поиск" autofocus><kbd class="kbd">Esc</kbd></div><div class="cmdk__list"></div></div>`);
    const q = $('.cmdk__q', m), list = $('.cmdk__list', m);
    // одно окно на всё: встречи, записи, люди и экраны — как палитра «/» продукта
    const ALL = [
      ...D.sessions.map((x) => ({ t: x.title, g: `встреча · ${x.day} ${x.time}`, icon: 'calendar', go: x.kind === 'stage' ? 'event' : x.kind === 'call' ? 'prejoin' : x.kind })),
      ...D.recordings.map((x) => ({ t: x.title, g: `запись · ${x.date}`, icon: 'play', go: 'recording' })),
      ...Object.values(D.people).filter((x) => x.role).map((x) => ({ t: x.name, g: `человек · ${x.role}`, icon: 'user', go: x.id === 'maria' ? 'messenger' : 'specialist-page' })),
      ...visible().map((x) => ({ t: x.title, g: `экран · ${x.group}`, icon: x.icon || 'dot', go: x.id })),
    ];
    const rows = () => { const s = q.value.trim().toLowerCase(); const hit = ALL.filter((x) => !s || (x.t + ' ' + x.g).toLowerCase().includes(s)).slice(0, 10);
      list.innerHTML = hit.length ? hit.map((x, i) => `<a class="cmdk__row ${i ? '' : 'is-on'}" data-go="${x.go}">${I(x.icon)}<span class="sp">${esc(x.t)}</span><span class="cmdk__grp">${esc(x.g)}</span></a>`).join('') : '<div class="cmdk__empty">Ничего не нашлось</div>'; };
    q.addEventListener('input', rows); q.addEventListener('keydown', (e) => {
      const all = $$('.cmdk__row', list), i = all.findIndex((r) => r.classList.contains('is-on'));
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const n = all[(i + (e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length]; all.forEach((r) => r.classList.toggle('is-on', r === n)); n && n.scrollIntoView({ block: 'nearest' }); }
      if (e.key === 'Enter') { const r = all[i] || all[0]; r && go(r.dataset.go); }
    });
    rows(); setTimeout(() => q.focus(), 30);
  }
  // мобильная панель модулей — Shell::MobileModuleSwitcherComponent
  const modSwitch = () => modal(`<div class="modal2__t">Модули</div><div class="mswitch">${RAIL.map((m) => `<a class="mswitch__i ${m.key === (current.shellActive || '') ? 'is-on' : ''}" ${m.act ? `data-act="${m.act}"` : m.hint ? `data-act="railhint" data-text="${esc(m.hint)}" ${m.go ? `data-to="${m.go}"` : ''}` : `data-go="${m.go}"`}><span class="mswitch__ic">${I(m.icon, 'md')}</span><span>${m.label}</span>${m.isNew ? '<span class="mswitch__new">новый</span>' : ''}</a>`).join('')}</div>`);
  // пункты — как в video/shared/_sidebar продукта (Обзор · Сейчас идёт · Запланировано · Записи) + новое по плану
  const videoNav = (on) => [
    { icon: 'grid', label: 'Обзор', go: 'hub', on: on === 'hub' },
    { icon: 'video', label: 'Сейчас идёт', go: 'stage', live: true },
    { icon: 'calendar', label: 'Запланировано', go: 'new', on: on === 'new', count: 4 },
    { icon: 'play', label: 'Записи', go: 'recordings', on: on === 'recordings', count: 48 },
    { icon: 'presentation', label: 'Эфиры', go: 'event', on: on === 'event', count: 2 },
    { icon: 'chart-bar', label: 'Отчёты', go: 'report', on: on === 'report' },
    { sec: 'Комнаты' },
    { icon: 'door', label: 'Кабинет Анны', go: 'call' },
    { icon: 'users', label: 'Группа «Опора»', go: 'meeting' },
    { sec: 'Настройки' },
    { icon: 'template', label: 'Шаблоны встреч', go: 'new', params: 'tpl=call' },
    { icon: 'sparkles', label: 'Юя и доверие', go: 'yuia', on: on === 'yuia' },
  ];

  // ── всплывающие и окна ────────────────────────────────────────────────
  function toast(text, { undo, icon = 'check-circle' } = {}) {
    const el = document.createElement('div'); el.className = 'undo-toast ptoast';
    el.innerHTML = `${I(icon)}<span>${text}</span>${undo ? '<button class="ptoast__undo">Отменить</button>' : ''}`;
    $('#toasts').appendChild(el); requestAnimationFrame(() => el.classList.add('is-in'));
    if (undo) el.querySelector('.ptoast__undo').onclick = () => { undo(); el.remove(); toast('Отменено', { icon: 'undo' }); };
    setTimeout(() => { el.classList.remove('is-in'); setTimeout(() => el.remove(), 300); }, undo ? 6000 : 3800);
  }
  function modal(html, { wide = false, dark = false } = {}) {
    closeModal(true);
    const el = document.createElement('div'); el.className = 'mwrap';
    el.innerHTML = `<div class="mback" data-act="close-modal"></div><div class="modal2 ${wide ? 'modal2--wide' : ''}" ${dark ? 'data-theme="dark"' : ''} role="dialog"><button class="modal2__x" data-act="close-modal" aria-label="Закрыть">${I('x', 'md')}</button>${html}</div>`;
    document.body.appendChild(el); requestAnimationFrame(() => el.classList.add('is-in'));
    return el;
  }
  function closeModal(instant) { $$('.mwrap').forEach((el) => { if (instant) el.remove(); else { el.classList.remove('is-in'); setTimeout(() => el.remove(), 180); } }); }

  // ── общие действия ────────────────────────────────────────────────────
  const tabAct = (el) => { const box = el.closest('[data-tabs]'); const key = box.dataset.tabs; $$('button', box).forEach((t) => { t.classList.toggle('is-on', t === el); t.classList.toggle('tabs__tab--current', t === el); }); $$(`[data-pane-of="${key}"]`).forEach((p) => (p.hidden = p.dataset.pane !== el.dataset.pane)); };
  const segAct = (el) => $$('button', el.parentElement).forEach((b) => b.classList.toggle('is-on', b === el));
  const pickAct = (el) => $$('.pick__i', el.closest('.pick')).forEach((c) => c.classList.toggle('is-on', c === el));
  const swAct = (el) => { el.classList.toggle('is-on'); if (el.dataset.text && el.classList.contains('is-on')) toast(el.dataset.text); };
  const GLOBAL = {
    'close-modal': () => closeModal(), toast: (el) => toast(esc(el.dataset.text)), drawer: () => document.body.classList.toggle('drawer-open'),
    tab: tabAct, seg: segAct, pick: pickAct, sw: swAct,
    railmenu: (el) => { const box = el.parentElement.querySelector('.shell-bell__menu, .shell-menu'); const open = !box.classList.contains('is-open'); $$('.shell-apprail .is-open').forEach((x) => x.classList.remove('is-open')); box.classList.toggle('is-open', open); },
    bellread: (el) => { $$('.shell-bell__row.is-unread').forEach((r) => r.classList.remove('is-unread')); $('.shell-bell__badge')?.remove(); toast('Все уведомления прочитаны'); },
    railhint: (el) => { closeModal(true); toast(esc(el.dataset.text), { icon: 'info-circle' }); if (el.dataset.to) later(900, () => go(el.dataset.to)); },
    modswitch: () => modSwitch(),
    palette: () => palette(),
    yuiapanel: () => yuiaPanel(),
    ycsend: () => { const i = $('#yc-in'); if (!i || !i.value.trim()) return; const b = $('#yc'); b.insertAdjacentHTML('beforeend', ycRow({ me: true, t: esc(i.value) })); i.value = ''; b.scrollTop = b.scrollHeight; later(700, () => { b.insertAdjacentHTML('beforeend', ycRow({ t: 'Сделаю. Отвечу здесь же, когда будет готово — обычно меньше минуты.' })); b.scrollTop = b.scrollHeight; }); },
  };
  const ROOM_ACTS = {};
  document.addEventListener('click', (ev) => {
    if (!ev.target.closest('.shell-apprail__profile, .shell-bell')) $$('.shell-apprail .is-open').forEach((x) => x.classList.remove('is-open'));
    const a = ev.target.closest('[data-act]');
    const g = ev.target.closest('[data-go]');
    if (a && (!g || a.contains(g) === false || a === g) && a.dataset.act) {
      const fn = (current && current.acts && current.acts[a.dataset.act]) || ROOM_ACTS[a.dataset.act] || GLOBAL[a.dataset.act];
      if (fn) { ev.preventDefault(); fn(a, ev); return; }
    }
    if (g) { ev.preventDefault(); const p = g.dataset.params ? Object.fromEntries(new URLSearchParams(g.dataset.params)) : undefined; go(g.dataset.go, p); }
  });

  // ── навигация по прототипу ────────────────────────────────────────────
  const visible = () => screens.filter((s) => !s.hidden);
  function step(d) { const l = visible(); const i = l.indexOf(current); go(l[(i + d + l.length) % l.length].id); }
  function updateNav() { const l = visible(); $('#n-grp').textContent = current.group; $('#n-ttl').textContent = current.title; $('#n-n').textContent = `${l.indexOf(current) + 1}/${l.length}`; }
  function navList() {
    const groups = {}; visible().forEach((s) => (groups[s.group] = groups[s.group] || []).push(s));
    return Object.entries(groups).map(([g, items]) => `<div class="nav2__g">${esc(g)}</div>${items.map((s) => `<a class="nav2__it ${s === current ? 'is-on' : ''}" data-go="${s.id}">${I(s.icon || 'dot')}<span>${esc(s.title)}</span>${s.frame === 'phone' ? I('device-mobile', 'xs') : ''}</a>`).join('')}`).join('');
  }
  function mountNav() {
    const n = document.createElement('div'); n.className = 'nav2';
    n.innerHTML = `<span class="nav2__hint"><kbd>←</kbd><kbd>→</kbd> листать экраны</span>
      <button class="nav2__arrow" data-n="prev" title="Предыдущий экран (←)">${I('chevron-left', 'lg')}<span>Назад</span></button>
      <button class="nav2__mid" data-n="list" title="Все экраны"><span class="nav2__txt"><span class="nav2__grp" id="n-grp"></span><span class="nav2__ttl" id="n-ttl"></span></span><span class="nav2__n" id="n-n"></span>${I('chevron-up', 'sm')}</button>
      <button class="nav2__arrow" data-n="next" title="Следующий экран (→)"><span>Дальше</span>${I('chevron-right', 'lg')}</button>
      <div class="nav2__tools"><button class="nav2__tool" data-n="info" title="Что это за экран">${I('info-circle', 'md')}</button><button class="nav2__tool" data-n="theme" title="Светлая или тёмная тема">${I('moon', 'md')}</button><button class="nav2__tool" data-n="map" title="Карта экранов">${I('layout-grid', 'md')}</button></div>
      <div class="nav2__panel"></div>`;
    document.body.appendChild(n);
    n.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-n]'); if (!b) return; const k = b.dataset.n;
      if (k === 'prev') step(-1); if (k === 'next') step(1); if (k === 'map') go('map');
      if (k === 'list') { n.classList.toggle('is-open'); $('.nav2__panel', n).innerHTML = navList(); const on = $('.nav2__it.is-on', n); on && on.scrollIntoView({ block: 'center' }); }
      if (k === 'theme') { S.theme = S.theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = S.theme; try { localStorage.setItem('v2-theme', S.theme); } catch (e) {} }
      if (k === 'info') modal(`<div class="t-sm muted">${esc(current.group)}${current.phase ? ' · ' + esc(current.phase) : ''}</div><div class="modal2__t" style="margin-top:6px">${esc(current.title)}</div><div class="modal2__s">${esc(current.desc || '')}</div>${current.plan ? `<div class="note mt16">${I('book')}<div>В плане: ${esc(current.plan)}</div></div>` : ''}${current.tips ? `<div class="h3 mt24">Что попробовать</div><ul style="padding-left:20px;margin-top:8px;line-height:1.8">${current.tips.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}`);
    });
    document.addEventListener('click', (ev) => { if (!ev.target.closest('.nav2')) n.classList.remove('is-open'); else if (ev.target.closest('.nav2__it')) n.classList.remove('is-open'); });
  }
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { closeModal(); $('.nav2')?.classList.remove('is-open'); $$('.shell-apprail .is-open').forEach((x) => x.classList.remove('is-open')); }
    if (ev.target.closest && ev.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k' && $('.shell-search-btn')) { ev.preventDefault(); palette(); return; }
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.key === '/' && $('.shell-search-btn')) { ev.preventDefault(); palette(); return; }
    if (ev.key === 'ArrowRight') { ev.preventDefault(); step(1); }
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); step(-1); }
  });

  async function boot() {
    const sprites = await Promise.all(['icons.svg', 'proto-icons.svg'].map((u) => fetch(u).then((r) => r.text()).catch(() => '')));
    const h = document.createElement('div'); h.style.display = 'none'; h.innerHTML = sprites.map((s) => s.replace(/<\?xml[^>]*>/, '')).join(''); document.body.prepend(h);
    try { const t = localStorage.getItem('v2-theme'); if (t) S.theme = t; } catch (e) {}
    document.documentElement.dataset.theme = S.theme;
    mountNav(); window.addEventListener('hashchange', render); render();
  }

  window.P = { GLOBAL, D, S, $, $$, esc, rub, num, I, av, person, add, go, every, later, onLeave, shell, videoNav, toast, modal, closeModal, ROOM_ACTS, screens, btn, chip, sw, opt, seg, pick, li, kpi, tile, tabs, pane, yuNote, note, page, attrs, get current() { return current; } };
  document.addEventListener('DOMContentLoaded', boot);
})();

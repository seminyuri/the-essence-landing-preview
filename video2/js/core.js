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
  const btn = (label, o = {}) => `<button class="btn2 ${o.kind ? 'btn2--' + o.kind : ''} ${o.size ? 'btn2--' + o.size : ''} ${o.block ? 'btn2--block' : ''} ${o.cls || ''}" ${attrs(o)} ${o.id ? `id="${o.id}"` : ''}>${o.icon ? I(o.icon) : ''}${label ? `<span>${label}</span>` : ''}</button>`;
  const chip = (t, tone = '') => `<span class="chip2 ${tone ? 'chip2--' + tone : ''}">${t}</span>`;
  const sw = (on, o = {}) => `<button class="sw ${on ? 'is-on' : ''}" data-act="${o.act || 'sw'}" ${o.text ? `data-text="${esc(o.text)}"` : ''} aria-label="переключатель"></button>`;
  const opt = (t, s, on, o = {}) => `<div class="opt"><div class="opt__m"><div class="opt__t">${t}</div>${s ? `<div class="opt__s">${s}</div>` : ''}</div>${sw(on, o)}</div>`;
  const seg = (items, on = 0, act = 'seg', o = {}) => `<div class="seg2 ${o.block ? 'seg2--block' : ''}">${items.map((x, i) => { const [label, val] = Array.isArray(x) ? x : [x, i]; return `<button class="${i === on ? 'is-on' : ''}" data-act="${act}" data-v="${val}">${label}</button>`; }).join('')}</div>`;
  const pick = (items, on = 0, act = 'pick') => `<div class="pick">${items.map((x, i) => `<button class="pick__i ${i === on ? 'is-on' : ''}" data-act="${act}" data-v="${x.v ?? i}"><span class="pick__r"></span><span><span class="pick__t">${x.t}</span>${x.s ? `<span class="pick__s" style="display:block">${x.s}</span>` : ''}</span></button>`).join('')}</div>`;
  const li = (o) => `<div class="li ${o.go || o.act ? 'li--click' : ''}" ${attrs(o)}>${o.lead || ''}<div class="li__m"><div class="li__t">${o.t}</div>${o.s ? `<div class="li__s">${o.s}</div>` : ''}</div>${o.right || ''}</div>`;
  const kpi = (l, v, s = '') => `<div class="card kpi"><div class="kpi__l">${l}</div><div class="kpi__v">${v}</div>${s ? `<div class="kpi__s">${s}</div>` : ''}</div>`;
  const tile = (o) => `<button class="tile-a ${o.primary ? 'tile-a--primary' : ''}" ${attrs(o)}><span class="tile-a__i">${I(o.icon, 'lg')}</span><span><span class="tile-a__t" style="display:block">${o.t}</span>${o.s ? `<span class="tile-a__s" style="display:block">${o.s}</span>` : ''}</span></button>`;
  const tabs = (key, items, on = 0) => `<div class="tabs2" data-tabs="${key}">${items.map((x, i) => `<button class="${i === on ? 'is-on' : ''}" data-act="tab" data-pane="${i}">${x}</button>`).join('')}</div>`;
  const pane = (key, i, html, on = 0) => `<div data-pane-of="${key}" data-pane="${i}" ${i === on ? '' : 'hidden'}>${html}</div>`;
  const yuNote = (html, extra = '') => `<div class="yu-note"><span class="yu2">${I('sparkles')}</span><div class="yu-note__b">${html}</div>${extra}</div>`;
  const note = (icon, html) => `<div class="note">${I(icon)}<div>${html}</div></div>`;
  const page = (o) => `<div class="page ${o.wide ? 'page--wide' : ''} ${o.narrow ? 'page--narrow' : ''}">${o.crumbs ? `<div class="crumbs">${o.crumbs}</div>` : ''}<div class="phead"><div class="phead__t"><h1 class="h1">${o.title}</h1>${o.sub ? `<div class="phead__sub">${o.sub}</div>` : ''}</div>${o.actions ? `<div class="row row--wrap">${o.actions}</div>` : ''}</div>${o.body}</div>`;

  // ── реестр экранов и маршруты ─────────────────────────────────────────
  const screens = [];
  const byId = {};
  const add = (def) => { screens.push(def); byId[def.id] = def; };
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

  // ── оболочка ──────────────────────────────────────────────────────────
  const MODULES = [
    ['video', 'video', 'Встречи и эфиры', 'hub'], ['messenger', 'messenger', 'Мессенджер', 'messenger'], ['wallet', 'sales', 'Продажи', 'sales'],
    ['graduation-cap', 'school', 'Школа', 'school'], ['template', 'pages', 'Страницы и рассылки', 'pages'], ['automation', 'scenarios', 'Сценарии', 'scenarios'],
  ];
  const EXIST = [['kanban', 'Задачи'], ['mail', 'Почта'], ['calendar', 'Календарь'], ['crm', 'CRM']];
  function shell({ module, active, compose, nav = [], body }) {
    const navHtml = nav.map((n) => n.sec ? `<div class="nav__sec">${n.sec}</div>` : `<a class="nav__i ${n.on ? 'is-on' : ''}" ${n.go || n.act ? attrs(n) : n.on ? `data-go="${current.id}"` : `data-act="toast" data-text="Раздел «${esc(n.label)}» в прототипе не нарисован — открыт главный экран модуля"`}>${I(n.icon, 'md')}<span>${n.label}</span>${n.live ? '<span class="nav__live">LIVE</span>' : ''}${n.count != null ? `<span class="nav__cnt">${n.count}</span>` : ''}</a>`).join('');
    const rail = [...EXIST.map(([i, l]) => `<button class="rail__i" data-act="toast" data-text="«${l}» уже работает в платформе — в прототип видеомодуля не входит" title="${l}">${I(i, 'md')}</button>`), '<span class="rail__sep"></span>',
      ...MODULES.map(([i, k, l, g]) => `<a class="rail__i ${k === active ? 'is-on' : ''}" data-go="${g}" title="${l}">${I(i, 'md')}</a>`)].join('');
    return `<div class="app"><div class="mhead">${btn('', { icon: 'menu', kind: 'ghost', act: 'drawer', cls: 'btn2--icon' })}<span class="app__brand-name">Суть <span class="app__brand-x">✕</span> <span class="app__brand-mod">${module}</span></span></div>
      <aside class="app__side"><a class="app__brand" data-go="map"><img src="seal-compact.svg" alt=""><span class="app__brand-name">Суть <span class="app__brand-x">✕</span> <span class="app__brand-mod">${module}</span></span></a>
        ${compose ? `<button class="compose" ${attrs(compose)}>${I(compose.icon || 'plus')} ${compose.label}</button>` : ''}
        <nav class="nav">${navHtml}</nav>
        <a class="app__ws" data-go="yuia">${av('anna', 36)}<span class="sp"><span class="b t-sm" style="display:block">Анна Соколова</span><span class="t-xs muted">Психолог · проверена</span></span></a></aside>
      <main class="app__main" id="main">${body}</main>
      <nav class="app__rail">${rail}<span class="sp"></span><button class="rail__i" data-act="toast" data-text="3 уведомления: 2 оплаты и вопрос в зале ожидания" title="Уведомления">${I('bell', 'md')}<span class="rail__dot"></span></button><a class="rail__i" data-go="ops" title="Дежурный">${I('server', 'md')}</a></nav></div>`;
  }
  const videoNav = (on) => [
    { icon: 'grid', label: 'Главная', go: 'hub', on: on === 'hub' },
    { icon: 'broadcast', label: 'Эфир сейчас', go: 'stage', live: true },
    { icon: 'presentation', label: 'Эфиры', go: 'event', on: on === 'event', count: 2 },
    { icon: 'play', label: 'Записи', go: 'recordings', on: on === 'recordings', count: 48 },
    { icon: 'chart-bar', label: 'Отчёты', go: 'report', on: on === 'report' },
    { sec: 'Комнаты' },
    { icon: 'door', label: 'Кабинет Анны', go: 'call' },
    { icon: 'users', label: 'Группа «Опора»', go: 'meeting' },
    { sec: 'Настройки' },
    { icon: 'template', label: 'Шаблоны встреч', go: 'new', on: on === 'new' },
    { icon: 'sparkles', label: 'Юя и доверие', go: 'yuia', on: on === 'yuia' },
  ];

  // ── всплывающие и окна ────────────────────────────────────────────────
  function toast(text, { undo, icon = 'check-circle' } = {}) {
    const el = document.createElement('div'); el.className = 'ptoast';
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
  const tabAct = (el) => { const box = el.closest('[data-tabs]'); const key = box.dataset.tabs; $$('button', box).forEach((t) => t.classList.toggle('is-on', t === el)); $$(`[data-pane-of="${key}"]`).forEach((p) => (p.hidden = p.dataset.pane !== el.dataset.pane)); };
  const segAct = (el) => $$('button', el.parentElement).forEach((b) => b.classList.toggle('is-on', b === el));
  const pickAct = (el) => $$('.pick__i', el.closest('.pick')).forEach((c) => c.classList.toggle('is-on', c === el));
  const swAct = (el) => { el.classList.toggle('is-on'); if (el.dataset.text && el.classList.contains('is-on')) toast(el.dataset.text); };
  const GLOBAL = {
    'close-modal': () => closeModal(), toast: (el) => toast(esc(el.dataset.text)), drawer: () => document.body.classList.toggle('drawer-open'),
    tab: tabAct, seg: segAct, pick: pickAct, sw: swAct,
  };
  const ROOM_ACTS = {};
  document.addEventListener('click', (ev) => {
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
    if (ev.key === 'Escape') { closeModal(); $('.nav2')?.classList.remove('is-open'); }
    if (ev.target.closest && ev.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
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

  window.P = { D, S, $, $$, esc, rub, num, I, av, person, add, go, every, later, onLeave, shell, videoNav, toast, modal, closeModal, ROOM_ACTS, screens, btn, chip, sw, opt, seg, pick, li, kpi, tile, tabs, pane, yuNote, note, page, attrs, get current() { return current; } };
  document.addEventListener('DOMContentLoaded', boot);
})();

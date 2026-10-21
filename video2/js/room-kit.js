/* Общий набор комнаты: камера, микрофон, субтитры, нижняя панель как в Телемосте,
   боковые панели, меню «Ещё», выход, проверка связи. Экраны комнат собираются из этих частей. */
(function () {
  const { D, S, I, av, esc, toast, modal, closeModal, go, every, later, onLeave, ROOM_ACTS, $, $$, btn, seg, pick, opt, note } = P;

  // ── камера и микрофон ────────────────────────────────────────────────
  P.cam = {
    async start() {
      if (S.camStream) return S.camStream;
      try { S.camStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true }); }
      catch (e) { toast('Камера недоступна — разрешите доступ в адресной строке. Прототип работает и без неё', { icon: 'video-off' }); }
      return S.camStream;
    },
    attach(root = document) {
      $$('video.my-cam', root).forEach((v) => { if (!S.camStream) return; v.srcObject = S.camStream; v.muted = true; v.play().catch(() => {}); v.hidden = false; v.closest('.prev2, .tl')?.classList.add('has-cam'); });
    },
  };
  P.micMeter = (el) => {
    if (!el) return;
    el.innerHTML = Array.from({ length: 16 }, () => '<i></i>').join('');
    let an = null, buf;
    if (S.camStream && window.AudioContext) {
      try { const ac = new AudioContext(); const src = ac.createMediaStreamSource(S.camStream); an = ac.createAnalyser(); an.fftSize = 256; src.connect(an); buf = new Uint8Array(an.frequencyBinCount); onLeave(() => ac.close()); } catch (e) { an = null; }
    }
    let t = 0;
    every(90, () => {
      if (!el.isConnected) return;
      let lvl;
      if (an) { an.getByteFrequencyData(buf); lvl = Math.min(1, buf.reduce((a, b) => a + b, 0) / buf.length / 70); }
      else { t += 0.35; lvl = Math.max(0, Math.sin(t) * 0.45 + Math.sin(t * 2.7) * 0.25 + 0.3); }
      $$('i', el).forEach((i, k) => i.classList.toggle('is-on', k / 16 < lvl));
    });
  };

  // ── реакции и субтитры ───────────────────────────────────────────────
  P.flyEmoji = (e) => {
    const fx = $('.rm__fx'); if (!fx) return;
    const s = document.createElement('span'); s.className = 'fly'; s.textContent = e;
    s.style.left = 10 + Math.random() * 80 + '%';
    s.style.setProperty('--dx', (Math.random() * 92 - 46) + 'px'); s.style.setProperty('--rot', (Math.random() * 44 - 22) + 'deg');
    fx.appendChild(s); setTimeout(() => s.remove(), 3200);
  };
  P.subtitles = (lines, onSpeaker) => {
    const host = $('.subs'); if (!host) return;
    let i = 0;
    const next = () => {
      if (!host.isConnected) return;
      const [who, text] = lines[i++ % lines.length];
      host.innerHTML = `<b>${esc(P.person(who).short)}</b><span class="subs__t"></span>`;
      const t = $('.subs__t', host); let k = 0;
      const h = every(40, () => { if (!t.isConnected) return clearInterval(h); t.textContent = text.slice(0, ++k); if (k >= text.length) clearInterval(h); });
      onSpeaker && onSpeaker(who);
    };
    next(); every(5600, next);
  };

  // ── части комнаты ────────────────────────────────────────────────────
  P.tl = (id, o = {}) => {
    const p = P.person(id);
    return `<div class="tl ${o.self ? 'tl--self' : ''} ${o.remote ? 'tl--remote' : ''} ${o.speaking ? 'is-speaking' : ''} ${o.cls || ''}" data-pid="${id}" data-initials="${esc((p.short || '?')[0])}" ${o.style ? `style="${o.style}"` : ''}>
      <div class="tl__img" style="background-image:url(${p.photo})"></div>${o.self ? '<video class="my-cam tl__cam" playsinline autoplay muted hidden></video>' : ''}
      <span class="tl__name">${o.muted ? I('mic-off', 'xs') : '<span class="eq"><i></i><i></i><i></i></span>'}${esc(o.name || p.short)}${o.self ? ' (вы)' : ''}</span>${o.hand ? `<span class="tl__hand">${I('hand', 'sm')}</span>` : ''}${o.extra || ''}</div>`;
  };
  // кнопка нижней панели: квадрат со значком или пилюля с подписью
  P.rb = (icon, label, act, o = {}) => `<button class="rb ${label ? '' : 'rb--sq'} ${o.on ? 'is-on' : ''} ${o.off ? 'is-off' : ''} ${o.cls || ''}" data-act="${act}" ${o.data || ''} title="${esc(o.title || label)}" aria-label="${esc(o.title || label)}">${I(icon, 'md')}${label ? `<span>${label}</span>` : ''}${o.n != null ? `<span class="rb__n">${o.n}</span>` : ''}${o.dot ? '<span class="rb__dot"></span>' : ''}</button>`;
  P.rbPanel = (key, icon, label, o = {}) => P.rb(icon, label, 'pn', { ...o, on: o.on && window.innerWidth > 760, data: `data-p="${key}"` });
  P.rbEnd = (title = 'Выйти') => `<button class="rb rb--end rb--core" data-act="leave" title="${title}" aria-label="${title}">${I('phone-off', 'md')}</button>`;
  const caret = (k, t) => `<button class="rb rb--caret rb--core" data-act="devmenu" data-k="${k}" title="${t}" aria-label="${t}">${I('chevron-up', 'xs')}</button>`;
  P.rbBase = (o = {}) => `<span class="rbx">${P.rb(o.micOff ? 'mic-off' : 'mic', '', 'mic', { off: o.micOff, cls: 'rb--core', title: 'Микрофон · ⌘D · пробел — нажми и говори' })}${caret('mic', 'Микрофон и динамики')}</span><span class="rbx">${P.rb('video', '', 'camt', { cls: 'rb--core', title: 'Камера · ⌘E' })}${caret('cam', 'Камера, фон и свет')}</span><span class="rb-gap"></span>`;
  P.rbReact = () => `<span style="position:relative;display:inline-flex">${P.rb('smile', '', 'react', { title: 'Реакции и ответы', cls: 'rb--core' })}</span>`;
  P.rmTop = (o) => `<div class="rm__top"><div class="rm__title">${o.title}${o.sub ? `<span class="muted">${o.sub}</span>` : ''}</div><span class="sp"></span>${o.extra || ''}${o.rec === false ? '' : `<button class="rec-pill" data-act="disclose" title="${o.recLabel || 'Запись · субтитры · Юя'}"><span class="rec-dot"></span><span class="rec-pill__t">${o.recLabel || 'Запись · субтитры · Юя'}</span></button>`}${o.clock ? `<span class="rm__clock" id="clock">${o.clock}</span>` : ''}</div>`;
  P.pn = (key, title, body, o = {}) => `<aside class="pn ${o.open && window.innerWidth > 760 ? 'is-open' : ''}" data-pn="${key}"><div class="pn__h"><h2 class="h2">${title}</h2>${o.head || ''}<button class="pn__x" data-act="pclose" aria-label="Закрыть">${I('x', 'md')}</button></div>${o.tabs ? `<div class="pn__tabs">${o.tabs}</div>` : ''}<div class="pn__b">${body}</div>${o.foot ? `<div class="pn__f">${o.foot}</div>` : ''}</aside>`;
  P.room = (o) => `<div class="rm ${o.cls || ''}" data-theme="dark">${P.rmTop(o.top)}<div class="rm__body"><div class="rm__stage">${o.stage}</div>${o.panels || ''}</div><div class="mhint" id="mhint" hidden></div><div class="rm__bar">${o.bar}</div><div class="rm__fx"></div></div>`;
  P.clock = (start = 18 * 60 + 40) => { let s = start; every(1000, () => { s++; const c = $('#clock'); if (c) c.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }); };
  P.openPanel = (key) => {
    $$('.pn').forEach((p) => p.classList.toggle('is-open', p.dataset.pn === key && !p.classList.contains('is-open')));
    const open = $(`.pn[data-pn="${key}"]`)?.classList.contains('is-open');
    $$('[data-act="pn"]').forEach((b) => b.classList.toggle('is-on', open && b.dataset.p === key));
  };

  // ── меню «Ещё» ──────────────────────────────────────────────────────
  const MORE = {
    host1: [['heart-hand', 'Кризисная ситуация', 'crisis'], ['user-plus', 'Пригласить', 'invite'], ['activity', 'Связь и устройства', 'netcheck'], ['sparkles', 'Фон и свет', 'fx'], ['maximize', 'Во весь экран', 'full'], ['volume', 'Сильное шумоподавление', 'dfn'], ['music', 'Музыка под голос', 'music'], ['layout-sidebar', 'Раскладка «Рядом»', 'side'], ['eye-off', 'Скрыть своё окно', 'hideme'], ['lock', 'Приватная сессия со сквозным шифрованием', 'e2ee'], ['leaf', 'Режим практики', 'go-practice'], ['node', 'Расстановка', 'go-constellation'], ['cards', 'Метафорические карты', 'go-cards'], ['device-mobile', 'Продолжить на телефоне', 'transfer'], ['settings', 'Настройки', 'go-settings']],
    group: [['user-plus', 'Пригласить', 'invite'], ['heart-hand', 'Кризисная ситуация', 'crisis'], ['volume', 'Пространственный звук в «Круге»', 'spatial'], ['users', 'Сессионные залы', 'go-breakout'], ['leaf', 'Режим практики', 'go-practice'], ['edit', 'Доска', 'go-board'], ['node', 'Расстановка', 'go-constellation'], ['cards', 'Метафорические карты', 'go-cards'], ['timer', 'Таймер для всех', 'timer'], ['door-exit', 'Перерыв: всех в зал ожидания', 'pause'], ['activity', 'Связь и устройства', 'netcheck'], ['sparkles', 'Фон и свет', 'fx'], ['maximize', 'Во весь экран', 'full'], ['settings', 'Настройки', 'go-settings']],
    stage: [['shield-check', 'Безопасность эфира', 'sec'], ['node', 'Расстановка на сцене', 'go-constellation'], ['timer', 'Таймер на сцене', 'stimer'], ['activity', 'Связь и устройства', 'netcheck'], ['volume', 'Сильное шумоподавление', 'dfn'], ['music', 'Музыка под голос', 'music'], ['cc', 'Язык субтитров', 'lang'], ['settings', 'Настройки', 'go-settings']],
    guest: [['clock', 'Отошёл — выключить камеру и звук', 'brb'], ['activity', 'Связь и устройства', 'netcheck'], ['cc', 'Язык субтитров', 'lang'], ['wifi', 'Экономия трафика', 'eco'], ['maximize', 'Во весь экран', 'full'], ['device-desktop', 'Смотреть на телевизоре', 'tv'], ['device-mobile', 'Второе устройство — только чат и вопросы', 'second'], ['phone', 'Звук по телефону — «Позвонить мне»', 'callme'], ['help', 'Сообщить о проблеме', 'report'], ['settings', 'Настройки', 'go-settings']],
  };
  const moreSheet = () => {
    const items = MORE[P.current.more || 'guest'];
    // кнопки, которые не поместились в нижнюю панель телефона, — первыми в «Ещё», как у Телемоста и Meet
    const hidden = $$('.rm__bar .rb').filter((b) => !b.classList.contains('rb--caret') && b.dataset.act !== 'more' && b.offsetParent === null);
    const top = hidden.map((b, n) => { const ic = b.querySelector('use')?.getAttribute('href')?.slice(1) || 'dot'; return `<button data-hid="${n}">${I(ic, 'md')}<span>${esc(b.getAttribute('aria-label') || b.textContent.trim())}</span>${b.querySelector('.rb__n') ? `<span class="rb__n" style="position:static">${b.querySelector('.rb__n').textContent}</span>` : ''}</button>`; }).join('');
    const m = modal(`<div class="modal2__t">Ещё</div>${top ? `<div class="sheet-l">${top}</div><div class="sheet-sep"></div>` : ''}<div class="sheet-l">${items.map(([i, t, k]) => `<button data-act="m-${k}">${I(i, 'md')}<span>${t}</span>${I('chevron-right', 'sm', 'subtle')}</button>`).join('')}</div>`, { dark: true });
    $$('[data-hid]', m).forEach((x) => (x.onclick = () => { closeModal(true); hidden[+x.dataset.hid].click(); }));
  };

  // ── всплывающее меню над кнопкой: устройства, реакции ───────────────
  P.pop = (el, html, cls = '') => {
    let pop = $('.rpop'); if (pop) { const same = pop.dataset.for === (el.dataset.k || el.dataset.act); pop.remove(); if (same) return null; }
    pop = document.createElement('div'); pop.className = 'rpop ' + cls; pop.dataset.for = el.dataset.k || el.dataset.act; pop.innerHTML = html;
    // панель кнопок прокручивается и обрезала бы меню — кладём его в саму комнату над кнопкой
    const host = el.closest('.rm, .mcall2') || document.body; host.appendChild(pop);
    const hr = host.getBoundingClientRect(), br = el.getBoundingClientRect();
    const half = Math.min(pop.offsetWidth, hr.width - 16) / 2;
    pop.style.left = Math.max(half + 8, Math.min(hr.width - half - 8, br.left - hr.left + br.width / 2)) + 'px'; pop.style.bottom = (hr.bottom - br.top + 10) + 'px';
    return pop;
  };
  const DEV = {
    mic: () => `<div class="dmenu"><div class="dmenu__h">Микрофон</div>${['Микрофон MacBook Pro', 'AirPods Pro', 'Гарнитура Jabra Evolve2'].map((t, i) => `<button data-dev="${t}" class="${i ? '' : 'is-on'}">${I(i ? 'circle' : 'check-circle', 'sm')}<span>${t}</span></button>`).join('')}
      <div class="dmenu__h">Динамики</div>${['AirPods Pro', 'Динамики MacBook Pro'].map((t, i) => `<button data-dev="${t}" class="${i ? '' : 'is-on'}">${I(i ? 'circle' : 'check-circle', 'sm')}<span>${t}</span></button>`).join('')}
      <div class="dmenu__sep"></div><button data-go2="settings">${I('volume', 'sm')}<span>Проверить звук и микрофон</span></button><button data-tog="dfn">${I('wand', 'sm')}<span>Сильное шумоподавление</span><span class="sw is-on"></span></button>
      <div class="dmenu__note">${I('bluetooth', 'xs')} Запомню эту пару устройств — в следующий раз всё будет так же</div></div>`,
    cam: () => `<div class="dmenu"><div class="dmenu__h">Камера</div>${['FaceTime HD', 'Камера iPhone Юрия', 'Logitech Brio 4K'].map((t, i) => `<button data-dev="${t}" class="${i ? '' : 'is-on'}">${I(i ? 'circle' : 'check-circle', 'sm')}<span>${t}</span></button>`).join('')}
      <div class="dmenu__sep"></div><button data-fx="1">${I('sparkles', 'sm')}<span>Фон и свет</span></button><button data-tog="mirror">${I('rotate', 'sm')}<span>Зеркалить моё видео</span><span class="sw is-on"></span></button>
      <div class="dmenu__note">${I('device-mobile', 'xs')} Камера iPhone как веб-камера даёт картинку заметно лучше встроенной</div></div>`,
  };
  function devMenu(el) {
    const pop = P.pop(el, DEV[el.dataset.k](), 'rpop--menu'); if (!pop) return;
    pop.onclick = (ev) => {
      const b = ev.target.closest('button'); if (!b) return; ev.stopPropagation();
      if (b.dataset.dev) { const grp = []; let n = b; while (n.previousElementSibling && !n.previousElementSibling.classList.contains('dmenu__h')) n = n.previousElementSibling; for (let k = n; k && k.dataset.dev; k = k.nextElementSibling) grp.push(k); grp.forEach((x) => { x.classList.toggle('is-on', x === b); x.querySelector('svg').outerHTML = I(x === b ? 'check-circle' : 'circle', 'sm'); }); toast(`Выбрано: ${b.dataset.dev}`, { icon: el.dataset.k === 'cam' ? 'video' : 'mic' }); }
      else if (b.dataset.tog) { const sw = b.querySelector('.sw'); sw.classList.toggle('is-on'); toast(b.dataset.tog === 'dfn' ? (sw.classList.contains('is-on') ? 'Сильное шумоподавление включено' : 'Обычное шумоподавление браузера') : 'Зеркалирование только у вас — собеседники видят как есть'); }
      else if (b.dataset.fx) { pop.remove(); fxModal(); }
      else if (b.dataset.go2) { pop.remove(); go(b.dataset.go2); }
    };
  }
  function fxModal() {
    modal(`<div class="modal2__t">Фон и свет</div><div class="modal2__s">Меняется сразу, собеседники видят результат без перезахода.</div>
      <div class="fxg mt16">${[['none', 'Без фона', ''], ['blur', 'Размытие', 'img/people/p26.jpg'], ['room', 'Кабинет', 'img/people/p32.jpg'], ['sys', 'Портрет Apple', '']].map(([k, t, im], i) => `<button class="fxg__i ${i === 3 ? 'is-on' : ''}" data-act="fxpick" data-t="${t}"><span class="fxg__p" style="${im ? `background-image:url(${im})` : ''}${k === 'blur' ? ';filter:blur(3px)' : ''}">${k === 'none' ? I('x-circle', 'lg') : k === 'sys' ? I('sparkles', 'lg') : ''}</span>${t}</button>`).join('')}</div>
      <div class="mt16">${opt('Подстроить свет', 'Если лицо темнее фона — например, окно за спиной', true)}${opt('Студийный свет Apple', 'Считает нейропроцессор — батарея почти не тратится', false)}</div>
      <div class="mt12">${note('cpu', 'Сначала системные эффекты — они лучше и не греют ноутбук. На слабом устройстве эффекты выключатся сами, звонок важнее.')}</div>`, { dark: true });
  }
  P.fxModal = fxModal;

  // ── панель не влезает — подписи сворачиваются в значки с подсказками, «Завершить» всегда на виду ──
  P.fitBar = () => $$('.rm__bar').forEach((bar) => {
    const lab = $$('.rb', bar).filter((b) => !b.classList.contains('rb--sq') && !b.classList.contains('rb--end') && b.querySelector(':scope > span:not(.rb__n):not(.rb__dot)'));
    lab.forEach((b) => b.classList.remove('rb--nolab'));
    if (window.innerWidth <= 760) return;
    // сворачиваем подписи с конца, пока панель не поместится: первые разделы остаются подписанными
    for (let i = lab.length - 1; i >= 0 && bar.scrollWidth > bar.clientWidth + 1; i--) lab[i].classList.add('rb--nolab');
  });
  window.addEventListener('resize', () => P.fitBar());

  // ── A2: «вы говорите, а микрофон выключен» ──────────────────────────
  let mutedWatch = null;
  function watchMuted(on) {
    clearInterval(mutedWatch); mutedWatch = null; const h = $('#mhint'); if (h) h.hidden = true;
    if (!on) return;
    let an = null, buf, t0 = Date.now();
    if (S.camStream && window.AudioContext) { try { const ac = new AudioContext(); const src = ac.createMediaStreamSource(S.camStream); an = ac.createAnalyser(); an.fftSize = 256; src.connect(an); buf = new Uint8Array(an.frequencyBinCount); onLeave(() => ac.close()); } catch (e) { an = null; } }
    mutedWatch = every(300, () => {
      const box = $('#mhint'); if (!box) { clearInterval(mutedWatch); return; }
      let speaking;
      if (an) { an.getByteFrequencyData(buf); speaking = buf.reduce((a, b) => a + b, 0) / buf.length > 22; } else speaking = Date.now() - t0 > 3200;
      if (speaking && box.hidden) { box.innerHTML = `${I('mic-off')}<span class="sp">Вы говорите, а микрофон выключен</span><button class="btn2 btn2--primary btn2--sm" data-act="mic-on">Включить</button><span class="mhint__k">или держите <kbd>пробел</kbd></span>`; box.hidden = false; clearInterval(mutedWatch); }
    });
  }
  function setMic(el, off) { if (!el) return; el.classList.toggle('is-off', off); el.innerHTML = I(off ? 'mic-off' : 'mic', 'md'); watchMuted(off); }

  // ── A3: горячие клавиши комнаты — по физической клавише, работают в русской раскладке ──
  let ptt = false;
  document.addEventListener('keydown', (e) => {
    if (!$('.rm') || (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]'))) return;
    const mod = e.metaKey || e.ctrlKey, mic = $('.rm__bar [data-act="mic"]');
    if (e.code === 'Space' && !mod && mic) { e.preventDefault(); if (!e.repeat && mic.classList.contains('is-off')) { ptt = true; setMic(mic, false); toast('Говорите — пока держите пробел, вас слышно', { icon: 'mic' }); } return; }
    if (mod && !e.shiftKey && e.code === 'KeyD' && mic) { e.preventDefault(); ROOM_ACTS.mic(mic); }
    if (mod && !e.shiftKey && e.code === 'KeyE') { const c = $('.rm__bar [data-act="camt"]'); if (c) { e.preventDefault(); ROOM_ACTS.camt(c); } }
    if (mod && e.shiftKey && e.code === 'KeyH') { const h = $('.rm__bar [data-act="hand"], .rm__bar [data-act="vhand"]'); if (h) { e.preventDefault(); h.click(); } }
    if (mod && e.shiftKey && e.code === 'KeyC') { const c = $('.rm__bar [data-act="pn"][data-p="chat"]'); if (c) { e.preventDefault(); c.click(); } }
  });
  document.addEventListener('keyup', (e) => { if (e.code === 'Space' && ptt) { ptt = false; setMic($('.rm__bar [data-act="mic"]'), true); } });

  // «Связь и устройства» — ответ словами; миллисекунды, потери и дрожание видит только дежурный платформы
  function netOverlay() {
    modal(`<div class="modal2__t">Связь хорошая</div><div class="modal2__s">Всё работает — ничего делать не нужно.</div>
      <div class="mt16">${[['mic', 'Вас слышно', 'хорошо'], ['video', 'Вас видно', 'хорошо'], ['volume', 'Вы слышите других', 'хорошо'], ['wifi', 'Интернет', 'устойчивый']].map(([ic, a, b]) => `<div class="row" style="padding:10px 0;font-size:15px">${I(ic, 'sm', 'subtle')}<span class="sp">${a}</span><span class="ok">${I('check-circle', 'sm')} ${b}</span></div>`).join('')}</div>
      <div class="t-sm muted mt12">Микрофон — MacBook Pro, звук — AirPods Pro, камера — FaceTime HD. Если станет хуже, Юя подскажет, что сделать.</div>
      <div class="modal2__f">${btn('Только звук', { icon: 'video-off', act: 'toast', data: 'data-text="Видео выключено — весь интернет отдан звуку"' })}${btn('Сообщить о проблеме', { icon: 'send', act: 'm-report' })}</div>`, { dark: true });
  }

  P.netOverlay = netOverlay;

  const isHost = () => ['call', 'meeting', 'stage', 'practice', 'breakout', 'constellation', 'board', 'share', 'cards', 'pip'].includes(P.current.id);
  Object.assign(ROOM_ACTS, {
    mic: (el) => { const off = !el.classList.contains('is-off'); setMic(el, off); toast(off ? 'Микрофон выключен. Пробел — нажми и говори' : 'Микрофон включён', { icon: off ? 'mic-off' : 'mic' }); },
    'mic-on': () => { setMic($('.rm__bar [data-act="mic"]'), false); toast('Микрофон включён', { icon: 'mic' }); },
    devmenu: devMenu,
    camt: async (el) => {
      if (!S.camStream) { await P.cam.start(); P.cam.attach(); return; }
      const off = !el.classList.contains('is-off'); el.classList.toggle('is-off', off); el.innerHTML = I(off ? 'video-off' : 'video', 'md');
      $$('.tl--self').forEach((t) => t.classList.toggle('cam-off', off));
    },
    cc: (el) => { el.classList.toggle('is-on'); $('.rm')?.classList.toggle('subs-off', !el.classList.contains('is-on')); },
    hand: (el) => { el.classList.toggle('is-on'); toast(el.classList.contains('is-on') ? 'Рука поднята — вы третья в очереди' : 'Рука опущена', { icon: 'hand' }); },
    react: (el) => {
      const set = P.current.gentle ? ['🙏', '💛', '🌿', '🤝', '✨', '👏'] : ['👏', '❤️', '🙏', '😊', '💡', '🌿'];
      const pop = P.pop(el, set.map((e) => `<button data-e="${e}" aria-label="${e}">${e}</button>`).join('') + `<span class="rpop__sep"></span>${['да', 'нет', 'медленнее', 'быстрее', 'отошёл'].map((t) => `<button class="nv" data-nv="${t}">${t}</button>`).join('')}`);
      if (!pop) return;
      pop.onclick = (ev) => { const b = ev.target.closest('button'); if (!b) return; ev.stopPropagation(); if (b.dataset.e) P.flyEmoji(b.dataset.e); else toast(`Ответ «${b.dataset.nv}» — ведущая видит счётчик, а не имена`); pop.remove(); };
    },
    pn: (el) => P.openPanel(el.dataset.p),
    pclose: (el) => { el.closest('.pn').classList.remove('is-open'); $$('[data-act="pn"]').forEach((b) => b.classList.remove('is-on')); },
    more: moreSheet,
    disclose: () => modal(`<div class="row"><span class="rec-dot"></span><div class="modal2__t" style="padding:0">Запись, субтитры и Юя</div></div><div class="modal2__s">Эту плашку видят все. Сигнал «запись началась» прозвучал у каждого. Согласие собрано на входе, по каждой цели отдельно.</div>
      <table class="tbl2 mt16"><tbody>${[['Запись', 'хранится в России 90 дней'], ['Расшифровка', 'по ходу встречи; итоги Юя пришлёт ведущей в чат после встречи'], ['Юя', 'итоги и заметки видит только специалист'], ['Кто открывал запись', 'клиент видит журнал доступа']].map(([a, b]) => `<tr><td>${a}</td><td class="muted r">${b}</td></tr>`).join('')}</tbody></table>
      ${isHost() ? `<div class="modal2__f">${btn('Пауза записи', { icon: 'pause', act: 'recpause' })}${btn('Выключить Юю', { icon: 'bolt-off', act: 'toast', data: 'data-text="Юя выключена в этой встрече. Быстрые команды и фильтр чата работают"' })}</div>` : `<div class="modal2__f">${btn('Попросить не записывать меня', { act: 'toast', data: 'data-text="Ведущая получила вашу просьбу. Ваша дорожка не попадёт в запись"' })}</div>`}`, { dark: true }),
    recpause: () => { closeModal(); $$('.rec-pill').forEach((r) => (r.innerHTML = `${I('pause', 'xs')} Запись на паузе`)); toast('Запись на паузе — у всех прозвучал сигнал', { icon: 'pause' }); },
    leave: () => {
      const host = isHost();
      modal(`<div class="modal2__t">${host ? 'Завершить встречу?' : 'Выйти из встречи?'}</div><div class="modal2__s">${host ? 'Завершение для всех остановит запись. Минуту можно будет отменить.' : 'Вернуться можно по той же ссылке.'}</div>${host && P.current.id !== 'call' ? `<label class="fld"><span class="fld__l">Если только выйти — ведущей станет</span><select class="in"><option>Елена Миронова · соведущая</option><option>Дмитрий Орлов</option><option>Никто — встреча закончится через 5 минут без ведущей</option></select></label>` : ''}
        <div class="modal2__f">${host ? `${btn('Только выйти', { act: 'justleave', size: 'lg' })}${btn('Завершить для всех', { kind: 'danger', act: 'endall', size: 'lg' })}` : btn('Выйти', { kind: 'danger', act: 'justleave', size: 'lg' })}</div>`, { dark: true });
    },
    justleave: () => { closeModal(); go(['viewer', 'viewer-mobile', 'replay', 'lobby'].includes(P.current.id) ? 'event-page' : isHost() ? 'hub' : 'end'); },
    endall: () => { const from = P.current.id; closeModal();
      if (from === 'stage') { modal(`<div class="row"><span class="yu2 yu2--lg">${I('check', 'lg')}</span><div><div class="t-sm muted">Эфир завершён для зрителей · 1 ч 34 мин</div><div class="modal2__t" style="padding:0">Разбор с докладчиками</div></div></div><div class="modal2__s">Зрители вышли, вы с Дмитрием и Еленой остались в закулисье. Запись остановлена, разговор не записывается.</div>
        <div class="card mt16" style="padding:14px;font-size:15px;line-height:1.6"><div class="b">${I('sparkles', 'sm')} Юя за минуту</div><div class="muted">Пик — 2 418 зрителей на 41-й минуте. Больше всего вопросов — о панических атаках ночью (14). Курс купили 67 человек, подарков — 214. Связь: 99,2 % вошли с первой попытки, у 21 зрителя были замирания на мобильном интернете.</div></div>
        <div class="modal2__f">${btn('Открыть отчёт', { icon: 'chart-bar', go: 'report' })}${btn('Завершить разбор', { kind: 'primary', act: 'enddebrief' })}</div>`, { dark: true }); return; } go('end', { from }); later(300, () => toast('Встреча завершена. Отменить можно ещё 60 секунд', { undo: () => go(from) })); },
    netcheck: netOverlay,
    enddebrief: () => { closeModal(); go('report'); },
    callme: () => modal(`<div class="modal2__t">Позвонить вам?</div><div class="modal2__s">Звук пойдёт по обычной телефонной сети, видео и чат останутся в браузере. Выручает, когда мобильный интернет совсем слабый.</div><label class="fld"><span class="fld__l">Номер</span><input class="in" value="+7 917 ••• 12-40"></label><div class="modal2__f">${btn('Позвонить', { kind: 'primary', size: 'lg', icon: 'phone', act: 'toast', data: 'data-text="Звоним… возьмите трубку — звук переключится сам"' })}</div>`, { dark: true }),
    'm-netcheck': netOverlay, 'm-callme': () => ROOM_ACTS.callme(),
    'm-go-practice': () => go('practice'), 'm-go-breakout': () => go('breakout'), 'm-go-board': () => go('board'), 'm-go-constellation': () => go('constellation', { ctx: P.current.more === 'host1' ? 'call' : P.current.more === 'stage' ? 'stage' : 'group' }), 'm-go-cards': () => go('cards'), 'm-go-settings': () => go('settings'),
    'm-dfn': () => { closeModal(); toast('Сильное шумоподавление включено. Обычный шумодав браузера выключен, чтобы не портить голос', { icon: 'volume' }); },
    'm-music': () => modal(`<div class="modal2__t">Музыка под голос</div><div class="modal2__s">Музыка смешивается с вашим голосом и автоматически тише, когда вы говорите. Нужны наушники.</div><div class="mt12">${pick([{ t: 'Тибетские чаши', s: '432 Гц · 40 мин' }, { t: 'Дождь и далёкий гром' }, { t: 'Пианино — медленно' }])}</div><div class="modal2__f">${btn('Включить', { kind: 'primary', size: 'lg', act: 'toast', data: 'data-text="Музыка играет · громкость 30 % · приглушается под голос"' })}</div>`, { dark: true }),
    'm-side': () => { closeModal(); $('.rm')?.classList.toggle('layout-side'); },
    'm-hideme': () => { closeModal(); $('.rm')?.classList.toggle('hide-self'); toast('Своё окно скрыто — на долгой сессии меньше устаёшь'); },
    'm-e2ee': () => modal(`<div class="modal2__t">Приватная сессия</div><div class="modal2__s">Звук и видео шифруются на ваших устройствах, сервер видит только шифр. В такой сессии нет записи, расшифровки и Юи — это честная цена приватности.</div><div class="modal2__f">${btn('Остаться как есть', { act: 'close-modal', size: 'lg' })}${btn('Включить', { kind: 'primary', size: 'lg', icon: 'lock', act: 'e2eeon' })}</div>`, { dark: true }),
    e2eeon: () => { closeModal(); $$('.rec-pill').forEach((r) => (r.innerHTML = `${I('lock', 'xs')} Сквозное шифрование`)); toast('Сквозное шифрование включено. Запись и Юя выключены на эту сессию', { icon: 'lock' }); },
    'm-transfer': () => modal(`<div class="modal2__t">Продолжить на телефоне</div><div class="modal2__s">Наведите камеру телефона. Без зала ожидания и повторного входа — компьютер отключится сам.</div><div style="display:grid;place-items:center;margin-top:20px">${C.qr(200, 5)}</div>`, { dark: true }),
    'm-timer': () => { closeModal(); let s = 300; const pill = $('#rtimer'); if (!pill) return; pill.hidden = false; every(1000, () => { s = Math.max(0, s - 1); pill.querySelector('b').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }); toast('Таймер 5:00 видят все'); },
    'm-pause': () => { closeModal(); toast('Перерыв 10 минут: все в зале ожидания, Юя покажет обратный отсчёт и вернёт всех сама', { icon: 'door-exit', undo: () => {} }); },
    'm-lang': () => modal(`<div class="modal2__t">Язык субтитров</div><div class="mt16">${pick([{ t: 'Русский', s: 'оригинал' }, { t: 'English', s: 'перевод в вашем браузере' }, { t: 'Deutsch', s: 'перевод в вашем браузере' }, { t: 'עברית', s: 'перевод на сервере' }])}</div>`, { dark: true }),
    'm-eco': () => modal(`<div class="modal2__t">Экономия трафика</div><div class="mt16">${pick([{ t: 'Автоматически', s: 'платформа подстроится сама' }, { t: 'Меньше трафика', s: 'картинка проще, звук тот же' }, { t: 'Только говорящий' }, { t: 'Только звук' }])}</div>`, { dark: true }),
    'm-crisis': () => modal(`<div class="row"><span class="yu2 yu2--lg">${I('heart-hand', 'lg')}</span><div><div class="t-sm muted">Видно только вам</div><div class="modal2__t" style="padding:0">Кризисная ситуация</div></div></div>
      <div class="crisis mt16"><div class="b">Контакты помощи — Казань, Россия</div>${[['112', 'единый номер экстренных служб'], ['8-800-2000-122', 'телефон доверия, бесплатно, круглосуточно'], ['051 · 8-495-051', 'психологическая помощь (Москва)']].map(([n, t]) => `<div class="row" style="padding:6px 0"><b class="mono" style="min-width:150px">${n}</b><span class="muted">${t}</span></div>`).join('')}<div class="t-xs muted mt8">Номера сверяются перед включением функции</div></div>
      ${P.current.id !== 'call' ? `<div class="mt12">${note('user', 'Экстренный контакт участника — в его меню в списке участников, если участник его указал.')}</div>` : ''}<div class="card mt12" style="padding:14px" ${P.current.id !== 'call' ? 'hidden' : ''}><div class="row"><span class="sp"><b>Экстренный контакт Марии</b><span class="t-sm muted" style="display:block">сестра Ольга · +7 917 ••• 40-11 · указан Марией 3 июня</span></span>${btn('Показать номер', { size: 'sm', act: 'toast', data: 'data-text="Номер показан и записан в журнал доступа"' })}</div></div>
      <div class="h3 mt16">Порядок</div><ol class="crisis__ol"><li>Остаться на связи, говорить спокойно, спросить прямо о безопасности</li><li>Договориться о плане безопасности и следующем контакте</li><li>При угрозе жизни — 112; сказать клиенту, что вы делаете</li><li>Отметить в заметках и обсудить на супервизии</li></ol>
      <div class="mt12">${opt('Юя тихо подсказывает', 'Если в речи прозвучат слова о намерении причинить себе вред — подсказка только вам. Без диагнозов, без действий и без уведомления кого-либо', true)}</div>
      <div class="modal2__f">${btn('Отметить в заметках', { icon: 'notes', act: 'toast', data: 'data-text="Отметка в заметках к встрече — только вам"' })}${btn('Понятно', { kind: 'primary', act: 'close-modal' })}</div>`, { dark: true }),
    'm-spatial': () => { closeModal(); toast('Пространственный звук: в «Круге» голос звучит с того места, где сидит человек. Нужны наушники', { icon: 'volume' }); },
    'm-brb': () => { closeModal(); $$('.rm__bar [data-act="mic"]').forEach((m) => { m.classList.add('is-off'); m.innerHTML = I('mic-off', 'md'); }); $$('.tl--self').forEach((t) => t.classList.add('cam-off')); toast('Вы отошли: камера и микрофон выключены, у вашей плитки — «скоро вернусь». Включатся, когда вернётесь', { icon: 'clock' }); },
    'm-invite': () => ROOM_ACTS.invite(), invite: () => modal(`<div class="modal2__t">Пригласить</div><div class="modal2__s">Ссылка пускает в зал ожидания — незнакомых Юя покажет вам, записанных впустит сама.</div>
      <div class="row mt16"><input class="in mono" value="the-essence.ai/m/anna-opora" readonly aria-label="Ссылка">${btn('', { icon: 'copy', kind: 'primary', cls: 'btn2--icon', act: 'toast', data: 'data-text="Ссылка скопирована"' })}</div>
      <div class="sendg mt16">${[['send', 'Telegram'], ['messenger', 'MAX'], ['mail', 'Почта'], ['qrcode', 'QR-код']].map(([i, t]) => `<button data-act="toast" data-text="${t === 'QR-код' ? 'QR показан — наведите камеру телефона' : `Приглашение ушло в ${t}`}">${I(i, 'lg')}<span>${t}</span></button>`).join('')}</div>
      <div class="card mt16" style="padding:14px"><div class="b">${I('phone', 'sm')} Вход по телефону</div><div class="t-sm muted mt8">+7 495 128-44-17, код встречи <b class="mono">4417 #</b> — для тех, у кого слабый интернет. Звук пойдёт по телефону, видео и чат останутся в браузере.</div></div>
      <label class="fld"><span class="fld__l">Или позвонить человеку прямо сейчас</span><div class="row"><input class="in" placeholder="Имя из клиентов или номер">${btn('Позвонить', { icon: 'phone', act: 'toast', data: 'data-text="Звоним… у человека звонит веб-приложение или телефон"' })}</div></label>`, { dark: true }),
    'm-fx': () => { closeModal(true); fxModal(); }, fxpick: (el) => { $$('.fxg__i').forEach((x) => x.classList.toggle('is-on', x === el)); toast(`Фон: ${el.dataset.t}`, { icon: 'sparkles' }); },
    'm-full': () => { closeModal(); try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch (e) { toast('Во весь экран — клавиша F'); } },
    'm-tv': () => modal(`<div class="modal2__t">Смотреть на телевизоре</div><div class="modal2__s">Эфир уйдёт на телевизор, а телефон останется пультом: чат, вопросы и субтитры.</div><div class="sheet-l mt12">${['Телевизор в гостиной · Chromecast', 'Apple TV · AirPlay'].map((t) => `<button data-act="toast" data-text="Эфир на телевизоре. Телефон — пульт с чатом и вопросами">${I('device-desktop', 'md')}<span>${t}</span></button>`).join('')}</div>`, { dark: true }),
    'm-second': () => modal(`<div class="modal2__t">Второе устройство</div><div class="modal2__s">Войдите с телефона только для чата, вопросов и субтитров — без звука, чтобы не было эха. Удобно, когда эфир идёт на большом экране.</div><div style="display:grid;place-items:center;margin-top:20px">${C.qr(180, 7)}</div>`, { dark: true }),
    'm-sec': () => modal(`<div class="modal2__t">Безопасность эфира</div><div class="fld"><span class="fld__l">Чат зрителей</span>${seg(['Всем', 'Медленно — раз в 10 с', 'Только вопросы', 'Выключен'])}</div>${opt('Ссылки в чате — только от ведущих', 'Юя скрывает остальные до показа', true)}${opt('Реакции зрителей', '', true)}${opt('Закрыть вход', 'Новые зрители не войдут — даже с билетом', false)}${opt('Скрыть имена зрителей друг от друга', '', true)}
      <div class="modal2__f">${btn('Остановить всё', { kind: 'danger', icon: 'ban', act: 'toast', data: 'data-text="Всё остановлено: у зрителей только видео сцены. Юя объяснила, что вы разбираетесь"' })}</div>`, { dark: true }),
    'm-stimer': () => modal(`<div class="modal2__t">Таймер на сцене</div><div class="modal2__s">Зрители видят обратный отсчёт поверх эфира — например, на упражнение или перерыв.</div><div class="slots2 mt16">${['1 мин', '3 мин', '5 мин', '10 мин'].map((t, i) => `<button class="${i === 2 ? 'is-on' : ''}" data-act="seg">${t}</button>`).join('')}</div><div class="modal2__f">${btn('Запустить', { kind: 'primary', size: 'lg', icon: 'timer', act: 'toast', data: 'data-text="Таймер 5:00 на сцене — его видят все зрители"' })}</div>`, { dark: true }),
    'm-report': () => modal(`<div class="modal2__t">Сообщить о проблеме</div><div class="modal2__s">К сообщению сами приложатся данные о связи за последние 5 минут. Видео и звук не отправляются.</div><div class="mt16">${pick([{ t: 'Не слышно' }, { t: 'Плохое видео' }, { t: 'Эхо или шум' }, { t: 'Другое' }])}</div><label class="fld"><span class="fld__l">Что случилось</span><textarea class="in" rows="3" placeholder="Необязательно"></textarea></label><div class="modal2__f">${btn('Позвать дежурного', { icon: 'user-plus', size: 'lg', act: 'toast', data: 'data-text="Дежурный инженер войдёт в комнату через минуту — диагностика уже у него"' })}${btn('Отправить', { kind: 'primary', size: 'lg', act: 'toast', data: 'data-text="Отчёт ушёл в поддержку. Юя ответит в этом окне"' })}</div><div class="t-xs muted mt12">Сначала ответит Юя — по данным вашей связи. Не помогло — дежурный придёт в комнату.</div>`, { dark: true }),
  });
  document.addEventListener('click', (ev) => { if (!ev.target.closest('.rpop, [data-act="react"], [data-act="devmenu"]')) $('.rpop')?.remove(); });
})();

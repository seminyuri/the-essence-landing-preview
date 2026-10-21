/* Общий набор комнаты: камера, микрофон, субтитры, нижняя панель как в Телемосте,
   боковые панели, меню «Ещё», выход, проверка связи. Экраны комнат собираются из этих частей. */
(function () {
  const { D, S, I, av, esc, toast, modal, closeModal, go, every, later, onLeave, ROOM_ACTS, $, $$, btn, seg, pick, opt } = P;

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
  P.rbEnd = (title = 'Выйти') => `<button class="rb rb--end" data-act="leave" title="${title}" aria-label="${title}">${I('phone-off', 'md')}</button>`;
  P.rbBase = (o = {}) => `${P.rb(o.micOff ? 'mic-off' : 'mic', '', 'mic', { off: o.micOff, title: 'Микрофон · пробел — нажми и говори' })}${P.rb('video', '', 'camt', { title: 'Камера' })}<span class="rb-gap"></span>`;
  P.rbReact = () => `<span style="position:relative;display:inline-flex">${P.rb('smile', '', 'react', { title: 'Реакции и ответы' })}</span>`;
  P.rmTop = (o) => `<div class="rm__top"><div class="rm__title">${o.title}${o.sub ? `<span class="muted">${o.sub}</span>` : ''}</div><span class="sp"></span>${o.extra || ''}${o.rec === false ? '' : `<button class="rec-pill" data-act="disclose">${'<span class="rec-dot"></span>'} ${o.recLabel || 'Запись · субтитры · Юя'}</button>`}${o.clock ? `<span class="rm__clock" id="clock">${o.clock}</span>` : ''}</div>`;
  P.pn = (key, title, body, o = {}) => `<aside class="pn ${o.open && window.innerWidth > 760 ? 'is-open' : ''}" data-pn="${key}"><div class="pn__h"><h2 class="h2">${title}</h2>${o.head || ''}<button class="pn__x" data-act="pclose" aria-label="Закрыть">${I('x', 'md')}</button></div>${o.tabs ? `<div class="pn__tabs">${o.tabs}</div>` : ''}<div class="pn__b">${body}</div>${o.foot ? `<div class="pn__f">${o.foot}</div>` : ''}</aside>`;
  P.room = (o) => `<div class="rm ${o.cls || ''}" data-theme="dark">${P.rmTop(o.top)}<div class="rm__body"><div class="rm__stage">${o.stage}</div>${o.panels || ''}</div><div class="rm__bar">${o.bar}</div><div class="rm__fx"></div></div>`;
  P.clock = (start = 18 * 60 + 40) => { let s = start; every(1000, () => { s++; const c = $('#clock'); if (c) c.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }); };
  P.openPanel = (key) => {
    $$('.pn').forEach((p) => p.classList.toggle('is-open', p.dataset.pn === key && !p.classList.contains('is-open')));
    const open = $(`.pn[data-pn="${key}"]`)?.classList.contains('is-open');
    $$('[data-act="pn"]').forEach((b) => b.classList.toggle('is-on', open && b.dataset.p === key));
  };

  // ── меню «Ещё» ──────────────────────────────────────────────────────
  const MORE = {
    host1: [['activity', 'Связь и устройства', 'netcheck'], ['volume', 'Сильное шумоподавление', 'dfn'], ['music', 'Музыка под голос', 'music'], ['layout-sidebar', 'Раскладка «Рядом»', 'side'], ['eye-off', 'Скрыть своё окно', 'hideme'], ['lock', 'Приватная сессия со сквозным шифрованием', 'e2ee'], ['leaf', 'Режим практики', 'go-practice'], ['cards', 'Метафорические карты', 'go-cards'], ['device-mobile', 'Продолжить на телефоне', 'transfer'], ['settings', 'Настройки', 'go-settings']],
    group: [['users', 'Сессионные залы', 'go-breakout'], ['leaf', 'Режим практики', 'go-practice'], ['edit', 'Доска', 'go-board'], ['node', 'Расстановка', 'go-constellation'], ['cards', 'Метафорические карты', 'go-cards'], ['timer', 'Таймер для всех', 'timer'], ['door-exit', 'Перерыв: всех в зал ожидания', 'pause'], ['activity', 'Связь и устройства', 'netcheck'], ['settings', 'Настройки', 'go-settings']],
    stage: [['activity', 'Связь и устройства', 'netcheck'], ['volume', 'Сильное шумоподавление', 'dfn'], ['music', 'Музыка под голос', 'music'], ['cc', 'Язык субтитров', 'lang'], ['settings', 'Настройки', 'go-settings']],
    guest: [['activity', 'Связь и устройства', 'netcheck'], ['cc', 'Язык субтитров', 'lang'], ['wifi', 'Экономия трафика', 'eco'], ['phone', 'Звук по телефону — «Позвонить мне»', 'callme'], ['help', 'Сообщить о проблеме', 'report'], ['settings', 'Настройки', 'go-settings']],
  };
  const moreSheet = () => {
    const items = MORE[P.current.more || 'guest'];
    modal(`<div class="modal2__t">Ещё</div><div class="sheet-l">${items.map(([i, t, k]) => `<button data-act="m-${k}">${I(i, 'md')}<span>${t}</span>${I('chevron-right', 'sm', 'subtle')}</button>`).join('')}</div>`, { dark: true });
  };

  function netOverlay() {
    const vals = Array.from({ length: 40 }, (_, i) => 30 + Math.sin(i / 3) * 6 + Math.random() * 6);
    const graph = () => C.area(vals, { h: 130, labels: ['−2 мин', '−1 мин', 'сейчас'], max: 120 });
    modal(`<div class="modal2__t">Связь стабильная</div><div class="modal2__s">Ближний узел — Москва, 34 мс. Потерь почти нет.</div>
      <div class="card mt16" style="padding:16px"><div class="row t-sm"><b>Задержка, мс</b><span class="sp"></span><span class="mono" id="nc-now">34 мс</span></div><div id="nc-graph" class="mt8">${graph()}</div></div>
      <table class="tbl2 mt16"><thead><tr><th></th><th class="r">Звук</th><th class="r">Видео</th></tr></thead><tbody>${[['Потери', '0,1 %', '0,3 %'], ['Дрожание', '4 мс', '9 мс'], ['Скорость', '48 кбит/с', '2,1 Мбит/с'], ['Процессор', 'лёгкая нагрузка', '—'], ['Эхо', 'нет — вы в наушниках', '—']].map((r) => `<tr><td class="muted">${r[0]}</td><td class="r">${r[1]}</td><td class="r">${r[2]}</td></tr>`).join('')}</tbody></table>
      <div class="modal2__f">${btn('Только звук', { icon: 'video-off', act: 'toast', data: 'data-text="Видео выключено — вся сеть отдана звуку"' })}${btn('Отправить отчёт', { icon: 'send', act: 'm-report' })}</div>`, { dark: true, wide: true });
    const h = setInterval(() => { if (!$('#nc-graph')) return clearInterval(h); vals.shift(); vals.push(30 + Math.random() * 12); $('#nc-graph').innerHTML = graph(); $('#nc-now').textContent = Math.round(vals[vals.length - 1]) + ' мс'; }, 800);
  }
  P.netOverlay = netOverlay;

  const isHost = () => ['call', 'meeting', 'stage', 'practice', 'breakout', 'constellation', 'board', 'share', 'cards', 'pip'].includes(P.current.id);
  Object.assign(ROOM_ACTS, {
    mic: (el) => { const off = !el.classList.contains('is-off'); el.classList.toggle('is-off', off); el.innerHTML = I(off ? 'mic-off' : 'mic', 'md'); toast(off ? 'Микрофон выключен. Пробел — нажми и говори' : 'Микрофон включён', { icon: off ? 'mic-off' : 'mic' }); },
    camt: async (el) => {
      if (!S.camStream) { await P.cam.start(); P.cam.attach(); return; }
      const off = !el.classList.contains('is-off'); el.classList.toggle('is-off', off); el.innerHTML = I(off ? 'video-off' : 'video', 'md');
      $$('.tl--self').forEach((t) => t.classList.toggle('cam-off', off));
    },
    cc: (el) => { el.classList.toggle('is-on'); $('.rm')?.classList.toggle('subs-off', !el.classList.contains('is-on')); },
    hand: (el) => { el.classList.toggle('is-on'); toast(el.classList.contains('is-on') ? 'Рука поднята — вы третья в очереди' : 'Рука опущена', { icon: 'hand' }); },
    react: (el) => {
      let pop = $('.rpop'); if (pop) return pop.remove();
      const set = P.current.gentle ? ['🙏', '💛', '🌿', '🤝', '✨', '👏'] : ['👏', '❤️', '🙏', '😊', '💡', '🌿'];
      pop = document.createElement('div'); pop.className = 'rpop';
      pop.innerHTML = set.map((e) => `<button data-e="${e}" aria-label="${e}">${e}</button>`).join('') + `<span class="rpop__sep"></span>${['да', 'нет', 'медленнее', 'быстрее', 'отошёл'].map((t) => `<button class="nv" data-nv="${t}">${t}</button>`).join('')}`;
      // панель кнопок прокручивается и обрезала бы меню — кладём его в саму комнату над кнопкой
      const host = el.closest('.rm, .mcall2') || document.body; host.appendChild(pop);
      const hr = host.getBoundingClientRect(), br = el.getBoundingClientRect();
      pop.style.left = Math.max(170, Math.min(hr.width - 190, br.left - hr.left + br.width / 2)) + 'px'; pop.style.bottom = (hr.bottom - br.top + 10) + 'px';
      pop.onclick = (ev) => { const b = ev.target.closest('button'); if (!b) return; ev.stopPropagation(); if (b.dataset.e) P.flyEmoji(b.dataset.e); else toast(`Ответ «${b.dataset.nv}» — ведущая видит счётчик, а не имена`); pop.remove(); };
    },
    pn: (el) => P.openPanel(el.dataset.p),
    pclose: (el) => { el.closest('.pn').classList.remove('is-open'); $$('[data-act="pn"]').forEach((b) => b.classList.remove('is-on')); },
    more: moreSheet,
    disclose: () => modal(`<div class="row"><span class="rec-dot"></span><div class="modal2__t" style="padding:0">Запись, субтитры и Юя</div></div><div class="modal2__s">Эту плашку видят все. Сигнал «запись началась» прозвучал у каждого. Согласие собрано на входе, по каждой цели отдельно.</div>
      <table class="tbl2 mt16"><tbody>${[['Запись по дорожкам', 'хранится в Москве 90 дней'], ['Расшифровка', 'по ходу встречи, итоги через 10 минут'], ['Юя', 'итоги и заметки видит только специалист'], ['Кто открывал запись', 'клиент видит журнал доступа']].map(([a, b]) => `<tr><td>${a}</td><td class="muted r">${b}</td></tr>`).join('')}</tbody></table>
      ${isHost() ? `<div class="modal2__f">${btn('Пауза записи', { icon: 'pause', act: 'recpause' })}${btn('Выключить Юю', { icon: 'bolt-off', act: 'toast', data: 'data-text="Юя выключена в этой встрече. Быстрые команды и фильтр чата работают"' })}</div>` : `<div class="modal2__f">${btn('Попросить не записывать меня', { act: 'toast', data: 'data-text="Ведущая получила вашу просьбу. Ваша дорожка не попадёт в запись"' })}</div>`}`, { dark: true }),
    recpause: () => { closeModal(); $$('.rec-pill').forEach((r) => (r.innerHTML = `${I('pause', 'xs')} Запись на паузе`)); toast('Запись на паузе — у всех прозвучал сигнал', { icon: 'pause' }); },
    leave: () => {
      const host = isHost();
      modal(`<div class="modal2__t">${host ? 'Завершить встречу?' : 'Выйти из встречи?'}</div><div class="modal2__s">${host ? 'Завершение для всех остановит запись. Минуту можно будет отменить.' : 'Вернуться можно по той же ссылке.'}</div>
        <div class="modal2__f">${host ? `${btn('Только выйти', { act: 'justleave', size: 'lg' })}${btn('Завершить для всех', { kind: 'danger', act: 'endall', size: 'lg' })}` : btn('Выйти', { kind: 'danger', act: 'justleave', size: 'lg' })}</div>`, { dark: true });
    },
    justleave: () => { closeModal(); go(['viewer', 'viewer-mobile', 'replay', 'lobby'].includes(P.current.id) ? 'event-page' : isHost() ? 'hub' : 'end'); },
    endall: () => { const from = P.current.id; closeModal(); go('end', { from }); later(300, () => toast('Встреча завершена. Отменить можно ещё 60 секунд', { undo: () => go(from) })); },
    netcheck: netOverlay,
    callme: () => modal(`<div class="modal2__t">Позвонить вам?</div><div class="modal2__s">Звук пойдёт по обычной телефонной сети, видео и чат останутся в браузере. Выручает, когда мобильный интернет совсем слабый.</div><label class="fld"><span class="fld__l">Номер</span><input class="in" value="+7 917 ••• 12-40"></label><div class="modal2__f">${btn('Позвонить', { kind: 'primary', size: 'lg', icon: 'phone', act: 'toast', data: 'data-text="Звоним… возьмите трубку — звук переключится сам"' })}</div>`, { dark: true }),
    'm-netcheck': netOverlay, 'm-callme': () => ROOM_ACTS.callme(),
    'm-go-practice': () => go('practice'), 'm-go-breakout': () => go('breakout'), 'm-go-board': () => go('board'), 'm-go-constellation': () => go('constellation'), 'm-go-cards': () => go('cards'), 'm-go-settings': () => go('settings'),
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
    'm-eco': () => modal(`<div class="modal2__t">Экономия трафика</div><div class="mt16">${pick([{ t: 'Автоматически' }, { t: '720p' }, { t: '360p' }, { t: 'Только говорящий' }, { t: 'Только звук' }])}</div>`, { dark: true }),
    'm-report': () => modal(`<div class="modal2__t">Сообщить о проблеме</div><div class="modal2__s">К сообщению сами приложатся данные о связи за последние 5 минут. Видео и звук не отправляются.</div><div class="mt16">${pick([{ t: 'Не слышно' }, { t: 'Плохое видео' }, { t: 'Эхо или шум' }, { t: 'Другое' }])}</div><label class="fld"><span class="fld__l">Что случилось</span><textarea class="in" rows="3" placeholder="Необязательно"></textarea></label><div class="modal2__f">${btn('Отправить', { kind: 'primary', size: 'lg', act: 'toast', data: 'data-text="Отчёт ушёл в поддержку. Юя ответит в этом окне"' })}</div>`, { dark: true }),
  });
  document.addEventListener('click', (ev) => { if (!ev.target.closest('.rpop, [data-act="react"]')) $('.rpop')?.remove(); });
})();

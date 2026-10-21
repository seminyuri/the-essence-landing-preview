(function () {
  const { D, S, add, I, av, esc, rub, num, toast, modal, closeModal, go, every, later, onLeave, ROOM_ACTS, $, $$ } = P;
  const G = 'Комната';

  // ── общие детали комнаты ───────────────────────────────────────────────
  const tile = (id, { big = false, self = false, speaking = false, muted = false, hand = false, name, extra = '', cls = '' } = {}) => {
    const p = P.person(id);
    return `<div class="tile ${big ? 'tile--big' : ''} ${self ? 'tile--self' : ''} ${speaking ? 'is-speaking' : ''} ${cls}" data-pid="${id}">
      <div class="tile__img" style="background-image:url(${p.photo})"></div>
      ${self ? '<video class="my-cam tile__cam" playsinline autoplay muted hidden></video>' : ''}
      <div class="tile__name">${muted ? I('mic-off', 'xs') : `<span class="eq"><i></i><i></i><i></i></span>`}<span>${esc(name || p.short || p.name)}${self ? ' (вы)' : ''}</span></div>
      ${hand ? `<span class="tile__hand">${I('hand', 'xs')}</span>` : ''}${extra}</div>`;
  };
  P.tile = tile;

  const dock = (opts = {}) => {
    const b = (act, icon, tip, cls = '', attrs = '') => `<button class="rbtn ${cls}" data-act="${act}" title="${tip}" ${attrs}>${I(icon, 'md')}<span class="rbtn__tip">${tip}</span></button>`;
    return `<div class="dock">
      ${b('mic', 'mic', 'Микрофон · пробел — нажми и говори')}${b('camt', 'cam', 'Камера')}
      ${opts.share === false ? '' : b('share', 'screen-share', 'Показать экран')}
      ${opts.rec === false ? '' : b('rec', 'circle-dot', 'Запись', 'is-rec')}
      ${b('cc', 'cc', 'Субтитры', opts.cc ? 'is-on' : '')}
      ${opts.hand === false ? '' : b('hand', 'hand', 'Поднять руку')}
      ${b('react', 'smile', 'Реакции')}
      ${opts.extra || ''}
      ${b('more', 'dots', 'Ещё')}
      <button class="rbtn rbtn--end" data-act="leave" title="Выйти">${I('phone-off', 'md')}</button></div>`;
  };
  P.dock = dock;

  const REACTIONS = ['👏', '❤️', '🙏', '😊', '💡', '🌿'];
  function flyEmoji(e, room = $('.room')) {
    const fx = $('.room__fx', room); if (!fx) return;
    const s = document.createElement('span');
    s.className = 'fly'; s.textContent = e;
    s.style.left = 10 + Math.random() * 80 + '%';
    s.style.setProperty('--dx', (Math.random() * 92 - 46) + 'px');
    s.style.setProperty('--rot', (Math.random() * 44 - 22) + 'deg');
    fx.appendChild(s); setTimeout(() => s.remove(), 3200);
  }
  P.flyEmoji = flyEmoji;

  function subtitles(lines, { speakerFn } = {}) {
    let i = 0;
    const host = $('.subs');
    if (!host) return;
    const typeLine = () => {
      if (!$('.subs')) return;
      const [who, text] = lines[i++ % lines.length];
      host.innerHTML = `<b>${esc(P.person(who).short)}</b> <span class="subs__t"></span>`;
      const t = $('.subs__t'); let k = 0;
      const h = every(45, () => { if (!t.isConnected) return clearInterval(h); t.textContent = text.slice(0, ++k); if (k >= text.length) clearInterval(h); });
      speakerFn && speakerFn(who);
    };
    typeLine(); every(5200, typeLine);
  }
  P.subtitles = subtitles;

  // ── общие действия комнаты ─────────────────────────────────────────────
  Object.assign(ROOM_ACTS, {
    mic: (el) => { el.classList.toggle('is-off'); el.innerHTML = el.innerHTML.replace(/#mic(-off)?"/, el.classList.contains('is-off') ? '#mic-off"' : '#mic"'); toast(el.classList.contains('is-off') ? 'Микрофон выключен' : 'Микрофон включён', { icon: el.classList.contains('is-off') ? 'mic-off' : 'mic' }); },
    camt: async (el) => {
      if (!S.camStream) { await P.cam.start(); P.cam.attach(); return; }
      el.classList.toggle('is-off'); $$('.tile--self').forEach((t) => t.classList.toggle('cam-off', el.classList.contains('is-off')));
    },
    share: (el) => {
      const room = $('.room'); el.classList.toggle('is-on');
      room.classList.toggle('is-sharing', el.classList.contains('is-on'));
      toast(el.classList.contains('is-on') ? 'Вы показываете вкладку «Карта Марии — PDF». Уведомления системы скрыты' : 'Показ остановлен', { icon: 'screen-share' });
    },
    rec: (el) => {
      const on = !el.classList.contains('is-paused');
      el.classList.toggle('is-paused', on);
      $$('.rec-ind').forEach((r) => r.classList.toggle('is-paused', on));
      toast(on ? 'Запись на паузе — у всех звучит сигнал «запись остановлена»' : 'Запись идёт — у всех звучит сигнал и видна плашка', { icon: 'circle-dot' });
    },
    cc: (el) => { el.classList.toggle('is-on'); $('.room')?.classList.toggle('subs-off', !el.classList.contains('is-on')); },
    hand: (el) => { el.classList.toggle('is-on'); toast(el.classList.contains('is-on') ? 'Рука поднята — вы третий в очереди' : 'Рука опущена', { icon: 'hand' }); },
    react: (el) => {
      let pop = $('.react-pop'); if (pop) return pop.remove();
      pop = document.createElement('div'); pop.className = 'react-pop';
      pop.innerHTML = REACTIONS.map((e) => `<button data-e="${e}">${e}</button>`).join('') + `<span class="react-pop__sep"></span>${['да', 'нет', 'медленнее', 'быстрее', 'отошёл'].map((t) => `<button class="nv" data-nv="${t}">${t}</button>`).join('')}`;
      el.parentElement.appendChild(pop);
      pop.onclick = (ev) => { const b = ev.target.closest('button'); if (!b) return; if (b.dataset.e) flyEmoji(b.dataset.e); else toast(`Невербальный ответ: «${b.dataset.nv}» — ведущий видит счётчик`); pop.remove(); };
    },
    leave: () => {
      const host = P.current.id === 'stage' || P.current.id === 'meeting' || P.current.id === 'call';
      modal(`<h2 class="pmodal__title">${host ? 'Завершить встречу?' : 'Выйти из встречи?'}</h2><p class="pmodal__lead">${host ? 'Завершение для всех остановит запись. Есть минута, чтобы отменить.' : 'Вы сможете вернуться по той же ссылке.'}</p>
        <div class="pmodal__actions">${host ? `<button class="btn btn--secondary" data-act="justleave">Только выйти</button><button class="btn btn--danger" data-act="endall">${I('phone-off')} Завершить для всех</button>` : `<button class="btn btn--danger" data-act="justleave">Выйти</button>`}</div>`, { dark: true });
    },
    justleave: () => { closeModal(); go(P.current.id === 'viewer' || P.current.id === 'viewer-mobile' ? 'event-page' : 'hub'); },
    endall: () => { closeModal(); go('end', { from: P.current.id }); toast('Встреча завершена. Отменить можно ещё 60 секунд', { undo: () => go('call') }); },
    netcheck: () => netOverlay(),
    more: (el) => moreSheet(el),
    panel: (el) => {
      const side = el.closest('.room').querySelector('.side'); const key = el.dataset.p;
      const open = !(side.classList.contains('is-open') && side.dataset.on === key);
      side.classList.toggle('is-open', open); side.dataset.on = key;
      $$('.side__tab', side).forEach((t) => t.classList.toggle('is-on', t.dataset.p === key));
      $$('.side__pane', side).forEach((p) => (p.hidden = p.dataset.p !== key));
      $$('[data-act="panel"]').forEach((b) => b.classList.toggle('is-on', open && b.dataset.p === key));
    },
    sidetab: (el) => { const side = el.closest('.side'); side.dataset.on = el.dataset.p; $$('.side__tab', side).forEach((t) => t.classList.toggle('is-on', t === el)); $$('.side__pane', side).forEach((p) => (p.hidden = p.dataset.p !== el.dataset.p)); },
    disclose: () => modal(`<div class="row" style="gap:8px"><span class="rec-dot"></span><h2 class="pmodal__title" style="margin:0">Запись · расшифровка · Юя</h2></div>
      <p class="pmodal__lead" style="margin-top:10px">Все участники видят эту плашку и слышали сигнал «запись началась». Согласие собрано на входе — по целям.</p>
      <table class="tbl" style="margin-top:12px"><tbody>${[['Запись по дорожкам', 'Москва · хранится 90 дней'], ['Расшифровка GigaAM', 'по ходу встречи, итоги ≤ 10 мин'], ['Юя', 'итоги и заметки — только специалисту'], ['Кто открывал запись', 'клиент видит журнал доступа']].map(([a, b]) => `<tr><td>${a}</td><td class="small muted">${b}</td></tr>`).join('')}</tbody></table>`, { dark: true }),
  });

  function netOverlay() {
    const vals = Array.from({ length: 40 }, (_, i) => 30 + Math.sin(i / 3) * 6 + Math.random() * 6);
    modal(`<div class="eyebrow eyebrow--accent">Проверка связи</div><h2 class="pmodal__title">Связь стабильная</h2>
      <div class="box" style="padding:12px;margin-top:8px"><div class="row small"><b>Задержка, мс</b><span class="sp"></span><span class="mono" id="nc-now">34 мс</span></div><div id="nc-graph">${C.area(vals, { h: 110, labels: ['−2 мин', '−1 мин', 'сейчас'], max: 120 })}</div></div>
      <div class="grid g2" style="gap:10px;margin-top:12px">
        <div class="box" style="padding:12px"><div class="small strong">${I('cpu', 'xs')} Нагрузка процессора</div><div class="cpu">${['лёгкая', 'средняя', 'высокая', 'критичная'].map((x, i) => `<span class="${i === 0 ? 'is-on' : ''}">${x}</span>`).join('')}</div></div>
        <div class="box" style="padding:12px"><div class="small strong">${I('headphones', 'xs')} Эхо</div><div class="small ok" style="margin-top:6px">Не обнаружено — вы в наушниках</div></div></div>
      <table class="tbl" style="margin-top:12px"><thead><tr><th></th><th class="num">Звук</th><th class="num">Видео</th><th class="num">Экран</th></tr></thead><tbody>
        ${[['Потери, ср / макс', '0,1 % / 0,8 %', '0,3 % / 2,1 %', '0 %'], ['Джиттер', '4 мс', '9 мс', '6 мс'], ['Битрейт', '48 кбит/с', '2,1 Мбит/с', '—'], ['Кодек', 'Opus + RED', 'VP9 · 1080p30', 'AV1'], ['Узел', 'msk-a · UDP', 'msk-a · UDP', '—']].map((r) => `<tr><td class="small muted">${r[0]}</td><td class="num small">${r[1]}</td><td class="num small">${r[2]}</td><td class="num small">${r[3]}</td></tr>`).join('')}</tbody></table>
      <div class="pmodal__actions" style="justify-content:flex-start"><button class="btn btn--secondary btn--sm" data-act="toast" data-text="Видео выключено — сеть освобождена для звука">${I('video-off')} Выключить видео</button><button class="btn btn--secondary btn--sm" data-act="toast" data-text="Принимаю только говорящего">${I('user')} В центре внимания</button><button class="btn btn--secondary btn--sm" data-act="callme">${I('phone')} Позвонить мне</button><span class="sp"></span><button class="btn btn--ghost btn--sm" data-act="toast" data-text="Отчёт о проблеме отправлен в поддержку с диагностикой — ответит Юя">${I('send')} Отчёт о проблеме</button></div>`, { dark: true, wide: true });
    const h = setInterval(() => { if (!$('#nc-graph')) return clearInterval(h); vals.shift(); vals.push(30 + Math.random() * 12); $('#nc-graph').innerHTML = C.area(vals, { h: 110, labels: ['−2 мин', '−1 мин', 'сейчас'], max: 120 }); $('#nc-now').textContent = Math.round(vals[vals.length - 1]) + ' мс'; }, 700);
  }
  ROOM_ACTS.callme = () => modal(`<div class="eyebrow eyebrow--accent">Звук по телефонной сети</div><h2 class="pmodal__title">Позвонить вам?</h2><p class="pmodal__lead">Сервер сам позвонит на ваш номер — звук пойдёт по телефону, а видео и чат останутся в браузере. Пригодится, если интернет совсем слабый.</p><label class="lbl">Номер</label><input class="inp" value="+7 917 ••• 12-40"><div class="pmodal__actions"><button class="btn btn--primary" data-act="toast" data-text="Звоним… возьмите трубку — звук переключится сам">${I('phone')} Позвонить</button></div>`, { dark: true });

  function moreSheet(el) {
    const id = P.current.id;
    const items = {
      call: [['leaf', 'Режим практики', 'practice'], ['music', 'Музыка под голос', 'music'], ['volume', 'Сильное шумоподавление', 'dfn'], ['layout-sidebar', 'Раскладка «Рядом»', 'side'], ['eye-off', 'Скрыть себя', 'hideme'], ['lock', 'Приватная сессия (сквозное шифрование)', 'e2ee'], ['device-mobile', 'Перенести на телефон', 'transfer'], ['activity', 'Статистика связи', 'netcheck']],
      meeting: [['users', 'Сессионные залы', 'breakout'], ['edit', 'Доска', 'board'], ['node', 'Расстановка', 'constellation'], ['timer', 'Таймер для всех', 'timer'], ['mic-off', 'Выключить микрофоны всем', 'muteall'], ['ban', '«Остановить всё»', 'stopall'], ['circle-dot', 'Запросить запись', 'askrec'], ['activity', 'Статистика связи', 'netcheck']],
    }[id] || [['activity', 'Статистика связи', 'netcheck'], ['cc', 'Язык субтитров', 'lang'], ['volume', 'Экономия трафика', 'eco'], ['help', 'Помощь — ответит Юя', 'help']];
    modal(`<div class="sheet-list">${items.map(([i, t, k]) => `<button class="sheet-i" data-act="m-${k}">${I(i, 'md')}<span>${t}</span>${I('chevron-right', 'sm', 'subtle')}</button>`).join('')}</div>`, { dark: true });
  }
  Object.assign(ROOM_ACTS, {
    'm-practice': () => go('practice'), 'm-breakout': () => go('breakout'), 'm-board': () => go('board'), 'm-constellation': () => go('constellation'),
    'm-netcheck': () => netOverlay(),
    'm-music': () => modal(`<div class="eyebrow eyebrow--accent">Музыка под голос</div><h2 class="pmodal__title">Фон для практики</h2>${['Тибетские чаши · 432 Гц', 'Дождь и далёкий гром', 'Пианино — медленно'].map((t, i) => `<div class="lrow">${I('music')}<div class="lrow__main small">${t}</div><button class="tgl ${i ? '' : 'is-on'}" data-act="tgl"></button></div>`).join('')}<div class="pmodal__note">${I('volume')} Автоприглушение: музыка тише, когда вы говорите. Смешивается на вашем устройстве и идёт одной стереодорожкой — у вас должны быть наушники.</div>`, { dark: true }),
    'm-dfn': () => { closeModal(); toast('Сильное шумоподавление DeepFilterNet включено · шумодав браузера выключен, чтобы не портить голос', { icon: 'volume' }); },
    'm-side': () => { closeModal(); $('.room')?.classList.toggle('layout-side'); },
    'm-hideme': () => { closeModal(); $('.room')?.classList.toggle('hide-self'); toast('Своё окно скрыто — меньше усталости на долгой сессии'); },
    'm-e2ee': () => modal(`<div class="eyebrow eyebrow--accent">Приватная сессия</div><h2 class="pmodal__title">Сквозное шифрование</h2><p class="pmodal__lead">Звук и видео шифруются на ваших устройствах — сервер видит только шифр. Честно: в такой сессии нет записи, расшифровки и Юи.</p><div class="pmodal__actions"><button class="btn btn--secondary" data-act="close-modal">Остаться как есть</button><button class="btn btn--primary" data-act="e2eeon">${I('lock')} Включить</button></div>`, { dark: true }),
    e2eeon: () => { closeModal(); $('.room')?.classList.add('is-e2ee'); toast('Сквозное шифрование включено · запись и Юя выключены для этой сессии', { icon: 'lock' }); },
    'm-transfer': () => modal(`<div class="eyebrow eyebrow--accent">Перенести на это устройство</div><h2 class="pmodal__title">Продолжить с телефона</h2><div style="display:grid;place-items:center;padding:10px">${C.qr(180, 5)}</div><p class="pmodal__lead small" style="text-align:center">Без зала ожидания и повторного входа. Компьютер отключится сам, как только телефон подключится.</p>`, { dark: true }),
    'm-timer': () => { closeModal(); const pill = $('.room-timer'); if (pill) { pill.hidden = false; let s = 300; const h = every(1000, () => { s--; pill.querySelector('b').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; if (s <= 0) clearInterval(h); }); } toast('Таймер 5:00 виден всем'); },
    'm-muteall': () => { closeModal(); $$('.tile:not(.tile--self) .tile__name').forEach((n) => (n.innerHTML = n.innerHTML.replace(/<span class="eq">.*?<\/span>/, P.I('mic-off', 'xs')))); toast('Микрофоны выключены у всех, кроме ведущих', { undo: () => {} }); },
    'm-stopall': () => modal(`<h2 class="pmodal__title">«Остановить всё»?</h2><p class="pmodal__lead">У всех, кроме ведущих, выключатся видео, звук, показ экрана и чат. Пригодится при атаке на встречу.</p><div class="pmodal__actions"><button class="btn btn--secondary" data-act="close-modal">Отмена</button><button class="btn btn--danger" data-act="stopallgo">${I('ban')} Остановить</button></div>`, { dark: true }),
    stopallgo: () => { closeModal(); toast('Всё остановлено. Юя сообщила участникам, что вы разбираетесь', { icon: 'ban', undo: () => {} }); },
    'm-askrec': () => { closeModal(); toast('Запрос записи отправлен ведущей'); },
    'm-lang': () => modal(`<h2 class="pmodal__title">Язык субтитров</h2><div class="choice">${['Русский (оригинал)', 'English — перевод в браузере', 'Deutsch — перевод в браузере', 'עברית — перевод на сервере', 'Español — перевод в браузере'].map((x, i) => `<div class="choice__item ${i ? '' : 'is-on'}" data-act="choice"><span class="choice__radio"></span><div class="choice__title small">${x}</div></div>`).join('')}</div>`, { dark: true }),
    'm-eco': () => modal(`<h2 class="pmodal__title">Экономия трафика</h2><div class="choice">${['Авто', '720p', '360p', 'Одно видео — говорящий', 'Только звук'].map((x, i) => `<div class="choice__item ${i ? '' : 'is-on'}" data-act="choice"><span class="choice__radio"></span><div class="choice__title small">${x}</div></div>`).join('')}</div>`, { dark: true }),
    'm-help': () => { closeModal(); toast('Юя: «Чем помочь? Я вижу, что у вас всё в порядке со связью — 34 мс, потерь нет»', { icon: 'sparkles' }); },
    choice: P.choiceAct, seg: P.segAct, tgl: P.tglAct,
  });

  // ───────────────────────────── разговор 1:1 — специалист ─────────────────────────────
  const YU_ANS = {
    'Что Мария говорила про отца в начале?': 'На 06:40 Мария сказала: «папа всегда спрашивал, почему не пятёрка». На 11:15 — что «перед планёркой слышу его голос». Связь со страхом оценки звучит второй раз за две встречи.',
    'Транзиты на этот месяц': 'Сатурн в квадрате к Солнцу Марии до 9 ноября — тема ответственности и оценки. Юпитер по 5-му дому — поддержка творческого самовыражения. Подойдёт к разговору о выступлениях.',
    'Сколько раз звучало «страшно»?': 'Пять раз за 18 минут, из них три — про планёрку. Дважды рядом со словом «папа».',
  };
  const notesHtml = () => `<div class="notes">${[['Запрос', 'Тревога перед выступлениями, сон перед планёрками'], ['Ключевые темы', 'Страх оценки; связь с отцом («почему не пятёрка»)'], ['Техники', 'Сократический диалог, «пустой стул» — продолжаем'], ['Домашнее задание', ''], ['Динамика', 'Первый успешный отказ 19 окт — опора']].map(([a, b]) => `<label class="notes__f"><span>${a}</span><textarea class="inp" rows="2" placeholder="…">${b}</textarea></label>`).join('')}
    <div class="row tiny subtle" style="gap:6px">${I('lock', 'xs')} Только вам · сохранено 09:58</div>
    <div class="yu-sugg"><span class="yu">${I('sparkles')}</span><span class="small">Добавить в ДЗ: «записывать мысли перед планёркой — 3 раза»?</span><button class="btn btn--secondary btn--sm" data-act="addhw">Добавить</button></div></div>`;

  add({
    id: 'call', group: G, title: 'Сессия 1:1 — специалист', icon: 'video', phase: 'фаза 4', plan: '§ 6.1; § 5.23 — инструменты практика; § 5.10 — профили 1:1',
    desc: 'Собеседник крупно, своё окно перетаскивается. Справа — карточка клиента, приватные заметки в профессиональной структуре, приватная Юя по живой расшифровке, астро-карта с «Показать всем», чат. Мягкое напоминание о конце сессии.',
    tips: ['Вкладка «Юя» — спросите про начало сессии', '«Астро» → «Показать всем»: карта становится общим инструментом', '«Ещё» → режим практики, приватная сессия, перенос на телефон', 'Своё окно можно перетащить'],
    acts: {
      ask: (el) => { const q = el.dataset.q || $('#yu-q').value.trim(); if (!q) return; const log = $('#yu-log');
        log.insertAdjacentHTML('beforeend', `<div class="qa__q fade-up">${esc(q)}</div><div class="qa__a fade-up"><span class="yu">${I('sparkles')}</span><div><span class="small typing">Ищу в расшифровке…</span></div></div>`);
        $('#yu-q').value = ''; log.scrollTop = log.scrollHeight;
        later(900, () => { const a = $$('.qa__a', log).pop(); a.lastElementChild.innerHTML = `<div class="small">${esc(YU_ANS[q] || 'По расшифровке: Мария трижды вернулась к теме сна и дважды — к работе. Предлагаю спросить, что изменилось после отказа 19 октября.')}</div><div class="row" style="gap:6px;margin-top:8px"><button class="btn btn--ghost btn--sm" data-act="sharechat">${I('share')} Поделиться в чат</button><button class="btn btn--ghost btn--sm" data-act="tonote">${I('notes')} В заметки</button></div>`; log.scrollTop = log.scrollHeight; }); },
      sharechat: () => toast('Ответ отправлен в чат сессии — Мария его видит'),
      tonote: () => toast('Добавлено в заметки сессии'),
      addhw: (el) => { el.closest('.yu-sugg').innerHTML = `<span class="pill pill--ok">${I('check', 'xs')} Задание добавлено — Мария увидит его после сессии</span>`; },
      showall: () => { $('.room').classList.add('is-tool'); toast('Карта показана всем — это живой инструмент, а не картинка экрана', { icon: 'stars' }); },
      hidetool: () => $('.room').classList.remove('is-tool'),
      transits: (el) => { el.classList.toggle('is-on'); $$('.natal-host').forEach((h) => (h.innerHTML = C.natal(h.dataset.size ? +h.dataset.size : 300, { transits: el.classList.contains('is-on') }))); },
      chatsend: () => { const i = $('#c-in'); if (!i.value.trim()) return; $('#c-log').insertAdjacentHTML('beforeend', `<div class="bub bub--me fade-up">${esc(i.value)}</div>`); i.value = ''; },
      hw: (el) => el.classList.toggle('is-done'),
    },
    render() {
      const c = D.client;
      return `<div class="room room--call" data-theme="dark">
        <div class="room__top"><div class="room__title">${av('maria', 26)}<b>Мария Иванова</b><span class="muted">· 9-я встреча</span></div>
          <span class="room__clock mono" id="clock">12:04</span><span class="tiny muted">из 60 мин</span><span class="sp"></span>
          <button class="rec-ind" data-act="disclose"><span class="rec-dot"></span>Запись · расшифровка · Юя</button>
          <span class="e2ee-ind pill">${I('lock', 'xs')} сквозное шифрование</span>
          <button class="rtag" data-act="netcheck">${I('signal', 'xs')} 34 мс</button></div>
        <div class="room__body">
          <div class="stage stage--call">
            ${tile('maria', { big: true, speaking: true, cls: 'tile--remote' })}
            ${tile('anna', { self: true })}
            <div class="shared-tool"><div class="shared-tool__head"><span class="pill pill--accent">${I('stars', 'xs')} Карта Марии · видят оба</span><span class="sp"></span><button class="btn btn--secondary btn--sm" data-act="hidetool">${I('video')} Вернуть видео</button></div><div class="natal-host natal-host--big" data-size="520">${C.natal(520, { pointer: 112 })}</div><div class="tiny muted" style="text-align:center">Нажмите на карту — указка видна Марии</div></div>
            <div class="share-mock"><div class="share-mock__bar">${I('screen-share', 'xs')} Вы показываете вкладку «Карта Марии — PDF» · <a data-act="share">Остановить</a></div><div class="share-mock__page">${C.natal(360)}</div></div>
            <div class="subs"></div><div class="room__fx"></div>
          </div>
          <aside class="side is-open" data-on="client">
            <div class="side__tabs">${[['client', 'Клиент'], ['notes', 'Заметки'], ['yuia', 'Юя'], ['astro', 'Астро'], ['chat', 'Чат']].map(([k, t]) => `<button class="side__tab ${k === 'client' ? 'is-on' : ''}" data-act="sidetab" data-p="${k}">${t}</button>`).join('')}</div>
            <div class="side__pane" data-p="client"><div class="row" style="gap:12px">${av('maria', 48)}<div><div class="strong">Мария Иванова, ${c.age}</div><div class="tiny muted">${c.city} · ${c.since} · ${c.sessions} встреч</div></div></div>
              <div class="kv"><span>Запрос</span><b>${c.request}</b><span>Рождение</span><b>${c.birth}, ${c.city}</b><span>Оплаты</span><b>${c.paid}</b><span>Согласие</span><b class="ok">${c.consent}</b></div>
              <div class="tiny muted" style="margin-top:14px">Тревога по GAD-7, 8 встреч</div><div class="row" style="gap:10px">${C.spark(c.scores.map((x) => x.v), 200, 40)}<b class="ok">15 → 7</b></div>
              <div class="tiny muted" style="margin-top:14px">Домашние задания</div>${c.homework.map((h) => `<button class="hw ${h.done ? 'is-done' : ''}" data-act="hw">${I('square-check', 'sm')}<span>${h.t}</span></button>`).join('')}
              <div class="tiny muted" style="margin-top:14px">Прошлые встречи</div>${c.history.map((h) => `<div class="small" style="margin-top:6px"><span class="mono tiny subtle">${h.d}</span> ${h.t}</div>`).join('')}
              <button class="btn btn--secondary btn--sm" style="margin-top:14px" data-go="client">${I('external-link')} Карточка целиком</button></div>
            <div class="side__pane" data-p="notes" hidden>${notesHtml()}</div>
            <div class="side__pane side__pane--qa" data-p="yuia" hidden><div class="tiny muted" style="margin-bottom:8px">${I('lock', 'xs')} Видите только вы · контекст: живая расшифровка, карточка, астро-данные</div>
              <div class="qa" id="yu-log"></div>
              <div class="qa__presets">${Object.keys(YU_ANS).map((q) => `<button class="chipq" data-act="ask" data-q="${q}">${q}</button>`).join('')}</div>
              <div class="side__in"><input class="inp" id="yu-q" placeholder="Спросить Юю приватно…"><button class="rbtn" data-act="ask">${I('send')}</button></div></div>
            <div class="side__pane" data-p="astro" hidden><div class="row"><div class="strong small sp">Натальная карта · движок Сути</div><button class="chipq" data-act="transits">Транзиты на сегодня</button></div><div class="natal-host" style="margin-top:8px">${C.natal(300)}</div>
              <div class="small muted">Солнце в Рыбах, Луна во Льве, Асцендент в Раке · время рождения точное</div><button class="btn btn--primary btn--sm" style="margin-top:12px" data-act="showall">${I('stars')} Показать всем</button></div>
            <div class="side__pane" data-p="chat" hidden><div class="chatlog" id="c-log"><div class="bub">Добрый день! Я уже здесь 🙂</div><div class="bub bub--me">Здравствуйте, Мария! Впускаю</div><div class="bub bub--card">${I('paperclip')} Дневник мыслей · 14–20 окт.pdf</div></div><div class="side__in"><input class="inp" id="c-in" placeholder="Сообщение Марии…"><button class="rbtn" data-act="chatsend">${I('send')}</button></div></div>
          </aside></div>
        <div class="room__bottom">${dock({ cc: true })}<div class="dock-side"><button class="rbtn is-on" data-act="panel" data-p="client" title="Карточка">${I('user', 'md')}</button><button class="rbtn" data-act="panel" data-p="yuia" title="Юя">${I('sparkles', 'md')}</button></div></div>
      </div>`;
    },
    mount(root) {
      P.cam.attach(root);
      let s = 12 * 60 + 4; every(1000, () => { s++; const el = $('#clock'); if (el) el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; });
      subtitles([['maria', 'Я всё-таки сказала ему «нет», и мир не рухнул…'], ['anna', 'Что вы почувствовали в теле в тот момент?'], ['maria', 'Сначала жар в груди, а потом как будто стало легче дышать'], ['anna', 'Давайте запомним это ощущение — это и есть опора']], {
        speakerFn: (w) => { $$('.tile', root).forEach((t) => t.classList.toggle('is-speaking', t.dataset.pid === w || (w === 'anna' && t.classList.contains('tile--self')))); },
      });
      dragPip($('.tile--self', root));
      later(9000, () => toast('Юя (только вам): Мария дважды связала страх оценки с отцом — возможно, стоит спросить', { icon: 'sparkles' }));
      later(26000, () => toast('Мягкое напоминание: до конца оплаченного времени 5 минут', { icon: 'clock' }));
      const host = $('.natal-host--big', root);
      host.addEventListener('click', (e) => { const r = host.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); const deg = (180 - Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360; host.innerHTML = C.natal(520, { pointer: deg }); });
      $('#yu-q', root).addEventListener('keydown', (e) => { if (e.key === 'Enter') this.acts.ask(e.target); });
      $('#c-in', root).addEventListener('keydown', (e) => { if (e.key === 'Enter') this.acts.chatsend(); });
    },
  });

  function dragPip(el) {
    if (!el) return;
    let sx, sy, ox, oy, drag = false;
    el.addEventListener('pointerdown', (e) => { drag = true; sx = e.clientX; sy = e.clientY; const r = el.getBoundingClientRect(), pr = el.parentElement.getBoundingClientRect(); ox = r.left - pr.left; oy = r.top - pr.top; el.setPointerCapture(e.pointerId); el.classList.add('is-drag'); });
    el.addEventListener('pointermove', (e) => { if (!drag) return; el.style.left = ox + e.clientX - sx + 'px'; el.style.top = oy + e.clientY - sy + 'px'; el.style.right = 'auto'; el.style.bottom = 'auto'; });
    el.addEventListener('pointerup', () => { drag = false; el.classList.remove('is-drag'); });
  }
  P.dragPip = dragPip;

  // ───────────────────────────── группа ─────────────────────────────
  add({
    id: 'meeting', group: G, title: 'Групповая встреча', icon: 'users', phase: 'фаза 4–5', plan: '§ 6.2; Приложение В, Ж — паритет с Zoom',
    desc: 'Сетка с говорящим в фокусе, раскладка «Круг» для групп, очередь рук по времени, участники, чат, вопросы с голосами, опросы с живыми результатами, невербальные ответы, таймер для всех, «Остановить всё», запрос записи.',
    tips: ['Раскладка «Круг» — как в живой группе', 'Опросы → «Запустить» — голоса приходят в реальном времени', '«Ещё» → таймер, сессионные залы, доска, расстановка'],
    acts: {
      layout: (el) => { $$('.lay button').forEach((b) => b.classList.toggle('is-on', b === el)); const g = $('.stage--grid'); g.dataset.layout = el.dataset.l; const ts = $$('.tile', g); ts.forEach((t, i) => t.style.setProperty('--a', (360 / ts.length * i - 90) + 'deg')); },
      admit: (el) => { el.closest('.lrow').remove(); toast('Впущен(а) из зала ожидания'); },
      stage: (el) => toast(`${el.dataset.n} может говорить — микрофон разрешён`, { icon: 'mic' }),
      vote: (el) => { const n = el.querySelector('.qv'); n.textContent = +n.textContent + 1; el.classList.add('is-on'); },
      poll: (el) => { el.outerHTML = '<span class="pill pill--live">идёт</span>'; const bars = $$('.poll__opt i'); let k = 0; const h = every(300, () => { k++; bars.forEach((b, i) => { const v = Math.min([62, 24, 14][i], k * [4, 2, 1][i]); b.style.width = v + '%'; b.parentElement.nextElementSibling.textContent = v + ' %'; }); if (k > 20) clearInterval(h); }); },
      recreq: (el) => { el.closest('.req').remove(); toast(el.dataset.ok ? 'Запись включена — все услышали сигнал' : 'Запрос отклонён'); },
      gsend: () => { const i = $('#g-in'); if (!i.value.trim()) return; $('#g-log').insertAdjacentHTML('beforeend', P.msgHtml({ who: 'anna', text: i.value })); i.value = ''; },
    },
    render() {
      const ids = D.group;
      return `<div class="room room--meeting" data-theme="dark">
        <div class="room__top"><div class="room__title"><b>Группа «Опора»</b><span class="muted">· 6-я встреча · 12 участников</span></div><span class="room__clock mono" id="gclock">38:12</span>
          <span class="room-timer pill pill--accent" hidden>${I('timer', 'xs')} <b>5:00</b></span><span class="sp"></span>
          <div class="seg lay"><button class="is-on" data-act="layout" data-l="grid">Сетка</button><button data-act="layout" data-l="speaker">Говорящий</button><button data-act="layout" data-l="circle">Круг</button></div>
          <button class="rec-ind" data-act="disclose"><span class="rec-dot"></span>Запись</button><button class="rtag" data-act="netcheck">${I('signal', 'xs')} 41 мс</button></div>
        <div class="room__body">
          <div class="stage stage--grid" data-layout="grid">${ids.map((id, i) => tile(id, { self: id === 'anna', speaking: i === 3, muted: [2, 5, 9].includes(i), hand: [4, 8].includes(i) })).join('')}<div class="subs"></div><div class="room__fx"></div>
            <div class="req"><span>${av('kira', 24)} Кира просит записать встречу</span><button class="btn btn--primary btn--sm" data-act="recreq" data-ok="1">Одобрить</button><button class="btn btn--ghost btn--sm" data-act="recreq">Отклонить</button></div></div>
          <aside class="side is-open" data-on="people">
            <div class="side__tabs">${[['people', 'Участники'], ['chat', 'Чат'], ['qa', 'Вопросы'], ['polls', 'Опросы']].map(([k, t]) => `<button class="side__tab ${k === 'people' ? 'is-on' : ''}" data-act="sidetab" data-p="${k}">${t}</button>`).join('')}</div>
            <div class="side__pane" data-p="people"><div class="tiny muted">Зал ожидания · 2</div>${['zoya', 'gleb'].map((id) => `<div class="lrow" style="padding:8px 2px">${av(id, 28)}<div class="lrow__main small">${P.person(id).name}<div class="tiny muted">${id === 'zoya' ? 'записана в группу' : 'незнакомый · по ссылке'}</div></div><button class="btn btn--primary btn--sm" data-act="admit">Впустить</button></div>`).join('')}
              <div class="tiny muted" style="margin-top:12px">Руки · по времени поднятия</div>${['vera', 'lev'].map((id, i) => `<div class="lrow" style="padding:8px 2px"><span class="pill">${i + 1}</span>${av(id, 28)}<div class="lrow__main small">${P.person(id).name}<div class="tiny muted">${i ? '0:47' : '2:13'} назад</div></div><button class="btn btn--secondary btn--sm" data-act="stage" data-n="${P.person(id).short}">Дать слово</button></div>`).join('')}
              <div class="tiny muted" style="margin-top:12px">В комнате · 12</div>${ids.slice(0, 8).map((id) => `<div class="lrow" style="padding:6px 2px">${av(id, 26)}<div class="lrow__main small">${P.person(id).name}${id === 'anna' ? ' · ведущая' : ''}</div>${I('mic', 'xs', 'subtle')}</div>`).join('')}</div>
            <div class="side__pane" data-p="chat" hidden><div class="chatlog" id="g-log">${D.chatSeed.slice(0, 4).map(P.msgHtml).join('')}</div><div class="side__in"><input class="inp" id="g-in" placeholder="Сообщение всем…"><button class="rbtn" data-act="gsend">${I('send')}</button></div></div>
            <div class="side__pane" data-p="qa" hidden>${D.questions.slice(0, 4).map((q) => `<button class="qcard" data-act="vote"><span class="qv">${Math.round(q.votes / 20)}</span><span class="small">${q.text}</span></button>`).join('')}<div class="tiny muted" style="margin-top:8px">Анонимные вопросы включены</div></div>
            <div class="side__pane" data-p="polls" hidden><div class="poll"><div class="strong small">Насколько вы сейчас в контакте с телом?</div>${['Хорошо чувствую', 'Частично', 'Почти не чувствую'].map((o) => `<div class="poll__row"><span class="small">${o}</span><div class="poll__opt"><i style="width:0"></i></div><span class="tiny mono">0 %</span></div>`).join('')}<div class="row" style="margin-top:10px"><span class="tiny muted sp">анонимно · 12 участников</span><button class="btn btn--primary btn--sm" data-act="poll">Запустить</button></div></div>
              <div class="tiny muted" style="margin-top:12px">Библиотека: шкала самочувствия до/после, «что забираете с собой», викторина по теме</div></div>
          </aside></div>
        <div class="room__bottom">${dock({ cc: true })}<div class="dock-side"><button class="rbtn is-on" data-act="panel" data-p="people" title="Участники">${I('users', 'md')}<span class="rbtn__badge">2</span></button><button class="rbtn" data-act="panel" data-p="chat" title="Чат">${I('message-circle', 'md')}</button></div></div></div>`;
    },
    mount(root) {
      P.cam.attach(root);
      let s = 38 * 60 + 12; every(1000, () => { s++; const el = $('#gclock'); if (el) el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; });
      subtitles([['kira', 'Я заметила, что тревога приходит, когда я одна вечером'], ['anna', 'Кира, что помогает в такие вечера?'], ['timur', 'У меня похоже — я начинаю листать телефон'], ['vera', 'А мне помогает записать три мысли на бумагу']], {
        speakerFn: (w) => $$('.tile', root).forEach((t) => t.classList.toggle('is-speaking', t.dataset.pid === w)),
      });
      every(2600, () => { if (Math.random() > .5) flyEmoji(['🙏', '❤️', '🌿'][Math.floor(Math.random() * 3)], root); });
      $('#g-in', root).addEventListener('keydown', (e) => { if (e.key === 'Enter') this.acts.gsend(); });
    },
  });

  // ───────────────────────────── клиент на телефоне ─────────────────────────────
  add({
    id: 'call-mobile', group: G, title: 'Сессия 1:1 — клиент с телефона', icon: 'device-mobile', frame: 'phone', pair: 'call', phase: 'фаза 4', plan: '§ 6.1 — долгие сессии с телефона; Приложение И — «В дороге», перенос, экономия трафика',
    desc: 'Аппаратный H.264 без симулкаста, Wake Lock, крупно собеседник. Режим «В дороге», перенос на ноутбук без повторного входа, экономия трафика, при слабой связи — «Позвонить мне».',
    acts: {
      road: (el) => { $('.mcall').classList.toggle('is-road'); el.classList.toggle('is-on'); },
      mmore: () => $('.msheet').classList.toggle('is-open'),
      weak: () => $('.weak').classList.remove('is-show'),
    },
    render() {
      return `<div class="mcall room" data-theme="dark"><div class="mcall__remote" style="background-image:url(img/people/p32.jpg)"></div>
        <div class="mcall__top"><span class="rec-dot"></span><span class="tiny">Анна Соколова · 23:41</span><span class="sp"></span><button class="mcall__ic" data-act="netcheck">${I('signal', 'xs')}</button></div>
        <div class="mcall__self tile--self" style="background-image:url(img/people/p26.jpg)"><video class="my-cam tile__cam" playsinline autoplay muted hidden></video></div>
        <div class="weak is-show">${I('wifi')} <span class="sp small">Связь слабая. Перевести звук на телефонную линию?</span><button class="btn btn--primary btn--sm" data-act="callme">Позвонить мне</button><button class="mcall__x" data-act="weak">${I('x', 'xs')}</button></div>
        <div class="mcall__road"><div class="mcall__road-av">${av('anna', 120, 'ring')}</div><div style="font-size:22px;font-weight:300;margin-top:16px">Анна Соколова</div><div class="small muted">только звук · крупные кнопки</div></div>
        <div class="subs subs--m"><b>Анна</b> Что вы почувствовали в теле в тот момент?</div><div class="room__fx"></div>
        <div class="mcall__dock"><button class="mbtn" data-act="mic">${I('mic', 'md')}</button><button class="mbtn" data-act="camt">${I('cam', 'md')}</button><button class="mbtn mbtn--end" data-act="leave">${I('phone-off', 'md')}</button><button class="mbtn" data-act="road">${I('route', 'md')}</button><button class="mbtn" data-act="mmore">${I('dots', 'md')}</button></div>
        <div class="msheet"><div class="msheet__h"></div>${[['device-desktop', 'Перенести на ноутбук', 'm-transfer'], ['volume', 'Экономия трафика', 'm-eco'], ['cc', 'Субтитры и перевод', 'm-lang'], ['phone', 'Позвонить мне', 'callme'], ['smile', 'Реакции', 'react'], ['activity', 'Проверка связи', 'netcheck']].map(([i, t, a]) => `<button class="sheet-i" data-act="${a}">${I(i, 'md')}<span>${t}</span></button>`).join('')}</div></div>`;
    },
    mount(root) { P.cam.attach(root); },
  });

  // ───────────────────────────── входящий звонок ─────────────────────────────
  add({
    id: 'incoming', group: G, title: 'Звонок клиенту одним нажатием', icon: 'phone', frame: 'phone', phase: 'фаза 4', plan: 'Приложение И — вызовы «как по телефону»; § 13 — звонок из чата',
    desc: 'Специалист звонит из карточки или чата — у клиента звонит веб-приложение. Принимать можно только от своих специалистов.',
    render() {
      return `<div class="incall" data-theme="dark"><div class="incall__bg" style="background-image:url(img/people/p32.jpg)"></div>
        <div class="incall__body"><div class="tiny muted">Суть · видеозвонок</div>${av('anna', 110, 'ring incall__av')}<h2>Анна Соколова</h2><div class="small muted">психолог · ваш специалист</div><div class="pill pill--accent" style="margin-top:10px">сессия по записи · 10:00</div></div>
        <div class="incall__btns"><div><button class="mbtn mbtn--end mbtn--xl" data-act="toast" data-text="Отклонено — Анна получит «перезвоню»">${I('phone-off', 'lg')}</button><span>Отклонить</span></div>
          <div><button class="mbtn mbtn--ok mbtn--xl" data-go="call-mobile">${I('video', 'lg')}</button><span>Принять</span></div></div>
        <div class="incall__note tiny">Звонки приходят только от ваших специалистов · <a data-act="toast" data-text="Можно запретить звонки или разрешить только в рабочие часы">настроить</a></div></div>`;
    },
  });
})();

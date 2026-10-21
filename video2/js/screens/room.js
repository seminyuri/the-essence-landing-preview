(function () {
  const { D, S, add, I, av, esc, rub, toast, modal, closeModal, go, every, later, onLeave, $, $$, btn, chip, seg, li, yuNote, note, opt } = P;
  const G = 'Сессия 1:1';
  const SUBS = [['maria', 'Девятнадцатого я всё-таки сказала ему «нет». Было страшно, но я сказала.'], ['anna', 'Что вам помогло в тот момент?'], ['maria', 'Наверное, то, что я заранее записала, что хочу сказать.'], ['anna', 'Давайте посмотрим на это как на опору — вы сделали это сами.']];

  // ── Юя у специалиста: вопросы и ответы языком психолога ─────────────────
  const YU = {
    'Что Мария говорила про отца в начале?': 'На 06:40: «папа всегда спрашивал, почему не пятёрка». На 11:15: «перед планёркой слышу его голос». Связь со страхом оценки звучит второй раз за две встречи.',
    'Что сейчас даёт ей опору?': 'Ясные договорённости и предсказуемость. Сегодня это видно в том, как она подготовилась к отказу — записала слова заранее. Хорошо работает телесное: дыхание она делает 7 вечеров подряд.',
    'Как бережно дать задание?': 'Мягкая структура, без директивного тона. Например: «Если захочется — запишите перед планёркой три мысли, которые звучат громче всего». Ей важно чувство выбора.',
    'Сколько раз звучало «страшно»?': 'Пять раз за 18 минут, три из них — про планёрку. Дважды рядом со словом «папа».',
  };
  const yuA = (a) => `<div class="qa2__a fade-up"><span class="yu2">${I('sparkles')}</span><div class="sp">${esc(a)}<div class="row mt8" style="gap:6px">${btn('Поделиться в чат', { size: 'sm', act: 'yushare' })}${btn('В заметки', { size: 'sm', act: 'yunote' })}</div></div></div>`;
  const yuAnswer = (q, a) => `<div class="qa2__q fade-up">${esc(q)}</div>${yuA(a)}`;
  const askYu = (q) => {
    const box = $('#yuqa'); if (!box) return;
    box.insertAdjacentHTML('beforeend', `<div class="qa2__q fade-up">${esc(q)}</div><div class="qa2__a fade-up" id="yuw"><span class="yu2">${I('sparkles')}</span><span class="dots3"><i></i><i></i><i></i></span></div>`);
    const sc = box.closest('.pn__b'); sc.scrollTop = sc.scrollHeight;
    later(900, () => { const w = $('#yuw'); if (!w) return; w.outerHTML = yuA(YU[q] || 'В разговоре этого пока не было. Я отмечу, когда тема прозвучит, — или спросите иначе.'); sc.scrollTop = sc.scrollHeight; });
  };

  const clientPane = () => { const c = D.client;
    return `<div class="row">${av('maria', 56)}<div><div class="h3" style="color:#F4EFE7">Мария Иванова, 35</div><div class="t-sm muted">Казань · с нами с июня · 9-я встреча</div></div></div>
      <div class="kv2 mt16"><span>Запрос</span><div>${esc(c.request)}</div><span>Оплата</span><div>${esc(c.balance)} · всего ${esc(c.paid)}</div><span>Согласие</span><div>запись, расшифровка, разбор Юей · подписано кодом 3 июня</div></div>
      <div class="pn__sec">Тревога по опроснику GAD-7</div><div class="card" style="padding:14px"><div class="row"><div class="h2" style="color:#F4EFE7">15 → 7</div><span class="sp"></span>${chip('−53 % за 8 встреч', 'ok')}</div><div class="mt8">${C.spark(c.scores.map((s) => s.v), 330, 48)}</div></div>
      <div class="pn__sec">Портрет от Юи</div><div class="card" style="padding:14px;font-size:15px;line-height:1.55">${esc(D.portrait.summary)}${D.portrait.points.map(([t, x]) => `<details class="pdet"><summary>${t}</summary><div class="muted">${esc(x)}</div></details>`).join('')}<div class="t-xs muted mt12">${I('sparkles', 'xs')} Юя учла анкету, переписку, сессии и дату рождения и пересказала языком психолога</div></div>
      <div class="pn__sec">Домашнее задание</div>${c.homework.map((h) => `<button class="hw2 ${h.done ? 'is-done' : ''}" data-act="hw"><span class="box">${h.done ? I('check', 'xs') : ''}</span><span>${esc(h.t)}</span></button>`).join('')}
      <div class="pn__sec">Прошлые встречи</div>${c.history.map((h) => li({ lead: `<span class="li__ic t-xs">${h.d}</span>`, t: esc(h.t.split(' · ')[0]), s: esc(h.t.split(' · ').slice(1).join(' · ')), go: 'recording' })).join('')}
      <div class="pn__sec">В других модулях</div><div class="row row--wrap" style="gap:6px">${[['users', 'Карточка в CRM', 'Карточка Марии в CRM откроется в новой вкладке — встреча не прервётся'], ['messenger', 'Переписка', 'Переписка с Марией откроется в новой вкладке'], ['wallet', 'Оплаты', '9 оплат на 58 500 ₽, следующая — 22 октября'], ['calendar', 'Следующая встреча', 'В календаре: ср, 22 октября, 10:00 — оплачено']].map(([ic, t, x]) => btn(t, { size: 'sm', icon: ic, act: 'toast', data: `data-text="${x}"` })).join('')}</div>`; };
  const notesPane = () => `${[['Запрос сегодня', 'Сон перед планёрками; первый отказ коллеге'], ['Ключевые темы', 'Страх оценки; связь с отцом («почему не пятёрка»)'], ['Техники', 'Сократический диалог; «пустой стул» — продолжаем'], ['Домашнее задание', ''], ['Динамика', 'Первый успешный отказ 19 октября — опора']].map(([a, b]) => `<label class="fld" style="margin-top:12px"><span class="fld__l" style="color:#B5AB9D">${a}</span><textarea class="in" rows="2">${b}</textarea></label>`).join('')}
    <div class="row mt12"><span class="t-xs muted sp">${I('lock', 'xs')} Только вам · сохранено 10:18</span>${btn('Поставить задачу', { size: 'sm', icon: 'square-check', act: 'toast', data: 'data-text="Задача в задачнике: «Подобрать статьи о дыхательных практиках» · ссылка на 32:10 · срок пятница"' })}</div><div class="mt16">${yuNote('Добавить в задание: «записывать мысли перед планёркой — три раза»?', btn('Добавить', { size: 'sm', act: 'addhw' }))}</div>`;
  const yuPane = () => `<div class="row" style="gap:8px">${btn('Догнать: последние 5 минут', { size: 'sm', icon: 'history', act: 'catchup' })}${btn('Найти в разговоре', { size: 'sm', icon: 'search', act: 'find' })}</div>
    <div class="qa2 mt16" id="yuqa">${yuAnswer('Что Мария говорила про отца в начале?', YU['Что Мария говорила про отца в начале?'])}</div>
    <div class="qpre">${Object.keys(YU).slice(1).map((q) => `<button data-act="ask" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div><div class="t-xs muted mt12">${I('lock', 'xs')} Ответы видите только вы. Юя слушает общую расшифровку, команды — только из вашего микрофона.</div>`;
  const agendaPane = () => `<div class="card" style="padding:14px"><div class="row"><span class="sp">Прошло 32 мин из 60</span><b>28 мин осталось</b></div><div class="ag__bar"><i style="width:53%"></i></div></div>
    <div class="mt12">${D.agenda.map((a) => `<div class="ag ${a.done ? 'is-done' : ''} ${a.now ? 'is-now' : ''}"><span class="ag__m">${a.min} мин</span><span class="sp">${esc(a.t)}</span>${a.done ? I('check', 'sm') : a.now ? chip('сейчас', 'accent') : ''}</div>`).join('')}</div>
    <div class="mt16">${yuNote('На отказ коллеге ушло 22 минуты из 20. Если хотите успеть про сон — через 3 минуты я тихо напомню.')}</div>`;
  const chatPane = () => `<div class="msgs">${[['maria', 'Я тут записала слова, которые сказала ему — прислать?'], ['anna', 'Да, пришлите, посмотрим вместе']].map(([w, t]) => `<div class="msg">${av(w, 32)}<div class="msg__b"><span class="msg__n">${P.person(w).short}</span><span class="msg__t">${t}</span></div></div>`).join('')}<div class="msg">${av('maria', 32)}<div class="msg__b"><span class="msg__n">Мария</span><div class="card mt8" style="padding:10px 12px">${I('file-text', 'sm')} слова_для_отказа.txt · 1 КБ</div></div></div></div>`;

  // перетаскивание своего окна в разговоре
  function dragSelf(root) {
    const el = $('.tl--self', root); if (!el) return;
    let drag = false, sx, sy, ox, oy;
    el.addEventListener('pointerdown', (e) => { drag = true; sx = e.clientX; sy = e.clientY; const r = el.getBoundingClientRect(), pr = el.parentElement.getBoundingClientRect(); ox = r.left - pr.left; oy = r.top - pr.top; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', (e) => { if (!drag) return; const pr = el.parentElement.getBoundingClientRect(); const x = Math.max(8, Math.min(pr.width - el.offsetWidth - 8, ox + e.clientX - sx)); const y = Math.max(8, Math.min(pr.height - el.offsetHeight - 8, oy + e.clientY - sy)); el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.right = 'auto'; el.style.bottom = 'auto'; });
    el.addEventListener('pointerup', () => { drag = false; });
  }

  // ───────────── разговор 1:1 — специалист ─────────────
  add({
    id: 'call', group: G, title: 'Сессия: экран специалиста', icon: 'video', more: 'host1', phase: 'фаза 4', plan: '§ 6.1, § 5.23, § 5.13, Приложение Ж.7',
    desc: 'Клиент крупно, своё окно перетаскивается. Справа — карточка клиента с портретом от Юи, заметки в профессиональной структуре, Юя для тихих вопросов, повестка с подсказками по времени, чат.',
    tips: ['Кнопки «Клиент», «Заметки», «Юя», «Повестка» внизу открывают панели', 'Спросите Юю — ответ видите только вы', 'Своё окно можно перетащить'],
    acts: {
      ask: (el) => askYu(el.dataset.q),
      yushare: () => toast('Ответ отправлен в чат встречи — Мария его видит'),
      yunote: () => toast('Добавлено в заметки к встрече', { icon: 'notes' }),
      catchup: () => { const box = $('#yuqa'); box.insertAdjacentHTML('beforeend', yuAnswer('Догнать: последние 5 минут', 'Мария рассказала про отказ коллеге 19 октября: подготовилась, записала слова. Вы предложили увидеть в этом опору. Она согласилась, но сказала, что «повезло». Стоит вернуться к этому «повезло».')); const sc = box.closest('.pn__b'); sc.scrollTop = sc.scrollHeight; },
      find: () => modal(`<div class="modal2__t">Найти в разговоре</div><input class="in mt16" value="планёрк" aria-label="Поиск"><div class="list mt12">${[['06:12', 'Мария: «…перед планёркой опять не спала»'], ['11:15', 'Мария: «…перед планёркой слышу его голос»'], ['24:02', 'Анна: «…что изменилось после планёрки?»']].map(([t, s]) => li({ lead: `<span class="mono accent">${t}</span>`, t: s })).join('')}</div>`, { dark: true }),
      hw: (el) => { el.classList.toggle('is-done'); el.querySelector('.box').innerHTML = el.classList.contains('is-done') ? I('check', 'xs') : ''; },
      'go-share': () => go('share'),
      addhw: (el) => { el.closest('.yu-note').outerHTML = chip(`${I('check', 'xs')} Добавлено в задание — Мария увидит его в своём кабинете`, 'ok'); },
    },
    render() {
      const panels = P.pn('client', 'Клиент', clientPane(), { open: true }) + P.pn('notes', 'Заметки', notesPane()) + P.pn('yu', 'Юя', yuPane(), { foot: `<input class="in" id="yuin" placeholder="Спросить Юю о встрече…">${btn('', { icon: 'send', act: 'yusend', kind: 'primary', cls: 'btn2--icon' })}` }) + P.pn('agenda', 'Повестка', agendaPane()) + P.pn('chat', 'Чат', chatPane(), { foot: `<input class="in" placeholder="Сообщение Марии…">${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'toast', data: 'data-text="Отправлено"' })}` });
      return P.room({ top: { title: 'Мария Иванова', sub: '· 9-я встреча', clock: '32:10' },
        stage: `<div class="st-call">${P.tl('maria', { remote: true, speaking: true })}${P.tl('anna', { self: true })}<div class="subs"></div><div class="dalerts" id="hints"></div></div>`,
        panels, bar: `${P.rbBase()}${P.rb('screen-share', '', 'go-share', { title: 'Показать экран' })}${P.rbPanel('client', 'user', 'Клиент', { on: true })}${P.rbPanel('notes', 'notes', 'Заметки')}${P.rbPanel('yu', 'sparkles', 'Юя', { dot: true })}${P.rbPanel('agenda', 'list-check', 'Повестка')}${P.rbPanel('chat', 'message-circle', 'Чат', { n: 1 })}${P.rbReact()}${P.rb('cc', '', 'cc', { on: true, title: 'Субтитры' })}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Завершить')}` });
    },
    mount(root) {
      P.cam.attach(root); dragSelf(root); P.clock(32 * 60 + 10); P.subtitles(SUBS, (w) => $$('.tl').forEach((t) => t.classList.toggle('is-speaking', t.dataset.pid === w)));
      this.acts.yusend = () => { const i = $('#yuin'); if (i.value.trim()) { P.openPanel('yu'); askYu(i.value.trim()); i.value = ''; } };
      $('#yuin').addEventListener('keydown', (e) => e.key === 'Enter' && this.acts.yusend());
      later(6000, () => { const h = $('#hints'); if (h) { h.innerHTML = `<div class="dalert"><span class="yu2">${I('sparkles')}</span><span>Осталось 28 минут. По повестке дальше — сон</span></div>`; later(6000, () => h.firstElementChild?.classList.add('is-out')); } });
    },
  });

  // ───────────── клиент с телефона ─────────────
  add({
    id: 'call-mobile', group: G, title: 'Сессия: клиент с телефона', icon: 'device-mobile', frame: 'phone', dark: true, pair: 'call', phase: 'фаза 4', plan: '§ 6.1, § 9 — мобильный интернет',
    desc: 'Специалист крупно, своё окно в углу. Слабая сеть — Юя предлагает «только звук» или «Позвонить мне». «В дороге» — экран гаснет, звук идёт.',
    tips: ['Через 3 секунды появится подсказка о слабой сети', '«Ещё» → «В дороге»', '«Ещё» → «Позвонить мне»'],
    acts: {
      msheet: () => { $('#cm-chat').classList.remove('is-open'); $('#cm-more').classList.toggle('is-open'); },
      road: () => { $('.mcall2').classList.toggle('is-road'); $$('.msheet2').forEach((x) => x.classList.remove('is-open')); },
      flip: () => { const s = $('.mcall2__self'); s.classList.toggle('is-back'); toast(s.classList.contains('is-back') ? 'Задняя камера — можно показать рисунок или записи' : 'Фронтальная камера', { icon: 'rotate' }); },
      audioout: () => modal(`<div class="modal2__t">Куда идёт звук</div><div class="mt12">${P.pick([{ t: 'AirPods Pro', s: 'подключены' }, { t: 'Динамик телефона' }, { t: 'Разговорный динамик', s: 'как обычный звонок — у уха' }])}</div>`),
      cmchat: () => { $('#cm-more').classList.remove('is-open'); $('#cm-chat').classList.add('is-open'); },
      cmclose: () => $$('.msheet2').forEach((x) => x.classList.remove('is-open')),
      cmsend: () => { const i = $('#cmin'); if (!i.value.trim()) return; $('#cmlog').insertAdjacentHTML('beforeend', `<div class="msg fade-up">${av('maria', 28)}<div class="msg__b"><span class="msg__n">Вы</span><span class="msg__t">${esc(i.value)}</span></div></div>`); i.value = ''; },
      audio: (el) => { el.closest('.weak2').remove(); toast('Только звук — видео вернётся само, когда сеть окрепнет'); },
      mmic: (el) => { el.classList.toggle('is-off'); el.querySelector('.mb__c').innerHTML = I(el.classList.contains('is-off') ? 'mic-off' : 'mic', 'md'); },
      mcam: (el) => { el.classList.toggle('is-off'); el.querySelector('.mb__c').innerHTML = I(el.classList.contains('is-off') ? 'video-off' : 'video', 'md'); },
    },
    render() {
      const mb = (act, icon, t, cls = '') => `<button class="mb ${cls}" data-act="${act}"><span class="mb__c">${I(icon, 'md')}</span>${t}</button>`;
      return `<div class="mcall2"><div class="mcall2__remote" style="background-image:url(img/people/p32.jpg)"></div>
        <div class="mcall2__top">${I('lock', 'sm')}<span class="sp b">Анна Соколова</span><span class="mono">32:10</span></div><div class="mcall2__self" style="background-image:url(img/people/p26.jpg)"><button class="mflip" data-act="flip" aria-label="Сменить камеру">${I('rotate', 'sm')}</button></div>
        <div class="subs" style="left:16px;right:16px;transform:none;max-width:none"><b>Анна</b>Давайте посмотрим на это как на опору</div>
        <div class="weak2"><span class="sp">Связь слабая. Оставить только звук?</span>${btn('Только звук', { size: 'sm', act: 'audio' })}${btn('Позвонить мне', { size: 'sm', act: 'callme' })}</div>
        <div class="road">${I('headphones', 'xl')}<div class="h2">Режим «В дороге»</div><div class="muted">Видео выключено, звук идёт. Экран можно заблокировать.</div>${btn('Вернуть видео', { act: 'road', kind: 'primary' })}</div>
        <div class="mcall2__dock">${mb('mmic', 'mic', 'Звук')}${mb('mcam', 'video', 'Видео')}${mb('msheet', 'dots', 'Ещё')}${mb('leave', 'phone-off', 'Выйти', 'mb--end')}</div>
        <div class="msheet2" id="cm-more"><div class="msheet2__h"></div><div class="sheet-l">${[['message-circle', 'Чат с Анной — файл, ссылка, слова', 'cmchat'], ['headphones', 'В дороге — только звук', 'road'], ['speaker', 'Куда идёт звук', 'audioout'], ['rotate', 'Сменить камеру', 'flip'], ['phone', 'Позвонить мне по телефону', 'callme'], ['calendar', 'Перенести встречу', 'resched'], ['cc', 'Субтитры', 'cc'], ['wifi', 'Связь', 'netcheck']].map(([i, t, a]) => `<button data-act="${a}">${I(i, 'md')}<span>${t}</span></button>`).join('')}</div></div>
        <div class="msheet2 msheet2--tall" id="cm-chat"><div class="msheet2__h"></div><div class="row"><b class="sp">Чат с Анной</b><button class="btn2 btn2--icon btn2--sm" data-act="cmclose" aria-label="Закрыть">${I('x')}</button></div>
          <div class="msgs mt12" id="cmlog"><div class="msg">${av('maria', 28)}<div class="msg__b"><span class="msg__n">Вы</span><span class="msg__t">Я записала слова, которые сказала ему, — прислать?</span></div></div><div class="msg">${av('anna', 28)}<div class="msg__b"><span class="msg__n">Анна</span><span class="msg__t">Да, пришлите, посмотрим вместе</span></div></div></div>
          <div class="row mt12">${btn('', { icon: 'paperclip', cls: 'btn2--icon', act: 'toast', data: 'data-text="Файл отправлен Анне — он останется в вашей переписке"' })}<input class="in" id="cmin" placeholder="Сообщение Анне…">${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'cmsend' })}</div></div></div>`;
    },
    mount() { this.acts.resched = () => { $$('.msheet2').forEach((x) => x.classList.remove('is-open')); modal(`<div class="modal2__t">Перенести встречу</div><div class="modal2__s">Свободные окна Анны на этой неделе:</div><div class="slots2 mt16">${['чт 10:00', 'чт 16:00', 'пт 11:00', 'пн 10:00'].map((s, i) => `<button class="${i ? '' : 'is-on'}" data-act="seg">${s}</button>`).join('')}</div><div class="modal2__f">${btn('Попросить перенос', { kind: 'primary', size: 'lg', act: 'toast', data: 'data-text="Анна получила просьбу о переносе"' })}</div>`); }; },
  });

  // ───────────── входящий звонок ─────────────
  add({
    id: 'incoming', group: G, title: 'Звонок клиенту одним нажатием', icon: 'phone', frame: 'phone', dark: true, phase: 'фаза 4', plan: '§ 13.4 — звонок из чата',
    desc: 'Специалист нажимает «Позвонить» в чате — у клиента на телефоне входящий. Принять — и сразу в разговоре, без ссылок и зала ожидания.',
    acts: { accept: () => go('call-mobile'), decline: () => modal(`<div class="modal2__t">Ответить сообщением</div><div class="sheet-l">${['Перезвоню через 10 минут', 'Сейчас не могу, напишу', 'Можно перенести на завтра?'].map((t) => `<button data-act="toast" data-text="Отправлено Анне: «${t}»">${I('message-circle', 'md')}<span>${t}</span></button>`).join('')}</div>`) },
    render() {
      return `<div class="mcall2"><div class="mcall2__remote" style="background-image:url(img/people/p32.jpg);filter:blur(20px) brightness(.45);transform:scale(1.2)"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding-top:120px;gap:14px;z-index:2">${av('anna', 120)}<div class="h1" style="color:#F4EFE7">Анна Соколова</div><div class="muted">Видеозвонок · «Суть»</div><div class="t-sm muted">9-я встреча · 10:00</div></div>
        <div style="position:absolute;left:0;right:0;bottom:80px;display:flex;justify-content:space-around;z-index:3"><button class="mb mb--xl mb--end" data-act="decline"><span class="mb__c">${I('phone-off', 'lg')}</span>Отклонить</button><button class="mb mb--xl mb--ok" data-act="accept"><span class="mb__c">${I('phone', 'lg')}</span>Принять</button></div></div>`;
    },
  });

  // ───────────── мини-окно ─────────────
  add({
    id: 'pip', group: G, title: 'Мини-окно поверх других окон', icon: 'pip', phase: 'фаза 4', plan: '§ 6.1, § 5.10',
    desc: 'Во время сессии специалист открывает документ или карточку в другом окне — разговор остаётся в маленьком окне поверх всего, с кнопками звука и выхода.',
    acts: { back: () => go('call'), pmic: (el) => { el.classList.toggle('is-off'); el.innerHTML = I(el.classList.contains('is-off') ? 'mic-off' : 'mic', 'md'); } },
    render() {
      return `<div class="pipd"><div class="pipd__win"><div class="pipd__bar"><i></i><i></i><i></i><span>Протокол супервизии — Документы</span></div>
        <div class="pipd__doc"><h2 class="h2">Мария И. — к супервизии 24 октября</h2><p class="muted mt12">Запрос: тревога перед выступлениями, сон. 9 встреч, динамика GAD-7 с 15 до 7.</p><p class="mt12">Вопрос к супервизору: как удержать фокус на опоре, не обесценив страх, когда клиентка говорит «повезло»?</p><p class="mt12 muted">Техники: сократический диалог, «пустой стул». Перенос: возможен — оценивающая фигура отца.</p></div></div>
        <div class="pip2"><div class="pip2__v" style="background-image:url(img/people/p26.jpg)"><span class="pip2__n">Мария · 33:40</span></div><div class="pip2__c">${P.rb('mic', '', 'pmic', { title: 'Микрофон' })}${P.rb('maximize', '', 'back', { title: 'Вернуться в комнату' })}${P.rbEnd('Завершить')}</div></div></div>`;
    },
  });

  // ───────────── очная сессия ─────────────
  const LIVE = ['Клиент: «Я опять три ночи плохо спал…»', 'Вы: «Что происходит перед сном?»', 'Клиент: «Прокручиваю разговор с начальником»', 'Вы: «Давайте попробуем записать эти мысли»', 'Клиент: «Боюсь, что станет хуже, если думать об этом»'];
  add({
    id: 'inperson', group: G, title: 'Очная сессия: телефон на столе', icon: 'device-mobile', frame: 'phone', phase: 'фаза 4', plan: '§ 5.13 — очная сессия',
    desc: 'Специалист кладёт телефон на стол — Юя ведёт расшифровку на русском и после встречи пишет конспект в карточку клиента. Согласие клиента отмечается вслух.',
    acts: { stop: () => { toast('Расшифровка остановлена. Конспект будет через 5 минут', { icon: 'notes' }); go('end', { from: 'inperson' }); }, pause: (el) => { el.classList.toggle('is-off'); toast(el.classList.contains('is-off') ? 'Пауза — ничего не записывается' : 'Продолжаю'); } },
    render() {
      return `<div class="mob"><div class="mob__top"><div class="sp"><div class="t-sm muted">Очная сессия · кабинет</div><div class="h2">Олег Мартынов</div></div>${chip('<span class="rec-dot"></span> идёт', 'bad')}</div>
        <div class="mob__body"><div style="text-align:center;padding:16px 0"><div class="pr-timer mono" id="ipt" style="color:var(--color-fg)">00:12:40</div><div class="mt12">${C.wave(44, 7)}</div></div>
          <div class="card" style="padding:14px"><div class="row t-sm">${I('check-circle', 'sm', 'ok')}<span>Олег согласился на расшифровку вслух — 10:02</span></div></div>
          <div class="h3 mt16">Слышу</div><div class="col mt8" id="ipl" style="gap:8px;font-size:15px"></div>
          <div class="row mt24" style="gap:10px">${btn('Пауза', { icon: 'pause', act: 'pause', size: 'lg' })}${btn('Закончить', { icon: 'stop', act: 'stop', kind: 'primary', size: 'lg', cls: 'sp' })}</div>
          <div class="t-xs muted mt12" style="text-align:center">Звук не хранится — только текст. Расшифровка идёт в России.</div></div></div>`;
    },
    mount() { let i = 0, s = 760; const add1 = () => { const l = $('#ipl'); if (!l) return; l.insertAdjacentHTML('beforeend', `<div class="fade-up muted">${esc(LIVE[i++ % LIVE.length])}</div>`); if (l.children.length > 4) l.firstElementChild.remove(); }; add1(); every(2600, add1); every(1000, () => { s++; const t = $('#ipt'); if (t) t.textContent = `00:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }); },
  });
})();

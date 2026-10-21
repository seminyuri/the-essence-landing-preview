(function () {
  const { D, add, I, av, esc, toast, modal, closeModal, go, every, later, $, $$, btn, chip, seg, pick, li, yuNote, note, opt, sw } = P;
  const G = 'Группа и встреча';
  const people = D.group;
  const hands = ['kira', 'timur', 'vera'];

  const partPane = () => `<div class="card" style="padding:12px 14px"><div class="row"><span class="sp b">В зале ожидания · 2</span>${btn('Впустить всех', { size: 'sm', kind: 'primary', act: 'admit' })}</div><div class="mt8" id="waitl">${['dasha', 'gleb'].map((w) => `<div class="row" style="padding:6px 0">${av(w, 32)}<span class="sp">${P.person(w).name}</span>${btn('Впустить', { size: 'sm', act: 'admit1' })}</div>`).join('')}</div></div>
    <div class="pn__sec">Руки — по очереди поднятия</div>${hands.map((h, i) => `<div class="li"><span class="li__ic b">${i + 1}</span>${av(h, 36)}<div class="li__m"><div class="li__t">${P.person(h).name}</div><div class="li__s">${['2 мин назад', '1 мин назад', 'только что'][i]}</div></div>${btn('Дать слово', { size: 'sm', act: 'giveword', data: `data-who="${h}"` })}</div>`).join('')}
    <div class="pn__sec">В комнате · 12</div><input class="in" placeholder="Найти участника" aria-label="Поиск участника">${people.filter((p) => !hands.includes(p)).map((p, i) => `<div class="li">${av(p, 36)}<div class="li__m"><div class="li__t">${P.person(p).name}${p === 'anna' ? ' (вы)' : ''}</div><div class="li__s">${p === 'anna' ? 'ведущая' : i === 2 ? 'соведущая' : 'участник'}</div></div>${I(i % 3 ? 'mic-off' : 'mic', 'sm', 'subtle')}${p === 'anna' ? '' : btn('', { icon: 'dots', size: 'sm', cls: 'btn2--icon', act: 'pmenu', data: `data-who="${p}"` })}</div>`).join('')}`;
  const mact = () => `<span class="msg__act"><button data-act="mreply" title="Ответить">${I('message-circle', 'xs')}</button><button data-act="mlike" title="Поддержать">${I('heart', 'xs')}</button><button data-act="mpin" title="Закрепить для всех">${I('pin', 'xs')}</button></span>`;
  const chatPane = () => `<div class="pinbar" id="gpin" hidden></div><div class="msgs" id="gchat">${[['olga', 'Можно я поделюсь первой?'], ['ivan', 'Спасибо за прошлую встречу, дневник веду'], ['sofia', 'У меня сегодня мало сил, побуду слушателем', true]].map(([w, t, dm]) => `<div class="msg" data-who="${w}">${av(w, 32)}<div class="msg__b">${dm ? '<div class="msg__dm">лично вам</div>' : ''}<span class="msg__n">${P.person(w).short}</span><span class="msg__t">${t}</span><span class="msg__likes"></span></div>${mact()}</div>`).join('')}</div>`;
  const qPane = () => D.questions.slice(0, 4).map((q, i) => `<button class="qc ${i === 0 ? 'is-on' : ''}" data-act="qpick"><span class="qv2">${q.votes}</span><span class="sp">${esc(q.text)}<div class="t-xs">${q.anon ? 'анонимно' : P.person(q.who).short}${q.merged ? ` · Юя склеила ${q.merged} похожих` : ''}</div></span></button>`).join('');
  const pollPane = () => `<div class="h3" style="color:#F4EFE7">Что сейчас откликается больше?</div><div class="t-sm muted mt8">Анонимно · 9 из 11 ответили</div><div class="mt16">${C.hbars([{ l: 'Сон', v: 5 }, { l: 'Работа', v: 3 }, { l: 'Отношения', v: 1 }])}</div>
    <div class="row mt16" style="gap:8px">${btn('Показать всем', { size: 'sm', kind: 'primary', act: 'toast', data: 'data-text="Результаты видят все участники"' })}${btn('Завершить', { size: 'sm', act: 'toast', data: 'data-text="Опрос завершён, итоги сохранены во встрече"' })}</div>
    <div class="mt24">${yuNote('Вы сказали «давайте проголосуем, с чего начнём». Подготовила опрос: «С чего начнём: дневники / сон / вопросы». Запустить?', btn('Запустить', { size: 'sm', act: 'toast', data: 'data-text="Опрос запущен — участники видят его поверх видео"' }))}</div>
    <div class="pn__sec">Библиотека</div>${['Как вы сегодня — шкала 1–10', 'Опросник до группы', 'Обратная связь после встречи'].map((t) => li({ lead: `<span class="li__ic">${I('chart-bar')}</span>`, t, act: 'toast', data: 'data-text="Опрос добавлен в эту встречу"' })).join('')}`;
  const ctrlPane = () => `<div class="pn__sec" style="margin-top:0">Разрешить участникам</div>${[['Показывать экран', false], ['Писать в чат', true], ['Включать микрофон', true], ['Включать видео', true], ['Переименовываться', false], ['Рисовать на доске', true]].map(([t, on]) => opt(t, '', on)).join('')}
    <div class="col mt16" style="gap:8px">${btn('Выключить микрофоны всем', { icon: 'mic-off', block: true, act: 'muteall' })}${btn('Закрыть встречу для входа', { icon: 'lock', block: true, act: 'toast', data: 'data-text="Встреча закрыта: новые участники не войдут"' })}${btn('Перерыв: всех в зал ожидания', { icon: 'door-exit', block: true, act: 'm-pause' })}${btn('Остановить всё', { icon: 'ban', block: true, kind: 'danger', act: 'stopall' })}</div>
    <div class="mt16">${note('shield-check', 'Юя сама отключит показ экрана незнакомцу и предложит «Остановить всё» при атаке.')}</div>`;

  add({
    id: 'meeting', group: G, title: 'Групповая встреча', icon: 'users', more: 'group', gentle: true, phase: 'фазы 2–5', plan: '§ 6.2, Приложение Ж.4–Ж.9, Ж.12',
    desc: 'Сетка, «Говорящий» и «Круг» для терапевтической группы. Участники с очередью рук и залом ожидания, чат с личными сообщениями, вопросы с голосами, опросы, права и «Остановить всё».',
    tips: ['Переключите раскладку на «Круг»', '«Участники» — очередь рук и зал ожидания', '«Управление» — что разрешено участникам', 'Реакции здесь бережные — для групп поддержки'],
    acts: {
      layout: (el) => { $$('.rm__top .seg2 button').forEach((b) => b.classList.toggle('is-on', b === el)); $('.st-grid').dataset.layout = el.dataset.v; },
      admit: () => { $('#waitl').innerHTML = `<div class="t-sm muted">Все впущены</div>`; toast('Впущены 2 человека'); },
      admit1: (el) => { el.closest('.row').remove(); toast('Впущен'); },
      giveword: (el) => { el.closest('.li').remove(); $$('.tl').forEach((t) => t.classList.toggle('is-speaking', t.dataset.pid === el.dataset.who)); toast(`Слово — ${P.person(el.dataset.who).short}. Микрофон включён`, { icon: 'mic' }); },
      pmenu: (el) => { const p = P.person(el.dataset.who); modal(`<div class="row">${av(el.dataset.who, 48)}<div class="modal2__t" style="padding:0">${p.name}</div></div><div class="sheet-l mt16">${[['message-circle', 'Написать лично', `Личный чат с ${p.short} открыт`], ['pin', 'Закрепить у себя', 'Закреплено только у вас'], ['star', 'Выделить для всех', 'Выделено у всех участников'], ['mic', 'Попросить включить микрофон', `${p.short} получил просьбу — включит сам`], ['settings', 'Помочь с настройками звука', `${p.short} разрешил(а) — вы переключили на микрофон ноутбука, Bluetooth отключён`], ['video', 'Попросить включить камеру', `${p.short} получил просьбу — включит сам`], ['pencil', 'Переименовать', 'Имя изменено у всех'], ['user-check', 'Сделать соведущим', `${p.short} теперь соведущий`], ['door-exit', 'Вернуть в зал ожидания', `${p.short} в зале ожидания`], ['mic-off', 'Выключить микрофон', 'Микрофон выключен'], ['user-x', 'Удалить из встречи', `${p.short} удалён. Отменить можно минуту`], ['flag', 'Пожаловаться', 'Жалоба ушла в поддержку с фрагментом чата']].map(([i, t, m]) => `<button data-act="toast" data-text="${m}">${I(i, 'md')}<span>${t}</span></button>`).join('')}</div>`, { dark: true }); },
      qpick: (el) => { $$('.qc').forEach((q) => q.classList.toggle('is-on', q === el)); toast('Вопрос выведен на экран для всех'); },
      muteall: () => toast('Микрофоны выключены у всех, кроме ведущих', { undo: () => {} }),
      stopall: () => modal(`<div class="modal2__t">Остановить всё?</div><div class="modal2__s">У всех, кроме ведущих, выключатся видео, звук, показ экрана и чат. Пригодится при атаке на встречу.</div><div class="modal2__f">${btn('Отмена', { act: 'close-modal', size: 'lg' })}${btn('Остановить', { kind: 'danger', size: 'lg', icon: 'ban', act: 'stopgo' })}</div>`, { dark: true }),
      stopgo: () => { closeModal(); toast('Всё остановлено. Юя сообщила участникам, что вы разбираетесь', { icon: 'ban', undo: () => {} }); },
      gsend: () => { const i = $('#gin'); const v = i.value.trim(); if (!v) return; const q = i.dataset.reply; $('#gchat').insertAdjacentHTML('beforeend', `<div class="msg fade-up" data-who="anna">${av('anna', 32)}<div class="msg__b">${$('#gto').value !== 'all' ? `<div class="msg__dm">лично: ${$('#gto').selectedOptions[0].text}</div>` : ''}${q ? `<div class="msg__q">${esc(q)}</div>` : ''}<span class="msg__n">Анна</span><span class="msg__t">${esc(v)}</span><span class="msg__likes"></span></div>${mact()}</div>`); i.value = ''; delete i.dataset.reply; i.placeholder = 'Сообщение…'; },
      mreply: (el) => { const m = el.closest('.msg'); const i = $('#gin'); i.dataset.reply = `${P.person(m.dataset.who).short}: ${m.querySelector('.msg__t').textContent}`; i.placeholder = `Ответ ${P.person(m.dataset.who).short}…`; i.focus(); },
      mlike: (el) => { const l = el.closest('.msg').querySelector('.msg__likes'); const n = (+l.dataset.n || 0) + 1; l.dataset.n = n; l.innerHTML = `💛 ${n}`; },
      mpin: (el) => { const m = el.closest('.msg'); const b = $('#gpin'); b.innerHTML = `${I('pin', 'sm')}<span class="sp"><b>${P.person(m.dataset.who).short}:</b> ${esc(m.querySelector('.msg__t').textContent)}</span><button data-act="unpin" aria-label="Открепить">${I('x', 'sm')}</button>`; b.hidden = false; toast('Закреплено — опоздавшие увидят его первым'); },
      unpin: () => { $('#gpin').hidden = true; },
      gfile: () => toast('Файл в чате встречи — сохранится в итогах и в чате группы', { icon: 'paperclip' }),
      weak: (el) => { const p = P.person(el.dataset.who); modal(`<div class="row"><span class="yu2 yu2--lg">${I('wifi-off', 'lg')}</span><div class="modal2__t" style="padding:0">У ${p.short === 'Тимур' ? 'Тимура' : p.short} слабая связь</div></div><div class="modal2__s">Мобильный интернет, потери 18 %. Юя уже предложила ему лично «только звук» — видео вернётся само, когда сеть окрепнет.</div><div class="modal2__f">${btn('Позвонить ему по телефону', { icon: 'phone', act: 'toast', data: 'data-text="Звоним Тимуру — звук пойдёт по телефону, плитка останется"' })}${btn('Понятно', { kind: 'primary', act: 'close-modal' })}</div>`, { dark: true }); },
      'go-share': () => go('share'),
    },
    render() {
      const tiles = people.map((p, i) => P.tl(p, { self: p === 'anna', speaking: p === 'olga', hand: hands.includes(p), muted: i % 3 === 1, style: `--a:${(i / people.length) * 360 - 90}deg`, extra: p === 'timur' ? `<button class="tl__net" data-act="weak" data-who="timur" title="Слабая связь">${I('wifi-off', 'sm')}</button>` : '' })).join('');
      const panels = P.pn('people', 'Участники', partPane(), { open: true, head: btn('Пригласить', { size: 'sm', icon: 'user-plus', act: 'invite' }) }) + P.pn('chat', 'Чат', chatPane(), { foot: `${btn('', { icon: 'paperclip', cls: 'btn2--icon', act: 'gfile', data: 'title="Файл"' })}<select class="in" id="gto" style="width:110px" aria-label="Кому"><option value="all">Всем</option><option value="olga">Ольге</option><option value="sofia">Софии</option></select><input class="in" id="gin" placeholder="Сообщение…">${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'gsend' })}` }) + P.pn('qa', 'Вопросы', qPane()) + P.pn('poll', 'Опросы', pollPane()) + P.pn('ctrl', 'Управление', ctrlPane());
      return P.room({ top: { title: 'Группа «Опора»', sub: '· встреча 4 из 8', clock: '18:40', extra: `<span class="top-pill" id="rtimer" hidden>${I('timer', 'xs')} <b>5:00</b></span>${seg([['Сетка', 'grid'], ['Говорящий', 'speaker'], ['Круг', 'circle']], 0, 'layout')}` },
        stage: `<div class="st-grid" data-layout="grid">${tiles}</div>`, panels,
        bar: `${P.rbBase()}${P.rb('screen-share', '', 'go-share', { title: 'Показать экран' })}${P.rbPanel('people', 'users', 'Участники', { n: 12, on: true })}${P.rbPanel('chat', 'message-circle', 'Чат', { n: 3 })}${P.rbPanel('qa', 'help', 'Вопросы', { n: 4 })}${P.rbPanel('poll', 'chart-bar', 'Опросы')}${P.rbPanel('ctrl', 'shield-check', 'Управление')}${P.rbReact()}${P.rb('hand', '', 'hand', { title: 'Поднять руку' })}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Завершить')}` });
    },
    mount(root) {
      P.cam.attach(root); P.clock(18 * 60 + 40);
      $('#gin').addEventListener('keydown', (e) => e.key === 'Enter' && this.acts.gsend());
      every(4000, () => { const t = $$('.tl:not(.tl--self)'); const k = Math.floor(Math.random() * t.length); t.forEach((x, i) => x.classList.toggle('is-speaking', i === k)); });
      later(2600, () => { const st = $('.rm__stage'); if (!st) return; st.insertAdjacentHTML('beforeend', `<div class="wpop fade-up" id="wpop">${av('dasha', 36)}<span class="sp"><b>Дарья Зуева</b> ждёт в зале ожидания<span class="t-xs muted" style="display:block">записана на группу · оплачено</span></span>${btn('Впустить', { size: 'sm', kind: 'primary', act: 'wadmit' })}${btn('', { icon: 'x', size: 'sm', cls: 'btn2--icon', act: 'wclose' })}</div>`); });
      this.acts.wadmit = () => { $('#wpop')?.remove(); $('#waitl .row')?.remove(); toast('Дарья в комнате', { icon: 'door' }); };
      this.acts.wclose = () => $('#wpop')?.remove();
    },
  });

  // ───────────── группа с телефона: вход по ссылке и комната ─────────────
  const MCHAT = [['olga', 'Можно я поделюсь первой?'], ['ivan', 'Спасибо за прошлую встречу, дневник веду'], ['anna', 'Ольга, да, начинайте']];
  add({
    id: 'meeting-mobile', group: G, title: 'Группа с телефона', icon: 'device-mobile', frame: 'phone', dark: true, pair: 'meeting', gentle: true, phase: 'фазы 2А / 4', plan: '§ 5.8 — вход по ссылке с любого устройства, § 6.2',
    desc: 'Участница открывает ссылку в телефоне: имя, камера, «Войти» — и через долю секунды в группе. Говорящий крупно, остальные лентой, рука, бережные реакции, чат, субтитры. Ничего не устанавливается.',
    tips: ['«Войти» — вход за 0,6 с', '«Рука» — очередь у ведущей', '«Чат» — ответить и поддержать', 'Проведите по ленте участников'],
    acts: {
      join: () => { toast('Вы в группе · вход за 0,6 с', { icon: 'bolt' }); go('meeting-mobile', { s: 'in' }); },
      mmic: (el) => { el.classList.toggle('is-off'); el.querySelector('.mb__c').innerHTML = I(el.classList.contains('is-off') ? 'mic-off' : 'mic', 'md'); },
      mcam: (el) => { el.classList.toggle('is-off'); el.querySelector('.mb__c').innerHTML = I(el.classList.contains('is-off') ? 'video-off' : 'video', 'md'); },
      mhand: (el) => { el.classList.toggle('is-on'); toast(el.classList.contains('is-on') ? 'Рука поднята — вы вторая в очереди' : 'Рука опущена', { icon: 'hand' }); },
      mreact: () => $('.mreact').classList.toggle('is-open'),
      memo: (el) => { P.flyEmoji(el.textContent); $('.mreact').classList.remove('is-open'); },
      msheet: () => { $$('.msheet2').forEach((x) => x.classList.remove('is-open')); $('#msh-more').classList.toggle('is-open'); },
      mchat: () => { $$('.msheet2').forEach((x) => x.classList.remove('is-open')); $('#msh-chat').classList.add('is-open'); },
      mclose: () => $$('.msheet2').forEach((x) => x.classList.remove('is-open')),
      mcsend: () => { const i = $('#mcin'); if (!i.value.trim()) return; $('#mclog').insertAdjacentHTML('beforeend', `<div class="msg fade-up">${av('olga', 28)}<div class="msg__b"><span class="msg__n">Вы</span><span class="msg__t">${esc(i.value)}</span></div></div>`); i.value = ''; },
      mcc: (el) => { $('.mcall2').classList.toggle('subs-off'); toast($('.mcall2').classList.contains('subs-off') ? 'Субтитры выключены' : 'Субтитры включены', { icon: 'cc' }); },
    },
    render(p) {
      if (p.s !== 'in') return `<div class="mob mjoin" style="background:#141210;color:#F4EFE7"><div class="mob__body" style="padding-top:64px">
        <div class="t-sm muted">Анна Соколова приглашает</div><div class="h2 mt8">Группа «Опора» · встреча 4 из 8</div><div class="t-sm muted mt8">Сегодня, 19:00–20:30 · 12 участников</div>
        <div class="mjoin__prev mt16"><video class="my-cam" playsinline autoplay muted hidden></video><div class="mjoin__ph">${av('olga', 72)}</div><div class="mjoin__ctl">${P.rb('mic-off', '', 'toast', { off: true, data: 'data-text="Войдёте с выключенным микрофоном — включите, когда захотите сказать"', title: 'Микрофон' })}${P.rb('video', '', 'toast', { data: 'data-text="Камера: фронтальная"', title: 'Камера' })}</div></div>
        <label class="fld"><span class="fld__l" style="color:#B5AB9D">Как вас зовут</span><input class="in" value="Ольга Белова" style="background:rgba(244,239,231,.08);color:#F4EFE7"></label>
        <div class="mjoin__opt">${opt('Ведущая может включать мой микрофон', 'Удобно в группе и практике — не нужно тянуться к кнопке', false)}</div>
        <div class="mt16">${btn('Войти', { kind: 'primary', size: 'lg', block: true, icon: 'video', act: 'join' })}</div>
        <div class="t-xs muted mt12" style="text-align:center;line-height:1.5">Без установки и регистрации. Встреча записывается, субтитры и Юя включены — это видно всем.</div></div></div>`;
      const strip = people.filter((x) => !['anna', 'olga'].includes(x)).map((x, i) => `<div class="mstrip__t" style="background-image:url(${P.person(x).photo})"><span>${i % 3 === 1 ? I('mic-off', 'xs') : ''}${P.person(x).short}</span>${hands.includes(x) ? `<b>${I('hand', 'xs')}</b>` : ''}</div>`).join('');
      const mb = (act, icon, t, cls = '') => `<button class="mb ${cls}" data-act="${act}"><span class="mb__c">${I(icon, 'md')}</span>${t}</button>`;
      return `<div class="mcall2 mgrp"><div class="mcall2__remote" style="background-image:url(img/people/p32.jpg)"></div>
        <div class="mcall2__top">${I('lock', 'sm')}<span class="sp b">Группа «Опора»</span><span class="rec-dot" title="Запись, субтитры, Юя"></span><span class="mono">18:40</span></div>
        <div class="mcall2__self" style="background-image:url(img/people/p23.jpg);top:116px"></div>
        <div class="mgrp__name"><span class="eq eq--on"><i></i><i></i><i></i></span>Анна Соколова · ведущая</div>
        <div class="subs" style="left:16px;right:16px;transform:none;max-width:none;bottom:270px"><b>Анна</b>Давайте начнём с того, что изменилось за неделю</div>
        <div class="mstrip">${strip}</div>
        <div class="rm__fx"></div><div class="mreact">${['🙏', '💛', '🌿', '🤝', '✨', '👏'].map((e) => `<button data-act="memo">${e}</button>`).join('')}</div>
        <div class="mcall2__dock">${mb('mmic', 'mic-off', 'Звук', 'is-off')}${mb('mcam', 'video', 'Видео')}${mb('mhand', 'hand', 'Рука')}${mb('mreact', 'smile', 'Реакции')}${mb('msheet', 'dots', 'Ещё')}${mb('leave', 'phone-off', 'Выйти', 'mb--end')}</div>
        <div class="msheet2" id="msh-more"><div class="msheet2__h"></div><div class="sheet-l">${[['message-circle', 'Чат · 3 новых', 'mchat'], ['users', 'Участники · 12', 'mclose'], ['cc', 'Субтитры', 'mcc'], ['activity', 'Связь', 'netcheck'], ['wifi', 'Экономия трафика', 'm-eco'], ['phone', 'Звук по телефону — «Позвонить мне»', 'callme'], ['help', 'Сообщить о проблеме', 'm-report']].map(([i, t, a]) => `<button data-act="${a}">${I(i, 'md')}<span>${t}</span></button>`).join('')}</div></div>
        <div class="msheet2 msheet2--tall" id="msh-chat"><div class="row"><div class="msheet2__h" style="margin:0 auto 10px"></div></div><div class="row"><b class="sp">Чат группы</b><button class="btn2 btn2--icon btn2--sm" data-act="mclose" aria-label="Закрыть">${I('x')}</button></div>
          <div class="msgs mt12" id="mclog">${MCHAT.map(([w, t]) => `<div class="msg">${av(w, 28)}<div class="msg__b"><span class="msg__n">${P.person(w).short}</span><span class="msg__t">${t}</span></div></div>`).join('')}</div>
          <div class="row mt12"><input class="in" id="mcin" placeholder="Сообщение группе…">${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'mcsend' })}</div></div></div>`;
    },
    mount(root, p) { if (p.s !== 'in') { P.cam.start().then(() => { P.cam.attach(root); const v = $('.mjoin__prev video', root); if (v && !v.hidden) $('.mjoin__ph', root).hidden = true; }); } },
  });

  // ───────────── показ экрана ─────────────
  add({
    id: 'share', group: G, title: 'Показ экрана', icon: 'screen-share', more: 'group', phase: 'фаза 4', plan: '§ 5.10, Приложение Ж.8 — «Рядом»',
    desc: 'Выбор окна или вкладки со звуком, «Не беспокоить» на время показа, раскладка «Рядом». Участник может приблизить показ у себя.',
    tips: ['Выберите вкладку и нажмите «Показать»', 'Переключите «Как видит участник» и приблизьте', '«Остановить» — вернуться к встрече'],
    acts: {
      spick: (el) => $$('.spick button').forEach((b) => b.classList.toggle('is-on', b === el)),
      start: () => { closeModal(); $('.share-wrap').hidden = false; toast('Вы показываете вкладку «Дневник тревоги». Уведомления скрыты', { icon: 'screen-share' }); },
      stop: () => go('meeting'),
      view: (el) => { $$('.rm__top .seg2 button').forEach((b) => b.classList.toggle('is-on', b === el)); $('.zoomctl').hidden = el.dataset.v !== 'guest'; $('.share-bar').hidden = el.dataset.v === 'guest'; },
      zin: () => { const d = $('.share-v__doc'); const z = Math.min(2, (+d.dataset.z || 1) + 0.25); d.dataset.z = z; d.style.transform = `scale(${z})`; },
      zout: () => { const d = $('.share-v__doc'); const z = Math.max(1, (+d.dataset.z || 1) - 0.25); d.dataset.z = z; d.style.transform = `scale(${z})`; },
      picker: () => picker(),
    },
    render() {
      return P.room({ top: { title: 'Группа «Опора»', sub: '· показ экрана', clock: '24:05', extra: seg([['Как вижу я', 'host'], ['Как видит участник', 'guest']], 0, 'view') },
        stage: `<div class="share-wrap" style="flex:1;display:flex;gap:12px" hidden><div class="share-v"><div class="share-v__bar share-bar"><span class="rec-dot"></span><span class="sp">Вы показываете вкладку «Дневник тревоги» · уведомления скрыты</span>${btn('Остановить', { size: 'sm', kind: 'danger', act: 'stop' })}</div><div class="share-v__page"><div class="share-v__doc"><h3>Дневник тревоги — неделя 1</h3><ol><li>Ситуация: что произошло, где, с кем</li><li>Мысль: что я сказал себе в этот момент</li><li>Чувство и где оно в теле, от 0 до 10</li><li>Что я сделал — и что помогло хоть немного</li><li>Альтернативная мысль: что сказал бы другу</li></ol></div><div class="presenter" style="background-image:url(img/people/p32.jpg)"></div><div class="zoomctl" hidden><button data-act="zout" aria-label="Отдалить">−</button><button data-act="zin" aria-label="Приблизить">+</button></div></div></div>
          <div class="col" style="width:220px;gap:10px">${['olga', 'ivan', 'kira'].map((p) => `<div style="height:130px;display:flex">${P.tl(p)}</div>`).join('')}</div></div>`,
        bar: `${P.rbBase()}${P.rb('screen-share', 'Показ', 'picker', { on: true })}${P.rbPanel('people', 'users', 'Участники', { n: 12 })}${P.rbReact()}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Завершить')}` });
    },
    mount() { picker(); },
  });
  function picker() {
    modal(`<div class="modal2__t">Что показать</div><div class="seg2 mt16">${['Вкладка', 'Окно', 'Весь экран'].map((t, i) => `<button class="${i ? '' : 'is-on'}" data-act="seg">${t}</button>`).join('')}</div>
      <div class="spick">${[['file-text', 'Дневник тревоги'], ['presentation', 'Слайды · Опора'], ['play', 'Видео: дыхание']].map(([i, t], k) => `<button class="${k ? '' : 'is-on'}" data-act="spick"><div class="spick__th">${I(i, 'xl')}</div><div class="t-sm">${t}</div></button>`).join('')}</div>
      <div class="mt16">${opt('Звук вкладки', 'Участники услышат видео и музыку', true)}${opt('Не беспокоить', 'Скрыть уведомления на время показа', true)}${opt('Раскладка «Рядом»', 'Показ слева, люди справа', true)}</div>
      <div class="modal2__f">${btn('Показать', { kind: 'primary', size: 'lg', icon: 'screen-share', act: 'start' })}</div>`, { wide: true, dark: true });
  }

  // ───────────── настройки ─────────────
  const SET = {
    sound: `<div class="h2">Звук</div><label class="fld"><span class="fld__l">Микрофон</span><select class="in"><option>Микрофон MacBook Pro</option><option>AirPods Pro</option></select></label><div class="row mt12"><span class="meter"></span></div>
      ${opt('Сильное шумоподавление', 'Убирает клавиатуру, улицу и собаку. Шумодав браузера при этом выключен', true)}${opt('Режим «Музыка»', 'Для практик: без сжатия и шумодава, стерео', false)}${opt('Выравнивать громкость собеседников', '', true)}${opt('Пробел — нажми и говори', '', true)}`,
    video: `<div class="h2">Видео</div><label class="fld"><span class="fld__l">Камера</span><select class="in"><option>FaceTime HD</option><option>Камера iPhone</option></select></label>${opt('Зеркалить моё видео', '', true)}${opt('Подстроить свет', 'Если лицо темнее фона', true)}${opt('Скрыть участников без видео', '', false)}${opt('Входить с выключенной камерой', '', false)}`,
    cc: `<div class="h2">Субтитры</div><div class="fld"><span class="fld__l">Язык</span>${seg(['Русский', 'English', 'Deutsch', 'עברית'])}</div><div class="fld"><span class="fld__l">Размер</span>${seg(['Обычный', 'Крупный', 'Очень крупный'], 1)}</div><div class="fld"><span class="fld__l">Фон</span>${seg(['Тёмный', 'Полупрозрачный', 'Без фона'])}</div><div class="subs-demo mt16">Опора — это способность оставаться в контакте с собой</div>`,
    a11y: `<div class="h2">Доступность</div>${opt('Всегда показывать кнопки', 'Панель не прячется, пока вы не двигаете мышью', true)}${opt('Меньше анимации', '', false)}${opt('Затемнять мигающие изображения', 'Если в видео или показе экрана частые вспышки — картинка сама затемнится', true)}${opt('Озвучивать события', 'Вошёл, вышел, рука, сообщение', true)}<div class="fld"><span class="fld__l">Реакции для экранного диктора</span>${seg(['Не озвучивать', 'Только звук', 'Реакция', 'Реакция и автор'], 2)}</div>${opt('Закрепить переводчика жестового языка', 'На сцене эфира', false)}<div class="fld"><span class="fld__l">Размер шрифта чата</span>${seg(['15', '17', '19'])}</div>`,
    keys: `<div class="h2">Горячие клавиши</div><div class="t-sm muted mt8">Работают и в русской раскладке</div><table class="tbl2 mt16"><tbody>${[['Микрофон', '⌘ D'], ['Камера', '⌘ E'], ['Нажми и говори', 'Пробел'], ['Поднять руку', '⌘ ⇧ H'], ['Чат', '⌘ ⇧ C'], ['Субтитры', '⌘ ⇧ S'], ['Выйти', '⌘ W']].map(([a, b]) => `<tr><td>${a}</td><td class="r"><kbd class="kbd">${b}</kbd></td></tr>`).join('')}</tbody></table>`,
  };
  add({
    id: 'settings', group: G, title: 'Настройки звонка', icon: 'settings', phase: 'фазы 2–4', plan: '§ 5.30, Приложение Ж.6, Ж.11',
    desc: 'Звук, видео, субтитры, доступность и горячие клавиши в одном окне: крупно, с подписями, всё меняется сразу.',
    acts: { stab: (el) => { $$('.setw__nav button').forEach((b) => b.classList.toggle('is-on', b === el)); $('.setw__b').innerHTML = SET[el.dataset.k]; P.micMeter($('.setw .meter')); }, close: () => go('meeting') },
    render() {
      return `<div class="rm" data-theme="dark"><div class="setw"><div class="setw__nav"><div class="h2" style="padding:4px 12px 12px">Настройки</div>${[['sound', 'mic', 'Звук'], ['video', 'video', 'Видео'], ['cc', 'cc', 'Субтитры'], ['a11y', 'eye', 'Доступность'], ['keys', 'grid', 'Горячие клавиши']].map(([k, i, t], n) => `<button class="${n ? '' : 'is-on'}" data-act="stab" data-k="${k}">${I(i, 'md')}${t}</button>`).join('')}</div>
        <div class="setw__b">${SET.sound}</div><button class="modal2__x" data-act="close" aria-label="Закрыть">${I('x', 'md')}</button></div></div>`;
    },
    mount() { P.micMeter($('.setw .meter')); },
  });
})();

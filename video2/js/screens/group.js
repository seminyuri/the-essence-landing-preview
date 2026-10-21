(function () {
  const { D, add, I, av, esc, toast, modal, closeModal, go, every, later, $, $$, btn, chip, seg, pick, li, yuNote, note, opt, sw } = P;
  const G = 'Группа и встреча';
  const people = D.group;
  const hands = ['kira', 'timur', 'vera'];

  const partPane = () => `<div class="card" style="padding:12px 14px"><div class="row"><span class="sp b">В зале ожидания · 2</span>${btn('Впустить всех', { size: 'sm', kind: 'primary', act: 'admit' })}</div><div class="mt8" id="waitl">${['dasha', 'gleb'].map((w) => `<div class="row" style="padding:6px 0">${av(w, 32)}<span class="sp">${P.person(w).name}</span>${btn('Впустить', { size: 'sm', act: 'admit1' })}</div>`).join('')}</div></div>
    <div class="pn__sec">Руки — по очереди поднятия</div>${hands.map((h, i) => `<div class="li"><span class="li__ic b">${i + 1}</span>${av(h, 36)}<div class="li__m"><div class="li__t">${P.person(h).name}</div><div class="li__s">${['2 мин назад', '1 мин назад', 'только что'][i]}</div></div>${btn('Дать слово', { size: 'sm', act: 'giveword', data: `data-who="${h}"` })}</div>`).join('')}
    <div class="pn__sec">В комнате · 12</div><input class="in" placeholder="Найти участника" aria-label="Поиск участника">${people.filter((p) => !hands.includes(p)).map((p, i) => `<div class="li">${av(p, 36)}<div class="li__m"><div class="li__t">${P.person(p).name}${p === 'anna' ? ' (вы)' : ''}</div><div class="li__s">${p === 'anna' ? 'ведущая' : i === 2 ? 'соведущая' : 'участник'}</div></div>${I(i % 3 ? 'mic-off' : 'mic', 'sm', 'subtle')}${p === 'anna' ? '' : btn('', { icon: 'dots', size: 'sm', cls: 'btn2--icon', act: 'pmenu', data: `data-who="${p}"` })}</div>`).join('')}`;
  const chatPane = () => `<div class="msgs" id="gchat">${[['olga', 'Можно я поделюсь первой?'], ['ivan', 'Спасибо за прошлую встречу, дневник веду'], ['sofia', 'У меня сегодня мало сил, побуду слушателем', true]].map(([w, t, dm]) => `<div class="msg">${av(w, 32)}<div class="msg__b">${dm ? '<div class="msg__dm">лично вам</div>' : ''}<span class="msg__n">${P.person(w).short}</span><span class="msg__t">${t}</span></div></div>`).join('')}</div>`;
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
      pmenu: (el) => { const p = P.person(el.dataset.who); modal(`<div class="row">${av(el.dataset.who, 48)}<div class="modal2__t" style="padding:0">${p.name}</div></div><div class="sheet-l mt16">${[['message-circle', 'Написать лично', `Личный чат с ${p.short} открыт`], ['star', 'Закрепить для всех', 'Закреплено у всех'], ['user-check', 'Сделать соведущим', `${p.short} теперь соведущий`], ['door-exit', 'Вернуть в зал ожидания', `${p.short} в зале ожидания`], ['mic-off', 'Выключить микрофон', 'Микрофон выключен'], ['user-x', 'Удалить из встречи', `${p.short} удалён. Отменить можно минуту`], ['flag', 'Пожаловаться', 'Жалоба ушла в поддержку с фрагментом чата']].map(([i, t, m]) => `<button data-act="toast" data-text="${m}">${I(i, 'md')}<span>${t}</span></button>`).join('')}</div>`, { dark: true }); },
      qpick: (el) => { $$('.qc').forEach((q) => q.classList.toggle('is-on', q === el)); toast('Вопрос выведен на экран для всех'); },
      muteall: () => toast('Микрофоны выключены у всех, кроме ведущих', { undo: () => {} }),
      stopall: () => modal(`<div class="modal2__t">Остановить всё?</div><div class="modal2__s">У всех, кроме ведущих, выключатся видео, звук, показ экрана и чат. Пригодится при атаке на встречу.</div><div class="modal2__f">${btn('Отмена', { act: 'close-modal', size: 'lg' })}${btn('Остановить', { kind: 'danger', size: 'lg', icon: 'ban', act: 'stopgo' })}</div>`, { dark: true }),
      stopgo: () => { closeModal(); toast('Всё остановлено. Юя сообщила участникам, что вы разбираетесь', { icon: 'ban', undo: () => {} }); },
      gsend: () => { const i = $('#gin'); const v = i.value.trim(); if (!v) return; $('#gchat').insertAdjacentHTML('beforeend', `<div class="msg fade-up">${av('anna', 32)}<div class="msg__b">${$('#gto').value !== 'all' ? `<div class="msg__dm">лично: ${$('#gto').selectedOptions[0].text}</div>` : ''}<span class="msg__n">Анна</span><span class="msg__t">${esc(v)}</span></div></div>`); i.value = ''; },
      'go-share': () => go('share'),
    },
    render() {
      const tiles = people.map((p, i) => P.tl(p, { self: p === 'anna', speaking: p === 'olga', hand: hands.includes(p), muted: i % 3 === 1, style: `--a:${(i / people.length) * 360 - 90}deg` })).join('');
      const panels = P.pn('people', 'Участники', partPane(), { open: true }) + P.pn('chat', 'Чат', chatPane(), { foot: `<select class="in" id="gto" style="width:120px" aria-label="Кому"><option value="all">Всем</option><option value="olga">Ольге</option><option value="sofia">Софии</option></select><input class="in" id="gin" placeholder="Сообщение…">${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'gsend' })}` }) + P.pn('qa', 'Вопросы', qPane()) + P.pn('poll', 'Опросы', pollPane()) + P.pn('ctrl', 'Управление', ctrlPane());
      return P.room({ top: { title: 'Группа «Опора»', sub: '· встреча 4 из 8', clock: '18:40', extra: `<span class="top-pill" id="rtimer" hidden>${I('timer', 'xs')} <b>5:00</b></span>${seg([['Сетка', 'grid'], ['Говорящий', 'speaker'], ['Круг', 'circle']], 0, 'layout')}` },
        stage: `<div class="st-grid" data-layout="grid">${tiles}</div>`, panels,
        bar: `${P.rbBase()}${P.rb('screen-share', '', 'go-share', { title: 'Показать экран' })}${P.rbPanel('people', 'users', 'Участники', { n: 12, on: true })}${P.rbPanel('chat', 'message-circle', 'Чат', { n: 3 })}${P.rbPanel('qa', 'help', 'Вопросы', { n: 4 })}${P.rbPanel('poll', 'chart-bar', 'Опросы')}${P.rbPanel('ctrl', 'shield-check', 'Управление')}${P.rbReact()}${P.rb('hand', '', 'hand', { title: 'Поднять руку' })}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Завершить')}` });
    },
    mount(root) {
      P.cam.attach(root); P.clock(18 * 60 + 40);
      $('#gin').addEventListener('keydown', (e) => e.key === 'Enter' && this.acts.gsend());
      every(4000, () => { const t = $$('.tl:not(.tl--self)'); const k = Math.floor(Math.random() * t.length); t.forEach((x, i) => x.classList.toggle('is-speaking', i === k)); });
    },
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
    a11y: `<div class="h2">Доступность</div>${opt('Всегда показывать кнопки', 'Панель не прячется, пока вы не двигаете мышью', true)}${opt('Меньше анимации', '', false)}${opt('Озвучивать события', 'Вошёл, вышел, рука, сообщение', true)}<div class="fld"><span class="fld__l">Реакции для экранного диктора</span>${seg(['Не озвучивать', 'Только звук', 'Реакция', 'Реакция и автор'], 2)}</div>${opt('Закрепить переводчика жестового языка', 'На сцене эфира', false)}<div class="fld"><span class="fld__l">Размер шрифта чата</span>${seg(['15', '17', '19'])}</div>`,
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

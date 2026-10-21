(function () {
  const { D, S, add, I, av, esc, rub, num, toast, modal, closeModal, go, every, later, $, $$, btn, chip, seg, li, yuNote, note, opt } = P;
  const G = 'Эфир';
  const SUBS = [['anna', 'Опора — это не отсутствие тревоги, а способность оставаться в контакте с собой'], ['dmitry', 'Если тревога держится больше полугода и мешает спать — это повод прийти к специалисту'], ['anna', 'Давайте прямо сейчас сделаем упражнение «пять-четыре-три-два-один»']];

  const scene = (o = {}) => `<div class="scene ${o.guest ? 'has-guest' : ''}" data-lay="${o.lay || 'side'}"><div class="scene__tiles"><div class="scene__slide"><div class="t-xs" style="opacity:.7">Тревога и опора · 4 / 12</div><h3>Тревога или расстройство?</h3><ul><li>Длится дольше полугода</li><li>Мешает сну, работе, отношениям</li><li>Появляется без повода</li></ul><div class="t-xs" style="opacity:.6">показ экрана · режим «Документ» — текст чёткий на телефоне</div></div>
      <div class="stile" data-pid="anna" style="background-image:url(img/people/p32.jpg)"><span class="plate"><b>Анна Соколова</b>психолог, КПТ</span></div>
      <div class="stile" data-pid="dmitry" style="background-image:url(img/people/p68.jpg)"><span class="plate"><b>Дмитрий Орлов</b>психиатр-консультант</span></div>
      <div class="stile stile--guest" data-pid="vera" style="background-image:url(img/people/p20.jpg)" ${o.guest ? '' : 'hidden'}><span class="plate"><b>Вера Ким</b>из зала</span></div></div>
    <div class="ticker">${I('bell', 'xs')} Упражнение «5-4-3-2-1» — в материалах эфира · запись будет до 26 октября</div>
    <div class="subs"></div><div class="dalerts"></div><div class="brb"><span class="yu2 yu2--lg">${I('wifi-off', 'lg')}</span><div class="h1">Сейчас вернёмся</div><div class="muted">У Анны пропала связь. Дмитрий продолжает через несколько секунд.</div></div>${o.extra || ''}</div>`;

  function donationAlert(name, amount, msg) {
    const host = $('.dalerts'); if (!host) return;
    const el = document.createElement('div'); el.className = 'dalert';
    el.innerHTML = `${I('heart', 'md')}<div><b>${esc(name)}</b> — ${rub(amount)}${msg ? `<div class="t-sm">«${esc(msg)}»</div>` : ''}</div>`;
    host.appendChild(el); setTimeout(() => el.classList.add('is-out'), 4200); setTimeout(() => el.remove(), 4800);
    $$('.goal2 i').forEach((g) => (g.style.width = Math.min(100, S.raised / D.donationGoal.goal * 100) + '%'));
    $$('.goal2-sum').forEach((g) => (g.textContent = rub(S.raised)));
  }
  const goal = () => `<div class="mini mt16"><div class="mini__l">${I('gift', 'xs')} ${esc(D.donationGoal.title)}</div><div class="row mt8" style="gap:6px"><b class="goal2-sum">${rub(S.raised)}</b><span class="muted t-sm">из ${rub(D.donationGoal.goal)}</span></div><div class="ag__bar goal2"><i style="width:${S.raised / D.donationGoal.goal * 100}%"></i></div></div>`;

  // чат эфира: Юя скрывает спам до показа, ведущая может вернуть
  const smsg = (m, host) => `<div class="msg fade-up">${av(m.who, 32)}<div class="msg__b"><span class="msg__n">${esc(P.person(m.who).short)}</span><span class="msg__t">${esc(m.text)}</span>${m.yuia ? `<div class="msg__yu"><span class="yu2">${I('sparkles')}</span><span>${esc(m.yuia)}${m.private ? ' <span class="muted">· лично зрителю</span>' : ''}</span></div>` : ''}${host ? `<div class="msg__tag"><a data-act="pinmsg">закрепить</a></div>` : ''}</div></div>`;
  function liveChat(box, host) {
    if (!box) return;
    D.chatSeed.forEach((m) => box.insertAdjacentHTML('beforeend', smsg(m, host)));
    let i = 0;
    every(1600, () => {
      if (!box.isConnected) return;
      const [who, text] = D.chatStream[i++ % D.chatStream.length];
      box.insertAdjacentHTML('beforeend', who === 'spam'
        ? `<div class="msg is-hidden fade-up"><span class="av" style="--s:32px"><b>З</b></span><div class="msg__b"><span class="msg__n">Заработок 300к</span><span class="msg__t">${esc(text)}</span><div class="msg__tag"><span class="yu2" style="width:18px;height:18px">${I('sparkles', 'xs')}</span> скрыто Юей до показа${host ? ' · <a data-act="restore" class="accent">вернуть</a>' : ''}</div></div></div>`
        : smsg({ who, text }, host));
      while (box.children.length > 50) box.firstElementChild.remove();
      const sc = box.closest('.pn__b') || box; sc.scrollTop = sc.scrollHeight;
    });
  }
  P.liveChat = liveChat;

  // ───────────── пульт ведущей ─────────────
  // зрители — люди и страны, без задержек и потоков (техника — у дежурного платформы)
  const audPane = () => `<div class="grid g2" style="gap:8px"><div class="mini"><div class="mini__l">Сейчас в эфире</div><div class="mini__v" id="v2">${num(2418)}</div></div><div class="mini"><div class="mini__l">Больше всего</div><div class="mini__v">2 418</div></div><div class="mini"><div class="mini__l">Подарили</div><div class="mini__v">214</div></div><div class="mini"><div class="mini__l">Вопросов</div><div class="mini__v">37</div></div></div>
    <div class="pn__sec">Откуда зрители</div>${C.hbars([{ l: 'Россия', v: 1500 }, { l: 'Германия', v: 266 }, { l: 'Израиль', v: 193 }, { l: 'США', v: 169 }])}
    <div class="pn__sec">Юя помогла зрителям</div><div style="font-size:15px">${I('check-circle', 'sm', 'ok')} 73 человека со звуком и видео — сама, без вас. У всех всё работает.</div>`;
  const qaPane = () => D.questions.map((q) => `<div class="qc ${q.status === 'answered' ? 'is-done' : ''}"><span class="qv2">${q.votes}</span><div class="sp">${esc(q.text)}<div class="t-xs">${q.anon ? 'анонимно' : P.person(q.who).name}${q.merged ? ` · Юя склеила ${q.merged} похожих` : ''}</div>${q.status === 'answered' ? `<div class="t-xs ok mt8">отвечено — Юя услышала ответ</div>` : `<div class="row mt8" style="gap:6px">${btn('Отвечу голосом', { size: 'sm', kind: 'primary', act: 'answer' })}${btn('Текстом', { size: 'sm', act: 'toast', data: 'data-text="Ответ отправлен автору и закреплён в вопросах"' })}</div>`}</div></div>`).join('');
  const handsPane = () => `<div class="t-sm muted">По времени поднятия. Билет «Разбор в эфире» — вперёд.</div><div class="mt8" id="handsq">${['vera', 'lev', 'kate', 'timur'].map((id, i) => `<div class="li"><span class="li__ic b">${i + 1}</span>${av(id, 36)}<div class="li__m"><div class="li__t">${P.person(id).name}</div><div class="li__s">${['VIP · вопрос про врача', 'Тель-Авив', 'Берлин', 'Алматы'][i]}</div></div>${btn('На сцену', { size: 'sm', kind: i ? '' : 'primary', act: 'onstage', data: `data-who="${id}"` })}</div>`).join('')}</div>`;
  const salesPane = () => `<div class="grid g2" style="gap:8px"><div class="mini"><div class="mini__l">Оплаты в эфире</div><div class="mini__v" id="paid">67</div></div><div class="mini"><div class="mini__l">Выручка</div><div class="mini__v" id="rev">1 189 300 ₽</div></div></div>
    ${D.offers.map((o) => `<div class="card mt12" style="padding:14px"><div class="b">${esc(o.title)}</div><div class="t-sm muted mt8">${rub(o.price)} · смотрели ${num(o.views)} · нажали ${num(o.clicks)} · оплатили ${o.paid}</div><div class="row mt12" style="gap:8px">${btn(S.offerLive === o.id ? 'Показано' : 'Показать зрителям', { size: 'sm', kind: S.offerLive === o.id ? '' : 'primary', act: 'offer', data: `data-o="${o.id}"` })}${o.id === 'course' ? '<span class="t-xs muted">или само в 20:10</span>' : ''}</div></div>`).join('')}
    <div class="mt12">${btn('Скрыть предложение', { size: 'sm', icon: 'eye-off', act: 'hideoffer' })}</div>${goal()}`;
  const yuPane = () => `<div class="row t-sm muted"><span class="yu2">${I('sparkles')}</span><span class="sp">Уровень: «Обратимое — сама»</span><a data-go="yuia" class="accent">настроить</a></div>
    <div class="card mt12 ycard" style="padding:14px"><div style="font-size:15px"><b>Нужно ваше «да»:</b> убрать из эфира «Заработок 300к» — 4 спам-ссылки за минуту</div><div class="row mt12" style="gap:8px">${btn('Да, убрать', { size: 'sm', kind: 'primary', act: 'confirmyes' })}${btn('Нет', { size: 'sm', act: 'confirmno' })}</div></div>
    <div class="card mt8 ycard" style="padding:14px"><div style="font-size:15px">Вы сказали «давайте проголосуем». Готов опрос: «Что мешает больше: мысли, тело, сон?»</div><div class="row mt12" style="gap:8px">${btn('Запустить опрос', { size: 'sm', kind: 'primary', act: 'pollgo' })}${btn('Не надо', { size: 'sm', act: 'confirmno' })}</div></div>
    <div class="pn__sec">Журнал</div><div id="ylog">${D.yuiaLog.map((l) => `<div class="li"><span class="mono t-xs muted" style="width:56px">${l.t.slice(0, 5)}</span><div class="li__m"><div class="li__t" style="font-weight:500">${l.act}: ${esc(l.obj)}</div><div class="li__s">${esc(l.why)}</div></div>${l.undo ? btn('', { icon: 'undo', size: 'sm', cls: 'btn2--icon', act: 'ylogundo' }) : ''}</div>`).join('')}</div>`;
  const POLL = { q: 'Что мешает больше: мысли, тело, сон?', o: [['Мысли', 41], ['Тело', 23], ['Сон', 36]] };
  const pollBars = (o, total) => o.map(([l, v]) => `<div class="pbar2"><div class="row"><span class="sp">${l}</span><b>${v} %</b></div><div class="ag__bar"><i style="width:${v}%"></i></div></div>`).join('') + `<div class="t-xs muted mt8">${total}</div>`;
  const pollPane = () => `<div class="card" style="padding:14px"><div class="row"><span class="chip2 chip2--live" id="plive" ${S.pollLive ? '' : 'hidden'}>идёт</span><span class="t-sm muted sp">анонимно</span></div><div class="b mt8" style="font-size:16px">${POLL.q}</div><div class="mt12" id="pres">${pollBars(POLL.o, S.pollLive ? 'ответили 1 412 из 2 418 · обновляется' : 'ещё не запущен')}</div>
      <div class="row mt12" style="gap:8px">${S.pollLive ? btn('Показать итоги всем', { size: 'sm', kind: 'primary', act: 'toast', data: 'data-text="Итоги видят все зрители — и попадут в отчёт"' }) + btn('Завершить', { size: 'sm', act: 'pollend' }) : btn('Запустить', { size: 'sm', kind: 'primary', icon: 'play', act: 'pollgo' })}</div></div>
    <div class="pn__sec">Новый опрос</div><input class="in" placeholder="Вопрос зрителям" value="Как вы сейчас, от 1 до 5?"><div class="row mt8" style="gap:8px">${['Опрос', 'Викторина', 'Шкала', 'Свой ответ'].map((t, i) => `<button class="chip2 ${i ? '' : 'chip2--accent'}" data-act="seg">${t}</button>`).join('')}</div>${opt('Анонимно', '', true)}
    <div class="pn__sec">Библиотека</div>${['Как вы сейчас — шкала 1–5', 'Что откликнулось больше всего', 'Викторина: тревога или страх'].map((t) => li({ lead: `<span class="li__ic">${I('chart-bar')}</span>`, t, act: 'toast', data: 'data-text="Опрос готов к запуску"' })).join('')}`;
  P.pollBars = pollBars; P.POLL = POLL;
  const SCENES = [['Приветствие', 'заставка и обратный отсчёт', 'p32'], ['Докладчики рядом', 'Анна и Дмитрий', 'p68'], ['Слайды и докладчик', 'показ «Тревога или расстройство»', 'p32'], ['Вопросы', 'вопрос на экране и отвечающий', 'p20'], ['Предложение', 'курс «Опора» поверх эфира', 'p23'], ['Перерыв', 'музыка и таймер 5:00', 'p26']];
  const scenePane = () => `<div class="t-sm muted">Соберите сцены заранее — во время эфира выводите одной кнопкой. Сейчас в эфире — «Докладчики рядом».</div><div class="scn mt12">${SCENES.map(([t, s, im], i) => `<button class="scn__i ${i === 1 ? 'is-live' : ''} ${i === 2 ? 'is-next' : ''}" data-act="scnpick" data-i="${i}"><span class="scn__th" style="background-image:url(img/people/${im}.jpg)">${i === 1 ? '<b>в эфире</b>' : i === 2 ? '<b class="nx">следующая</b>' : ''}</span><span class="scn__t">${t}</span><span class="scn__s">${s}</span></button>`).join('')}</div>
    <div class="row mt12" style="gap:8px">${btn('В эфир: «Слайды и докладчик»', { kind: 'primary', icon: 'broadcast', act: 'scngo', id: 'scngo' })}${btn('Видео из файла', { icon: 'play', act: 'toast', data: 'data-text="Ролик «Дыхание 4-7-8» пойдёт в эфир с сервера — чётко у всех, без показа экрана"' })}</div>`;
  const matPane = () => `${[['file-text', 'Упражнение «5-4-3-2-1» · PDF', 'Юя опубликовала, когда вы о нём сказали'], ['link', 'Тест тревоги GAD-7', 'ссылка'], ['graduation-cap', 'Курс «Опора» — программа', 'страница курса']].map(([i, t, s]) => li({ lead: `<span class="li__ic">${I(i)}</span>`, t, s })).join('')}<div class="mt12">${btn('Добавить материал', { icon: 'plus', size: 'sm', act: 'toast', data: 'data-text="Материал виден всем зрителям в панели «Материалы»"' })}</div>`;

  add({
    id: 'stage', group: G, title: 'Эфир: пульт ведущей', icon: 'broadcast', phase: 'фазы 2А–3', plan: '§ 6.3–6.4, § 5.7, § 5.13, § 5.21, § 1.7 п. 13',
    desc: 'Выход в эфир с отсчётом, сцена с плашками, зрители и страны, вопросы, чат с модерацией Юи, очередь рук и вывод на сцену, тихая панель продаж, подтверждения Юи, «Сейчас вернёмся».',
    tips: ['«Выйти в эфир» — отсчёт и LIVE', '«Продажи» → «Показать зрителям», потом откройте экран зрителя', '«Руки» → «На сцену»', '«Юя» — подтвердите удаление спамера', '«Ещё» → «Проверить: пропала связь»'],
    acts: {
      golive: (el) => { const ov = $('.countdown'); ov.hidden = false; let n = 3; ov.textContent = n; const h = every(800, () => { n--; if (n > 0) ov.textContent = n; else { clearInterval(h); ov.hidden = true; S.live = true; $('#livest').outerHTML = chip('В ЭФИРЕ', 'live'); el.remove(); toast('Вы в эфире. 1 284 зрителя из зала ожидания вошли за 1,8 с', { icon: 'broadcast' }); } }); },
      offer: (el) => { S.offerLive = el.dataset.o; const o = D.offers.find((x) => x.id === S.offerLive); $('.pn[data-pn="sales"] .pn__b').innerHTML = salesPane(); toast(`Зрители видят «${o.title}» — таймер 15 минут`, { icon: 'target' }); },
      hideoffer: () => { S.offerLive = null; $('.pn[data-pn="sales"] .pn__b').innerHTML = salesPane(); toast('Предложение скрыто'); },
      onstage: (el) => { const p = P.person(el.dataset.who); modal(`<div class="modal2__t">${p.name} — на сцену?</div><div class="modal2__s">Ей придёт окно согласия: «Вас увидят 2 418 зрителей, эфир записывается». Можно выйти только голосом или с аватаром. Переход — за секунду.</div><div class="mt16">${seg(['Видео и голос', 'Только голос', 'Аватар'], 0, 'seg', { block: true })}</div><div class="modal2__f">${btn('Отмена', { act: 'close-modal', size: 'lg' })}${btn('Пригласить', { kind: 'primary', size: 'lg', icon: 'user-check', act: 'onstagego' })}</div>`, { dark: true }); },
      onstagego: () => { closeModal(); later(900, () => { $('.stile--guest').hidden = false; $('.scene').classList.add('has-guest'); $('#handsq')?.firstElementChild?.remove(); toast('Вера согласилась и вышла на сцену за 0,8 с', { icon: 'user-check' }); }); },
      confirmyes: (el) => { el.closest('.ycard').remove(); $('#ylog').insertAdjacentHTML('afterbegin', `<div class="li fade-up"><span class="mono t-xs muted" style="width:56px">19:43</span><div class="li__m"><div class="li__t" style="font-weight:500">Убрала из эфира: «Заработок 300к»</div><div class="li__s ok">вы подтвердили</div></div>${btn('', { icon: 'undo', size: 'sm', cls: 'btn2--icon', act: 'ylogundo' })}</div>`); toast('Спамер выведен из эфира. Отменить можно в журнале', { icon: 'user-x' }); },
      confirmno: (el) => { el.closest('.ycard').remove(); toast('Хорошо, не буду'); },
      pollgo: (el) => { el.closest('.ycard')?.remove(); S.pollLive = true; $('.pn[data-pn="poll"] .pn__b').innerHTML = pollPane(); if (!$('.pn[data-pn="poll"]').classList.contains('is-open')) P.openPanel('poll'); toast('Опрос запущен — зрители видят его поверх видео', { icon: 'chart-bar' });
        const h = setInterval(() => { const r = $('#pres'); if (!r || !S.pollLive) return clearInterval(h); POLL.o = POLL.o.map(([l, v]) => [l, Math.max(5, Math.min(70, v + Math.round(Math.random() * 6 - 3)))]); r.innerHTML = pollBars(POLL.o, `ответили ${num(1412 + Math.round(Math.random() * 400))} из 2 418 · обновляется`); }, 1500); },
      pollend: () => { S.pollLive = false; $('.pn[data-pn="poll"] .pn__b').innerHTML = pollPane(); toast('Опрос завершён — итоги в отчёте эфира'); },
      scnpick: (el) => { $$('.scn__i').forEach((x) => { x.classList.toggle('is-next', x === el && !x.classList.contains('is-live')); x.querySelector('.nx')?.remove(); }); if (!el.classList.contains('is-live')) el.querySelector('.scn__th').insertAdjacentHTML('beforeend', '<b class="nx">следующая</b>'); $('#scngo').innerHTML = `${I('broadcast')}<span>В эфир: «${SCENES[+el.dataset.i][0]}»</span>`; $('#scngo').dataset.i = el.dataset.i; },
      scngo: (el) => { const i = +(el.dataset.i ?? 2); $$('.scn__i').forEach((x, k) => { x.classList.toggle('is-live', k === i); x.classList.remove('is-next'); const th = x.querySelector('.scn__th'); th.querySelectorAll('b').forEach((b) => b.remove()); if (k === i) th.insertAdjacentHTML('beforeend', '<b>в эфире</b>'); }); const lay = { 1: 'side', 2: 'slides', 3: 'speaker' }[i]; if (lay) $$('.scene').forEach((x) => (x.dataset.lay = lay)); toast(`В эфире сцена «${SCENES[i][0]}» — переход плавный, без чёрного кадра`, { icon: 'broadcast' }); },
      qfreeze: (el) => { el.classList.toggle('btn2--primary'); toast(el.classList.contains('btn2--primary') ? 'Порядок вопросов закреплён — новые голоса не двигают список, пока вы читаете' : 'Список снова сортируется по голосам', { icon: 'pin' }); },
      popout: () => toast('Панель открыта в отдельном окне — перетащите его на второй монитор', { icon: 'external-link' }),
      scenelay: (el) => { $$('button', el.parentElement).forEach((b) => b.classList.toggle('is-on', b === el)); $$('.scene').forEach((x) => (x.dataset.lay = el.dataset.v)); toast(`Зрители видят: ${el.textContent}`, { icon: 'eye' }); },
      slides: () => { $$('.scene').forEach((x) => (x.dataset.lay = 'slides')); $$('.bs2 .seg2 button').forEach((b) => b.classList.toggle('is-on', b.dataset.v === 'slides')); toast('Слайды на сцене, вы — рядом. Зрители могут приблизить текст', { icon: 'screen-share' }); },
      ylogundo: (el) => { el.closest('.li').style.opacity = .5; el.outerHTML = chip('отменено'); toast('Отменено', { icon: 'undo' }); },
      restore: (el) => { el.closest('.msg').classList.remove('is-hidden'); el.remove(); toast('Сообщение возвращено — Юя это учтёт'); },
      pinmsg: (el) => { el.closest('.msg').classList.add('is-pinned'); toast('Закреплено для всех'); },
      answer: (el) => { el.closest('.qc').classList.add('is-on'); el.parentElement.outerHTML = '<div class="t-xs mt8" style="color:#E8B898">на экране у зрителей — отвечайте голосом</div>'; },
      brb: () => { const sc = $('.scene'); sc.classList.add('is-brb'); toast('Связь Анны пропала — зрители видят заставку, Дмитрий ведёт', { icon: 'wifi-off' }); later(4500, () => { sc.classList.remove('is-brb'); toast('Анна вернулась через 4 с — зрители никуда не ушли', { icon: 'wifi' }); }); },
      mini: () => $('.rm').classList.toggle('is-mini'),
      'go-viewer': () => go('viewer'),
    },
    more: 'stage',
    render() {
      const pop = btn('', { icon: 'external-link', size: 'sm', cls: 'btn2--icon', act: 'popout', data: 'title="В отдельное окно"' });
      const panels = P.pn('aud', 'Зрители', audPane(), { open: true, head: pop }) + P.pn('qa', 'Вопросы', qaPane(), { head: btn('Закрепить порядок', { size: 'sm', icon: 'pin', act: 'qfreeze' }) + pop }) + P.pn('scn', 'Сцены', scenePane()) + P.pn('chat', 'Чат', '<div class="msgs" id="s-chat"></div>', { head: btn('Медленно', { size: 'sm', act: 'sw', data: 'data-text="Медленный режим: одно сообщение в 10 секунд"' }), foot: `<input class="in" placeholder="Написать зрителям…">${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'toast', data: 'data-text="Отправлено"' })}` }) + P.pn('hands', 'Руки', handsPane()) + P.pn('sales', 'Продажи', salesPane()) + P.pn('yu', 'Юя', yuPane(), { foot: `<input class="in" placeholder="«Юя, закрепи упражнение»">${btn('', { icon: 'mic', kind: 'primary', cls: 'btn2--icon', act: 'toast', data: 'data-text="Команда исполнена быстрым путём за 0,4 с"' })}` }) + P.pn('poll', 'Опросы', pollPane()) + P.pn('mat', 'Материалы', matPane());
      const bs = `<aside class="bs2"><div class="h3">Закулисье</div>${[['dmitry', 'Докладчик · звук и свет проверены'], ['elena', 'Соведущая · подменит вас']].map(([id, s]) => `<div class="bs2__p">${av(id, 36)}<div class="sp"><div class="b t-sm">${P.person(id).name}</div><div class="t-xs muted">${s}</div></div><span class="eq eq--on"><i></i><i></i><i></i></span></div>`).join('')}
        <div class="mt12">${btn('Позвать докладчика', { size: 'sm', icon: 'user-plus', act: 'toast', data: 'data-text="Ссылка в закулисье скопирована"' })}</div>
        <div class="h3 mt24">Что видят зрители</div><div class="mt8">${seg([['Говорящий', 'speaker'], ['Докладчики рядом', 'side'], ['Слайды и докладчик', 'slides']], 1, 'scenelay')}</div>
        <div class="h3 mt24">Оформление</div>${opt('Плашки', '', true)}${opt('Бегущая строка', '', true)}${opt('Число зрителей', '', false)}${goal()}
        <div class="mt16 col" style="gap:8px">${btn('Проверить: пропала связь', { size: 'sm', icon: 'wifi-off', act: 'brb', block: true })}${btn('Глазами зрителя', { size: 'sm', icon: 'eye', act: 'go-viewer', block: true })}</div></aside>`;
      return P.room({ cls: 'rm--stage', top: { title: 'Тревога и опора', sub: `· <span id="viewers">${num(2418)}</span> зрителей`, clock: '41:10', recLabel: 'Запись · субтитры · Юя', extra: `${S.live ? chip('В ЭФИРЕ', 'live') : `<span id="livest" class="top-pill">закулисье</span>`}${S.live ? '' : btn('Выйти в эфир', { kind: 'danger', icon: 'broadcast', act: 'golive' })}` },
        stage: `<div style="flex:1;display:flex;gap:12px;min-width:0">${bs}<div style="flex:1;display:flex;position:relative;min-width:0">${scene()}<div class="countdown" hidden>3</div></div></div>`, panels,
        bar: `${P.rbBase()}${P.rb('screen-share', '', 'slides', { title: 'Показать слайды' })}${P.rbPanel('scn', 'layout-grid', 'Сцены')}${P.rbPanel('aud', 'users', 'Зрители', { on: true })}${P.rbPanel('qa', 'help', 'Вопросы', { n: 5 })}${P.rbPanel('chat', 'message-circle', 'Чат')}${P.rbPanel('hands', 'hand', 'Руки', { n: 4 })}${P.rbPanel('poll', 'chart-bar', 'Опросы')}${P.rbPanel('sales', 'wallet', 'Продажи')}${P.rbPanel('yu', 'sparkles', 'Юя', { n: 2 })}${P.rbPanel('mat', 'paperclip', 'Материалы')}${P.rbReact()}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Завершить эфир')}` });
    },
    mount(root) {
      P.clock(41 * 60 + 10); liveChat($('#s-chat', root), true);
      P.subtitles(SUBS, (w) => $$('.stile', root).forEach((t) => t.classList.toggle('is-speaking', t.dataset.pid === w)));
      let v = 2418; every(2200, () => { v += Math.round(Math.random() * 14 - 4); const a = $('#viewers'), b = $('#v2'); if (a) a.textContent = num(v); if (b) b.textContent = num(v); });
      every(1800, () => P.flyEmoji(['👏', '❤️', '🙏', '💡'][Math.floor(Math.random() * 4)]));
      const donors = [['Яна', 500, 'Спасибо за эфир!'], ['Лев', 1000, ''], ['Дарья', 300, 'Очень нужно было это услышать'], ['Аноним', 3000, '']];
      let di = 0; every(7000, () => { const [n, a, m] = donors[di++ % donors.length]; S.raised += a; donationAlert(n, a, m); });
      let paid = 67, rev = 1189300; every(4100, () => { if (!S.offerLive) return; paid++; rev += 14900; const p = $('#paid'), r = $('#rev'); if (p) p.textContent = paid; if (r) r.textContent = rub(rev); });
    },
  });

  // ───────────── закулисье докладчика ─────────────
  add({
    id: 'backstage', group: G, title: 'Закулисье докладчика', icon: 'door', phase: 'фаза 2А', plan: '§ 1.7 п. 5, § 5.32, Приложение Ж.13',
    desc: 'Докладчик входит по ссылке, проверяет звук, свет и сеть, видит, что сейчас у зрителей, и переписывается с ведущей в чате закулисья. Выход на сцену — по её кнопке.',
    tips: ['Включите камеру — проверка света по-настоящему', 'Напишите в чат закулисья'],
    acts: {
      cam: async () => { await P.cam.start(); P.cam.attach(); },
      bsend: () => { const i = $('#bin'); if (!i.value.trim()) return; $('#bchat').insertAdjacentHTML('beforeend', `<div class="msg fade-up">${av('dmitry', 32)}<div class="msg__b"><span class="msg__n">Дмитрий</span><span class="msg__t">${esc(i.value)}</span></div></div>`); i.value = ''; later(1100, () => $('#bchat')?.insertAdjacentHTML('beforeend', `<div class="msg fade-up">${av('anna', 32)}<div class="msg__b"><span class="msg__n">Анна</span><span class="msg__t">Отлично, зову вас после упражнения, минуты через три</span></div></div>`)); },
    },
    render() {
      return P.room({ rec: false, top: { title: 'Закулисье', sub: '· «Тревога и опора»', rec: false, extra: `<span class="top-pill">${I('clock', 'xs')} На сцену через ~3 мин</span>` },
        stage: `<div style="flex:1;display:grid;grid-template-columns:1.2fr 1fr;gap:12px;min-height:0"><div class="tl" style="min-height:0"><div class="tl__img" style="background-image:url(img/people/p68.jpg)"></div><video class="my-cam tl__cam" playsinline autoplay muted hidden></video><span class="tl__name">Вы · Дмитрий Орлов</span><div class="prev2__ctl" style="bottom:56px">${btn('Включить камеру', { kind: 'primary', icon: 'video', act: 'cam' })}</div></div>
          <div class="col" style="gap:12px;min-height:0"><div class="pn is-open" style="width:auto;flex:none"><div class="pn__h"><h2 class="h2">Проверка</h2></div><div class="pn__b">${[['Микрофон', 'голос чистый, громкость хорошая', 1], ['Свет', 'лицо освещено ровно', 1], ['Интернет', 'хороший', 1], ['Наушники', 'эха не будет', 1]].map(([a, b]) => `<div class="row" style="padding:8px 0;font-size:15px">${I('check-circle', 'md', 'ok')}<b>${a}</b><span class="muted">${b}</span></div>`).join('')}</div></div>
            <div class="bs-prev" style="flex:1;min-height:180px;display:flex;position:relative">${scene()}</div></div></div>`,
        panels: P.pn('bchat', 'Чат закулисья', `<div class="msgs" id="bchat">${[['anna', 'Дмитрий, добрый вечер! Слышу вас отлично'], ['elena', 'Я на связи, если что — подхвачу']].map(([w, t]) => `<div class="msg">${av(w, 32)}<div class="msg__b"><span class="msg__n">${P.person(w).short}</span><span class="msg__t">${t}</span></div></div>`).join('')}</div>`, { open: true, foot: `<input class="in" id="bin" placeholder="Написать ведущим…" value="Готов, слайды открыты">${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'bsend' })}` }),
        bar: `${P.rbBase()}${P.rb('screen-share', 'Слайды', 'toast', { data: 'data-text="Слайды готовы к показу в закулисье"' })}${P.rbPanel('bchat', 'message-circle', 'Чат закулисья', { on: true })}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Выйти')}` });
    },
    mount(root) { P.cam.attach(root); P.subtitles(SUBS); },
  });

  // ───────────── зритель ─────────────
  const offerHtml = (o) => `<div class="offer2 fade-up" id="offer"><div class="row"><div class="sp"><div class="offer2__k">${o.kind} · осталось ${o.left} мест</div><div class="offer2__t">${esc(o.title)}</div></div><button class="btn2 btn2--icon btn2--sm" data-act="offerx" aria-label="Скрыть" style="background:transparent;color:#141210">${I('x')}</button></div>
    <div class="row mt8"><span class="offer2__p">${rub(o.price)}</span>${o.old ? `<s class="muted">${rub(o.old)}</s>` : ''}<span class="sp"></span><span class="mono" id="otimer">${o.timer}</span></div>
    <div class="row mt12" style="gap:8px">${btn('Купить, не уходя из эфира', { kind: 'primary', size: 'lg', icon: 'credit-card', act: 'buy', cls: 'sp' })}${btn('', { icon: 'qrcode', size: 'lg', cls: 'btn2--icon', act: 'buy', data: 'title="QR для телефона"' })}</div></div>`;
  add({
    id: 'viewer', group: G, title: 'Эфир глазами зрителя', icon: 'eye', phase: 'фазы 2А–3', plan: '§ 5.7, § 5.21, § 5.12, Приложение Ж.4–Ж.5, Ж.13',
    desc: 'Сцена крупно, субтитры на своём языке, чат и вопросы, материалы. Предложение поверх эфира и оплата не уходя — видео в мини-окне. Подарок ведущей. Подняли руку — приглашение на сцену с согласием.',
    tips: ['Через 3 секунды появится предложение — «Купить»', '«Поддержать» — подарок с именем или анонимно', 'Поднимите руку — вас пригласят на сцену', 'Напишите «не слышно» — Юя ответит лично'],
    acts: {
      buy: () => { const o = D.offers.find((x) => x.id === (S.offerLive || 'course')); $('.rm').classList.add('is-mini'); P.payModal(o.price, o.title, () => { $('.rm').classList.remove('is-mini'); $('#offer').outerHTML = `<div class="offer2 offer2--done fade-up" id="offer">${I('check-circle', 'lg')}<div><b>Готово — доступ к курсу открыт</b><div class="t-sm">Чек и вход в курс — на почте. Эфир продолжается.</div></div></div>`; later(3500, () => $('#offer')?.remove()); }, { dark: true }); later(400, () => $('.mback')?.addEventListener('click', () => $('.rm')?.classList.remove('is-mini'))); },
      offerx: () => $('#offer')?.remove(),
      gift: () => P.giftModal({ dark: true, onDone: (a, m, anon) => donationAlert(anon ? 'Аноним' : 'Ольга', a, m) }),
      vsend: () => { const i = $('#vin'); const v = i.value.trim(); if (!v) return; $('#v-chat').insertAdjacentHTML('beforeend', smsg({ who: 'olga', text: v })); i.value = ''; if (/слыш|звук/i.test(v)) later(1200, () => $('#v-chat')?.insertAdjacentHTML('beforeend', `<div class="msg fade-up"><span class="yu2">${I('sparkles')}</span><div class="msg__b"><span class="msg__n">Юя</span><span class="msg__t">Ольга, звук к вам приходит, но громкость вкладки на нуле. Нажмите на значок динамика в адресной строке.</span> <span class="muted t-xs">· видно только вам</span></div></div>`)); },
      vhand: (el) => { el.classList.toggle('is-on'); if (!el.classList.contains('is-on')) return; toast('Рука поднята. Вы пятая в очереди', { icon: 'hand' }); later(2500, () => modal(`<div class="modal2__t">Анна приглашает вас на сцену</div><div class="modal2__s">Вас увидят и услышат 2 418 зрителей, эфир записывается. Можно выйти только голосом.</div><div class="mt16">${seg(['С видео', 'Только голос', 'С аватаром'], 1, 'seg', { block: true })}</div><div class="modal2__f">${btn('Не сейчас', { act: 'close-modal', size: 'lg' })}${btn('Выйти на сцену', { kind: 'primary', size: 'lg', act: 'stagego' })}</div>`, { dark: true })); },
      stagego: () => { closeModal(); $('.stile--guest').hidden = false; $('.stile--guest').style.backgroundImage = 'url(img/people/p23.jpg)'; $('.stile--guest .plate').innerHTML = '<b>Ольга Белова</b>из зала · только голос'; $('.scene').classList.add('has-guest'); toast('Вы на сцене. Уйти можно одной кнопкой', { icon: 'mic' }); },
      ask: () => { const i = $('#qin'); if (!i.value.trim()) return; toast(`Вопрос отправлен${$('#qanon').classList.contains('is-on') ? ' анонимно' : ''}. Юя склеит его с похожими`); i.value = ''; },
      vote: (el) => { if (el.closest('.vpoll')) { const box = el.closest('.vpoll'); box.querySelector('.vpoll__b').innerHTML = `${P.pollBars(POLL.o.map(([l, v]) => [l === el.dataset.v ? `${l} · ваш ответ` : l, v]), 'ответили 1 412 · анонимно')}`; later(6000, () => box.remove()); return; } const n = el.querySelector('.qv2'); n.textContent = +n.textContent + 1; el.classList.add('is-on'); },
      vpollx: (el) => el.closest('.vpoll').remove(),
      mynadd: () => { const i = $('#mynin'); if (!i.value.trim()) return; $('#mynl').insertAdjacentHTML('beforeend', `<div class="mnote fade-up"><span class="mono accent">41:${String(10 + $$('.mnote').length).padStart(2, '0')}</span><span>${esc(i.value)}</span></div>`); i.value = ''; toast('Заметка сохранена в вашем кабинете — рядом с записью эфира', { icon: 'notes' }); },
      missed: () => modal(`<div class="row"><span class="yu2 yu2--lg">${I('sparkles', 'lg')}</span><div><div class="t-sm muted">Юя · вы вошли на 41-й минуте</div><div class="modal2__t" style="padding:0">Что было до вас</div></div></div>
        <div class="col mt16" style="gap:12px;font-size:15px;line-height:1.55">${[['00:00', 'Анна рассказала, чем тревога отличается от расстройства: дольше полугода и мешает жить'], ['07:40', 'Дмитрий — когда идти к врачу и почему это не стыдно'], ['23:35', 'Упражнение «5-4-3-2-1» — оно в «Материалах»'], ['36:10', 'Вопросы зрителей: панические атаки ночью, тревога у подростков']].map(([t, x]) => `<div class="row row--top"><span class="mono accent" style="width:52px;flex:none">${t}</span><span>${x}</span></div>`).join('')}</div>
        <div class="modal2__f">${btn('Понятно, смотрю дальше', { kind: 'primary', size: 'lg', act: 'close-modal' })}</div><div class="t-xs muted mt12">По расшифровке эфира на русском. Полная запись — по вашему билету после эфира.</div>`, { dark: true }),
    },
    render() {
      const panels = P.pn('chat', 'Чат', `<div class="pinbar">${I('pin', 'sm')}<span class="sp"><b>Анна:</b> упражнение «5-4-3-2-1» — в «Материалах», запись будет до 26 октября</span></div><div class="msgs" id="v-chat"></div>`, { open: true, foot: `<input class="in" id="vin" placeholder="Сообщение…" value="не слышно">${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'vsend' })}` })
        + P.pn('qa', 'Вопросы', `${D.questions.slice(0, 4).map((q) => `<button class="qc" data-act="vote"><span class="qv2">${q.votes}</span><span class="sp">${esc(q.text)}<div class="t-xs">${q.anon ? 'анонимно' : P.person(q.who).short}</div></span></button>`).join('')}`, { foot: `<input class="in" id="qin" placeholder="Ваш вопрос…"><label class="row t-xs" style="gap:6px;color:#B5AB9D;flex:none">анонимно<button class="sw" id="qanon" data-act="sw" aria-label="Анонимно"></button></label>${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'ask' })}` })
        + P.pn('mat', 'Материалы', [['file-text', 'Упражнение «5-4-3-2-1» · PDF'], ['link', 'Тест тревоги GAD-7'], ['graduation-cap', 'Курс «Опора» — программа']].map(([i, t]) => li({ lead: `<span class="li__ic">${I(i)}</span>`, t, act: 'toast', data: 'data-text="Открыто в новой вкладке — эфир продолжается"' })).join(''))
        + P.pn('mynotes', 'Мои заметки', `<div class="t-sm muted">Видите только вы. Каждая заметка помнит минуту эфира — из записи можно перейти к этому месту.</div><div class="mt12" id="mynl">${[['23:35', 'Упражнение 5-4-3-2-1 — попробовать перед сном'], ['36:10', 'Спросить врача про тревогу ночью']].map(([t, x]) => `<div class="mnote"><span class="mono accent">${t}</span><span>${x}</span></div>`).join('')}</div>`, { foot: `<input class="in" id="mynin" placeholder="Заметка к этой минуте…">${btn('', { icon: 'plus', kind: 'primary', cls: 'btn2--icon', act: 'mynadd' })}` });
      return P.room({ top: { title: 'Тревога и опора', sub: '· Анна Соколова', recLabel: 'Запись · субтитры', extra: `${chip('В ЭФИРЕ', 'live')}<button class="top-pill top-pill--yu" data-act="missed">${I('sparkles', 'xs')} Что я пропустил?</button><span class="top-pill">${I('cc', 'xs')} Deutsch</span>` },
        stage: `<div style="flex:1;display:flex;position:relative;min-width:0">${scene({ extra: '<div class="hls" id="hls">' + I('wifi') + ' Интернет слабый — эфир идёт чуть позже остальных, зато без замираний</div>' })}<div id="offerhost"></div></div>`, panels,
        bar: `${P.rb('volume', '', 'toast', { title: 'Громкость', cls: 'rb--core', data: 'data-text="Громкость 80 %"' })}${P.rb('cc', '', 'cc', { on: true, title: 'Субтитры', cls: 'rb--core' })}<span class="rb-gap"></span>${P.rbPanel('chat', 'message-circle', 'Чат', { on: true })}${P.rbPanel('qa', 'help', 'Вопросы')}${P.rbPanel('mat', 'paperclip', 'Материалы')}${P.rbPanel('mynotes', 'notes', 'Заметки')}${P.rb('heart', 'Поддержать', 'gift')}${P.rbReact()}${P.rb('hand', '', 'vhand', { title: 'Поднять руку · ⌘⇧H', cls: 'rb--core' })}${P.rb('maximize', '', 'm-full', { title: 'Во весь экран' })}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Выйти')}` });
    },
    mount(root) {
      liveChat($('#v-chat', root), false);
      $('#vin').addEventListener('keydown', (e) => e.key === 'Enter' && this.acts.vsend());
      P.subtitles([['anna', 'Halt ist nicht die Abwesenheit von Angst, sondern die Fähigkeit, mit sich in Kontakt zu bleiben'], ['dmitry', 'Wenn die Angst länger als ein halbes Jahr anhält — ist das ein Grund, zum Spezialisten zu gehen']], (w) => $$('.stile', root).forEach((t) => t.classList.toggle('is-speaking', t.dataset.pid === w)));
      every(2200, () => P.flyEmoji(['👏', '❤️', '🙏'][Math.floor(Math.random() * 3)]));
      later(3000, () => { const o = D.offers.find((x) => x.id === (S.offerLive || 'course')); const h = $('#offerhost'); if (h) h.innerHTML = offerHtml(o); let s = 899; every(1000, () => { s = Math.max(0, s - 1); const t = $('#otimer'); if (t) t.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }); });
      later(9000, () => { $('#hls')?.classList.add('is-show'); later(5000, () => $('#hls')?.classList.remove('is-show')); });
      later(6000, () => { const sc = $('.scene', root); if (!sc) return; sc.insertAdjacentHTML('beforeend', `<div class="vpoll fade-up"><div class="row"><span class="t-xs muted sp">${I('chart-bar', 'xs')} Опрос · анонимно</span><button class="vpoll__x" data-act="vpollx" aria-label="Закрыть">${I('x', 'sm')}</button></div><div class="b mt8">${POLL.q}</div><div class="vpoll__b mt12">${POLL.o.map(([l]) => `<button class="vpoll__o" data-act="vote" data-v="${l}">${l}</button>`).join('')}</div></div>`); });
      later(1200, () => toast('Вы вошли на 41-й минуте — «Что я пропустил?» вверху расскажет коротко', { icon: 'sparkles' }));
      every(8000, () => { S.raised += 500; donationAlert('Яна', 500, 'Спасибо!'); });
    },
  });

  // ───────────── зритель с телефона ─────────────
  // Предложение — полоской между видео и чатом: не прячет ни видео, ни чат (у GetCourse на телефоне продающий блок закрывает чат)
  const vmPanes = {
    chat: () => `<div class="pinbar">${I('pin', 'sm')}<span class="sp"><b>Анна:</b> упражнение «5-4-3-2-1» — в «Материалах»</span></div><div class="msgs" id="vm-chat"></div>`,
    qa: () => D.questions.slice(0, 4).map((q) => `<button class="qc" data-act="vmvote"><span class="qv2">${q.votes}</span><span class="sp">${esc(q.text)}<div class="t-xs">${q.anon ? 'анонимно' : P.person(q.who).short}${q.merged ? ` · Юя склеила ${q.merged} похожих` : ''}</div></span></button>`).join(''),
    mat: () => [['file-text', 'Упражнение «5-4-3-2-1» · PDF'], ['link', 'Тест тревоги GAD-7'], ['graduation-cap', 'Курс «Опора» — программа']].map(([i, t]) => li({ lead: `<span class="li__ic">${I(i)}</span>`, t, act: 'toast', data: 'data-text="Открыто — эфир продолжается в мини-окне"' })).join(''),
  };
  add({
    id: 'viewer-mobile', group: G, title: 'Эфир с телефона', icon: 'device-mobile', frame: 'phone', dark: true, pair: 'viewer', phase: 'фазы 2А–3', plan: '§ 5.21, § 12.1 п. 4 — на телефоне предложение не прячет чат',
    desc: 'Видео сверху, под ним — полоска предложения, которая не закрывает ни видео, ни чат. Чат, вопросы и материалы вкладками. Рука, реакции, подарок, субтитры и «Что я пропустил?» — в одно касание. Оплата SberPay, T-Pay, Mir Pay или СБП, эфир не прерывается.',
    tips: ['Через 2 секунды под видео появится предложение', '«Подробнее» раскрывает его, чат остаётся на месте', 'Вкладка «Вопросы» — голосуйте за вопросы', 'Значок ✦ — «Что я пропустил?»'],
    acts: {
      buy: () => P.payModal(14900, 'Курс «Опора»', () => { $('#vmoffer').innerHTML = `<div class="row" style="gap:10px">${I('check-circle', 'md', 'ok')}<span class="sp"><b>Доступ к курсу открыт</b><span class="t-xs muted" style="display:block">чек и вход — на почте, эфир идёт</span></span></div>`; later(3500, () => $('#vmoffer')?.classList.remove('is-show')); }, { dark: true }),
      gift: () => P.giftModal({ dark: true }),
      omore: () => $('#vmoffer').classList.toggle('is-open'),
      ohide: () => $('#vmoffer').classList.remove('is-show'),
      vmtab: (el) => { $$('.vm2__tabs button').forEach((b) => b.classList.toggle('is-on', b === el)); const k = el.dataset.v; $('#vmpane').innerHTML = vmPanes[k](); if (k === 'chat') liveChat($('#vm-chat'), false); $('#vmq').hidden = k !== 'qa'; $('#vmin').placeholder = k === 'qa' ? 'Ваш вопрос ведущим…' : 'Сообщение…'; },
      vmvote: (el) => { const n = el.querySelector('.qv2'); n.textContent = +n.textContent + 1; el.classList.add('is-on'); },
      vmsend: () => { const i = $('#vmin'); const v = i.value.trim(); if (!v) return; if (!$('#vmq').hidden) { toast('Вопрос отправлен. Юя склеит его с похожими'); i.value = ''; return; } $('#vm-chat')?.insertAdjacentHTML('beforeend', `<div class="msg fade-up">${av('olga', 32)}<div class="msg__b"><span class="msg__n">Вы</span><span class="msg__t">${esc(v)}</span></div></div>`); i.value = ''; },
      vmreact: () => $('.mreact').classList.toggle('is-open'),
      memo: (el) => { P.flyEmoji(el.textContent); $('.mreact').classList.remove('is-open'); },
      vmhand: (el) => { el.classList.toggle('is-on'); toast(el.classList.contains('is-on') ? 'Рука поднята — Анна может пригласить вас на сцену, можно только голосом' : 'Рука опущена', { icon: 'hand' }); },
      vmcc: (el) => { el.classList.toggle('is-on'); $('.vm2__video .subs').hidden = !el.classList.contains('is-on'); },
      missed: () => P.screens.find((x) => x.id === 'viewer').acts.missed(),
    },
    render() {
      return `<div class="mob vm2"><div class="vm2__video" style="background-image:url(img/people/p32.jpg)"><span class="top-pill" style="position:absolute;left:10px;top:10px;background:#C0392B;color:#fff">● В ЭФИРЕ</span><span class="top-pill" style="position:absolute;right:10px;top:10px">${I('users', 'xs')} 2 418</span>
          <div class="subs" style="bottom:10px;left:12px;right:12px;transform:none;max-width:none;font-size:14px">Опора — это способность оставаться в контакте с собой</div><div class="rm__fx"></div></div>
        <div class="vm2__info"><div class="sp" style="min-width:0"><div class="b ell">Тревога и опора</div><div class="t-sm muted ell">Анна Соколова · субтитры: русский · 0,4 с</div></div>
          <button class="vm2__ib vm2__ib--yu" data-act="missed" title="Что я пропустил?">${I('sparkles', 'md')}</button><button class="vm2__ib is-on" data-act="vmcc" title="Субтитры">${I('cc', 'md')}</button><button class="vm2__ib" data-act="gift" title="Поддержать Анну">${I('heart', 'md')}</button></div>
        <div class="vm2__offer" id="vmoffer"><div class="row" style="gap:10px"><span class="vm2__oi">${I('graduation-cap', 'md')}</span><div class="sp" style="min-width:0"><div class="b ell">Курс «Опора»</div><div class="t-sm ell"><b>14 900 ₽</b> <s class="muted">19 900</s> <span class="muted">· 23 места · <span class="mono" id="vmt">14:59</span></span></div></div>${btn('Купить', { kind: 'primary', size: 'sm', act: 'buy' })}<button class="vm2__ox" data-act="omore" aria-label="Подробнее">${I('chevron-down', 'sm')}</button></div>
          <div class="vm2__od"><div class="t-sm" style="line-height:1.45">6 недель: записи эфиров, задания с разбором, чат потока. Можно тремя частями по 4 967 ₽ — SberPay, T-Pay, СБП. <a class="muted" data-act="ohide" style="text-decoration:underline">Скрыть</a></div></div></div>
        <div class="vm2__tabs">${[['Чат', 'chat'], ['Вопросы · 4', 'qa'], ['Материалы', 'mat']].map(([t, v], i) => `<button class="${i ? '' : 'is-on'}" data-act="vmtab" data-v="${v}">${t}</button>`).join('')}</div>
        <div class="vm2__pane" id="vmpane">${vmPanes.chat()}</div>
        <div class="mreact">${['👏', '❤️', '🙏', '😊', '💡', '🌿'].map((e) => `<button data-act="memo">${e}</button>`).join('')}</div>
        <div class="vm2__in"><span id="vmq" hidden class="t-xs muted">анонимно</span><input class="in" id="vmin" placeholder="Сообщение…"><button class="vm2__ib" data-act="vmreact" title="Реакции">${I('smile', 'md')}</button><button class="vm2__ib" data-act="vmhand" title="Поднять руку">${I('hand', 'md')}</button>${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'vmsend' })}</div></div>`;
    },
    mount(root) {
      liveChat($('#vm-chat', root), false);
      $('#vmin', root).addEventListener('keydown', (e) => e.key === 'Enter' && this.acts.vmsend());
      later(2000, () => $('#vmoffer')?.classList.add('is-show'));
      let t = 899; every(1000, () => { t = Math.max(0, t - 1); const el = $('#vmt'); if (el) el.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; });
      every(2600, () => P.flyEmoji(['👏', '❤️', '🙏'][Math.floor(Math.random() * 3)]));
    },
  });

  // ───────────── честный повтор ─────────────
  add({
    id: 'replay', group: G, title: 'Повтор эфира по расписанию', icon: 'repeat', phase: 'фаза 5', plan: '§ 1.8 — честность вместо имитации, Приложение Ж.13',
    desc: 'Запись идёт по расписанию, и зритель это видит. Чат живой, сообщения из прямого эфира помечены. Ведущая может подключиться вживую к концу.',
    acts: { rsend: () => { const i = $('#rin'); if (!i.value.trim()) return; $('#r-chat').insertAdjacentHTML('beforeend', `<div class="msg fade-up">${av('nina', 32)}<div class="msg__b"><span class="msg__n">Нина</span><span class="msg__t">${esc(i.value)}</span><div class="msg__tag">сейчас</div></div></div>`); i.value = ''; later(1100, () => $('#r-chat')?.insertAdjacentHTML('beforeend', `<div class="msg fade-up"><span class="yu2">${I('sparkles')}</span><div class="msg__b"><span class="msg__n">Юя</span><span class="msg__t">Нина, Анна подключится вживую в 20:30 и ответит на вопросы из этого чата.</span></div></div>`)); } },
    render() {
      const hist = D.chatSeed.slice(0, 4).map((m) => `<div class="msg">${av(m.who, 32)}<div class="msg__b"><span class="msg__n">${P.person(m.who).short}</span><span class="msg__t">${esc(m.text)}</span><div class="msg__tag">${I('history', 'xs')} из эфира 16 октября</div></div></div>`).join('');
      return P.room({ top: { title: 'Сон без тревоги', sub: '· повтор', rec: false, extra: `<span class="top-pill" style="color:#F4EFE7">${I('repeat', 'xs')} Запись эфира 16 октября · чат живой</span><span class="top-pill">${I('clock', 'xs')} Анна подключится вживую в 20:30</span>` },
        stage: `<div style="flex:1;display:flex;position:relative;min-width:0">${scene()}</div>`,
        panels: P.pn('chat', 'Чат', `<div class="msgs" id="r-chat">${hist}<div class="msg"><span class="yu2">${I('sparkles')}</span><div class="msg__b"><span class="msg__n">Юя</span><span class="msg__t">Это повтор. Сообщения выше — из прямого эфира, ниже — живые. Вопросы Анна разберёт вживую в 20:30.</span></div></div></div>`, { open: true, foot: `<input class="in" id="rin" placeholder="Вопрос к Анне…">${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'rsend' })}` }),
        bar: `${P.rb('volume', '', 'toast', { title: 'Громкость', data: 'data-text="Громкость 80 %"' })}${P.rb('cc', '', 'cc', { on: true, title: 'Субтитры' })}<span class="rb-gap"></span>${P.rbPanel('chat', 'message-circle', 'Чат', { on: true })}${P.rb('heart', 'Поддержать', 'gift')}${P.rbReact()}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Выйти')}` });
    },
    mount() { this.acts.gift = () => P.giftModal({ dark: true }); P.subtitles(SUBS); },
  });
})();

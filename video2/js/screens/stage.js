(function () {
  const { D, S, add, I, av, esc, rub, num, toast, modal, closeModal, go, every, later, ROOM_ACTS, $, $$ } = P;
  const G = 'Комната';

  const stageComp = (extra = '') => `<div class="scene">
      <div class="scene__tiles">
        <div class="stile" data-pid="anna" style="background-image:url(img/people/p32.jpg)"><span class="plate"><b>Анна Соколова</b>психолог, КПТ</span></div>
        <div class="stile" data-pid="dmitry" style="background-image:url(img/people/p68.jpg)"><span class="plate"><b>Дмитрий Орлов</b>психиатр-консультант</span></div>
        <div class="stile stile--guest" data-pid="vera" style="background-image:url(img/people/p20.jpg)" hidden><span class="plate"><b>Вера Ким</b>из зала · только голос и видео</span></div>
      </div>
      <div class="ticker">${I('bell', 'xs')} Упражнение «5-4-3-2-1» — в материалах эфира · запись будет до 26 октября</div>${extra}
      <div class="subs"></div><div class="room__fx"></div><div class="dalerts"></div></div>`;

  function donationAlert(name, amount, msg) {
    const host = $('.dalerts'); if (!host) return;
    const el = document.createElement('div'); el.className = 'dalert';
    el.innerHTML = `<span class="dalert__ic">${I('heart')}</span><div><b>${esc(name)}</b> подарила ${rub(amount)}${msg ? `<div class="tiny">«${esc(msg)}»</div>` : ''}</div>`;
    host.appendChild(el); setTimeout(() => el.classList.add('is-out'), 4200); setTimeout(() => el.remove(), 4800);
    $$('.goal i').forEach((g) => (g.style.width = Math.min(100, S.raised / D.donationGoal.goal * 100) + '%'));
    $$('.goal-sum').forEach((g) => (g.textContent = rub(S.raised)));
  }
  P.donationAlert = donationAlert;

  const offerCard = (o) => `<div class="offer fade-up"><div class="offer__k">${o.kind} · осталось ${o.left} мест</div><div class="offer__t">${esc(o.title)}</div>
    <div class="row" style="gap:10px;margin-top:8px"><b class="offer__p">${rub(o.price)}</b>${o.old ? `<s class="small muted">${rub(o.old)}</s>` : ''}<span class="sp"></span><span class="mono small" id="offer-timer">${o.timer || ''}</span></div>
    <div class="row" style="gap:8px;margin-top:10px"><button class="btn btn--primary" data-act="buy" style="flex:1">${I('credit-card')} Купить, не уходя из эфира</button><button class="btn btn--secondary" data-act="sbp" title="QR для телефона">${I('qrcode')}</button></div></div>`;

  const goalBar = () => `<div class="goalbox"><div class="tiny muted">${I('gift', 'xs')} ${esc(D.donationGoal.title)}</div><div class="row tiny" style="margin-top:4px;gap:6px"><b class="goal-sum">${rub(S.raised)}</b><span class="muted">из ${rub(D.donationGoal.goal)}</span></div><div class="bar goal" style="margin-top:6px"><i style="width:${S.raised / D.donationGoal.goal * 100}%"></i></div></div>`;

  // ───────────────────────────── пульт ведущей ─────────────────────────────
  add({
    id: 'stage', group: G, title: 'Эфир — пульт ведущей', icon: 'broadcast', phase: 'фаза 2А–3', plan: '§ 6.3–6.4; § 5.7; § 5.13; § 5.21',
    desc: 'Закулисье и выход в эфир, сцена с плашками, зрители по регионам и качество, вопросы с голосами, чат с модерацией Юи, очередь рук и вывод на сцену с согласием, тихая панель продаж, лента действий Юи с отменой и подтверждениями.',
    tips: ['«Выйти в эфир» — обратный отсчёт и LIVE', 'Продажи → «Показать» — зрители увидят карточку (откройте экран зрителя)', 'Руки → «На сцену» — Вера выйдет третьей плиткой', 'Юя → подтвердите удаление спамера'],
    acts: {
      golive: (el) => {
        const ov = $('.countdown'); ov.hidden = false; let n = 3; ov.textContent = n;
        const h = every(800, () => { n--; if (n > 0) ov.textContent = n; else { clearInterval(h); ov.hidden = true; S.live = true; $('.live-state').innerHTML = '<span class="pill pill--live">В ЭФИРЕ</span>'; el.remove(); toast('Вы в эфире · 1 284 зрителя ждали в зале — все вошли за 1,8 с', { icon: 'broadcast' }); } });
      },
      offer: (el) => { const o = D.offers.find((x) => x.id === el.dataset.o); S.offerLive = o.id; $$('[data-act="offer"]').forEach((b) => { b.textContent = b === el ? 'Показано' : 'Показать'; b.classList.toggle('btn--primary', b !== el); b.classList.toggle('btn--secondary', b === el); }); $('.scene-offer').innerHTML = `<div class="offer offer--mini">${esc(o.title)} · ${rub(o.price)}</div>`; toast(`Зрители видят: «${o.title}» · таймер 15 минут`, { icon: 'target' }); },
      hideoffer: () => { S.offerLive = null; $('.scene-offer').innerHTML = ''; $$('[data-act="offer"]').forEach((b) => { b.textContent = 'Показать'; b.classList.add('btn--primary'); b.classList.remove('btn--secondary'); }); toast('Предложение скрыто'); },
      onstage: (el) => modal(`<div class="eyebrow eyebrow--accent">Вывод на сцену</div><h2 class="pmodal__title">Вера Ким — на сцену?</h2><p class="pmodal__lead">Вере придёт окно согласия: «Вас увидят 2 418 зрителей, эфир записывается». Можно выйти только голосом или с аватаром. Переход — за секунду, без переподключения.</p>
        <div class="seg" style="margin-top:12px"><button class="is-on" data-act="seg">Видео и голос</button><button data-act="seg">Только голос</button><button data-act="seg">Аватар</button></div>
        <div class="pmodal__actions"><button class="btn btn--secondary" data-act="close-modal">Отмена</button><button class="btn btn--primary" data-act="onstagego">${I('user-check')} Пригласить</button></div>`, { dark: true }),
      onstagego: () => { closeModal(); later(900, () => { $('.stile--guest').hidden = false; $('.scene').classList.add('has-guest'); toast('Вера согласилась и вышла на сцену · 0,8 с', { icon: 'user-check' }); $('.hands-q')?.firstElementChild?.remove(); }); },
      offstage: () => { $('.stile--guest').hidden = true; $('.scene').classList.remove('has-guest'); toast('Вера вернулась в зрители'); },
      confirmyes: (el) => { el.closest('.ycard').outerHTML = `<div class="ylog__row fade-up"><span class="mono tiny subtle">19:43:02</span><div class="sp small"><b>Убрала из эфира</b> · «Заработок 300к» → зал ожидания с запретом входа · <span class="ok">вы подтвердили</span></div></div>`; toast('Спамер выведен из эфира. Отменить можно в журнале', { icon: 'user-x' }); },
      confirmno: (el) => { el.closest('.ycard').remove(); toast('Юя не будет удалять — сообщения этого участника она продолжит скрывать'); },
      ylogundo: (el) => { el.closest('.ylog__row').classList.add('is-undone'); el.outerHTML = '<span class="pill">отменено</span>'; toast('Отменено', { icon: 'undo' }); },
      restore: (el) => { const m = el.closest('.smsg'); m.classList.remove('is-hidden'); el.remove(); toast('Сообщение возвращено — Юя учтёт'); },
      answer: (el) => { const q = el.closest('.qcard'); q.classList.add('is-answered'); el.outerHTML = '<span class="pill pill--ok">отвечаю голосом</span>'; toast('Вопрос выведен на экран зрителям · Юя отметит, когда вы ответите'); },
      voice: () => { const i = $('#vcmd'); const v = i.value || 'Юя, закрепи упражнение 5-4-3-2-1'; $('#ylog').insertAdjacentHTML('afterbegin', `<div class="ylog__row fade-up"><span class="mono tiny subtle">сейчас</span><div class="sp small"><b>Голосовая команда</b> · «${esc(v)}» → <span class="ok">исполнено быстрым путём за 0,4 с</span></div><button class="btn btn--ghost btn--sm" data-act="ylogundo">${I('undo')}</button></div>`); i.value = ''; },
      slow: (el) => { el.classList.toggle('is-on'); toast(el.classList.contains('is-on') ? 'Медленный режим: одно сообщение в 10 секунд' : 'Медленный режим выключен'); },
      pinmsg: (el) => { el.closest('.smsg').classList.add('is-pinned'); toast('Сообщение закреплено для всех'); },
    },
    render() {
      const e = D.event;
      return `<div class="room room--stage" data-theme="dark">
        <div class="room__top"><div class="room__title"><b>Эфир · ${esc(e.title.split(':')[0])}</b></div><span class="live-state">${S.live ? '<span class="pill pill--live">В ЭФИРЕ</span>' : '<span class="pill">закулисье</span>'}</span>
          <span class="tiny muted" id="viewers">${num(2418)} зрителей</span><span class="sp"></span>
          ${['MSK 1 186', 'FRA 402', 'TLV 153', 'USE 134'].map((x) => `<span class="rtag">${I('server', 'xs')} ${x}</span>`).join('')}
          <button class="rec-ind" data-act="disclose"><span class="rec-dot"></span>Запись · HLS</button>
          ${S.live ? '' : `<button class="btn btn--danger btn--sm" data-act="golive">${I('broadcast')} Выйти в эфир</button>`}</div>
        <div class="room__body stage-layout">
          <aside class="bs"><div class="eyebrow">Закулисье</div>
            ${[['dmitry', 'Докладчик · звук и свет проверены', true], ['elena', 'Соведущая · альтернативная ведущая', true]].map(([id, s]) => `<div class="bs__p">${av(id, 34)}<div class="sp"><div class="small strong">${P.person(id).name}</div><div class="tiny muted">${s}</div></div><span class="eq eq--on"><i></i><i></i><i></i></span></div>`).join('')}
            <button class="btn btn--secondary btn--sm" data-act="toast" data-text="Ссылка в закулисье для докладчика скопирована">${I('user-plus')} Позвать докладчика</button>
            <div class="eyebrow" style="margin-top:18px">Что видят зрители</div><div class="seg seg--col">${['Говорящий', 'Сетка докладчиков', 'Слайды и докладчик сбоку'].map((x, i) => `<button class="${i === 1 ? 'is-on' : ''}" data-act="seg">${x}</button>`).join('')}</div>
            <div class="eyebrow" style="margin-top:18px">Оформление</div>
            ${[['Плашки с регалиями', true], ['Бегущая строка', true], ['Число зрителей', false], ['Фон сцены «Опора»', true]].map(([t, on]) => `<div class="optrow" style="padding:8px 0"><div class="optrow__main small">${t}</div><button class="tgl ${on ? 'is-on' : ''}" data-act="tgl"></button></div>`).join('')}
            ${goalBar()}</aside>
          <div class="stage stage--live">${stageComp('<div class="scene-offer"></div>')}<div class="countdown" hidden>3</div></div>
          <aside class="side is-open prod" data-on="aud">
            <div class="side__tabs">${[['aud', 'Зрители'], ['qa', 'Вопросы'], ['chat', 'Чат'], ['hands', 'Руки'], ['sales', 'Продажи'], ['yuia', 'Юя']].map(([k, t]) => `<button class="side__tab ${k === 'aud' ? 'is-on' : ''}" data-act="sidetab" data-p="${k}">${t}${k === 'hands' ? ' <span class="cnt">4</span>' : k === 'yuia' ? ' <span class="cnt">1</span>' : ''}</button>`).join('')}</div>
            <div class="side__pane" data-p="aud"><div class="grid g2" style="gap:10px"><div class="mini"><span class="tiny muted">Онлайн</span><b id="v2">${num(2418)}</b></div><div class="mini"><span class="tiny muted">Задержка p95</span><b>0,44 с</b></div><div class="mini"><span class="tiny muted">На запасном HLS</span><b>1,6 %</b></div><div class="mini"><span class="tiny muted">Вход с 1-й попытки</span><b>99,2 %</b></div></div>
              <div class="tiny muted" style="margin:14px 0 6px">Регионы</div>${C.hbars([{ l: 'Москва', v: 1186 }, { l: 'Франкфурт', v: 402 }, { l: 'Тель-Авив', v: 153 }, { l: 'Нью-Йорк', v: 134 }, { l: 'Прочие', v: 37 }])}
              <div class="tiny muted" style="margin:14px 0 6px">Юя решила у зрителей</div><div class="small">${I('check-circle', 'xs', 'ok')} 38 «не слышно» · 21 замирание · 14 перешли на HLS</div>
              <div class="tiny muted" style="margin:14px 0 6px">Кривая присутствия</div>${C.area([300, 900, 1500, 1900, 2210, 2380, 2418], { h: 90, labels: ['19:00', '19:20', 'сейчас'] })}</div>
            <div class="side__pane" data-p="qa" hidden>${D.questions.map((q) => `<div class="qcard ${q.status === 'answered' ? 'is-answered' : ''}"><span class="qv">${q.votes}</span><div class="sp"><div class="small">${esc(q.text)}</div><div class="tiny muted" style="margin-top:4px">${q.anon ? 'анонимно' : P.person(q.who).name}${q.merged ? ` · ${I('sparkles', 'xs')} Юя склеила ${q.merged}` : ''}</div>${q.status === 'answered' ? '<span class="pill pill--ok" style="margin-top:6px">отвечено — Юя услышала ответ</span>' : `<button class="btn btn--secondary btn--sm" style="margin-top:6px" data-act="answer">Ответить голосом</button>`}</div></div>`).join('')}</div>
            <div class="side__pane" data-p="chat" hidden><div class="row" style="margin-bottom:8px"><span class="tiny muted sp">Юя модерирует · фильтр &lt; 50 мс</span><button class="chipq" data-act="slow">Медленный режим</button></div><div class="chatlog chatlog--live" id="s-chat"></div></div>
            <div class="side__pane" data-p="hands" hidden><div class="tiny muted" style="margin-bottom:8px">Очередь по времени поднятия · «Разбор в эфире» — приоритет</div><div class="hands-q">${['vera', 'lev', 'kate', 'timur'].map((id, i) => `<div class="lrow" style="padding:8px 2px"><span class="pill">${i + 1}</span>${av(id, 30)}<div class="lrow__main small">${P.person(id).name}<div class="tiny muted">${['VIP · вопрос про врача', 'Тель-Авив · 0,41 с', 'Берлин', 'Алматы'][i]}</div></div><button class="btn btn--primary btn--sm" data-act="onstage">На сцену</button></div>`).join('')}</div><button class="btn btn--ghost btn--sm" data-act="offstage">Вернуть Веру в зрители</button></div>
            <div class="side__pane" data-p="sales" hidden><div class="grid g2" style="gap:10px"><div class="mini"><span class="tiny muted">Оплаты в эфире</span><b id="paid">67</b></div><div class="mini"><span class="tiny muted">Выручка</span><b id="rev">1 189 300 ₽</b></div></div>
              ${D.offers.map((o) => `<div class="sale"><div class="small strong">${esc(o.title)}</div><div class="tiny muted">${rub(o.price)} · просмотры ${num(o.views)} · нажатия ${num(o.clicks)} · оплаты ${o.paid}</div><div class="row" style="margin-top:8px;gap:6px"><button class="btn btn--primary btn--sm" data-act="offer" data-o="${o.id}">Показать</button><span class="tiny subtle">или по расписанию в 20:10</span></div></div>`).join('')}
              <button class="btn btn--ghost btn--sm" data-act="hideoffer">${I('eye-off')} Скрыть предложение</button>${goalBar()}</div>
            <div class="side__pane" data-p="yuia" hidden><div class="row tiny muted" style="margin-bottom:8px"><span class="yu">${I('sparkles')}</span><span class="sp">Уровень: «Обратимое — сама»</span><a data-go="yuia" class="accent">настроить</a></div>
              <div class="ycard"><div class="small"><b>Нужно ваше «да»:</b> убрать из эфира «Заработок 300к» — 4 спам-ссылки за минуту в четырёх комнатах</div><div class="row" style="gap:6px;margin-top:8px"><button class="btn btn--primary btn--sm" data-act="confirmyes">Да, убрать</button><button class="btn btn--secondary btn--sm" data-act="confirmno">Нет</button></div></div>
              <div class="side__in" style="margin:10px 0"><input class="inp" id="vcmd" placeholder="Команда голосом или текстом: «Юя, закрепи…»"><button class="rbtn" data-act="voice">${I('mic')}</button></div>
              <div class="ylog" id="ylog">${D.yuiaLog.map((l) => `<div class="ylog__row"><span class="mono tiny subtle">${l.t}</span><div class="sp small"><b>${l.act}</b> · ${esc(l.obj)}<div class="tiny muted">${esc(l.why)}</div></div>${l.undo ? `<button class="btn btn--ghost btn--sm" data-act="ylogundo">${I('undo')}</button>` : ''}</div>`).join('')}</div></div>
          </aside></div>
        <div class="room__bottom">${P.dock({ hand: false, cc: true })}<div class="dock-side"><button class="rbtn" data-go="viewer" title="Глазами зрителя">${I('eye', 'md')}</button><button class="rbtn" data-go="ops" title="Пульт дежурного">${I('server', 'md')}</button></div></div></div>`;
    },
    mount(root) {
      liveChat($('#s-chat', root), { moderated: true, host: true });
      P.subtitles([['anna', 'Опора — это не отсутствие тревоги, а способность оставаться в контакте с собой'], ['dmitry', 'Если тревога держится больше полугода и мешает спать — это повод прийти к специалисту'], ['anna', 'Давайте прямо сейчас сделаем упражнение «пять-четыре-три-два-один»']], {
        speakerFn: (w) => $$('.stile', root).forEach((t) => t.classList.toggle('is-speaking', t.dataset.pid === w)),
      });
      let v = 2418; every(2200, () => { v += Math.round(Math.random() * 14 - 4); ['#viewers', '#v2'].forEach((s) => { const el = $(s); if (el) el.textContent = s === '#viewers' ? `${num(v)} зрителей` : num(v); }); });
      every(1700, () => P.flyEmoji(['👏', '❤️', '🙏', '💡'][Math.floor(Math.random() * 4)], root));
      const donors = [['Яна', 500, 'Спасибо за эфир!'], ['Лев', 1000, ''], ['Дарья', 300, 'Очень нужно было это услышать'], ['Аноним', 3000, '']];
      let di = 0; every(7000, () => { const [n, a, m] = donors[di++ % donors.length]; S.raised += a; donationAlert(n, a, m); });
      if (S.offerLive) { const o = D.offers.find((x) => x.id === S.offerLive); $('.scene-offer', root).innerHTML = `<div class="offer offer--mini">${esc(o.title)} · ${rub(o.price)}</div>`; }
      let paid = 67, rev = 1189300; every(4100, () => { if (!S.offerLive) return; paid++; rev += 14900; const p = $('#paid'), r = $('#rev'); if (p) p.textContent = paid; if (r) r.textContent = rub(rev); });
    },
  });

  function liveChat(host, { moderated = false, host: isHost = false, mine } = {}) {
    if (!host) return;
    D.chatSeed.forEach((m) => host.insertAdjacentHTML('beforeend', smsg(m, isHost)));
    let i = 0;
    every(1500, () => {
      const [who, text] = D.chatStream[i++ % D.chatStream.length];
      const spam = who === 'spam';
      host.insertAdjacentHTML('beforeend', spam ? `<div class="smsg is-hidden fade-up"><span class="pav" style="--s:24px"><b>З</b></span><div class="sp"><b class="small">Заработок 300к</b> <span class="small">${esc(text)}</span><div class="tiny"><span class="yu" style="width:16px;height:16px">${I('sparkles')}</span> скрыто Юей до показа · ссылка + повтор${isHost ? ` · <a data-act="restore" class="accent">вернуть</a>` : ''}</div></div></div>` : smsg({ who, text }, isHost));
      while (host.children.length > 60) host.firstElementChild.remove();
      host.scrollTop = host.scrollHeight;
    });
  }
  P.liveChat = liveChat;
  function smsg(m, isHost) {
    const p = P.person(m.who);
    return `<div class="smsg fade-up">${av(m.who, 24)}<div class="sp"><b class="small">${esc(p.short)}</b> <span class="small">${esc(m.text)}</span>${m.yuia ? `<div class="smsg__yu"><span class="yu" style="width:16px;height:16px">${I('sparkles')}</span> ${esc(m.yuia)}${m.private ? ' · лично' : ''}</div>` : ''}</div>${isHost ? `<button class="smsg__pin" data-act="pinmsg" title="Закрепить">${I('pin', 'xs')}</button>` : ''}</div>`;
  }

  // ───────────────────────────── зритель ─────────────────────────────
  const viewerActs = {
    buy: () => { $('.room').classList.add('is-mini'); P.payModal(14900, 'Курс «Опора»: 6 недель работы с тревогой', () => { $('.room').classList.remove('is-mini'); const done = `<div class="offer offer--done fade-up">${I('check-circle')} Курс оплачен — доступ уже открыт. Чек на почте. Эфир продолжается</div>`; const slot = $('.offer-slot') || $('.vm__offer'); if (slot) slot.outerHTML = slot.classList.contains('vm__offer') ? `<div class="vm__offer">${done}</div>` : `<div class="offer-slot">${done}</div>`; toast('Оплата подтверждена кассой · доступ к курсу открыт', { icon: 'check-circle' }); later(6000, () => { const d = $('.offer--done'); if (d) d.remove(); }); }, { dark: true }); setTimeout(() => { const w = $('.pmodal-wrap'); if (w) new MutationObserver(() => { if (!document.body.contains(w)) $('.room')?.classList.remove('is-mini'); }).observe(document.body, { childList: true }); }, 50); },
    sbp: () => modal(`<div class="eyebrow eyebrow--accent">Оплата с телефона</div><h2 class="pmodal__title">СБП · 14 900 ₽</h2><div style="display:grid;place-items:center;padding:10px"><div style="padding:10px;background:#fff;border-radius:12px">${C.qr(190, 33)}</div></div><p class="pmodal__lead small" style="text-align:center">Наведите камеру телефона. Эфир на компьютере продолжается.</p>`, { dark: true }),
    gift: () => P.giftModal({ dark: true, onDone: (a, m) => donationAlert('Ольга', a, m) }),
    showoffer: () => { S.offerLive = 'course'; renderOffer(); },
    hls: () => { const b = $('.hls-ind'); b.classList.add('is-show'); b.innerHTML = `${I('refresh', 'xs', 'spin')} Связь прервалась — переключаемся на запасной поток…`; later(1500, () => { b.innerHTML = `${I('check', 'xs')} Запасной поток · задержка 6 с · пробуем вернуться`; }); later(5000, () => { b.innerHTML = `${I('bolt', 'xs')} Вернулись в живой поток · 0,4 с`; }); later(7500, () => b.classList.remove('is-show')); },
    lang: (el) => { $$('.langs button').forEach((b) => b.classList.toggle('is-on', b === el)); S.captionsLang = el.dataset.l; toast(el.dataset.l === 'ru' ? 'Субтитры: оригинал' : `Перевод субтитров: ${el.textContent} — ${el.dataset.l === 'he' ? 'на сервере, один раз на всех' : 'встроенным переводчиком браузера, без передачи данных'}`, { icon: 'cc' }); },
    vsend: () => { const i = $('#v-in'); const v = i.value.trim(); if (!v) return; const log = $('#v-chat'); log.insertAdjacentHTML('beforeend', `<div class="smsg smsg--me fade-up">${av('olga', 24)}<div class="sp"><b class="small">Вы</b> <span class="small">${esc(v)}</span></div></div>`); i.value = ''; log.scrollTop = log.scrollHeight;
      if (/слыш|звук|видн|запис|оплат/i.test(v)) later(1100, () => { log.insertAdjacentHTML('beforeend', `<div class="smsg smsg--yu fade-up"><span class="yu">${I('sparkles')}</span><div class="sp small"><b>Юя</b> ${/запис/i.test(v) ? 'Запись будет до 26 октября по вашей ссылке.' : /оплат/i.test(v) ? 'Карточка курса — над чатом, оплата не прерывает эфир.' : 'Ольга, видео и звук доходят: 0,38 с, потерь нет. Проверьте громкость вкладки — сейчас 12 %.'} <span class="tiny subtle">· видно только вам</span></div></div>`); log.scrollTop = log.scrollHeight; }); },
    ask: () => { const i = $('#v-q'); if (!i.value.trim()) return; $('#v-qs').insertAdjacentHTML('afterbegin', `<div class="qcard fade-up"><span class="qv">1</span><div class="sp small">${esc(i.value)}<div class="tiny muted">${I('sparkles', 'xs')} Юя: похожий вопрос уже есть — ваш голос добавлен к нему</div></div></div>`); i.value = ''; },
    vote: (el) => { const n = el.querySelector('.qv'); n.textContent = +n.textContent + 1; el.classList.add('is-on'); },
  };
  function renderOffer() {
    const slot = $('.offer-slot'); if (!slot) return;
    slot.innerHTML = S.offerLive ? offerCard(D.offers.find((o) => o.id === S.offerLive)) : '';
    let t = 899; every(1000, () => { t--; const el = $('#offer-timer'); if (el) el.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; });
  }

  add({
    id: 'viewer', group: G, title: 'Эфир — зритель', icon: 'eye', phase: 'фаза 2А–3', plan: '§ 5.7; § 5.12.3 — перевод; § 5.21 — оплата без ухода',
    desc: 'Задержка меньше 0,5 с с ближнего узла, субтитры и перевод на язык зрителя, чат и вопросы, рука, реакции. Карточка предложения поверх эфира, оплата без ухода (видео в мини-окне), подарок с оповещением и шкалой цели. Если связь рвётся — запасной поток.',
    tips: ['«Показать предложение» → «Купить» — эфир уходит в мини-окно', 'Напишите в чат «не слышно» — ответит Юя лично', 'Языки субтитров — справа сверху', '«Смоделировать обрыв» — переход на HLS и обратно'],
    acts: viewerActs,
    render() {
      return `<div class="room room--viewer" data-theme="dark">
        <div class="room__top"><span class="lp__logo">${I('leaf')} Опора</span><b class="small">${esc(D.event.title)}</b><span class="pill pill--live">LIVE</span><span class="sp"></span>
          <div class="seg langs">${[['ru', 'RU'], ['en', 'EN'], ['de', 'DE'], ['he', 'HE'], ['es', 'ES']].map(([k, t]) => `<button class="${k === 'ru' ? 'is-on' : ''}" data-act="lang" data-l="${k}">${t}</button>`).join('')}</div>
          <span class="rtag">${I('server', 'xs')} Франкфурт · 0,38 с</span><button class="rtag" data-act="hls">смоделировать обрыв</button></div>
        <div class="room__body viewer-layout">
          <div class="stage stage--viewer">${stageComp()}<div class="hls-ind"></div>
            <div class="viewer-actions"><button class="vbtn" data-act="hand">${I('hand', 'md')}<span>Рука</span></button><button class="vbtn" data-act="react">${I('smile', 'md')}<span>Реакции</span></button><button class="vbtn vbtn--gift" data-act="gift">${I('heart', 'md')}<span>Подарить</span></button><button class="vbtn" data-act="more">${I('dots', 'md')}<span>Ещё</span></button><button class="vbtn" data-act="leave">${I('door-exit', 'md')}<span>Выйти</span></button></div>
            <div class="offer-slot"></div></div>
          <aside class="side is-open" data-on="chat">
            <div class="side__tabs"><button class="side__tab is-on" data-act="sidetab" data-p="chat">Чат</button><button class="side__tab" data-act="sidetab" data-p="qa">Вопросы</button><button class="side__tab" data-act="sidetab" data-p="mat">Материалы</button></div>
            <div class="side__pane" data-p="chat">${goalBar()}<div class="chatlog chatlog--live" id="v-chat"></div><div class="side__in"><input class="inp" id="v-in" placeholder="Сообщение…" value="не слышно Дмитрия"><button class="rbtn" data-act="vsend">${I('send')}</button></div></div>
            <div class="side__pane" data-p="qa" hidden><div class="side__in" style="margin:0 0 10px"><input class="inp" id="v-q" placeholder="Задать вопрос (можно анонимно)"><button class="rbtn" data-act="ask">${I('send')}</button></div><div id="v-qs">${D.questions.map((q) => `<button class="qcard" data-act="vote"><span class="qv">${q.votes}</span><span class="small">${esc(q.text)}</span></button>`).join('')}</div></div>
            <div class="side__pane" data-p="mat" hidden>${[['file-text', 'Упражнение «5-4-3-2-1» · PDF'], ['link', 'Тест GAD-7 — проверить себя'], ['book', 'Список литературы от Дмитрия']].map(([i, t]) => `<a class="lrow lrow--click" data-act="toast" data-text="Открыто в новой вкладке">${I(i)}<span class="small">${t}</span></a>`).join('')}</div>
          </aside></div>
        <button class="proto-hint" data-act="showoffer">(прототип) ведущая показала предложение</button></div>`;
    },
    mount(root) {
      liveChat($('#v-chat', root));
      P.subtitles([['anna', 'Опора — это не отсутствие тревоги, а способность оставаться в контакте с собой'], ['dmitry', 'Если тревога держится больше полугода и мешает спать — это повод прийти к специалисту']], {
        speakerFn: (w) => $$('.stile', root).forEach((t) => t.classList.toggle('is-speaking', t.dataset.pid === w)),
      });
      every(1900, () => P.flyEmoji(['👏', '❤️', '🙏'][Math.floor(Math.random() * 3)], root));
      every(9000, () => { S.raised += 500; donationAlert(['Яна', 'Лиза', 'Марк'][Math.floor(Math.random() * 3)], 500, ''); });
      renderOffer();
      $('#v-in', root).addEventListener('keydown', (e) => { if (e.key === 'Enter') viewerActs.vsend(); });
    },
  });

  add({
    id: 'viewer-mobile', group: G, title: 'Эфир — зритель с телефона', icon: 'device-mobile', frame: 'phone', pair: 'viewer', phase: 'фаза 2А', plan: '§ 5.10 — зритель на телефоне',
    desc: 'Видео сверху, чат под ним, карточка предложения — плашкой над чатом: ни видео, ни чат она не прячет. Подарок и рука — внизу.',
    acts: { ...viewerActs, vsend: () => { const i = $('#v-in'); if (!i.value.trim()) return; $('#v-chat').insertAdjacentHTML('beforeend', `<div class="smsg fade-up">${av('olga', 22)}<div class="sp small"><b>Вы</b> ${esc(i.value)}</div></div>`); i.value = ''; } },
    render() {
      const o = D.offers[0];
      return `<div class="vm room" data-theme="dark"><div class="vm__video">${stageComp()}<span class="pill pill--live vm__live">LIVE</span></div>
        <div class="vm__offer"><div class="sp"><div class="tiny accent">Курс · осталось ${o.left} мест · <span id="offer-timer" class="mono">14:59</span></div><div class="small strong">${esc(o.title)}</div></div><button class="btn btn--primary btn--sm" data-act="buy">${rub(o.price)}</button></div>
        <div class="vm__chat chatlog chatlog--live" id="v-chat"></div>
        <div class="vm__bar"><input class="inp" id="v-in" placeholder="Сообщение…"><button class="mbtn mbtn--s" data-act="hand">${I('hand')}</button><button class="mbtn mbtn--s" data-act="react">${I('smile')}</button><button class="mbtn mbtn--s mbtn--gift" data-act="gift">${I('heart')}</button></div></div>`;
    },
    mount(root) { liveChat($('#v-chat', root)); let t = 899; every(1000, () => { t--; const el = $('#offer-timer'); if (el) el.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; }); P.subtitles([['anna', 'Давайте прямо сейчас сделаем упражнение']]); every(2400, () => P.flyEmoji('❤️', root)); },
  });
})();

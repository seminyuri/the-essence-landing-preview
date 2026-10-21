(function () {
  const { D, S, add, I, av, esc, rub, num, toast, modal, closeModal, go, every, later, onLeave, $, $$ } = P;
  const G = 'Вход участника';

  // ── настоящая камера (по желанию человека) ─────────────────────────────
  P.cam = {
    async start() {
      if (S.camStream) return S.camStream;
      try { S.camStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true }); }
      catch (e) { toast('Камера недоступна — покажем аватар. В настоящем продукте здесь подсказка, как разрешить доступ', { icon: 'video-off' }); return null; }
      return S.camStream;
    },
    stop() { if (S.camStream) { S.camStream.getTracks().forEach((t) => t.stop()); S.camStream = null; } },
    attach(root = document) {
      $$('video.my-cam', root).forEach((v) => { if (S.camStream) { v.srcObject = S.camStream; v.muted = true; v.play().catch(() => {}); v.hidden = false; v.parentElement.classList.add('has-cam'); } });
    },
  };

  // уровень микрофона: настоящий, если камера/микрофон разрешены, иначе — правдоподобная имитация
  function micMeter(el) {
    let an = null, buf;
    if (S.camStream && window.AudioContext) {
      try { const ac = new AudioContext(); const src = ac.createMediaStreamSource(S.camStream); an = ac.createAnalyser(); an.fftSize = 256; src.connect(an); buf = new Uint8Array(an.frequencyBinCount); onLeave(() => ac.close()); } catch (e) { an = null; }
    }
    every(90, () => {
      let v;
      if (an) { an.getByteFrequencyData(buf); v = Math.min(1, buf.reduce((a, b) => a + b, 0) / buf.length / 70); }
      else v = Math.max(0, Math.sin(Date.now() / 260) * .4 + Math.random() * .35);
      $$('i', el).forEach((b, i) => b.classList.toggle('is-on', i / 14 < v));
    });
  }
  P.micMeter = micMeter;
  const meter = () => `<span class="meter">${'<i></i>'.repeat(14)}</span>`;

  // ───────────────────────────── публичная страница эфира ─────────────────────────────
  add({
    id: 'event-page', group: G, title: 'Страница эфира и регистрация', icon: 'globe', phase: 'фаза 2А', plan: '§ 5.22 — воронка; § 5.21 — оплата; § 5.25',
    desc: 'Время в поясе зрителя, билеты, регистрация, оплата без ухода со страницы (СБП, карты, Pay-сервисы, зарубежные карты), «в календарь», подписка на бота, подарок ведущей.',
    tips: ['Смените пояс — пересчитается время', 'Выберите билет «С записью» → оплата → личная ссылка', '«Подарить ведущей» — режим «Подарок»'],
    acts: {
      ...P.common,
      tz: (el) => { $$('.tzs button').forEach((b) => b.classList.toggle('is-on', b === el)); $('#tz-time').textContent = el.dataset.t; },
      ticket: (el) => { $$('.ticket').forEach((t) => t.classList.toggle('is-on', t === el)); const pr = +el.dataset.p; $('#reg-btn').innerHTML = pr ? `${I('credit-card')} Оплатить ${rub(pr)}` : `${I('check')} Зарегистрироваться бесплатно`; $('#reg-btn').dataset.p = pr; },
      register: (el) => { const pr = +(el.dataset.p || 990); if (!pr) return P.current.acts.done(); payModal(pr, 'Билет «С записью» · Тревога и опора', () => P.current.acts.done()); },
      done: () => { $('#reg-form').innerHTML = `<div class="fade-up" style="text-align:center;padding:10px 0"><span class="yu yu--lg" style="margin:0 auto">${I('check')}</span><h3 style="font-size:20px;font-weight:300;margin:12px 0 6px">Вы зарегистрированы</h3>
        <p class="small muted">Личная ссылка — в почте. Пересылать не нужно: она пускает одного человека.</p>
        <div class="invite__link" style="margin:14px 0">${I('link')}<span class="invite__url">the-essence.ai/e/trevoga-i-opora?p=7Fq…</span></div>
        <div class="col"><button class="btn btn--secondary" data-act="toast" data-text="Событие добавлено: календарь .ics скачан">${I('calendar')} Добавить в календарь</button>
        <button class="btn btn--secondary" data-act="toast" data-text="Бот @opora_anna_bot напомнит за сутки, час и 5 минут">${I('send')} Напоминать в Telegram</button>
        <button class="btn btn--secondary" data-act="toast" data-text="Напоминания придут в MAX">${I('messenger')} Напоминать в MAX</button>
        <button class="btn btn--primary" data-go="lobby">${I('door')} Зал ожидания эфира</button></div></div>`; toast('Билет оплачен · чек отправлен на почту'); },
      gift: () => giftModal(),
    },
    render() {
      const e = D.event;
      return `<div class="lp" style="--brand:var(--color-accent)">
        <header class="lp__top"><span class="lp__logo">${I('leaf')} Опора · Анна Соколова</span><span class="sp"></span><span class="small muted">на платформе</span><img src="seal-compact.svg" width="22" height="22" alt=""><b class="small">Суть</b></header>
        <section class="lp__hero"><div class="lp__copy"><div class="row" style="gap:8px;flex-wrap:wrap"><span class="pill pill--accent">${I('broadcast', 'xs')} Онлайн-эфир</span><span class="pill">${I('cc', 'xs')} Субтитры на 6 языках</span><span class="pill">${I('users', 'xs')} 2 847 зарегистрировались</span></div>
          <h1>${esc(e.title)}</h1><p class="lp__lead">Полтора часа о тревоге: как отличить её от расстройства, что делать ночью, когда сердце колотится, и как вернуть себе опору. Живые вопросы, упражнения, разбор в эфире.</p>
          <div class="lp__when"><div><div class="tiny muted">Ваше время</div><div class="lp__time"><span id="tz-time">чт, 23 октября, 18:00</span></div></div>
            <div class="tzs seg">${[['Берлин', 'чт, 23 октября, 18:00'], ['Москва', 'чт, 23 октября, 19:00'], ['Тель-Авив', 'чт, 23 октября, 19:00'], ['Нью-Йорк', 'чт, 23 октября, 12:00']].map(([c, t], i) => `<button class="${i ? '' : 'is-on'}" data-act="tz" data-t="${t}">${c}</button>`).join('')}</div></div>
          <div class="lp__hosts">${['anna', 'dmitry'].map((id) => `<div class="row" style="gap:10px">${av(id, 48)}<div><div class="strong">${P.person(id).name} ${P.person(id).verified ? `<span class="pill pill--ok" style="padding:1px 7px">${I('shield-check', 'xs')} проверен</span>` : ''}</div><div class="small muted">${P.person(id).role}</div></div></div>`).join('')}</div></div>
          <div class="lp__card box" id="reg-form"><div class="eyebrow">Выберите билет</div>
            <div class="tickets">${e.tickets.map((t, i) => `<button class="ticket ${i === 1 ? 'is-on' : ''}" data-act="ticket" data-p="${t.price}"><div class="row"><b>${t.name}</b><span class="sp"></span><b>${t.price ? rub(t.price) : 'бесплатно'}</b></div><div class="small muted">${t.note}${t.left ? ` · осталось ${t.left} мест` : ''}</div></button>`).join('')}</div>
            <label class="lbl">Имя</label><input class="inp" value="Ольга Белова"><label class="lbl">Почта</label><input class="inp" value="olga.belova@mail.ru">
            <label class="row small" style="margin-top:12px;gap:8px;cursor:pointer"><input type="checkbox" checked> Напоминать в Telegram или MAX</label>
            <label class="row small" style="margin-top:8px;gap:8px;cursor:pointer;align-items:flex-start"><input type="checkbox" checked style="margin-top:2px"> <span>Согласен на обработку персональных данных — <a class="accent">отдельный документ</a></span></label>
            <button class="btn btn--primary btn--lg" id="reg-btn" style="width:100%;margin-top:16px" data-act="register" data-p="990">${I('credit-card')} Оплатить 990 ₽</button>
            <div class="row tiny muted" style="justify-content:center;gap:10px;margin-top:10px;flex-wrap:wrap"><span>СБП</span>·<span>SberPay</span>·<span>T-Pay</span>·<span>Mir Pay</span>·<span>карты мира</span></div></div></section>
        <section class="lp__sec"><div class="grid g3">${[['Как отличить тревогу от расстройства', 'Критерии, которые использует психиатр, — простыми словами'], ['Что делать ночью', 'Дыхание и «5-4-3-2-1», которые работают за две минуты'], ['Опора на каждый день', 'Небольшие ритуалы, которые возвращают ощущение почвы']].map(([a, b], i) => `<div class="box"><div class="act-card__glyph">${I(['help', 'moon-stars', 'leaf'][i])}</div><div class="strong">${a}</div><div class="small muted" style="margin-top:6px">${b}</div></div>`).join('')}</div></section>
        <section class="lp__sec lp__gift box box--glow"><div class="row" style="gap:16px;flex-wrap:wrap"><span class="act-card__glyph" style="margin:0">${I('gift')}</span><div class="sp" style="min-width:240px"><div class="strong">${esc(D.donationGoal.title)}</div><div class="small muted">Собрано ${rub(S.raised)} из ${rub(D.donationGoal.goal)}</div><div class="bar" style="margin-top:8px"><i style="width:${Math.round(S.raised / D.donationGoal.goal * 100)}%"></i></div></div><button class="btn btn--secondary" data-act="gift">${I('heart')} Подарить ведущей</button></div></section>
        <footer class="lp__foot small muted">Платформа «Суть» — агент ИП Соколовой А. В. · оферта · политика · условия дарения · <a data-go="check" class="accent">проверить связь и устройства</a></footer></div>`;
    },
  });

  // оплата без ухода — общая для страницы, эфира, мессенджера
  function payModal(amount, title, onPaid, { dark = false } = {}) {
    modal(`<div class="eyebrow eyebrow--accent">Оплата · касса платформы</div><h2 class="pmodal__title">${rub(amount)}</h2><p class="pmodal__lead small">${esc(title)}</p>
      <div class="paym">${[['sbp', 'СБП', 'qrcode'], ['card', 'Карта РФ', 'credit-card'], ['sber', 'SberPay', 'wallet'], ['tpay', 'T-Pay', 'wallet'], ['world', 'Карта мира', 'globe']].map(([k, t, ic], i) => `<button class="paym__i ${i ? '' : 'is-on'}" data-pm="${k}">${I(ic)} ${t}</button>`).join('')}</div>
      <div id="paypane"><div class="row" style="gap:18px;margin-top:16px;flex-wrap:wrap"><div style="padding:8px;background:#fff;border-radius:12px">${C.qr(132, 21)}</div><div class="sp small muted" style="min-width:180px">Наведите камеру телефона — откроется приложение банка. Платёж подтвердит касса, доступ откроется сам. ${dark ? '<br><br>Эфир продолжается в мини-окне.' : ''}</div></div></div>
      <div class="pmodal__actions"><button class="btn btn--secondary" data-act="close-modal">Отмена</button><button class="btn btn--primary" id="pay-ok">${I('check')} Я оплатил(а)</button></div>
      <div class="tiny muted" style="margin-top:12px">Чек по 54-ФЗ придёт на почту · деньги получает касса платформы как агент специалиста</div>`, { dark });
    $$('.paym__i').forEach((b) => (b.onclick = () => {
      $$('.paym__i').forEach((x) => x.classList.toggle('is-on', x === b));
      $('#paypane').innerHTML = b.dataset.pm === 'sbp' ? `<div class="row" style="gap:18px;margin-top:16px"><div style="padding:8px;background:#fff;border-radius:12px">${C.qr(132, 21)}</div><div class="sp small muted">Наведите камеру — откроется приложение банка.</div></div>`
        : `<div style="margin-top:14px"><label class="lbl">Номер карты</label><input class="inp" value="${b.dataset.pm === 'world' ? '4111 1111 1111 1111' : '2200 7001 2345 6789'}"><div class="row" style="margin-top:8px"><input class="inp" value="12 / 28"><input class="inp" value="•••"></div>${b.dataset.pm === 'world' ? '<div class="tiny muted" style="margin-top:8px">Комиссия за зарубежную карту включена в цену — вы платите ровно указанную сумму</div>' : ''}</div>`;
    }));
    $('#pay-ok').onclick = () => { const b = $('#pay-ok'); b.innerHTML = `${I('refresh', 'sm', 'spin')} Ждём подтверждение кассы…`; setTimeout(() => { closeModal(); onPaid && onPaid(); }, 1300); };
  }
  P.payModal = payModal;

  function giftModal({ dark = false, onDone } = {}) {
    modal(`<div class="eyebrow eyebrow--accent">Подарок ведущей</div><h2 class="pmodal__title">Поддержать Анну</h2><p class="pmodal__lead small">${esc(D.donationGoal.title)}. Подарок ничего не открывает и не даёт привилегий — это просто «спасибо».</p>
      <div class="amounts">${[300, 500, 1000, 3000, 5000].map((a, i) => `<button class="amount ${i === 1 ? 'is-on' : ''}" data-a="${a}">${rub(a)}</button>`).join('')}<input class="inp amount-other" placeholder="Своя сумма"></div>
      <label class="lbl">Сообщение (увидят все в эфире)</label><input class="inp" id="gift-msg" value="Спасибо за эфир!">
      <div class="seg" style="margin-top:12px"><button class="is-on" data-act="seg">С именем</button><button data-act="seg">Анонимно</button></div>
      <div class="pmodal__actions"><button class="btn btn--primary" id="gift-ok">${I('heart')} Подарить 500 ₽</button></div><div class="tiny muted">Условия дарения · подарок от физлица, налог 0 % · без регистрации</div>`, { dark });
    let amount = 500;
    $$('.amount').forEach((b) => (b.onclick = () => { $$('.amount').forEach((x) => x.classList.toggle('is-on', x === b)); amount = +b.dataset.a; $('#gift-ok').innerHTML = `${I('heart')} Подарить ${rub(amount)}`; }));
    $('#gift-ok').onclick = () => payModal(amount, 'Подарок ведущей', () => { S.raised += amount; toast(`Спасибо! Подарок ${rub(amount)} получен — Анна увидит его на экране`, { icon: 'heart' }); onDone && onDone(amount, $('#gift-msg')?.value); }, { dark });
  }
  P.giftModal = giftModal;

  // ───────────────────────────── проверка связи ─────────────────────────────
  add({
    id: 'check', group: G, title: 'Проверить связь и устройства', icon: 'wifi', phase: 'фаза 2А', plan: '§ 5.32 — как zoom.us/test',
    desc: 'Публичная страница: камера, микрофон, динамики, сеть до ближнего узла. Ссылка — в каждом напоминании.',
    tips: ['«Включить камеру» — настоящий доступ к камере', 'Сеть проверяется до всех узлов, выбирается ближний'],
    acts: {
      cam: async () => { await P.cam.start(); P.cam.attach(); },
      beep: () => { try { const ac = new AudioContext(); const o = ac.createOscillator(); const g = ac.createGain(); o.frequency.value = 660; g.gain.value = .08; o.connect(g); g.connect(ac.destination); o.start(); setTimeout(() => { o.stop(); ac.close(); }, 600); } catch (e) {} toast('Слышали короткий сигнал? Динамики в порядке'); },
      net: () => runNet(),
    },
    render() {
      return `<div class="lp"><header class="lp__top"><img src="seal-compact.svg" width="26" height="26" alt=""><span class="shell-sidebar__name"><span class="shell-sidebar__brandname">Суть</span><span class="shell-sidebar__x">✕</span><span class="shell-sidebar__module">Проверка связи</span></span></header>
        <section class="page" style="padding-top:28px"><h1 class="page__title">Проверим всё <em>до эфира</em>, а не во время</h1><p class="page__sub">Минута — и вы знаете, что вас увидят и услышат. Ничего устанавливать не нужно.</p>
        <div class="grid g2" style="margin-top:22px">
          <div class="box"><div class="box__title">${I('cam')} Камера</div><div class="preview"><video class="my-cam" playsinline autoplay muted hidden></video><div class="preview__ph">${I('video-off', 'xl')}<span class="small">Камера выключена</span></div></div><div class="box__foot"><button class="btn btn--primary btn--sm" data-act="cam">${I('cam')} Включить камеру</button><span class="small muted">FaceTime HD · 1280×720 · 30 к/с</span></div></div>
          <div class="col" style="gap:16px">
            <div class="box"><div class="box__title">${I('mic')} Микрофон</div><div class="row" style="margin-top:12px">${meter()}<span class="small muted">Скажите что-нибудь</span></div><div class="small muted" style="margin-top:8px">${I('bluetooth', 'xs')} Bluetooth-наушники добавляют 100–250 мс задержки. Для долгих сессий лучше микрофон ноутбука и наушники для звука.</div></div>
            <div class="box"><div class="box__title">${I('volume')} Динамики</div><div class="box__foot"><button class="btn btn--secondary btn--sm" data-act="beep">${I('play')} Проиграть сигнал</button></div></div>
            <div class="box"><div class="box__title">${I('wifi')} Сеть до узлов</div><div id="net" class="netlist">${[['Москва', 'msk-a'], ['Москва-2', 'msk-b'], ['Франкфурт', 'fra-edge'], ['Нью-Йорк', 'use-edge']].map(([a, b]) => `<div class="netlist__i"><span>${a} <span class="tiny subtle mono">${b}</span></span><span class="mono small muted">…</span></div>`).join('')}</div><div id="net-res" class="small" style="margin-top:10px"></div></div></div></div></section></div>`;
    },
    mount(root) { micMeter($('.meter', root)); P.cam.attach(root); runNet(); },
  });
  function runNet() {
    const vals = [18, 21, 47, 129];
    $$('.netlist__i').forEach((r, i) => later(400 + i * 350, () => { r.lastElementChild.textContent = vals[i] + ' мс'; r.lastElementChild.className = 'mono small ' + (vals[i] < 60 ? 'ok' : 'warn'); }));
    later(1900, () => { const el = $('#net-res'); if (el) el.innerHTML = `<span class="pill pill--ok">${I('check', 'xs')} Ближний узел — Москва, 18 мс. Видео в эфире будет с задержкой меньше 0,5 с</span>`; });
  }

  // ───────────────────────────── экран входа ─────────────────────────────
  add({
    id: 'prejoin', group: G, title: 'Экран входа в комнату', icon: 'door', phase: 'фаза 2А / 2Б', plan: '§ 5.8; § 5.10 — экран входа; Приложение И — «Проверить себя»',
    desc: 'Камера и устройства, фон и свет, подсказка про Bluetooth, «Проверить себя» (10 секунд записи и прослушивание), плашка записи и ИИ с согласием по целям, прогрев соединения до ближнего узла.',
    tips: ['Включите камеру — это настоящая камера', '«Проверить себя» записывает 10 секунд', 'Согласие по целям не блокирует вход'],
    acts: {
      ...P.common,
      cam: async () => { await P.cam.start(); P.cam.attach(); micMeter($('.meter')); },
      fx: (el) => { $$('.fx').forEach((f) => f.classList.toggle('is-on', f === el)); $('.preview')?.setAttribute('data-fx', el.dataset.fx); toast(el.dataset.fx === 'sys' ? 'Системный «Портрет» Apple — считает нейропроцессор, батарея не тратится' : `Эффект: ${el.textContent.trim()}`); },
      selftest: (el) => selfTest(el),
      tg: () => $('#inapp').classList.toggle('is-show'),
      enter: () => { toast('Соединение прогрето — вход за 0,6 с', { icon: 'bolt' }); go(P.current.params.to || 'call'); },
    },
    render(p) {
      return `<div class="pj" data-theme="dark">
        <div class="pj__top"><a class="pj__back" data-go="hub">${I('arrow-left')} Встречи</a><span class="sp"></span><span class="pill">${I('server', 'xs')} Москва · msk-a · 18 мс · соединение прогрето</span></div>
        <div class="inapp" id="inapp">${I('alert-triangle')} Вы открыли ссылку внутри Telegram — звук и камера там работают хуже. <button class="btn btn--primary btn--sm">Открыть в браузере</button></div>
        <div class="pj__grid">
          <div class="pj__left">
            <div class="preview preview--lg" data-fx="none"><video class="my-cam" playsinline autoplay muted hidden></video><div class="preview__ph">${av('anna', 120)}<span class="small">Камера выключена</span><button class="btn btn--primary btn--sm" data-act="cam">${I('cam')} Включить камеру</button></div>
              <div class="preview__bar">${meter()}</div><span class="preview__name">Анна Соколова</span></div>
            <div class="pj__ctrls"><button class="rbtn" data-act="toast" data-text="Микрофон: MacBook Pro · встроенный">${I('mic', 'md')}</button><button class="rbtn" data-act="cam">${I('cam', 'md')}</button>
              <span class="sp"></span><span class="tiny subtle">Фон и свет</span>${[['none', 'Нет'], ['blur', 'Размытие'], ['bg', 'Кабинет'], ['sys', 'Портрет Apple']].map(([k, t], i) => `<button class="fx ${i ? '' : 'is-on'}" data-act="fx" data-fx="${k}">${t}</button>`).join('')}</div>
            <div class="pj__devs"><label>${I('mic', 'xs')}<select><option>MacBook Pro — микрофон</option><option>AirPods Pro (Bluetooth)</option></select></label><label>${I('volume', 'xs')}<select><option>AirPods Pro</option><option>Динамики MacBook</option></select></label><label>${I('cam', 'xs')}<select><option>FaceTime HD</option><option>iPhone Анны (камера Continuity)</option></select></label></div>
            <div class="hint">${I('bluetooth')} <span>Микрофон ноутбука + AirPods для звука — голос будет без задержки Bluetooth. <a class="accent" data-act="toast" data-text="Запомнили для этой пары устройств">Сделать так</a></span></div>
            <div class="hint">${I('device-mobile')} <span>Камера iPhone как веб-камера — картинка заметно лучше встроенной.</span></div>
          </div>
          <div class="pj__right">
            <div class="eyebrow">Индивидуальная сессия · 10:00–11:00</div><h1 class="pj__title">Мария Иванова, <em>9-я встреча</em></h1>
            <div class="row small muted" style="gap:8px">${av('maria', 26)} Мария в зале ожидания · заполнила анкету «как вы сегодня»: <b class="accent">6 из 10</b></div>
            <div class="selftest box"><div class="row"><div class="sp"><div class="strong">Проверить себя</div><div class="small muted">10 секунд записи и прослушивание — подскажу, что поправить</div></div><button class="btn btn--secondary btn--sm" data-act="selftest">${I('circle-dot')} Записать</button></div><div id="st-out"></div></div>
            <div class="disclose box"><div class="row" style="gap:8px"><span class="rec-dot"></span><b>Идёт запись · расшифровка · Юя</b></div>
              <div class="small muted" style="margin:6px 0 10px">Клиент подписал согласие кодом 03.06 · его можно отозвать в любой момент</div>
              ${[['Запись звука и видео', true], ['Расшифровка (GigaAM, хранится в России)', true], ['ИИ-разбор и итоги — только для вас', true], ['Субтитры для клиента', false]].map(([t, on]) => `<div class="optrow" style="padding:8px 0"><div class="optrow__main small">${t}</div><button class="tgl ${on ? 'is-on' : ''}" data-act="tgl"></button></div>`).join('')}</div>
            <button class="btn btn--primary btn--lg pj__go" data-act="enter">${I('video')} Войти</button>
            <div class="row tiny subtle" style="justify-content:center;gap:12px;margin-top:10px"><a data-act="tg">показать: открыто из Telegram</a>·<a data-go="check">проверить связь</a></div>
          </div></div></div>`;
    },
    mount(root) { P.cam.attach(root); micMeter($('.meter', root)); },
  });

  function selfTest(btn) {
    const out = $('#st-out');
    let t = 10; btn.disabled = true;
    out.innerHTML = `<div class="row small" style="margin-top:10px;gap:8px"><span class="rec-dot"></span> Запись… <b id="st-t">10</b> с — скажите пару фраз обычным голосом</div>`;
    let rec, chunks = [];
    if (S.camStream && window.MediaRecorder) { try { rec = new MediaRecorder(S.camStream); rec.ondataavailable = (e) => chunks.push(e.data); rec.start(); } catch (e) { rec = null; } }
    const h = every(1000, () => {
      t--; const el = $('#st-t'); if (el) el.textContent = t;
      if (t <= 0) {
        clearInterval(h); btn.disabled = false;
        const finish = (url) => { out.innerHTML = `<div class="fade-up" style="margin-top:12px">${url ? `<video src="${url}" controls playsinline style="width:100%;border-radius:10px;max-height:180px;background:#000"></video>` : `<div class="row small" style="gap:8px">${I('play')} Прослушать запись ${C.wave(40)}</div>`}
          <div class="col small" style="gap:6px;margin-top:10px"><span class="ok">${I('check', 'xs')} Голос чистый, громкость −18 дБ — хорошо</span><span class="warn">${I('alert-triangle', 'xs')} Свет сзади: лицо темнее фона. Повернитесь к окну или включите «Портрет»</span><span class="ok">${I('check', 'xs')} Эха нет — вы в наушниках</span></div></div>`; };
        if (rec) { rec.onstop = () => finish(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType }))); rec.stop(); } else finish(null);
      }
    });
  }

  // ───────────────────────────── зал ожидания 1:1 (телефон клиента) ─────────────────────────────
  add({
    id: 'waiting', group: G, title: 'Зал ожидания сессии 1:1 (клиент)', icon: 'hourglass', frame: 'phone', phase: 'фаза 4', plan: 'Приложение Ж.1 — зал ожидания для сессии 1:1; § 5.26 — согласие кодом',
    desc: 'Пока клиент ждёт: проверка устройств, анкета «как вы сегодня», согласие с подписью кодом (один раз на специалиста), оплата до входа — и специалист впускает.',
    acts: {
      mood: (el) => { $$('.mood button').forEach((b) => b.classList.toggle('is-on', b === el)); },
      sign: () => { $('#sign').innerHTML = `<div class="fade-up"><div class="small">Код из SMS на +7 9•• ••• 12-40</div><div class="code">${'<input maxlength="1" inputmode="numeric">'.repeat(4)}</div></div>`; const ins = $$('.code input'); ins[0].focus(); ins.forEach((inp, i) => inp.oninput = () => { if (inp.value && ins[i + 1]) ins[i + 1].focus(); if (ins.every((x) => x.value)) { $('#sign').innerHTML = `<span class="pill pill--ok">${I('check', 'xs')} Подписано простой электронной подписью · 21.10 09:51</span>`; toast('Согласие подписано — действует до отзыва'); } }); },
      pay: (el) => P.payModal(6500, 'Сессия с Анной Соколовой · 60 мин', () => { el.outerHTML = `<span class="pill pill--ok">${I('check', 'xs')} Оплачено · чек на почте</span>`; }, { dark: true }),
      admitted: () => { toast('Анна впустила вас', { icon: 'door' }); go('call-mobile'); },
    },
    render() {
      return `<div class="mw"><div class="mw__head">${av('anna', 64, 'ring')}<div class="mw__t">Анна скоро впустит вас</div><div class="small muted">Сессия 10:00–11:00 · подключение готово</div><div class="mw__pulse"></div></div>
        <div class="mw__body">
          <div class="mcard"><div class="row"><span class="ok">${I('check-circle')}</span><span class="sp small">Камера, микрофон и связь в порядке</span><span class="tiny subtle">18 мс</span></div></div>
          <div class="mcard"><div class="strong small">Как вы сегодня?</div><div class="mood">${Array.from({ length: 10 }, (_, i) => `<button class="${i === 5 ? 'is-on' : ''}" data-act="mood">${i + 1}</button>`).join('')}</div>
            <textarea class="inp" style="margin-top:10px;min-height:64px" placeholder="О чём хочется поговорить?">Опять не спала перед планёркой, но отказалась от лишнего проекта</textarea><div class="tiny subtle" style="margin-top:6px">Видит только Анна</div></div>
          <div class="mcard"><div class="strong small">Согласие на запись и расшифровку</div><div class="tiny muted" style="margin:4px 0 10px">Цели отдельно: запись ✓ расшифровка ✓ ИИ-разбор ✓ · хранение 90 дней · отзыв одной кнопкой</div><div id="sign"><button class="btn btn--secondary btn--sm" data-act="sign">${I('pencil')} Подписать кодом</button></div></div>
          <div class="mcard row"><div class="sp"><div class="strong small">Сессия · 6 500 ₽</div><div class="tiny muted">оплатите до входа — без переписки о деньгах</div></div><button class="btn btn--primary btn--sm" data-act="pay">Оплатить</button></div>
          <button class="btn btn--secondary" style="width:100%" data-act="admitted">${I('door')} (прототип) Анна впускает</button></div></div>`;
    },
    pair: 'prejoin',
  });

  // ───────────────────────────── зал ожидания эфира ─────────────────────────────
  add({
    id: 'lobby', group: G, title: 'Зал ожидания эфира', icon: 'clock', phase: 'фаза 2Б', plan: '§ 5.11 — брендированный зал ожидания; Приложение Ж.13 — лобби с чатом',
    desc: 'Обратный отсчёт, бренд клиента, чат до начала, Юя отвечает на «будет ли запись», соединение прогревается заранее.',
    acts: { send: () => sendLobby() },
    render() {
      return `<div class="lobby" data-theme="dark"><div class="lobby__bg" style="background-image:url(img/people/p32.jpg)"></div>
        <div class="lobby__grid"><div class="lobby__main"><span class="lp__logo">${I('leaf')} Опора · Анна Соколова</span>
          <div class="eyebrow" style="margin-top:40px">Эфир начнётся через</div><div class="lobby__count mono" id="cd">00:04:59</div>
          <h1>${esc(D.event.title)}</h1><div class="row" style="gap:12px;margin-top:20px">${av('anna', 44)}${av('dmitry', 44)}<div class="small muted">Анна Соколова и Дмитрий Орлов уже в закулисье — проверяют звук</div></div>
          <div class="row" style="gap:8px;margin-top:28px;flex-wrap:wrap"><span class="pill">${I('users', 'xs')} 1 284 ждут</span><span class="pill">${I('server', 'xs')} Франкфурт · 24 мс</span><span class="pill">${I('cc', 'xs')} субтитры: Deutsch</span><button class="btn btn--secondary btn--sm" data-go="viewer">${I('play')} (прототип) Эфир начался</button></div></div>
          <div class="lobby__chat"><div class="strong small" style="padding:14px 16px">Чат до начала</div><div class="lobby__msgs" id="lmsgs">${D.chatSeed.slice(0, 5).map(msgHtml).join('')}</div>
            <div class="lobby__in"><input class="inp" id="lin" placeholder="Написать в чат…" value="А запись будет?"><button class="rbtn" data-act="send">${I('send')}</button></div></div></div></div>`;
    },
    mount() {
      let s = 299; every(1000, () => { s--; const el = $('#cd'); if (el) el.textContent = `00:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; });
      $('#lin').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendLobby(); });
    },
  });
  function msgHtml(m) {
    const p = P.person(m.who);
    return `<div class="cmsg fade-up">${av(m.who, 26)}<div class="cmsg__b"><b>${esc(p.short || p.name)}</b> ${esc(m.text)}${m.yuia ? `<div class="cmsg__yu"><span class="yu">${I('sparkles')}</span> ${esc(m.yuia)}${m.private ? ' <span class="tiny subtle">· видно только вам</span>' : ''}</div>` : ''}</div></div>`;
  }
  P.msgHtml = msgHtml;
  function sendLobby() {
    const inp = $('#lin'); const v = inp.value.trim(); if (!v) return;
    $('#lmsgs').insertAdjacentHTML('beforeend', msgHtml({ who: 'olga', text: v }));
    inp.value = '';
    later(900, () => { $('#lmsgs').insertAdjacentHTML('beforeend', `<div class="cmsg cmsg--yu fade-up"><span class="yu">${I('sparkles')}</span><div class="cmsg__b"><b>Юя</b> Да, Ольга: у вас билет «С записью» — запись будет навсегда по вашей ссылке, с главами и расшифровкой. <span class="tiny subtle">· видно только вам</span></div></div>`); const m = $('#lmsgs'); m.scrollTop = m.scrollHeight; });
  }
})();

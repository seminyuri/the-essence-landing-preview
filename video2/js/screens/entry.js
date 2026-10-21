(function () {
  const { D, S, add, I, av, esc, rub, toast, modal, closeModal, go, every, later, $, $$, btn, chip, opt, seg, pick, li, yuNote, note } = P;
  const G = 'Вход участника';

  // ── оплата не уходя со страницы или из эфира — общая для всех экранов ─────
  function payModal(amount, title, onPaid, { dark = false } = {}) {
    const methods = [['sbp', 'СБП', 'qrcode'], ['card', 'Карта', 'credit-card'], ['pay', 'SberPay · T-Pay · Mir Pay', 'wallet'], ['world', 'Карта другой страны', 'globe']];
    const paneHtml = (k) => k === 'sbp'
      ? `<div class="row row--top mt16" style="gap:20px"><div style="padding:10px;background:#fff;border-radius:14px">${C.qr(140, 21)}</div><div class="sp muted" style="font-size:15px;line-height:1.55">Наведите камеру телефона — откроется приложение банка. Подтверждение придёт от кассы, доступ откроется сам.${dark ? '<br><br>Эфир идёт в мини-окне — вы ничего не пропустите.' : ''}</div></div>`
      : k === 'pay' ? `<div class="mt16">${pick([{ t: 'SberPay' }, { t: 'T-Pay' }, { t: 'Mir Pay' }, { t: 'Яндекс Пэй' }])}</div>`
        : `<label class="fld"><span class="fld__l">Номер карты</span><input class="in" value="${k === 'world' ? '4111 1111 1111 1111' : '2200 7001 2345 6789'}"></label><div class="row"><input class="in" value="12 / 28" aria-label="Срок"><input class="in" value="•••" aria-label="Код"></div>${k === 'world' ? `<div class="mt12">${note('info-circle', 'Комиссия за карту другой страны уже в цене — вы платите ровно указанную сумму.')}</div>` : ''}`;
    modal(`<div class="t-sm muted">Оплата · касса платформы</div><div class="modal2__t" style="font-size:30px;margin-top:4px">${rub(amount)}</div><div class="modal2__s">${esc(title)}</div>
      <div class="paym2">${methods.map(([k, t, ic], i) => `<button class="${i ? '' : 'is-on'}" data-pm="${k}">${I(ic)} ${t}</button>`).join('')}</div><div id="paypane">${paneHtml('sbp')}</div>
      <div class="modal2__f">${btn('Оплатить', { kind: 'primary', size: 'lg', id: 'pay-ok', icon: 'check' })}</div><div class="t-xs muted mt12">Чек придёт на почту. Деньги принимает касса платформы как агент специалиста.</div>`, { dark });
    $$('.paym2 button').forEach((b) => (b.onclick = () => { $$('.paym2 button').forEach((x) => x.classList.toggle('is-on', x === b)); $('#paypane').innerHTML = paneHtml(b.dataset.pm); }));
    $('#pay-ok').onclick = () => { const b = $('#pay-ok'); b.disabled = true; b.innerHTML = `${I('refresh', 'sm', 'spin')} Ждём подтверждение кассы…`; setTimeout(() => { closeModal(); onPaid && onPaid(); }, 1200); };
  }
  P.payModal = payModal;

  function giftModal({ dark = false, onDone } = {}) {
    modal(`<div class="modal2__t">Поддержать Анну</div><div class="modal2__s">${esc(D.donationGoal.title)}. Подарок ничего не открывает и не даёт привилегий — это просто «спасибо».</div>
      <div class="amts">${[300, 500, 1000, 3000, 5000].map((a, i) => `<button class="${i === 1 ? 'is-on' : ''}" data-a="${a}">${rub(a)}</button>`).join('')}</div>
      <label class="fld"><span class="fld__l">Сообщение — его увидят все в эфире</span><input class="in" id="gift-msg" value="Спасибо за эфир!"></label>
      <div class="fld"><span class="fld__l">Как подписать</span>${seg(['С моим именем', 'Анонимно'], 0, 'seg', { block: true })}</div>
      <div class="modal2__f">${btn('Подарить 500 ₽', { kind: 'primary', size: 'lg', id: 'gift-ok', icon: 'heart' })}</div><div class="t-xs muted mt12">Подарок от частного лица — налог 0 %. Условия дарения.</div>`, { dark });
    let amount = 500;
    $$('.amts button').forEach((b) => (b.onclick = () => { $$('.amts button').forEach((x) => x.classList.toggle('is-on', x === b)); amount = +b.dataset.a; $('#gift-ok').innerHTML = `${I('heart')}<span>Подарить ${rub(amount)}</span>`; }));
    $('#gift-ok').onclick = () => { const msg = $('#gift-msg')?.value; const anon = $('.seg2 button.is-on')?.textContent === 'Анонимно'; payModal(amount, 'Подарок ведущей', () => { S.raised += amount; toast(`Спасибо! Подарок ${rub(amount)} получен — Анна увидит его на экране`, { icon: 'heart' }); onDone && onDone(amount, msg, anon); }, { dark }); };
  }
  P.giftModal = giftModal;

  const chatMsg = (m) => { const p = P.person(m.who); return `<div class="msg fade-up">${av(m.who, 32)}<div class="msg__b"><span class="msg__n">${esc(p.short)}</span><span class="msg__t">${esc(m.text)}</span>${m.yuia ? `<div class="msg__yu"><span class="yu2">${I('sparkles')}</span><span>${esc(m.yuia)}${m.private ? ' <span class="muted">· видно только вам</span>' : ''}</span></div>` : ''}</div></div>`; };
  P.chatMsg = chatMsg;

  // ───────────── страница эфира ─────────────
  add({
    id: 'event-page', group: G, title: 'Страница эфира и билеты', icon: 'globe', phase: 'фаза 2А', plan: '§ 5.22, § 5.21, § 5.25',
    desc: 'Время в поясе зрителя, ведущие, билеты, оплата не уходя со страницы, «в календарь», напоминания в Telegram и MAX, подарок ведущей.',
    tips: ['Смените город — пересчитается время', 'Билет «С записью» → оплата → личная ссылка', '«Поддержать» — подарок ведущей'],
    acts: {
      tz: (el) => { $$('.tzs button').forEach((b) => b.classList.toggle('is-on', b === el)); $('#tz-time').textContent = el.dataset.t; },
      ticket: (el) => { $$('.ticket2').forEach((t) => t.classList.toggle('is-on', t === el)); const pr = +el.dataset.p; const b = $('#reg-btn'); b.innerHTML = pr ? `${I('credit-card')}<span>Оплатить ${rub(pr)}</span>` : `${I('check')}<span>Зарегистрироваться бесплатно</span>`; b.dataset.p = pr; },
      register: (el) => { const pr = +(el.dataset.p ?? 990); if (!pr) return P.current.acts.done(); payModal(pr, 'Билет «С записью» · Тревога и опора', () => P.current.acts.done()); },
      done: () => { $('#reg-form').innerHTML = `<div class="fade-up" style="text-align:center"><span class="yu2 yu2--lg" style="margin:0 auto">${I('check', 'lg')}</span><div class="h2 mt16">Вы зарегистрированы</div>
        <div class="muted mt8" style="font-size:15px">Личная ссылка — в почте. Она пускает одного человека, пересылать не нужно.</div>
        <div class="col mt24" style="gap:8px">${btn('Добавить в календарь', { icon: 'calendar', block: true, kind: 'white', act: 'toast', data: 'data-text="Событие добавлено в календарь"' })}${btn('Напоминать в Telegram', { icon: 'send', block: true, kind: 'white', act: 'toast', data: 'data-text="Бот напомнит за сутки, за час и за 5 минут"' })}${btn('Напоминать в MAX', { icon: 'messenger', block: true, kind: 'white', act: 'toast', data: 'data-text="Напоминания придут в MAX"' })}${btn('Проверить связь заранее', { icon: 'wifi', block: true, kind: 'white', go: 'check' })}${btn('В зал ожидания', { icon: 'door', block: true, kind: 'primary', size: 'lg', go: 'lobby' })}</div></div>`; toast('Билет оплачен · чек отправлен на почту'); },
      gift: () => giftModal({ onDone: () => P.current && P.current.id === 'event-page' && go('event-page') }),
    },
    render() {
      const e = D.event, pct = Math.round(S.raised / D.donationGoal.goal * 100);
      return `<div class="pub">
        <header class="pub__top"><span class="pub__logo">${I('leaf', 'md')} Опора · Анна Соколова</span><span class="sp"></span><span class="t-sm muted">на платформе</span><img src="seal-compact.svg" width="22" height="22" alt=""><b class="t-sm">Суть</b></header>
        <section class="pub__hero"><div><div class="row row--wrap" style="gap:8px">${chip(`${I('broadcast', 'xs')} Онлайн-эфир`, 'accent')}${chip(`${I('cc', 'xs')} Субтитры на 6 языках`)}${chip(`${I('users', 'xs')} 2 847 зарегистрировались`)}</div>
          <h1 class="pub__h">${esc(e.title)}</h1><p class="pub__lead">Полтора часа о тревоге: как отличить её от расстройства, что делать ночью, когда сердце колотится, и как вернуть себе опору. Живые вопросы, упражнения, разбор в эфире.</p>
          <div class="when"><div><div class="t-sm muted">Ваше время</div><div class="when__t" id="tz-time">чт, 23 октября, 18:00</div></div>
            <div class="tzs seg2">${[['Берлин', 'чт, 23 октября, 18:00'], ['Москва', 'чт, 23 октября, 19:00'], ['Тель-Авив', 'чт, 23 октября, 19:00'], ['Нью-Йорк', 'чт, 23 октября, 12:00']].map(([c, t], i) => `<button class="${i ? '' : 'is-on'}" data-act="tz" data-t="${t}">${c}</button>`).join('')}</div></div>
          <div class="col mt32" style="gap:16px">${['anna', 'dmitry'].map((id) => `<div class="row">${av(id, 56)}<div><div class="b" style="font-size:16px">${P.person(id).name} ${chip(`${I('shield-check', 'xs')} проверен`, 'ok')}</div><div class="muted" style="font-size:15px">${P.person(id).role}</div></div></div>`).join('')}</div></div>
          <div class="pub__card" id="reg-form"><div class="h3">Выберите билет</div>
            <div class="tickets2">${e.tickets.map((t, i) => `<button class="ticket2 ${i === 1 ? 'is-on' : ''}" data-act="ticket" data-p="${t.price}"><div class="row"><span>${t.name}</span><span class="sp"></span><span>${t.price ? rub(t.price) : 'бесплатно'}</span></div><div class="t-sm muted">${t.note}${t.left ? ` · осталось ${t.left} мест` : ''}</div></button>`).join('')}</div>
            <label class="fld"><span class="fld__l">Имя</span><input class="in" value="Ольга Белова"></label><label class="fld"><span class="fld__l">Почта</span><input class="in" value="olga.belova@mail.ru"></label>
            <label class="row mt16" style="font-size:14.5px;cursor:pointer;align-items:flex-start"><input type="checkbox" checked style="width:18px;height:18px;margin-top:2px"><span>Согласна на обработку персональных данных — <a class="accent">отдельный документ</a></span></label>
            <div class="mt16">${btn('Оплатить 990 ₽', { kind: 'primary', size: 'lg', block: true, icon: 'credit-card', act: 'register', id: 'reg-btn', data: 'data-p="990"' })}</div>
            <div class="t-xs muted mt12" style="text-align:center">СБП · SberPay · T-Pay · Mir Pay · карты других стран</div></div></section>
        <section class="pub__sec"><div class="grid g3">${[['help', 'Тревога или расстройство', 'Признаки, по которым психиатр отличает одно от другого, — простыми словами'], ['moon-stars', 'Что делать ночью', 'Дыхание и «5-4-3-2-1» — работают за две минуты'], ['leaf', 'Опора на каждый день', 'Небольшие ритуалы, которые возвращают ощущение почвы']].map(([i, a, b]) => `<div class="card"><span class="tile-a__i">${I(i, 'lg')}</span><div class="h3 mt16">${a}</div><div class="muted mt8" style="font-size:15px">${b}</div></div>`).join('')}</div></section>
        <section class="pub__sec"><div class="card card--hero"><div class="row row--wrap" style="gap:20px"><span class="tile-a__i">${I('gift', 'lg')}</span><div class="sp" style="min-width:240px"><div class="h3">${esc(D.donationGoal.title)}</div><div class="muted mt8">Собрано ${rub(S.raised)} из ${rub(D.donationGoal.goal)}</div><div class="bar2 mt12"><i style="width:${pct}%"></i></div></div>${btn('Поддержать', { icon: 'heart', act: 'gift', size: 'lg', kind: 'white' })}</div></div></section>
        <footer class="pub__foot">Платформа «Суть» — агент ИП Соколовой А. В. · оферта · политика · условия дарения · <a data-go="check" class="accent">проверить связь и устройства</a></footer></div>`;
    },
  });

  // ───────────── проверка связи ─────────────
  function runNet() {
    const vals = [18, 21, 47, 129];
    $$('.netr').forEach((r, i) => later(400 + i * 350, () => { const v = r.querySelector('.netv'); v.textContent = vals[i] + ' мс'; v.className = 'netv mono ' + (vals[i] < 60 ? 'ok' : 'warn'); }));
    later(1900, () => { const el = $('#net-res'); if (el) el.innerHTML = chip(`${I('check', 'xs')} Ближний узел — Москва, 18 мс. Задержка видео будет меньше 0,5 с`, 'ok'); });
  }
  add({
    id: 'check', group: G, title: 'Проверка связи и устройств', icon: 'wifi', phase: 'фаза 2А', plan: '§ 5.32',
    desc: 'Публичная страница: камера, микрофон, динамики, сеть до ближнего узла. Ссылка стоит в каждом напоминании.',
    tips: ['«Включить камеру» — настоящий доступ к камере', 'Сеть проверяется до всех узлов, выбирается ближний'],
    acts: {
      cam: async () => { await P.cam.start(); P.cam.attach(); },
      beep: () => { try { const ac = new AudioContext(); const o = ac.createOscillator(); const g = ac.createGain(); o.frequency.value = 660; g.gain.value = .08; o.connect(g); g.connect(ac.destination); o.start(); setTimeout(() => { o.stop(); ac.close(); }, 600); } catch (e) {} toast('Слышали короткий сигнал? Динамики в порядке'); },
      net: () => runNet(),
    },
    render() {
      return `<div class="pub"><header class="pub__top"><img src="seal-compact.svg" width="26" height="26" alt=""><b>Суть</b><span class="muted">· проверка связи</span></header>
        <div class="page page--wide" style="padding-top:36px"><h1 class="h1">Проверим всё до встречи, а не во время</h1><p class="lead mt8">Минута — и вы знаете, что вас увидят и услышат. Ничего устанавливать не нужно.</p>
        <div class="grid g2 mt32">
          <div class="card"><div class="card__t">${I('video', 'md', 'accent')} Камера</div><div class="prev2 mt16"><video class="my-cam" playsinline autoplay muted hidden></video><div class="prev2__ph">${I('video-off', 'xl')}<span>Камера выключена</span></div></div><div class="card__f">${btn('Включить камеру', { kind: 'primary', icon: 'video', act: 'cam' })}<span class="t-sm muted">FaceTime HD · 1280×720</span></div></div>
          <div class="col" style="gap:16px">
            <div class="card"><div class="card__t">${I('mic', 'md', 'accent')} Микрофон</div><div class="row mt16"><span class="meter"></span><span class="t-sm muted">Скажите что-нибудь</span></div><div class="mt16">${note('bluetooth', 'Наушники по Bluetooth добавляют до четверти секунды задержки. Для долгих сессий лучше микрофон ноутбука, а наушники — только для звука.')}</div></div>
            <div class="card"><div class="row"><div class="card__t sp">${I('volume', 'md', 'accent')} Динамики</div>${btn('Проиграть сигнал', { icon: 'play', act: 'beep', kind: 'white' })}</div></div>
            <div class="card"><div class="row"><div class="card__t sp">${I('wifi', 'md', 'accent')} Сеть до узлов</div>${btn('Ещё раз', { icon: 'refresh', act: 'net', kind: 'white', size: 'sm' })}</div><div class="mt12">${[['Москва', 'msk-a'], ['Москва-2', 'msk-b'], ['Франкфурт', 'fra-edge'], ['Нью-Йорк', 'use-edge']].map(([a, b]) => `<div class="row netr" style="padding:10px 0;font-size:15px"><span class="sp">${a} <span class="t-xs subtle mono">${b}</span></span><span class="netv mono muted">…</span></div>`).join('')}</div><div id="net-res" class="mt12"></div></div></div></div></div></div>`;
    },
    mount(root) { P.micMeter($('.meter', root)); P.cam.attach(root); runNet(); },
  });

  // ───────────── экран входа ─────────────
  function selfTest(b) {
    const out = $('#st-out'); let t = 10; b.disabled = true;
    out.innerHTML = `<div class="row mt12"><span class="rec-dot"></span> Запись… <b id="st-t">10</b> с — скажите пару фраз обычным голосом</div>`;
    let rec, chunks = [];
    if (S.camStream && window.MediaRecorder) { try { rec = new MediaRecorder(S.camStream); rec.ondataavailable = (e) => chunks.push(e.data); rec.start(); } catch (e) { rec = null; } }
    const h = every(1000, () => {
      t--; const el = $('#st-t'); if (el) el.textContent = t;
      if (t > 0) return;
      clearInterval(h); b.disabled = false;
      const finish = (url) => { out.innerHTML = `<div class="fade-up mt12">${url ? `<video src="${url}" controls playsinline style="width:100%;border-radius:12px;max-height:180px;background:#000"></video>` : `<div class="row">${I('play')} Прослушать ${C.wave(40)}</div>`}
        <div class="col mt12" style="gap:8px;font-size:14.5px"><span class="ok">${I('check', 'xs')} Голос чистый, громкость хорошая</span><span class="warn">${I('alert-triangle', 'xs')} Окно за спиной: лицо темнее фона. Повернитесь к свету или включите «Портрет»</span><span class="ok">${I('check', 'xs')} Эха нет — вы в наушниках</span></div></div>`; };
      if (rec) { rec.onstop = () => finish(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType }))); rec.stop(); } else finish(null);
    });
  }
  add({
    id: 'prejoin', group: G, title: 'Экран входа в комнату', icon: 'door', phase: 'фазы 2А / 2Б', plan: '§ 5.8, § 5.10, Приложение И — «Проверить себя»',
    desc: 'Камера и устройства, фон и свет, подсказки про Bluetooth и камеру телефона, «Проверить себя» (10 секунд записи), плашка записи и Юи, прогрев соединения до ближнего узла.',
    tips: ['Включите камеру — это настоящая камера', '«Проверить себя» записывает 10 секунд', 'Ссылка внизу показывает подсказку «открыто в Telegram»'],
    acts: {
      cam: async () => { await P.cam.start(); P.cam.attach(); },
      fx: (el) => { $$('.fx2 button').forEach((f) => f.classList.toggle('is-on', f === el)); toast(el.dataset.fx === 'sys' ? 'Системный «Портрет» Apple — считает нейропроцессор, батарея почти не тратится' : `Фон: ${el.textContent.trim()}`); },
      selftest: (el) => selfTest(el),
      tg: () => $('#inapp').classList.toggle('is-show'),
      enter: () => { toast('Соединение прогрето — вход за 0,6 с', { icon: 'bolt' }); go(P.current.params.to || 'call'); },
    },
    render() {
      return `<div class="pj2" data-theme="dark"><div class="row row--wrap"><a class="row t-sm" data-go="hub" style="gap:6px;color:#B5AB9D">${I('arrow-left')} Встречи</a><span class="sp"></span><span class="top-pill" style="background:rgba(244,239,231,.08)">${I('server', 'xs')} Москва · 18 мс · соединение прогрето</span></div>
        <div class="inapp2" id="inapp">${I('alert-triangle')} <span class="sp">Ссылка открыта внутри Telegram — там хуже работают звук и камера.</span>${btn('Открыть в браузере', { kind: 'primary', size: 'sm' })}</div>
        <div class="pj2__grid">
          <div><div class="prev2"><video class="my-cam" playsinline autoplay muted hidden></video><div class="prev2__ph">${av('anna', 112)}<span>Камера выключена</span>${btn('Включить камеру', { kind: 'primary', icon: 'video', act: 'cam' })}</div><div class="prev2__meter"><span class="meter"></span></div>
              <div class="prev2__ctl">${P.rb('mic', '', 'toast', { data: 'data-text="Микрофон: MacBook Pro"', title: 'Микрофон' })}${P.rb('video', '', 'cam', { title: 'Камера' })}</div></div>
            <div class="fx2">${[['none', 'Без фона'], ['blur', 'Размытие'], ['bg', 'Кабинет'], ['sys', 'Портрет Apple']].map(([k, t], i) => `<button class="${i ? '' : 'is-on'}" data-act="fx" data-fx="${k}">${t}</button>`).join('')}</div>
            <div class="devs2"><select aria-label="Микрофон"><option>Микрофон MacBook Pro</option><option>AirPods Pro</option></select><select aria-label="Динамики"><option>AirPods Pro</option><option>Динамики MacBook</option></select><select aria-label="Камера"><option>FaceTime HD</option><option>Камера iPhone</option></select></div>
            <div class="col mt16" style="gap:8px">${note('bluetooth', 'Микрофон ноутбука плюс AirPods для звука — голос будет без задержки Bluetooth. <a class="accent" data-act="toast" data-text="Запомнили для этой пары устройств">Сделать так</a>')}${note('device-mobile', 'Камера iPhone как веб-камера даёт картинку заметно лучше встроенной.')}</div></div>
          <div><div class="t-sm muted">Индивидуальная сессия · 10:00–11:00</div><h1 class="h1 mt8" style="font-size:32px">Мария Иванова, 9-я встреча</h1>
            <div class="row mt16" style="font-size:15px">${av('maria', 32)}<span>Мария в зале ожидания. Анкета «как вы сегодня»: <b style="color:#E8B898">6 из 10</b></span></div>
            <div class="card mt24"><div class="row"><div class="sp"><div class="b">Проверить себя</div><div class="t-sm muted">10 секунд записи и прослушивание — подскажу, что поправить</div></div>${btn('Записать', { icon: 'circle-dot', act: 'selftest' })}</div><div id="st-out"></div></div>
            <div class="card mt12"><div class="row"><span class="rec-dot"></span><b>Запись · расшифровка · Юя</b></div><div class="t-sm muted mt8">Клиент подписал согласие кодом 3 июня. Отозвать его можно в любой момент.</div>
              ${opt('Запись звука и видео', '', true)}${opt('Расшифровка — хранится в России', '', true)}${opt('Итоги и заметки Юи — только вам', '', true)}${opt('Субтитры для клиента', '', false)}</div>
            <div class="mt24">${btn('Войти', { kind: 'primary', size: 'lg', block: true, icon: 'video', act: 'enter' })}</div>
            <div class="row t-sm muted mt12" style="justify-content:center;gap:14px"><a data-act="tg">показать: открыто из Telegram</a>·<a data-go="check">проверить связь</a></div></div></div></div>`;
    },
    mount(root) { P.cam.attach(root); P.micMeter($('.meter', root)); },
  });

  // ───────────── зал ожидания клиента 1:1 ─────────────
  add({
    id: 'waiting', group: G, title: 'Зал ожидания сессии (клиент)', icon: 'hourglass', frame: 'phone', pair: 'prejoin', phase: 'фаза 4', plan: 'Приложение Ж.1, § 5.26',
    desc: 'Пока клиент ждёт: проверка устройств, анкета «как вы сегодня», согласие подписью кодом, оплата до входа. Специалист впускает одной кнопкой.',
    tips: ['Выберите число в анкете', '«Подписать кодом» — введите любые 4 цифры', '«Оплатить» — оплата без переписки о деньгах'],
    acts: {
      mood: (el) => $$('.mood2 button').forEach((b) => b.classList.toggle('is-on', b === el)),
      sign: () => { $('#sign').innerHTML = `<div class="fade-up"><div class="t-sm muted">Код из SMS на +7 9•• ••• 12-40</div><div class="code2">${'<input maxlength="1" inputmode="numeric" aria-label="цифра">'.repeat(4)}</div></div>`; const ins = $$('.code2 input'); ins[0].focus(); ins.forEach((inp, i) => (inp.oninput = () => { if (inp.value && ins[i + 1]) ins[i + 1].focus(); if (ins.every((x) => x.value)) { $('#sign').innerHTML = chip(`${I('check', 'xs')} Подписано · 21.10, 09:51`, 'ok'); toast('Согласие подписано — действует до отзыва'); } })); },
      pay: (el) => payModal(6500, 'Сессия с Анной Соколовой · 60 мин', () => { el.outerHTML = chip(`${I('check', 'xs')} Оплачено · чек на почте`, 'ok'); }),
      admitted: () => { toast('Анна впустила вас', { icon: 'door' }); go('call-mobile'); },
    },
    render() {
      return `<div class="mob"><div class="mob__body" style="padding-top:60px"><div style="text-align:center">${av('anna', 80, 'av--ring')}<div class="h2 mt16">Анна скоро впустит вас</div><div class="t-sm muted mt8">Сессия 10:00–11:00 · подключение готово</div></div>
          <div class="card mt24" style="padding:16px"><div class="row" style="font-size:15px"><span class="ok">${I('check-circle', 'md')}</span><span class="sp">Камера, микрофон и связь в порядке</span><span class="t-xs muted">18 мс</span></div></div>
          <div class="card mt12" style="padding:16px"><div class="b">Как вы сегодня?</div><div class="mood2">${Array.from({ length: 10 }, (_, i) => `<button class="${i === 5 ? 'is-on' : ''}" data-act="mood">${i + 1}</button>`).join('')}</div>
            <textarea class="in mt12" rows="3" placeholder="О чём хочется поговорить?">Опять не спала перед планёркой, но отказалась от лишнего проекта</textarea><div class="t-xs muted mt8">${I('lock', 'xs')} Видит только Анна</div></div>
          <div class="card mt12" style="padding:16px"><div class="b">Согласие на запись и расшифровку</div><div class="t-sm muted mt8">По целям отдельно: запись, расшифровка, разбор Юей. Хранение 90 дней, отзыв — одной кнопкой.</div><div id="sign" class="mt12">${btn('Подписать кодом', { icon: 'pencil', act: 'sign', kind: 'white' })}</div></div>
          <div class="card mt12" style="padding:16px"><div class="row"><div class="sp"><div class="b">Сессия · 6 500 ₽</div><div class="t-sm muted">Оплатите до входа — без переписки о деньгах</div></div>${btn('Оплатить', { kind: 'primary', act: 'pay' })}</div></div>
          <div class="mt16">${btn('Прототип: Анна впускает', { icon: 'door', block: true, act: 'admitted', kind: 'white' })}</div></div></div>`;
    },
  });

  // ───────────── зал ожидания эфира ─────────────
  const sendLobby = () => {
    const inp = $('#lin'); const v = inp.value.trim(); if (!v) return;
    $('#lmsgs').insertAdjacentHTML('beforeend', chatMsg({ who: 'olga', text: v })); inp.value = '';
    later(900, () => { const m = $('#lmsgs'); if (!m) return; m.insertAdjacentHTML('beforeend', `<div class="msg fade-up"><span class="yu2">${I('sparkles')}</span><div class="msg__b"><span class="msg__n">Юя</span><span class="msg__t">Да, Ольга: у вас билет «С записью» — запись будет навсегда, с главами и расшифровкой.</span> <span class="muted t-xs">· видно только вам</span></div></div>`); m.scrollTop = m.scrollHeight; });
  };
  add({
    id: 'lobby', group: G, title: 'Зал ожидания эфира', icon: 'clock', phase: 'фаза 2Б', plan: '§ 5.11, Приложение Ж.13',
    desc: 'Обратный отсчёт, оформление ведущей, чат до начала, Юя отвечает на «будет ли запись», соединение прогревается заранее.',
    tips: ['Напишите вопрос в чат — Юя ответит лично', '«Эфир начался» — переход к зрителю'],
    acts: { send: sendLobby },
    render() {
      return `<div class="lob" data-theme="dark"><div class="lob__bg" style="background-image:url(img/people/p32.jpg)"></div>
        <div class="lob__g"><div class="lob__main"><span class="row" style="gap:8px;color:#E8B898;font-weight:600">${I('leaf', 'md')} Опора · Анна Соколова</span>
          <div class="muted mt32" style="font-size:16px">Эфир начнётся через</div><div class="lob__cd" id="cd">04:59</div>
          <h1 class="h1 mt24" style="font-size:34px;max-width:720px">${esc(D.event.title)}</h1><div class="row mt24">${av('anna', 48)}${av('dmitry', 48)}<div class="muted" style="font-size:15px">Анна и Дмитрий уже в закулисье — проверяют звук</div></div>
          <div class="row row--wrap mt32" style="gap:8px"><span class="top-pill">${I('users', 'xs')} 1 284 ждут</span><span class="top-pill">${I('server', 'xs')} Франкфурт · 24 мс</span><span class="top-pill">${I('cc', 'xs')} субтитры: Deutsch</span>${btn('Прототип: эфир начался', { icon: 'play', go: 'viewer', kind: 'primary' })}</div></div>
          <div class="lob__chat"><div class="h3" style="padding:0 20px 12px">Чат до начала</div><div class="msgs" id="lmsgs" style="flex:1;overflow:auto;padding:0 20px">${D.chatSeed.slice(0, 5).map(chatMsg).join('')}</div>
            <div class="pn__f"><input class="in" id="lin" placeholder="Написать в чат…" value="А запись будет?" style="background:rgba(244,239,231,.08);color:#F4EFE7">${btn('', { icon: 'send', act: 'send', kind: 'primary', cls: 'btn2--icon' })}</div></div></div></div>`;
    },
    mount() {
      let s = 299; every(1000, () => { s = Math.max(0, s - 1); const el = $('#cd'); if (el) el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; });
      $('#lin').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendLobby(); });
    },
  });

  // ───────────── ссылка уже открыта на другом устройстве ─────────────
  add({
    id: 'ticket-busy', group: G, title: 'Ссылка открыта на другом устройстве', icon: 'device-mobile', frame: 'phone', phase: 'фазы 2А / 5', plan: '§ 1.7 п. 3, § 5.21 — один активный вход на билет',
    desc: 'Билет пускает одного человека. Если ссылку открыли на втором устройстве, человек сам выбирает, где смотреть, — без писем в поддержку.',
    acts: { here: () => { toast('Эфир переехал на этот телефон. На компьютере показ остановлен'); go('viewer-mobile'); } },
    render() {
      return `<div class="mob"><div class="mob__body" style="padding-top:80px;text-align:center"><span class="tile-a__i" style="margin:0 auto;width:64px;height:64px">${I('device-desktop', 'xl')}</span>
        <div class="h2 mt24">Эфир уже открыт на другом устройстве</div><div class="muted mt12" style="font-size:15px;line-height:1.55">Ваш билет пускает одного человека. Сейчас эфир идёт на компьютере: Chrome, macOS, Москва, вошли в 19:02.</div>
        <div class="col mt32" style="gap:10px">${btn('Смотреть здесь', { kind: 'primary', size: 'lg', block: true, icon: 'device-mobile', act: 'here' })}${btn('Остаться на компьютере', { size: 'lg', block: true, go: 'event-page' })}</div>
        <div class="mt24">${note('shield-check', 'Это не вы? Нажмите «Смотреть здесь» — чужое устройство отключится, а Юя пришлёт вам новую ссылку.')}</div></div></div>`;
    },
  });
})();

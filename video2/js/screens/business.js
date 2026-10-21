(function () {
  const { D, S, add, I, av, esc, rub, num, shell, toast, modal, closeModal, go, every, later, $, $$ } = P;
  const G = 'Модули вокруг эфира';
  const CH = { chat: ['Суть', 'messenger'], telegram: ['Telegram', 'send'], max: ['MAX', 'messenger'], vk: ['ВКонтакте', 'users'], mail: ['Почта', 'mail'], group: ['Группа', 'users'], channel: ['Канал', 'broadcast'] };

  // ───────────────────────────── мессенджер ─────────────────────────────
  const thread = {
    maria: [
      { me: false, t: 'Анна, добрый вечер! Можно вопрос между сессиями?', time: 'пт 19:02' },
      { me: true, t: 'Конечно, Мария. Пишите', time: 'пт 19:10', read: true },
      { me: false, voice: '0:42', tr: 'Сегодня опять не спала перед планёркой, проснулась в четыре и всё прокручивала в голове. Но я сделала дыхание, как вы показывали, и минут через десять уснула.', time: 'пт 19:14' },
      { me: true, t: 'Это большой шаг — вы заметили и помогли себе сами. Обсудим в среду 🌿', time: 'пт 19:20', read: true },
      { card: 'pay', time: 'пн 10:05' },
      { me: false, t: 'Спасибо! До встречи в среду 🙏', time: 'пн 10:07' },
    ],
    olga: [
      { me: false, t: 'Здравствуйте! Можно перенести субботу на час позже?', time: '08:40', via: 'telegram' },
      { me: false, t: 'Если нет — ничего страшного', time: '08:41', via: 'telegram' },
    ],
  };
  const msgRow = (m) => {
    if (m.card === 'pay') return `<div class="mmsg mmsg--me"><div class="mcardx"><div class="row">${I('credit-card', 'md', 'accent')}<div class="sp"><b class="small">Сессия 22 октября · 6 500 ₽</b><div class="tiny muted">карточка оплаты</div></div><span class="pill pill--ok">${I('check', 'xs')} оплачено</span></div></div><span class="mmsg__t">${m.time} · ✓✓</span></div>`;
    if (m.card === 'slot') return `<div class="mmsg mmsg--me"><div class="mcardx"><b class="small">${I('calendar', 'xs')} Записаться на сессию</b><div class="slots" style="margin-top:8px">${['сб 25 · 12:00', 'сб 25 · 13:00', 'вс 26 · 11:00'].map((s, i) => `<button class="slot ${i === 1 ? 'is-on' : ''}" data-act="toast" data-text="Ольга записана: ${s}">${s}</button>`).join('')}</div></div><span class="mmsg__t">сейчас</span></div>`;
    if (m.voice) return `<div class="mmsg"><div class="mbub"><div class="row" style="gap:8px">${I('play', 'sm', 'accent')}${C.wave(28, 7)}<span class="tiny mono">${m.voice}</span></div><div class="vtr">${I('sparkles', 'xs')} ${esc(m.tr)}</div></div><span class="mmsg__t">${m.time}</span></div>`;
    return `<div class="mmsg ${m.me ? 'mmsg--me' : ''}"><div class="mbub">${esc(m.t)}</div><span class="mmsg__t">${m.time}${m.via ? ` · ${CH[m.via][0]}` : ''}${m.read ? ' · ✓✓' : ''}</span></div>`;
  };
  add({
    id: 'messenger', group: G, title: 'Мессенджер специалиста', icon: 'messenger', phase: 'фаза 4 / 9', plan: '§ 13 — мессенджер; единые входящие',
    desc: 'Личные чаты с клиентами, группы и каналы; клиенты пишут откуда удобно (наш чат, Telegram, MAX, ВК, почта) — ответ уходит туда же, контакты скрыты. Голосовые сразу текстом, карточки оплаты и записи, черновики Юи, рабочие часы, звонок из чата.',
    tips: ['Откройте Ольгу — она пишет из Telegram', '«Юя, черновик» — ответ на голосовое', 'Скрепка → «Запись на сессию»', 'Кнопка видео — звонок клиенту'],
    acts: {
      ...P.common,
      open: (el) => go('messenger', { c: el.dataset.c }),
      draft: () => { const i = $('#m-in'); i.value = P.current.params.c === 'olga' ? 'Ольга, здравствуйте! Да, давайте в 13:00 — выбирайте время ниже 👇' : 'Мария, это и есть опора, о которой мы говорили. Запишите, пожалуйста, что помогло — обсудим в среду.'; i.focus(); toast('Юя написала черновик — правьте и отправляйте', { icon: 'sparkles' }); },
      msend: () => { const i = $('#m-in'); const v = i.value.trim(); if (!v) return; const log = $('#m-log'); log.insertAdjacentHTML('beforeend', msgRow({ me: true, t: v, time: 'сейчас' })); i.value = ''; log.scrollTop = log.scrollHeight;
        const c = P.current.params.c; if (c === 'olga') { log.insertAdjacentHTML('beforeend', `<div class="tiny muted" style="text-align:center;margin:6px 0">${I('send', 'xs')} ушло в Telegram через бота платформы</div>`); }
        later(1200, () => { log.insertAdjacentHTML('beforeend', `<div class="mmsg typing-row"><div class="mbub"><span class="dots3"><i></i><i></i><i></i></span></div></div>`); log.scrollTop = log.scrollHeight; });
        later(3000, () => { $('.typing-row')?.remove(); log.insertAdjacentHTML('beforeend', msgRow({ me: false, t: c === 'olga' ? 'Отлично, тогда 13:00!' : 'Спасибо, Анна! Обязательно 🌿', time: 'сейчас', via: c === 'olga' ? 'telegram' : null })); log.scrollTop = log.scrollHeight; }); },
      slotcard: () => { closeModal(); $('#m-log').insertAdjacentHTML('beforeend', msgRow({ card: 'slot' })); $('#m-log').scrollTop = 1e6; },
      paycard: () => { closeModal(); $('#m-log').insertAdjacentHTML('beforeend', `<div class="mmsg mmsg--me"><div class="mcardx"><div class="row">${I('credit-card', 'md', 'accent')}<div class="sp"><b class="small">Сессия 25 октября · 6 500 ₽</b><div class="tiny muted">оплата в одно касание · СБП, карты</div></div><span class="pill pill--warn">ждёт оплаты</span></div></div><span class="mmsg__t">сейчас</span></div>`); $('#m-log').scrollTop = 1e6; },
      attach: () => modal(`<div class="sheet-list">${[['calendar', 'Запись на сессию', 'slotcard'], ['credit-card', 'Карточка оплаты', 'paycard'], ['file', 'Файл или фото', 'toast'], ['notes', 'Домашнее задание', 'toast']].map(([i, t, a]) => `<button class="sheet-i" data-act="${a}" data-text="Вложение отправлено">${I(i, 'md')}<span>${t}</span></button>`).join('')}</div>`),
      callc: () => { toast('Звоним Марии — у неё звонит веб-приложение', { icon: 'phone' }); later(1400, () => go('incoming')); },
      voicemsg: (el) => { el.classList.toggle('is-recording'); if (!el.classList.contains('is-recording')) { $('#m-log').insertAdjacentHTML('beforeend', msgRow({ voice: '0:08', tr: 'Мария, получила ваше сообщение, отвечу подробнее вечером.', time: 'сейчас' }).replace('class="mmsg"', 'class="mmsg mmsg--me"')); toast('Голосовое отправлено · расшифровано GigaAM'); } },
    },
    render(p) {
      const cur = p.c || 'maria';
      const curChat = D.messengerChats.find((c) => c.id === cur) || D.messengerChats[0];
      const who = curChat.who ? P.person(curChat.who) : { name: curChat.title };
      const list = D.messengerChats.map((c) => `<a class="mlist__i ${c.id === cur ? 'is-on' : ''}" data-act="open" data-c="${c.id}">${c.who ? av(c.who, 40) : `<span class="pav" style="--s:40px">${I(CH[c.ch][1])}</span>`}<div class="sp" style="min-width:0"><div class="row" style="gap:6px"><b class="small nowrap">${esc(c.who ? P.person(c.who).name : c.title)}</b><span class="chb chb--${c.ch}">${CH[c.ch][0]}</span><span class="sp"></span><span class="tiny subtle">${c.time}</span></div><div class="tiny muted ell">${esc(c.last)}</div></div>${c.unread ? `<span class="ubadge">${c.unread}</span>` : ''}</a>`).join('');
      const body = `<div class="msgr"><div class="mlist"><div class="mlist__head"><input class="inp" placeholder="Поиск по перепискам и голосовым"><div class="seg" style="margin-top:8px;flex-wrap:wrap">${['Все', 'Клиенты', 'Группы', 'Каналы', 'Входящие'].map((x, i) => `<button class="${i ? '' : 'is-on'}" data-act="seg">${x}</button>`).join('')}</div></div>${list}
          <div class="mlist__foot tiny muted">${I('moon', 'xs')} Рабочие часы 10:00–19:00 · вне их — автоответ и тишина</div></div>
        <div class="mthread"><div class="mthread__head">${curChat.who ? av(curChat.who, 34) : ''}<div class="sp"><b>${esc(who.name)}</b><div class="tiny muted">${cur === 'olga' ? 'пишет из Telegram · ответ уйдёт туда же · номер скрыт' : 'клиент · 9 сессий · онлайн'}</div></div>
            <span class="pill pill--accent">${I('clock', 'xs')} вы «на сессии» до 11:00</span><button class="rbtn rbtn--light" data-act="callc" title="Видеозвонок">${I('video', 'md')}</button><button class="rbtn rbtn--light" data-go="client" title="Карточка">${I('user', 'md')}</button></div>
          <div class="mthread__log" id="m-log">${(thread[cur] || thread.maria).map(msgRow).join('')}</div>
          <div class="yu-sugg" style="margin:0 16px"><span class="yu">${I('sparkles')}</span><span class="small sp">${cur === 'olga' ? 'Ольга просит перенести субботу. Свободно 13:00 — предложить?' : 'Мария сама справилась с бессонницей — отметить это?'}</span><button class="btn btn--secondary btn--sm" data-act="draft">Черновик</button></div>
          <div class="mthread__in"><button class="rbtn rbtn--light" data-act="attach">${I('paperclip', 'md')}</button><input class="inp" id="m-in" placeholder="Сообщение…"><button class="rbtn rbtn--light" data-act="voicemsg" title="Голосовое">${I('mic', 'md')}</button><button class="btn btn--primary" data-act="msend">${I('send')}</button></div></div></div>`;
      return shell({ module: 'Мессенджер', active: 'chat', compose: { label: 'Новый чат', icon: 'edit', act: 'toast' }, nav: [{ icon: 'inbox', label: 'Все разговоры', on: true, count: 8 }, { icon: 'user', label: 'Клиенты', count: 31 }, { icon: 'users', label: 'Группы', count: 4 }, { icon: 'broadcast', label: 'Каналы', count: 2 }, { section: 'Входящие из' }, { icon: 'send', label: 'Telegram', count: 2 }, { icon: 'messenger', label: 'MAX', count: 0 }, { icon: 'users', label: 'ВКонтакте', count: 1 }, { icon: 'mail', label: 'Почта', count: 0 }], body });
    },
    mount(root) { const l = $('#m-log', root); l.scrollTop = l.scrollHeight; $('#m-in', root).addEventListener('keydown', (e) => { if (e.key === 'Enter') this.acts.msend(); }); },
  });

  // ───────────────────────────── продажи ─────────────────────────────
  add({
    id: 'sales', group: G, title: 'Продажи и кошелёк', icon: 'wallet', phase: 'фаза 2А / 8', plan: '§ 5.21; § 5.25 — агентская схема; § 12.2–12.3',
    desc: '«Вы получите N ₽» на каждой продаже, кошелёк с холдом на окно возврата, вывод по СБП, проверка статуса самозанятого перед выплатой, предложения, заказы, подарки в режиме «Подарок» или «Доход», отчёт агента.',
    tips: ['«Вывести» → СБП', 'Вкладка «Подарки» — режимы с объяснением', '«Новое предложение» — частями, подписка, лимит мест'],
    acts: {
      ...P.common,
      withdraw: () => modal(`<div class="eyebrow eyebrow--accent">Вывод</div><h2 class="pmodal__title">Вывести 248 300 ₽</h2><div class="choice">${['СБП · Т-Банк •• 4471 — мгновенно', 'Карта Мир •• 0912 — до 1 дня', 'Счёт ИП — 1 рабочий день'].map((x, i) => `<div class="choice__item ${i ? '' : 'is-on'}" data-act="choice"><span class="choice__radio"></span><div class="choice__title small">${x}</div></div>`).join('')}</div>
        <div class="pmodal__note">${I('shield-check')} Статус самозанятого проверен в ФНС сегодня, 09:01. Чеки за вас уже в «Мой налог».</div><div class="pmodal__actions"><button class="btn btn--primary" data-act="wdone">Вывести</button></div>`),
      wdone: () => { closeModal(); toast('248 300 ₽ отправлены по СБП · назначение «Выплата по агентскому договору №А-0412, без НДС»', { icon: 'wallet' }); },
      newoffer: () => modal(`<div class="eyebrow eyebrow--accent">Новое предложение</div><h2 class="pmodal__title">Что продаём</h2>
        <div class="seg" style="flex-wrap:wrap">${['Курс', 'Консультация', 'Запись эфира', 'Клуб по подписке', 'Билет офлайн'].map((x, i) => `<button class="${i ? '' : 'is-on'}" data-act="seg">${x}</button>`).join('')}</div>
        <label class="lbl">Название</label><input class="inp" value="Курс «Опора»: 6 недель работы с тревогой"><div class="grid g2" style="gap:10px"><div><label class="lbl">Цена</label><input class="inp" value="14 900 ₽"></div><div><label class="lbl">Лимит мест</label><input class="inp" value="40"></div></div>
        <div class="optrow"><div class="optrow__main"><div class="optrow__title">Оплата частями</div><div class="optrow__sub">3 платежа · доступ открывается по мере оплаты</div></div><button class="tgl is-on" data-act="tgl"></button></div>
        <div class="optrow"><div class="optrow__main"><div class="optrow__title">Показывать в эфирах</div><div class="optrow__sub">По кнопке ведущей или по сигналу Юи, когда разговор подошёл к теме</div></div><button class="tgl is-on" data-act="tgl"></button></div>
        <div class="pmodal__note">${I('wallet')} Вы получите: <b>13 410 ₽</b> с каждой продажи (вознаграждение платформы и эквайринг — одной ставкой)</div><div class="pmodal__actions"><button class="btn btn--primary" data-act="close-modal">Создать</button></div>`),
      dmode: (el) => { P.choiceAct(el); toast(el.dataset.m === 'gift' ? 'Режим «Подарок»: 0 % налога, без чеков; подарок ничего не открывает' : 'Режим «Доход»: 4 % налога, чеки пробивает платформа; можно давать бонусы дарителям'); },
    },
    render() {
      const body = `<div class="page page--wide"><div class="page__head"><div class="page__titles"><div class="eyebrow">Касса платформы — агент · вы — самозанятая, статус проверен сегодня</div><h1 class="page__title">Продажи</h1></div><div class="page__actions"><button class="btn btn--secondary" data-act="newoffer">${I('plus')} Новое предложение</button><button class="btn btn--primary" data-act="withdraw">${I('wallet')} Вывести</button></div></div>
        <div class="grid g4"><div class="box stat box--glow"><div class="stat__label">${I('wallet', 'xs')} Можно вывести</div><div class="stat__value">248 300 ₽</div><div class="small muted">ещё 96 200 ₽ в холде до конца окна возврата</div></div>
          <div class="box stat"><div class="stat__label">${I('chart-line', 'xs')} Октябрь</div><div class="stat__value">1 412 900 ₽</div><div class="stat__delta">+38 % к сентябрю</div></div>
          <div class="box stat"><div class="stat__label">${I('gift', 'xs')} Подарки</div><div class="stat__value">${rub(S.raised)}</div><div class="small muted">режим «Подарок» · 0 % налога</div></div>
          <div class="box stat"><div class="stat__label">${I('receipt', 'xs')} Чеки</div><div class="stat__value">1 284</div><div class="small muted">все в «Мой налог» · ручных сверок 0</div></div></div>
        <div class="tabs" data-tabs="sl" style="margin-top:22px">${['Предложения', 'Заказы', 'Подарки', 'Выплаты', 'Отчёт агента'].map((x, i) => `<button class="tab ${i ? '' : 'is-on'}" data-act="tab" data-pane="${i}">${x}</button>`).join('')}</div>
        <div data-pane-of="sl" data-pane="0"><div class="box box--flush"><table class="tbl"><thead><tr><th>Предложение</th><th>Вид</th><th class="num">Цена</th><th class="num">Вы получите</th><th class="num">Продано</th><th>Как платят</th></tr></thead><tbody>
          ${[['Курс «Опора»: 6 недель', 'Курс', 14900, 13410, 67, 'сразу или 3 частями'], ['Индивидуальная сессия · 60 мин', 'Консультация', 6500, 5850, 214, 'перед входом в комнату'], ['Запись эфира навсегда', 'Запись', 990, 891, 121, 'в эфире и на странице'], ['Клуб «Опора» · закрытый канал', 'Подписка', 1900, 1710, 88, 'ежемесячно · пробный 7 дней'], ['Интенсив в Казани · 15 ноября', 'Офлайн-билет', 7900, 7110, 23, 'QR-билет, сканер на входе']].map(([a, b, c, d, e, f]) => `<tr><td class="strong">${a}</td><td><span class="pill">${b}</span></td><td class="num">${rub(c)}</td><td class="num ok">${rub(d)}</td><td class="num">${e}</td><td class="small muted">${f}</td></tr>`).join('')}</tbody></table></div></div>
        <div data-pane-of="sl" data-pane="1" hidden><div class="box box--flush"><table class="tbl"><thead><tr><th>Заказ</th><th>Покупатель</th><th>Что</th><th class="num">Сумма</th><th>Статус</th></tr></thead><tbody>${[['#48210', 'olga', 'Билет «С записью»', 990, 'оплачен · СБП'], ['#48209', 'lev', 'Курс «Опора» · 1 из 3', 4967, 'частями · 2 платежа впереди'], ['#48207', 'mark', 'Билет VIP', 4900, 'оплачен · зарубежная карта'], ['#48201', 'kate', 'Сессия 60 мин', 6500, 'возврат по запросу · 2 дня']].map(([a, w, b, s, st]) => `<tr><td class="mono small">${a}</td><td><div class="row" style="gap:8px">${av(w, 24)}${P.person(w).name}</div></td><td class="small">${b}</td><td class="num">${rub(s)}</td><td class="small">${st}</td></tr>`).join('')}</tbody></table></div></div>
        <div data-pane-of="sl" data-pane="2" hidden><div class="grid g2"><div class="box"><div class="box__title">Режим подарков</div><div class="choice" style="margin-top:12px"><div class="choice__item is-on" data-act="dmode" data-m="gift"><span class="choice__radio"></span><div><div class="choice__title">«Подарок» — 0 % налога</div><div class="choice__sub">Дарение от физлица. Подарок ничего не открывает: ни записи, ни мест, ни приоритета вопросов. Кнопка — «Подарить ведущей»</div></div></div>
              <div class="choice__item" data-act="dmode" data-m="income"><span class="choice__radio"></span><div><div class="choice__title">«Доход» — 4 % с чеками</div><div class="choice__sub">Спокойнее для больших сумм и смешанных форматов; можно благодарить дарителей бонусами</div></div></div></div></div>
            <div class="box"><div class="box__title">Цель сбора</div><div class="small" style="margin-top:6px">${esc(D.donationGoal.title)}</div><div class="bar" style="margin-top:10px"><i style="width:${S.raised / D.donationGoal.goal * 100}%"></i></div><div class="small muted" style="margin-top:6px">${rub(S.raised)} из ${rub(D.donationGoal.goal)} · 412 дарителей</div><div class="box__foot"><button class="btn btn--secondary btn--sm" data-go="stage">Как это видно в эфире</button></div></div></div></div>
        <div data-pane-of="sl" data-pane="3" hidden><div class="box">${[['14 окт', '186 400 ₽', 'СБП · Т-Банк'], ['7 окт', '142 900 ₽', 'СБП · Т-Банк'], ['30 сен', '98 300 ₽', 'Карта Мир']].map(([d, s, m]) => `<div class="lrow"><span class="mono small subtle">${d}</span><div class="lrow__main small">${s} · ${m}</div><span class="pill pill--ok">выплачено · ФНС ✓</span></div>`).join('')}<div class="pmodal__note">${I('shield-check')} Перед каждой выплатой платформа сама проверяет статус самозанятого на дату выплаты. Статус потерян — выплата на паузе с понятным объяснением.</div></div></div>
        <div data-pane-of="sl" data-pane="4" hidden><div class="box"><div class="box__title">${I('file-text')} Отчёт агента за сентябрь</div><div class="box__sub">Формируется сам каждый месяц · ст. 1008 ГК</div><table class="tbl" style="margin-top:12px"><tbody>${[['Принято от покупателей', '1 024 600 ₽'], ['Вознаграждение платформы', '102 460 ₽'], ['Перечислено вам', '922 140 ₽'], ['Чеков пробито', '944']].map(([a, b]) => `<tr><td>${a}</td><td class="num strong">${b}</td></tr>`).join('')}</tbody></table><div class="box__foot"><button class="btn btn--secondary btn--sm" data-act="toast" data-text="Отчёт агента скачан, PDF">${I('download')} PDF</button></div></div></div></div>`;
      return shell({ module: 'Продажи', active: 'sales', compose: { label: 'Предложение', icon: 'plus', act: 'newoffer' }, nav: [{ icon: 'dashboard', label: 'Обзор', on: true }, { icon: 'target', label: 'Предложения', count: 5 }, { icon: 'receipt', label: 'Заказы' }, { icon: 'ticket', label: 'Билеты' }, { icon: 'gift', label: 'Подарки' }, { icon: 'wallet', label: 'Кошелёк и выплаты' }, { icon: 'tag', label: 'Промокоды' }], body });
    },
  });

  // ───────────────────────────── страницы и рассылки ─────────────────────────────
  add({
    id: 'pages', group: G, title: 'Страницы и рассылки', icon: 'template', phase: 'фаза 2А / 9', plan: '§ 12.4–12.5 — Юя собирает страницу по описанию',
    desc: 'Юя собирает страницу эфира или курса по описанию словами; рассылки и цепочки по сегментам с замером доставляемости; рассылки в Telegram, MAX и ВК.',
    tips: ['Нажмите «Собрать» — блоки страницы появятся по очереди'],
    acts: {
      build: (el) => { el.disabled = true; el.innerHTML = `${I('refresh', 'sm', 'spin')} Собираю…`; const pv = $('#pv'); pv.innerHTML = '';
        const blocks = [`<div class="pvb pvb--hero"><div class="tiny accent">Онлайн-интенсив · 3 дня</div><h3>Сон без тревоги</h3><p class="small muted">Практики для тех, кто просыпается в 4 утра</p><span class="btn btn--primary btn--sm">Записаться · 2 900 ₽</span></div>`, `<div class="pvb"><b class="small">Ведущая</b><div class="row" style="gap:8px;margin-top:6px">${av('anna', 30)}<span class="small">Анна Соколова · 9 лет практики</span></div></div>`, `<div class="pvb"><b class="small">Программа</b><div class="small muted">День 1 · Почему мы не спим · День 2 · Тело · День 3 · Ритуалы</div></div>`, `<div class="pvb"><b class="small">Отзывы</b><div class="small muted">«Впервые за год сплю до утра» — Ольга</div></div>`, `<div class="pvb"><b class="small">Время в вашем поясе · Регистрация · Оплата</b></div>`];
        blocks.forEach((b, i) => later(450 * (i + 1), () => pv.insertAdjacentHTML('beforeend', `<div class="fade-up">${b}</div>`)));
        later(450 * 6, () => { el.disabled = false; el.innerHTML = `${I('check')} Готово · опубликовать`; toast('Страница собрана: 5 блоков, адаптирована под телефон', { icon: 'sparkles' }); }); },
    },
    render() {
      const body = `<div class="page page--wide"><div class="page__head"><div class="page__titles"><div class="eyebrow eyebrow--accent">Без техспециалиста</div><h1 class="page__title">Страницы и рассылки</h1></div></div>
        <div class="grid g2"><div class="box"><div class="box__title"><span class="yu">${I('sparkles')}</span> Опишите страницу словами</div><textarea class="inp" style="margin-top:10px" rows="4">Страница трёхдневного интенсива «Сон без тревоги» 12–14 ноября, 2 900 ₽, для тех, кто просыпается в 4 утра. Ведущая — я. Отзыв Ольги. Регистрация и оплата, время в поясе зрителя.</textarea>
            <div class="box__foot"><button class="btn btn--primary" data-act="build">${I('wand')} Собрать</button><span class="small muted">или выбрать шаблон: эфир · курс · консультация · специалист</span></div></div>
          <div class="box"><div class="box__title">Предпросмотр · телефон</div><div class="pvphone"><div id="pv" class="pv"><div class="empty-note">Здесь появится страница</div></div></div></div></div>
        <div class="sec"><div class="sec__head"><h3>Рассылки и цепочки</h3><span class="sp"></span><button class="btn btn--secondary btn--sm" data-go="scenarios">${I('automation')} Сценарии</button></div>
          <div class="box box--flush"><table class="tbl"><thead><tr><th>Рассылка</th><th>Сегмент</th><th>Каналы</th><th class="num">Доставлено</th><th class="num">Открыли</th><th class="num">Перешли</th></tr></thead><tbody>
          ${[['Запись «Сон без тревоги» + курс −25 %', 'досмотрели > 50 %, не купили · 1 343', 'почта · TG · MAX', '99,1 %', '61 %', '18 %'], ['Анонс эфира 23 октября', 'все подписчики · 8 410', 'почта · TG · ВК', '98,4 %', '47 %', '22 %'], ['Цепочка «Новый клиент» · 4 письма', 'пришли на первую сессию', 'почта · чат', '99,6 %', '72 %', '—']].map((r) => `<tr><td class="strong small">${r[0]}</td><td class="small muted">${r[1]}</td><td class="small">${r[2]}</td>${r.slice(3).map((x) => `<td class="num">${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
          <div class="small muted" style="margin-top:8px">${I('shield-check', 'xs')} Доменная почта, DMARC, прогрев выделенного IP — доставляемость меряется на каждой рассылке</div></div></div>`;
      return shell({ module: 'Страницы и рассылки', active: 'pages', compose: { label: 'Новая страница', icon: 'plus', act: 'toast' }, nav: [{ icon: 'template', label: 'Страницы', on: true, count: 6 }, { icon: 'mail', label: 'Рассылки', count: 3 }, { icon: 'automation', label: 'Цепочки', go: 'scenarios' }, { icon: 'users', label: 'Сегменты' }, { icon: 'globe', label: 'Домены' }], body });
    },
  });

  // ───────────────────────────── школа ─────────────────────────────
  add({
    id: 'school', group: G, title: 'Школа: курс и поток', icon: 'graduation-cap', phase: 'фаза 7', plan: '§ 12.8 — школа; запись эфира → урок',
    desc: 'Один вид курса: модули и уроки (видео, аудио, текст, задания, живые эфиры внутри урока), запись эфира становится уроком одним нажатием, поток по датам, ученики и прогресс, проверка заданий — Юя первый проверяющий.',
    tips: ['Урок из эфира помечен значком', 'Очередь проверки → черновик комментария от Юи', '«Вид ученика» — урок глазами ученика'],
    acts: {
      ...P.common,
      review: (el) => { el.closest('.rv').innerHTML = `<div class="small ok">${I('check-circle', 'xs')} Комментарий отправлен ученице · +10 баллов</div>`; },
    },
    render() {
      const cr = D.course;
      const tic = { video: 'play', text: 'file-text', task: 'pencil', audio: 'headphones', live: 'broadcast' };
      const body = `<div class="page page--wide"><div class="page__head"><div class="page__titles"><div class="eyebrow">${cr.stream} · ${cr.students} учеников · ${cr.revenue}</div><h1 class="page__title">${esc(cr.title)}</h1></div><div class="page__actions"><button class="btn btn--secondary" data-go="recording">${I('plus')} Урок из записи эфира</button><button class="btn btn--primary" data-go="lesson">${I('eye')} Вид ученика</button></div></div>
        <div class="grid g-side"><div>${cr.modules.map((m) => `<div class="box" style="margin-bottom:12px"><div class="box__title">${esc(m.title)}</div>${m.lessons.map((l) => `<div class="lrow" style="padding:10px 2px">${I(tic[l.type] || 'file', 'md', 'accent')}<div class="lrow__main"><div class="lrow__title small">${esc(l.t)} ${l.fromLive ? `<span class="pill pill--accent">${I('broadcast', 'xs')} из эфира · главы и субтитры</span>` : ''}${l.locked ? ' <span class="pill">стоп-урок</span>' : ''}</div><div class="lrow__sub">${l.dur || ''} ${l.done ? `· прошли ${l.done}` : ''}${l.review ? ` · <b class="warn">${l.review} на проверке</b>` : ''}</div></div>${I('grip', 'sm', 'subtle')}</div>`).join('')}</div>`).join('')}</div>
          <div class="col" style="gap:16px"><div class="box"><div class="box__title">Проверка заданий · 38</div><div class="box__sub">Юя — первый проверяющий: разбирает ответ и пишет черновик комментария куратору</div>
            ${['alina', 'dasha'].map((id) => `<div class="rv"><div class="row" style="gap:8px;margin-top:12px">${av(id, 28)}<b class="small">${P.person(id).name}</b><span class="tiny muted">голосовое · 1:48</span></div><div class="small muted" style="margin-top:6px">«Три ситуации: планёрка, звонок маме, очередь в банке…»</div>
              <div class="yu-sugg" style="margin:8px 0 0"><span class="yu">${I('sparkles')}</span><span class="small sp">Задание выполнено полно; телесные сигналы описаны в 2 из 3 ситуаций — предложить дополнить третью</span></div>
              <div class="row" style="gap:6px;margin-top:8px"><button class="btn btn--primary btn--sm" data-act="review">Отправить</button><button class="btn btn--ghost btn--sm" data-act="toast" data-text="Комментарий открыт для правки">Править</button></div></div>`).join('')}</div>
            <div class="box"><div class="box__title">Прогресс потока</div>${C.hbars([{ l: 'Неделя 1', v: 88, f: '88' }, { l: 'Неделя 2', v: 62, f: '62' }, { l: 'Неделя 3', v: 0, f: 'откроется 17 ноя' }], { suffix: '' })}<div class="tiny muted" style="margin-top:8px">% учеников, прошедших неделю · сертификат со страницей проверки по номеру</div></div></div></div></div>`;
      return shell({ module: 'Школа', active: 'school', compose: { label: 'Новый курс', icon: 'plus', act: 'toast' }, nav: [{ icon: 'graduation-cap', label: 'Курсы', on: true, count: 3 }, { icon: 'users', label: 'Ученики', count: 214 }, { icon: 'pencil', label: 'Проверка', count: 38 }, { icon: 'certificate', label: 'Сертификаты' }, { icon: 'messenger', label: 'Чаты потоков' }], body });
    },
  });

  add({
    id: 'lesson', group: G, title: 'Урок глазами ученика', icon: 'book', phase: 'фаза 7', plan: '§ 12.8 — видео с главами, субтитрами и поиском',
    desc: 'Видео урока с главами, субтитрами и поиском по словам, задание с ответом голосом, разбор от Юи, чат потока. Веб-приложение — работает и офлайн.',
    acts: {
      ...P.common,
      recans: (el) => { el.classList.toggle('is-rec'); if (el.classList.contains('is-rec')) { el.innerHTML = `${I('stop')} Остановить · 0:07`; } else { el.outerHTML = `<div class="fade-up"><div class="row" style="gap:8px">${I('play', 'sm', 'accent')}${C.wave(30, 9)}<span class="tiny mono">0:46</span></div><div class="yu-sugg" style="margin:10px 0 0"><span class="yu">${I('sparkles')}</span><span class="small">Хороший разбор! Вы описали, где в теле тревога, в двух ситуациях. Куратор посмотрит в течение суток.</span></div></div>`; toast('Ответ отправлен · расшифрован и передан куратору'); } },
      seekl: (el) => toast(`Видео: ${el.dataset.t}`, { icon: 'play' }),
    },
    render() {
      return `<div class="lesson"><header class="lp__top"><span class="lp__logo">${I('leaf')} Опора · курс</span><span class="sp"></span><span class="small muted">Неделя 1 · урок 1 из 3</span><div class="bar" style="width:140px"><i style="width:33%"></i></div></header>
        <div class="page page--wide"><div class="grid g-side" style="grid-template-columns:minmax(0,1fr) 340px"><div>
          <div class="player"><div class="player__video" style="background-image:url(img/people/p32.jpg)"><button class="player__play">${I('play', 'lg')}</button><span class="player__cc">Тревога — это сигнал, который пытается нас защитить</span></div>
            <div class="player__bar"><span class="mono small">07:40</span><div class="player__track"><i style="width:8%"></i></div><span class="mono small muted">1:26:30</span><button class="btn btn--ghost btn--sm" data-act="toast" data-text="Скачано для просмотра офлайн — на срок доступа">${I('download')}</button></div></div>
          <h1 class="page__title" style="font-size:24px;margin-top:16px">Тревога как сигнал</h1><div class="small muted">Запись эфира 23 октября · блок продаж вырезан · субтитры RU/EN</div>
          <div class="chapters" style="margin-top:14px">${D.chapters.slice(0, 6).map((c) => `<a class="chapter" data-act="seekl" data-t="${c.t}"><span class="mono small accent">${c.t}</span><span>${c.title}</span></a>`).join('')}</div>
          <div class="box" style="margin-top:16px"><div class="box__title">${I('pencil')} Задание</div><div class="small" style="margin-top:6px">Опишите три ситуации на этой неделе, когда вы чувствовали тревогу, и где именно в теле она была.</div><div class="box__foot"><button class="btn btn--primary btn--sm" data-act="recans">${I('mic')} Ответить голосом</button><button class="btn btn--secondary btn--sm" data-act="toast" data-text="Можно ответить текстом или фото">Текстом</button></div></div></div>
          <div class="box box--flush"><div class="tabs" data-tabs="ls" style="margin:0;padding:0 8px"><button class="tab is-on" data-act="tab" data-pane="0">Расшифровка</button><button class="tab" data-act="tab" data-pane="1">Чат потока</button></div>
            <div data-pane-of="ls" data-pane="0" class="tr"><input class="inp" placeholder="Найти в уроке…" style="margin-bottom:10px">${D.transcript.slice(0, 5).map((l) => `<div class="tr-line" data-act="seekl" data-t="${l.t}"><span class="mono tiny subtle">${l.t}</span><p>${l.text}</p></div>`).join('')}</div>
            <div data-pane-of="ls" data-pane="1" hidden class="tr">${D.chatSeed.slice(0, 4).map(P.msgHtml).join('')}</div></div></div></div></div>`;
    },
  });

  // ───────────────────────────── карточка клиента ─────────────────────────────
  add({
    id: 'client', group: G, title: 'Карточка клиента', icon: 'user', phase: 'фаза 4 / 10', plan: '§ 5.23; § 12.6 — CRM; § 5.29 — журнал доступа',
    desc: 'Всё о клиенте в одном месте: данные рождения и карта, динамика по опросникам, сессии и записи, задания, оплаты, переписка, согласия по целям и журнал — кто открывал записи.',
    acts: { ...P.common, callc: () => go('incoming') },
    render() {
      const c = D.client;
      const body = `<div class="page page--wide"><div class="row" style="gap:16px;flex-wrap:wrap;margin-bottom:22px">${av('maria', 72)}<div class="sp"><div class="eyebrow">Клиент · ${c.since} · пришла с эфира «Границы без вины»</div><h1 class="page__title">Мария Иванова</h1><div class="small muted">${c.age} года · ${c.city} · следующая сессия ${c.next}</div></div>
          <div class="page__actions"><button class="btn btn--secondary" data-go="messenger">${I('messenger')} Написать</button><button class="btn btn--secondary" data-act="callc">${I('phone')} Позвонить</button><button class="btn btn--primary" data-go="prejoin">${I('video')} В комнату</button></div></div>
        <div class="grid g-side"><div class="col" style="gap:16px">
          <div class="box"><div class="box__title">Динамика · тревога по GAD-7</div><div class="box__sub">Опросник перед каждой сессией · ниже — лучше</div>${C.area(c.scores.map((s) => s.v), { h: 170, labels: c.scores.map((s) => s.n + '-я'), max: 21, min: 0, color: 'var(--color-success)' })}</div>
          <div class="box"><div class="box__title">Сессии</div>${[['14 окт', '8-я · страх оценки, «пустой стул»', '58:40'], ['7 окт', '7-я · сон: режим, ритуал, дыхание', '61:12'], ['30 сен', '6-я · границы на работе, ролевая игра', '59:03']].map(([d, t, l]) => `<div class="lrow lrow--click" data-go="recording"><span class="mono small subtle">${d}</span><div class="lrow__main small">${t}</div><span class="pill">${I('play', 'xs')} ${l}</span><span class="pill pill--ok">итоги</span></div>`).join('')}</div>
          <div class="box"><div class="box__title">Задания</div>${c.homework.map((h) => `<div class="lrow"><span class="${h.done ? 'ok' : 'subtle'}">${I('square-check')}</span><div class="lrow__main small">${h.t}</div><span class="pill ${h.done ? 'pill--ok' : 'pill--warn'}">${h.done ? 'сделано' : 'в процессе'}</span></div>`).join('')}</div></div>
          <div class="col" style="gap:16px"><div class="box"><div class="box__title">${I('stars')} Карта</div><div class="small muted">${c.birth}</div><div style="margin-top:8px">${C.natal(280)}</div></div>
            <div class="box"><div class="box__title">${I('shield-check')} Согласия</div>${[['Обработка персональных данных', '03.06'], ['Запись сессий', '03.06 · кодом'], ['Расшифровка', '03.06 · кодом'], ['ИИ-разбор', '03.06 · кодом']].map(([a, b]) => `<div class="lrow" style="padding:8px 2px"><span class="ok">${I('check-circle')}</span><div class="lrow__main small">${a}</div><span class="tiny muted">${b}</span></div>`).join('')}</div>
            <div class="box"><div class="box__title">${I('eye')} Кто открывал записи</div><div class="box__sub">Клиент видит этот журнал в своём профиле</div>${[['Анна Соколова', '14 окт 11:02', 'запись 8-й встречи'], ['Анна Соколова', '8 окт 20:15', 'расшифровка 7-й'], ['Сотрудники платформы', '—', 'доступа нет']].map(([a, b, cc]) => `<div class="lrow" style="padding:8px 2px"><div class="lrow__main small">${a}<div class="tiny muted">${cc}</div></div><span class="tiny muted">${b}</span></div>`).join('')}</div>
            <div class="box"><div class="box__title">${I('wallet')} Оплаты</div><div class="small" style="margin-top:6px">${c.paid} · ${c.balance}</div></div></div></div></div>`;
      return shell({ module: 'CRM и сценарии', active: 'crm', compose: { label: 'Новый клиент', icon: 'user-plus', act: 'toast' }, nav: [{ icon: 'users', label: 'Клиенты', on: true, count: 31 }, { icon: 'filter', label: 'Сегменты', count: 9 }, { icon: 'automation', label: 'Сценарии', go: 'scenarios' }, { icon: 'chart-bar', label: 'Аналитика', go: 'report' }, { icon: 'inbox', label: 'Обращения', count: 3 }], body });
    },
  });

  // ───────────────────────────── сценарии ─────────────────────────────
  add({
    id: 'scenarios', group: G, title: 'Сценарии вместо «процессов»', icon: 'automation', phase: 'фаза 2А / 10', plan: '§ 12.7 — один движок сценариев на журнале событий',
    desc: 'Триггер — любое событие журнала (оплата, вход в эфир, уход на N-й минуте, нажатие на предложение), затем условия и действия. Сценарий пишет Юя словами и прогоняет на симуляторе.',
    tips: ['«Написать словами» → схема строится сама', '«Симулятор» — прогон на 10 зрителях'],
    acts: {
      write: (el) => { el.disabled = true; const nodes = $$('.snode'); nodes.forEach((n) => n.classList.remove('is-in')); nodes.forEach((n, i) => later(380 * (i + 1), () => n.classList.add('is-in'))); later(380 * (nodes.length + 1), () => { el.disabled = false; toast('Сценарий собран: 1 триггер, 2 условия, 4 действия · ждёт включения', { icon: 'sparkles' }); }); },
      sim: () => { const out = $('#simlog'); out.innerHTML = ''; const rows = [['olga', 'досмотрела 78 % → письмо с записью + курс −25 %'], ['lev', 'досмотрел 34 % → запись на 3 дня'], ['kate', 'открыла предложение, не купила → напоминание через 24 ч'], ['mark', 'купил курс → доступ, приветствие в чате потока'], ['nina', 'не пришла → запись + «следующий эфир 6 ноября»']];
        rows.forEach(([w, t], i) => later(400 * (i + 1), () => out.insertAdjacentHTML('beforeend', `<div class="lrow fade-up" style="padding:8px 2px">${av(w, 24)}<span class="small">${P.person(w).short}: ${t}</span></div>`))); },
      enable: (el) => { el.classList.toggle('is-on'); toast(el.classList.contains('is-on') ? 'Сценарий включён · массовый запуск — с вашего подтверждения (уровень доверия)' : 'Сценарий выключен'); },
    },
    render() {
      const n = (k, t, s, x, y) => `<div class="snode snode--${k} is-in" style="left:${x}%;top:${y}px"><div class="tiny">${{ trig: 'Триггер', cond: 'Условие', act: 'Действие' }[k]}</div><b class="small">${t}</b><div class="tiny muted">${s}</div></div>`;
      const body = `<div class="page page--wide"><div class="page__head"><div class="page__titles"><div class="eyebrow">Движок сценариев · журнал событий</div><h1 class="page__title">После эфира — <em>дожим без спама</em></h1></div><div class="page__actions"><span class="small muted">Включён</span><button class="tgl" data-act="enable"></button></div></div>
        <div class="box"><div class="row" style="gap:10px"><span class="yu">${I('sparkles')}</span><input class="inp sp" value="Когда эфир закончился: кто досмотрел больше половины и не купил — запись и курс со скидкой 48 часов; кто не пришёл — запись на 3 дня; купившим — доступ и приветствие в чате потока"><button class="btn btn--primary" data-act="write">${I('wand')} Написать словами</button></div></div>
        <div class="flow">${n('trig', 'Эфир закончился', '«Тревога и опора»', 2, 120)}${n('cond', 'Досмотрел > 50 %?', 'и не оплатил курс', 26, 30)}${n('cond', 'Не пришёл', 'был зарегистрирован', 26, 220)}${n('act', 'Письмо + Telegram', 'запись и курс −25 % · 48 ч', 52, 10)}${n('act', 'Через 24 ч', 'напоминание, если открыл и не купил', 76, 10)}${n('act', 'Запись на 3 дня', 'почта и бот', 52, 220)}${n('act', 'Купил → доступ', 'чат потока, приветствие', 52, 115)}
          <svg class="flow__lines" viewBox="0 0 100 300" preserveAspectRatio="none"><path d="M16 150 C 22 150, 20 60, 26 60 M16 150 C 22 150, 20 250, 26 250 M40 60 L52 40 M66 40 L76 40 M40 60 C 46 60, 46 145, 52 145 M40 250 L52 250"/></svg></div>
        <div class="grid g2" style="margin-top:16px"><div class="box"><div class="row"><div class="box__title sp">Симулятор</div><button class="btn btn--secondary btn--sm" data-act="sim">${I('play')} Прогнать на 10 зрителях</button></div><div id="simlog" style="margin-top:8px"></div></div>
          <div class="box"><div class="box__title">Журнал срабатываний</div>${[['16 окт 20:41', '1 343 письма · 1 343 сообщения в боты', '18 % перешли'], ['16 окт 20:41', '935 записей на 3 дня', '41 % открыли'], ['17 окт 20:41', '345 напоминаний', '22 оплаты']].map(([a, b, c]) => `<div class="lrow" style="padding:8px 2px"><span class="mono tiny subtle">${a}</span><div class="lrow__main small">${b}</div><span class="pill pill--ok">${c}</span></div>`).join('')}</div></div></div>`;
      return shell({ module: 'CRM и сценарии', active: 'crm', compose: { label: 'Новый сценарий', icon: 'plus', act: 'toast' }, nav: [{ icon: 'users', label: 'Клиенты', go: 'client', count: 31 }, { icon: 'filter', label: 'Сегменты', count: 9 }, { icon: 'automation', label: 'Сценарии', on: true, count: 6 }, { icon: 'chart-bar', label: 'Аналитика', go: 'report' }], body });
    },
  });
})();

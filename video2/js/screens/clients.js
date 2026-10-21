/* Экраны клиента и ученика: страница специалиста и запись, каталог, «нет доступа», опросник,
   чат со специалистом, кабинет ученика, проверка сертификата; второе устройство; участник в зале. */
(function () {
  const { D, S, add, I, av, esc, rub, toast, modal, closeModal, go, every, later, $, $$, btn, chip, opt, seg, pick, li, yuNote, note, tabs, pane } = P;
  const GC = 'Клиент и ученик';

  // ───────────── страница специалиста и запись ─────────────
  const FORMATS = [['first', 'Первая встреча', '30 мин', 2500, 'познакомиться и понять запрос'], ['session', 'Сессия', '60 мин', 6500, 'основной формат'], ['pack', 'Пакет из 5 сессий', '5 × 60 мин', 29000, 'можно тремя частями']];
  const DAYS = [['пт', '24'], ['сб', '25'], ['пн', '27'], ['вт', '28'], ['ср', '29'], ['чт', '30'], ['пт', '31']];
  const slotsFor = (i) => [['10:00', '11:00', '16:00'], ['12:00', '13:00'], ['18:00'], ['10:00', '12:00', '19:00'], ['09:00', '17:00'], ['12:00', '15:00', '18:00'], ['11:00']][i];
  add({
    id: 'specialist-page', after: 'check', group: 'Вход участника', title: 'Страница специалиста и запись', icon: 'user-check', phase: 'фазы 4 / 9', plan: '§ 12.4 — шаблон страницы специалиста, § 5.22 — запись на консультацию, § 5.28 — «проверенный специалист»',
    desc: 'Публичная страница специалиста: кто он и с чем работает, отметка «проверен платформой», ближайшие эфиры, группы и курсы. Запись на сессию — день, время в поясе клиента, формат, оплата до встречи, без переписки.',
    tips: ['Выберите формат — цена и кнопка пересчитаются', 'Выберите день и время', '«Записаться и оплатить» — оплата и подтверждение'],
    acts: {
      fmt: (el) => { $$('.fmt2').forEach((x) => x.classList.toggle('is-on', x === el)); const f = FORMATS[+el.dataset.i]; $('#bk-btn').innerHTML = `${I('credit-card')}<span>Записаться и оплатить · ${rub(f[3])}</span>`; $('#bk-btn').dataset.i = el.dataset.i; },
      day: (el) => { $$('.days2 button').forEach((x) => x.classList.toggle('is-on', x === el)); $('#slots').innerHTML = slotsFor(+el.dataset.i).map((t, k) => `<button class="${k ? '' : 'is-on'}" data-act="seg">${t}</button>`).join(''); },
      book: (el) => { const f = FORMATS[+(el.dataset.i ?? 1)]; const d = $('.days2 .is-on')?.textContent.trim() || 'пт 24'; const t = $('#slots .is-on')?.textContent || '10:00'; P.payModal(f[3], `${f[1]} с Анной Соколовой · ${d}, ${t}`, () => { $('#bk').innerHTML = `<div class="fade-up" style="text-align:center"><span class="yu2 yu2--lg" style="margin:0 auto">${I('check', 'lg')}</span><div class="h2 mt16">Вы записаны</div><div class="muted mt8" style="font-size:15px;line-height:1.55">${esc(f[1])} · ${esc(d)}, ${esc(t)} по вашему времени (Казань). Ссылка на встречу — в почте и в Telegram. За сутки придёт короткая анкета — её увидит только Анна.</div>
        <div class="col mt24" style="gap:8px">${btn('Добавить в календарь', { icon: 'calendar', block: true, kind: 'white', act: 'toast', data: 'data-text="Встреча в вашем календаре"' })}${btn('Написать Анне', { icon: 'message-circle', block: true, kind: 'white', go: 'messenger-mobile' })}${btn('Проверить связь заранее', { icon: 'wifi', block: true, kind: 'primary', go: 'check' })}</div></div>`; toast('Оплачено · чек на почте'); }); },
    },
    render() {
      const a = P.person('anna');
      return `<div class="pub"><header class="pub__top"><span class="pub__logo">${av('anna', 28)} Анна Соколова</span><span class="sp"></span><a class="t-sm muted" data-go="catalog">Все специалисты</a><img src="seal-compact.svg" width="22" height="22" alt=""><b class="t-sm">Суть</b></header>
        <section class="pub__hero"><div><div class="row" style="gap:20px;align-items:center">${av('anna', 112)}<div><h1 class="pub__h" style="margin:0">Анна Соколова</h1><div class="muted mt8" style="font-size:16px">${esc(a.role)} · 9 лет практики</div><div class="row row--wrap mt12" style="gap:8px">${chip(`${I('shield-check', 'xs')} проверена платформой`, 'ok')}${chip('онлайн и очно, Москва')}${chip('русский, английский')}</div></div></div>
          <p class="pub__lead">Помогаю, когда тревога мешает жить: бессонница перед важными событиями, страх оценки, выгорание. Работаю бережно и по шагам — с задачами между встречами и понятной динамикой.</p>
          <div class="note mt16">${I('shield-check')}<div>Диплом и удостоверения о повышении квалификации проверены платформой 12 июня 2026. Супервизия — регулярно.</div></div>
          <div class="h3 mt32">С чем работаю</div><div class="row row--wrap mt12" style="gap:8px">${['тревога', 'панические атаки', 'бессонница', 'выгорание', 'страх оценки', 'границы на работе', 'адаптация после переезда'].map((x) => chip(x)).join('')}</div>
          <div class="h3 mt32">Как проходит работа</div><div class="steps3 mt12">${[['1', 'Первая встреча', 'знакомство и запрос, без обязательств'], ['2', 'План', 'договариваемся о цели и числе встреч'], ['3', 'Сессии', 'раз в неделю, задания между встречами'], ['4', 'Динамика', 'короткие опросники — видно, что меняется']].map(([n, t, s]) => `<div><b class="accent">${n}</b><div class="b mt8">${t}</div><div class="t-sm muted">${s}</div></div>`).join('')}</div></div>
          <div class="pub__card" id="bk"><div class="h3">Записаться</div><div class="col mt12" style="gap:8px">${FORMATS.map(([k, t, d, p, s], i) => `<button class="fmt2 ${i === 1 ? 'is-on' : ''}" data-act="fmt" data-i="${i}"><div class="row"><b>${t}</b><span class="sp"></span><b>${rub(p)}</b></div><div class="t-sm muted">${d} · ${s}</div></button>`).join('')}</div>
            <div class="fld"><span class="fld__l">День · время по Казани</span><div class="days2">${DAYS.map(([w, n], i) => `<button class="${i ? '' : 'is-on'}" data-act="day" data-i="${i}"><span>${w}</span><b>${n}</b></button>`).join('')}</div><div class="slots2 mt8" id="slots">${slotsFor(0).map((t, k) => `<button class="${k ? '' : 'is-on'}" data-act="seg">${t}</button>`).join('')}</div></div>
            <div class="fld"><span class="fld__l">Где</span>${seg(['Онлайн', 'Очно · Чистые пруды'], 0, 'seg', { block: true })}</div>
            <label class="fld"><span class="fld__l">Коротко о запросе — видит только Анна</span><textarea class="in" rows="2">Не сплю перед важными встречами на работе</textarea></label>
            <label class="row mt12" style="font-size:14px;align-items:flex-start;cursor:pointer"><input type="checkbox" checked style="width:18px;height:18px;margin-top:2px"><span>Согласна на обработку персональных данных и условия записи — <a class="accent" data-act="toast" data-text="Согласие и условия — отдельными документами">документы</a></span></label>
            <div class="mt16">${btn('Записаться и оплатить · 6 500 ₽', { kind: 'primary', size: 'lg', block: true, icon: 'credit-card', act: 'book', id: 'bk-btn', data: 'data-i="1"' })}</div>
            <div class="t-xs muted mt12" style="text-align:center">Перенос или отмена — бесплатно за сутки, в одно касание</div></div></section>
        <section class="pub__sec"><div class="h2">Эфиры, группы и курсы Анны</div><div class="grid g3 mt16">${[['broadcast', 'Эфир · чт 23 октября, 18:00', 'Тревога и опора: как вернуть себе почву', 'event-page'], ['users', 'Группа · набор до 1 ноября', '«Опора» — 8 встреч по средам, до 12 человек', 'catalog'], ['graduation-cap', 'Курс · 6 недель', '«Опора»: работа с тревогой — записи, задания, разбор', 'no-access']].map(([i, k, t, g]) => `<a class="card card--click" data-go="${g}"><span class="tile-a__i">${I(i, 'lg')}</span><div class="t-sm muted mt16">${k}</div><div class="h3 mt8">${t}</div></a>`).join('')}</div></section>
        <footer class="pub__foot">Платформа «Суть» — агент ИП Соколовой А. В. · оферта · политика · <a data-go="check" class="accent">проверить связь</a></footer></div>`;
    },
  });

  // ───────────── каталог проверенных специалистов ─────────────
  const SPECS = [
    ['anna', 'Анна Соколова', 'КПТ, гипнотерапия · 9 лет', 'тревога, бессонница, выгорание', 6500, 'завтра 10:00', 'p32'],
    ['dmitry', 'Дмитрий Орлов', 'психиатр-консультант · 14 лет', 'тревожные расстройства, сон, медикаменты', 9000, 'пн 12:00', 'p68'],
    ['vera', 'Вера Ким', 'гештальт-терапия · 6 лет', 'отношения, самооценка, тревога', 5000, 'сегодня 19:00', 'p20'],
    ['lev', 'Лев Шапиро', 'клинический психолог · 11 лет', 'панические атаки, ОКР, тревога', 7000, 'ср 09:00', 'p60'],
    ['nina', 'Нина Абрамова', 'семейный психолог · 8 лет', 'пары, родители и подростки', 6000, 'чт 18:00', 'p38'],
    ['alina', 'Алина Руденко', 'телесная терапия · 5 лет', 'стресс, напряжение, сон', 4500, 'завтра 15:00', 'p44'],
  ];
  add({
    id: 'catalog', after: 'specialist-page', group: 'Вход участника', title: 'Каталог специалистов', icon: 'search', phase: 'фазы 9–10', plan: '§ 12.1 п. 9 — каталог проверенных специалистов, § 5.28',
    desc: 'Только проверенные платформой специалисты. Можно описать словами, что беспокоит, — Юя подберёт и объяснит почему. Фильтры по формату, цене и времени, запись в два касания.',
    tips: ['Нажмите «Подобрать» — Юя объяснит выбор', 'Фильтры сужают список', 'Карточка ведёт на страницу специалиста'],
    acts: {
      match: () => { $('#cat-yu').innerHTML = yuNote('По запросу «не сплю перед важными встречами» подходят трое: Анна (тревога и сон, КПТ), Лев (панические атаки) и Алина (телесная работа со стрессом). Если есть мысли о лекарствах — Дмитрий, он психиатр.'); $$('.spec2').forEach((c) => c.classList.toggle('is-dim', !['anna', 'lev', 'alina', 'dmitry'].includes(c.dataset.id))); toast('Юя подобрала четырёх специалистов', { icon: 'sparkles' }); },
      cf: (el) => { el.classList.toggle('chip2--accent'); },
    },
    render() {
      return `<div class="pub"><header class="pub__top"><img src="seal-compact.svg" width="26" height="26" alt=""><b>Суть</b><span class="muted">· специалисты</span></header>
        <div class="page page--wide" style="padding-top:28px"><h1 class="h1">Специалисты, которых проверила платформа</h1><p class="lead mt8">Дипломы и удостоверения проверены. Первая встреча — короткая, чтобы понять, ваш ли это человек.</p>
          <div class="card mt24"><div class="row row--wrap"><span class="yu2">${I('sparkles')}</span><input class="in sp" value="Не сплю перед важными встречами, накручиваю себя" aria-label="Что беспокоит" style="min-width:240px">${btn('Подобрать', { kind: 'primary', icon: 'wand', act: 'match' })}</div><div id="cat-yu" class="mt12"></div>
            <div class="row row--wrap mt12" style="gap:8px">${['онлайн', 'очно в Москве', 'до 6 000 ₽', 'есть время на этой неделе', 'психиатр', 'работа с парами'].map((x) => `<button class="chip2" data-act="cf">${x}</button>`).join('')}</div></div>
          <div class="grid g3 mt24">${SPECS.map(([id, n, r, w, p, t, im]) => `<a class="card card--click spec2" data-id="${id}" data-go="specialist-page"><div class="row" style="gap:14px"><span class="av" style="--s:64px"><img src="img/people/${im}.jpg" alt=""></span><div><div class="h3">${n}</div><div class="t-sm muted">${r}</div></div></div><div class="mt12" style="font-size:15px">${w}</div><div class="row mt16"><b>${rub(p)}</b><span class="t-sm muted">· сессия</span><span class="sp"></span>${chip(`${I('shield-check', 'xs')} проверен`, 'ok')}</div><div class="t-sm accent mt8">${I('clock', 'xs')} ближайшее: ${t}</div></a>`).join('')}</div>
          <div class="note mt24">${I('info-circle')}<div>Если сейчас тяжело и есть мысли причинить себе вред — звоните 112 или на телефон доверия 8-800-2000-122, это бесплатно и круглосуточно.</div></div></div></div>`;
    },
  });

  // ───────────── нет доступа — купить ─────────────
  add({
    id: 'no-access', after: 'ticket-busy', group: 'Вход участника', title: 'Нет доступа — купить', icon: 'lock', phase: 'фаза 2Б', plan: '§ 12.10 — страница «нет доступа» с предложением, § 5.22',
    desc: 'Человек открыл чужую ссылку на запись или курс. Вместо «доступ запрещён» — что это, первые минуты бесплатно, варианты доступа и оплата здесь же. Есть билет — вход по почте.',
    tips: ['«Смотреть первые 3 минуты»', 'Выберите вариант и оплатите', '«У меня есть билет» — вход по коду'],
    acts: {
      pick2: (el) => { $$('.fmt2').forEach((x) => x.classList.toggle('is-on', x === el)); $('#na-btn').innerHTML = `${I('credit-card')}<span>Оплатить ${rub(+el.dataset.p)}</span>`; $('#na-btn').dataset.p = el.dataset.p; },
      buyna: (el) => P.payModal(+(el.dataset.p || 990), 'Запись эфира «Сон без тревоги»', () => { $('#na').innerHTML = `<div class="fade-up" style="text-align:center">${I('check-circle', 'xl', 'ok')}<div class="h2 mt12">Доступ открыт</div><div class="muted mt8">Запись с главами и расшифровкой — ваша. Ссылка личная: она пускает одного человека.</div><div class="mt16">${btn('Смотреть', { kind: 'primary', size: 'lg', icon: 'play', go: 'lesson' })}</div></div>`; }),
      code: () => modal(`<div class="modal2__t">Войти по почте</div><div class="modal2__s">Пришлём код на почту, указанную при покупке билета.</div><label class="fld"><span class="fld__l">Почта</span><input class="in" value="olga.belova@mail.ru"></label><div class="modal2__f">${btn('Прислать код', { kind: 'primary', size: 'lg', act: 'toast', data: 'data-text="Код отправлен — действует 10 минут"' })}</div>`),
    },
    render() {
      return `<div class="pub"><header class="pub__top"><span class="pub__logo">${I('leaf', 'md')} Опора · Анна Соколова</span><span class="sp"></span><img src="seal-compact.svg" width="22" height="22" alt=""><b class="t-sm">Суть</b></header>
        <div class="page page--wide" style="padding-top:28px"><div class="grid g-main g-main--wide"><div>
          <div class="player2"><div class="player2__v" style="background-image:url(img/people/p32.jpg);filter:saturate(.7)"><button class="player2__play" data-act="toast" data-text="Первые 3 минуты — бесплатно" aria-label="Смотреть начало">${I('play', 'xl')}</button><span class="player2__cc">Первые 3 минуты — бесплатно</span></div></div>
          <h1 class="h1 mt24">Эфир «Сон без тревоги»</h1><div class="muted mt8">16 октября · 1 ч 34 мин · Анна Соколова и Дмитрий Орлов · субтитры и расшифровка</div>
          <div class="h3 mt24">Что внутри</div><div class="grid g2 mt12" style="gap:8px">${D.chapters.slice(0, 6).map((c) => `<div class="chap" style="cursor:default"><span class="mono">${c.t}</span>${c.title}</div>`).join('')}</div></div>
          <aside class="pub__card" id="na"><div class="row" style="gap:10px">${I('lock', 'md', 'accent')}<div class="h3">Эта запись — для участников</div></div><div class="t-sm muted mt8">Ссылку вам переслали — она личная. Можно открыть доступ себе:</div>
            <div class="col mt16" style="gap:8px">${[['Запись навсегда', 'главы, расшифровка, поиск', 990], ['Запись + следующий эфир', '6 ноября, «Тревога у подростков»', 1690], ['Курс «Опора»', 'эта запись — урок курса, 6 недель', 14900]].map(([t, s, p], i) => `<button class="fmt2 ${i ? '' : 'is-on'}" data-act="pick2" data-p="${p}"><div class="row"><b>${t}</b><span class="sp"></span><b>${rub(p)}</b></div><div class="t-sm muted">${s}</div></button>`).join('')}</div>
            <div class="mt16">${btn('Оплатить 990 ₽', { kind: 'primary', size: 'lg', block: true, icon: 'credit-card', act: 'buyna', id: 'na-btn', data: 'data-p="990"' })}</div>
            <div class="row mt12" style="justify-content:center"><a class="t-sm accent" data-act="code">У меня есть билет — войти по почте</a></div></aside></div></div></div>`;
    },
  });

  // ───────────── опросник перед встречей ─────────────
  const QS = ['Нервничали, тревожились, были «на взводе»', 'Не могли остановить или контролировать беспокойство', 'Слишком много беспокоились о разных вещах', 'Трудно было расслабиться', 'Были так беспокойны, что трудно усидеть на месте', 'Легко раздражались', 'Боялись, что может случиться что-то ужасное'];
  const AN = ['Ни разу', 'Несколько дней', 'Больше половины дней', 'Почти каждый день'];
  add({
    id: 'questionnaire', after: 'client-cabinet', group: GC, title: 'Опросник перед встречей', icon: 'list-check', frame: 'phone', phase: 'фаза 4', plan: 'Приложение Ж.3 — опросники до и после сессии, динамика в карточке клиента',
    desc: 'За сутки до встречи клиент проходит короткий опросник — семь вопросов за две минуты. Специалист видит динамику рядом с видео. Это не диагноз, а ориентир для разговора.',
    tips: ['Отвечайте на вопросы — счётчик растёт', '«Отправить» — увидите свою динамику'],
    acts: {
      ans: (el) => { $$('button', el.parentElement).forEach((b) => b.classList.toggle('is-on', b === el)); const n = $$('.qz .is-on').length; $('#qz-n').textContent = `${n} из 7`; $('#qz-bar').style.width = (n / 7 * 100) + '%'; $('#qz-go').disabled = n < 7; },
      qzsend: () => { const sum = $$('.qz .is-on').reduce((a, b) => a + +b.dataset.v, 0); $('#qz').innerHTML = `<div class="fade-up" style="text-align:center;padding-top:20px">${I('check-circle', 'xl', 'ok')}<div class="h2 mt12">Спасибо, Мария</div><div class="muted mt8">Сегодня — ${sum} из 21. Неделю назад было 9, в июне — 15.</div><div class="card mt16" style="padding:14px">${C.spark([15, 13, 12, 11, 10, 9, 9, sum], 300, 50)}</div><div class="t-sm muted mt12" style="line-height:1.5">Анна увидит динамику перед встречей. Это не диагноз — ориентир, чтобы поговорить о главном.</div><div class="mt16">${btn('В мой кабинет', { kind: 'primary', block: true, go: 'client-cabinet' })}</div></div>`; },
    },
    render() {
      return `<div class="mob"><div class="mob__top"><div class="sp"><div class="t-sm muted">Перед встречей с Анной · завтра 10:00</div><div class="h2">Как вы последние 2 недели?</div></div></div>
        <div class="mob__body" id="qz"><div class="row t-sm"><span class="sp muted">Как часто вас беспокоило…</span><b id="qz-n">0 из 7</b></div><div class="bar2 mt8"><i id="qz-bar" style="width:0"></i></div>
          ${QS.map((q, i) => `<div class="card mt12 qz" style="padding:14px"><div style="font-size:15px;line-height:1.45">${i + 1}. ${q}</div><div class="qz__a mt12">${AN.map((a, v) => `<button data-act="ans" data-v="${v}">${a}</button>`).join('')}</div></div>`).join('')}
          <div class="mt16 mb24"><button class="btn2 btn2--primary btn2--lg btn2--block" id="qz-go" data-act="qzsend" disabled>Отправить</button></div><div class="t-xs muted" style="text-align:center;padding-bottom:24px">${I('lock', 'xs')} Ответы видит только Анна · опросник GAD-7, общедоступный</div></div></div>`;
    },
  });

  // ───────────── чат клиента со специалистом ─────────────
  add({
    id: 'messenger-mobile', after: 'questionnaire', group: GC, title: 'Чат со специалистом на телефоне', icon: 'messenger', frame: 'phone', pair: 'messenger', phase: 'фаза 4', plan: '§ 13.4 — личные чаты специалист ↔ клиент',
    desc: 'Клиент пишет специалисту там же, где оплачивает и записывается: карточка оплаты, выбор времени, задание с отметкой, голосовые сразу текстом. Статус «на сессии до 11:00» — без ожидания ответа впустую.',
    tips: ['«Оплатить» в карточке', 'Выберите время в карточке записи', 'Микрофон — голосовое с расшифровкой'],
    acts: {
      mpay: (el) => P.payModal(6500, 'Сессия 28 октября', () => { el.closest('.bcard').querySelector('.row').insertAdjacentHTML('beforeend', chip('оплачено', 'ok')); el.remove(); }),
      mslot: (el) => { $$('button', el.parentElement).forEach((b) => b.classList.toggle('is-on', b === el)); toast(`Записано: ${el.textContent} — Анна получила уведомление`); },
      mhw: (el) => { el.classList.toggle('is-done'); el.querySelector('.box').innerHTML = el.classList.contains('is-done') ? I('check', 'xs') : ''; },
      msend: () => { const i = $('#mm-in'); if (!i.value.trim()) return; $('#mm-log').insertAdjacentHTML('beforeend', `<div class="bub2 bub2--me fade-up"><div class="bub2__b">${esc(i.value)}</div><span class="bub2__t">сейчас · доставлено</span></div>`); i.value = ''; const l = $('#mm-log'); l.scrollTop = l.scrollHeight; },
      mvoice: (el) => { el.classList.toggle('is-recording'); if (el.classList.contains('is-recording')) return; $('#mm-log').insertAdjacentHTML('beforeend', `<div class="bub2 bub2--me fade-up"><div class="bub2__b"><div class="row">${I('play', 'sm')}${C.wave(22, 4)}<span class="t-xs mono">0:09</span></div><div class="vtr2">${I('sparkles', 'xs')} Получилось сделать дыхание два раза, стало легче</div></div><span class="bub2__t">сейчас</span></div>`); const l = $('#mm-log'); l.scrollTop = l.scrollHeight; },
    },
    render() {
      return `<div class="mob"><div class="mob__top">${av('anna', 40)}<div class="sp"><div class="b">Анна Соколова</div><div class="t-xs muted">${I('clock', 'xs')} на сессии до 11:00 · ответит после</div></div><button class="btn2 btn2--icon" data-act="toast" data-text="Звонок — в рабочие часы Анны или по её приглашению" aria-label="Позвонить">${I('video')}</button></div>
        <div class="mob__body mm-log" id="mm-log">
          <div class="bub2"><div class="bub2__b">Мария, как прошла неделя? Получилось делать дыхание перед сном?</div><span class="bub2__t">пн 19:10</span></div>
          <div class="bub2 bub2--me"><div class="bub2__b"><div class="row">${I('play', 'sm')}${C.wave(22, 7)}<span class="t-xs mono">0:42</span></div><div class="vtr2">${I('sparkles', 'xs')} Опять не спала перед планёркой, но сделала дыхание и минут через десять уснула</div></div><span class="bub2__t">пн 21:02 · прочитано</span></div>
          <div class="bub2"><div class="bcard"><div class="b">${I('notes', 'sm')} Задание на неделю</div><button class="hw2 mt8" data-act="mhw"><span class="box"></span><span>Три раза записать мысли перед планёркой</span></button><button class="hw2" data-act="mhw"><span class="box"></span><span>Отметить, где в теле тревога</span></button></div><span class="bub2__t">вт 10:05</span></div>
          <div class="bub2"><div class="bcard"><div class="row">${I('credit-card', 'md', 'accent')}<div class="sp"><div class="b">Сессия 28 октября · 6 500 ₽</div><div class="t-sm muted">оплата в одно касание</div></div></div><div class="mt12">${btn('Оплатить', { kind: 'primary', size: 'sm', act: 'mpay' })}</div></div><span class="bub2__t">вт 10:06</span></div>
          <div class="bub2"><div class="bcard"><div class="b">${I('calendar', 'sm')} Выберите время следующей встречи</div><div class="slots2 mt12">${['пн 3 · 10:00', 'вт 4 · 10:00', 'ср 5 · 18:00'].map((s) => `<button data-act="mslot">${s}</button>`).join('')}</div></div><span class="bub2__t">вт 10:06</span></div></div>
        <div class="mm-in">${btn('', { icon: 'paperclip', cls: 'btn2--icon', act: 'toast', data: 'data-text="Файл или фото — останется в переписке"' })}<input class="in" id="mm-in" placeholder="Сообщение Анне…">${btn('', { icon: 'mic', cls: 'btn2--icon recbtn', act: 'mvoice' })}${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'msend' })}</div></div>`;
    },
    mount() { const l = $('#mm-log'); l.scrollTop = l.scrollHeight; },
  });

  // ───────────── кабинет ученика ─────────────
  add({
    id: 'student', after: 'messenger-mobile', group: GC, title: 'Кабинет ученика', icon: 'graduation-cap', frame: 'phone', pair: 'lesson', phase: 'фаза 7', plan: '§ 12.8 — веб-приложение ученика: курсы, задания, офлайн-видео, сертификаты',
    desc: 'Все курсы ученика в одном месте: следующий урок, задания и ответы кураторов, скачанные для дороги видео, сертификат с проверкой по номеру. Один аккаунт на все школы и всех специалистов.',
    tips: ['«Продолжить» — следующий урок', 'Вкладка «Задания» — разбор от куратора', 'Сертификат — проверка по номеру'],
    acts: { stab: (el) => { $$('.ctabs button').forEach((b) => b.classList.toggle('is-on', b === el)); $$('[data-sp]').forEach((p) => (p.hidden = p.dataset.sp !== el.dataset.v)); } },
    render() {
      return `<div class="mob"><div class="mob__top"><div class="sp"><div class="t-sm muted">Мои курсы</div><div class="h2">Ольга</div></div>${av('olga', 40)}</div>
        <div class="mob__body"><div class="cab-next"><div class="t-sm" style="opacity:.85">Курс «Опора» · неделя 2 из 6</div><div class="h2 mt8">Урок 4 · Тело и тревога</div><div class="bar2 mt12" style="background:rgba(255,255,255,.25)"><i style="width:38%;background:#fff"></i></div><div class="t-sm mt8" style="opacity:.85">пройдено 38 % · следующий эфир потока — ср 18:00</div><div class="mt16">${btn('Продолжить', { kind: 'white', size: 'lg', block: true, icon: 'play', go: 'lesson' })}</div></div>
          <div class="seg2 seg2--block ctabs mt16">${[['Курсы', 'c'], ['Задания', 'h'], ['Сертификаты', 's']].map(([t, v], i) => `<button class="${i ? '' : 'is-on'}" data-act="stab" data-v="${v}">${t}</button>`).join('')}</div>
          <div data-sp="c" class="mt12">${li({ lead: `<span class="li__ic">${I('graduation-cap')}</span>`, t: 'Опора: 6 недель работы с тревогой', s: 'Анна Соколова · 38 %', go: 'lesson' })}${li({ lead: `<span class="li__ic">${I('moon-stars')}</span>`, t: 'Сон без тревоги · интенсив', s: 'Анна Соколова · пройден', act: 'toast', data: 'data-text="Курс пройден — сертификат во вкладке «Сертификаты»"' })}<div class="card mt12" style="padding:14px"><div class="row">${I('download', 'md', 'accent')}<div class="sp"><div class="b">Для дороги</div><div class="t-sm muted">2 урока скачаны · 1,2 ГБ · доступны без интернета до конца доступа</div></div></div></div></div>
          <div data-sp="h" class="mt12" hidden><div class="card" style="padding:14px"><div class="row"><b class="sp">Три ситуации тревоги</b>${chip('проверено', 'ok')}</div><div class="t-sm muted mt8">Куратор Елена: «Очень точно про телесные сигналы. В третьей ситуации попробуйте отметить, что помогло хоть немного».</div></div><div class="card mt8" style="padding:14px"><div class="row"><b class="sp">Дневник мыслей · неделя 2</b>${chip('на проверке', 'warn')}</div><div class="t-sm muted mt8">Отправлено голосом вчера · куратор ответит в течение суток</div></div></div>
          <div data-sp="s" class="mt12" hidden><a class="card card--click" data-go="certificate" style="display:block;padding:16px"><div class="row">${I('certificate', 'lg', 'accent')}<div class="sp"><div class="b">Сон без тревоги</div><div class="t-sm muted">№ OPR-2026-0417 · 12 часов · 14 октября</div></div>${I('chevron-right', 'sm', 'subtle')}</div></a><div class="t-xs muted mt8">Работодатель или клиент проверит сертификат по номеру — страница открыта всем.</div></div></div>
        <nav class="mob__tab">${[['graduation-cap', 'Курсы', 1], ['messenger', 'Чаты'], ['calendar', 'Эфиры'], ['user', 'Профиль']].map(([i, t, on]) => `<a class="${on ? 'is-on' : ''}" ${t === 'Чаты' ? 'data-go="messenger-mobile"' : 'data-act="toast" data-text="' + t + '"'}>${I(i, 'md')}${t}</a>`).join('')}</nav></div>`;
    },
  });

  // ───────────── проверка сертификата ─────────────
  add({
    id: 'certificate', after: 'student', group: GC, title: 'Проверка сертификата', icon: 'certificate', phase: 'фаза 7', plan: '§ 12.8 — сертификат со страницей проверки по номеру',
    desc: 'Открытая страница: по номеру видно, кому, за какой курс и сколько часов выдан сертификат и кто его выдал. Подделку видно сразу.',
    tips: ['Номер уже введён — «Проверить»', 'Попробуйте неверный номер'],
    acts: { verify: () => { const v = $('#cert-n').value.trim().toUpperCase(); $('#cert-r').innerHTML = v === 'OPR-2026-0417' ? `<div class="card fade-up" style="padding:24px"><div class="row" style="gap:12px">${I('check-circle', 'xl', 'ok')}<div><div class="h2">Сертификат подлинный</div><div class="muted">выдан платформой «Суть»</div></div></div>
        <div class="kv2 mt16"><span>Кому</span><div>Ольга Белова</div><span>Курс</span><div>«Сон без тревоги» · интенсив</div><span>Объём</span><div>12 академических часов, 3 практических задания</div><span>Дата</span><div>14 октября 2026</div><span>Выдал</span><div>Анна Соколова · ${chip(`${I('shield-check', 'xs')} проверенный специалист`, 'ok')}</div></div></div>` : `<div class="card fade-up" style="padding:24px"><div class="row" style="gap:12px">${I('x-circle', 'xl', 'warn')}<div><div class="h2">Такого номера нет</div><div class="muted">Проверьте номер на сертификате или спросите у выдавшего его специалиста.</div></div></div></div>`; } },
    render() {
      return `<div class="pub"><header class="pub__top"><img src="seal-compact.svg" width="26" height="26" alt=""><b>Суть</b><span class="muted">· проверка сертификата</span></header>
        <div class="page page--narrow" style="padding-top:36px"><h1 class="h1">Проверить сертификат</h1><p class="lead mt8">Номер указан внизу сертификата.</p>
          <div class="row mt24"><input class="in mono" id="cert-n" value="OPR-2026-0417" aria-label="Номер сертификата" style="font-size:16px">${btn('Проверить', { kind: 'primary', size: 'lg', act: 'verify' })}</div><div id="cert-r" class="mt24"></div></div></div>`;
    },
    mount() { this.acts.verify(); $('#cert-n').addEventListener('keydown', (e) => e.key === 'Enter' && this.acts.verify()); },
  });

  // ───────────── второе устройство ─────────────
  add({
    id: 'companion', after: 'viewer-mobile', group: 'Эфир', title: 'Второе устройство', icon: 'device-mobile', frame: 'phone', dark: true, phase: 'фаза 5', plan: 'Приложение И — «Второе устройство» по образцу Companion в Meet',
    desc: 'Эфир идёт на телевизоре или ноутбуке, а телефон — пульт: чат, вопросы, крупные субтитры, реакции и рука. Звука нет — эха не будет.',
    tips: ['Вкладки: чат, вопросы, субтитры', 'Голосуйте за вопросы'],
    acts: {
      ctab: (el) => { $$('.vm2__tabs button').forEach((b) => b.classList.toggle('is-on', b === el)); $$('[data-cp2]').forEach((p) => (p.hidden = p.dataset.cp2 !== el.dataset.v)); },
      cvote: (el) => { const n = el.querySelector('.qv2'); n.textContent = +n.textContent + 1; el.classList.add('is-on'); },
    },
    render() {
      return `<div class="mob vm2"><div style="padding:56px 16px 10px" class="row"><span class="tile-a__i" style="width:44px;height:44px">${I('device-desktop', 'md')}</span><div class="sp"><div class="b">Тревога и опора · в эфире</div><div class="t-sm muted">${I('volume-off', 'xs')} звук идёт на телевизоре · здесь — пульт</div></div></div>
        <div class="vm2__tabs">${[['Субтитры', 's'], ['Чат', 'c'], ['Вопросы', 'q']].map(([t, v], i) => `<button class="${i ? '' : 'is-on'}" data-act="ctab" data-v="${v}">${t}</button>`).join('')}</div>
        <div class="vm2__pane"><div data-cp2="s"><div class="csubs" id="csubs"></div></div><div data-cp2="c" hidden><div class="msgs" id="c-chat"></div></div>
          <div data-cp2="q" hidden>${D.questions.slice(0, 4).map((q) => `<button class="qc" data-act="cvote"><span class="qv2">${q.votes}</span><span class="sp">${esc(q.text)}</span></button>`).join('')}</div></div>
        <div class="vm2__in"><input class="in" placeholder="Сообщение или вопрос…"><button class="vm2__ib" data-act="toast" data-text="Рука поднята — сюда придёт приглашение на сцену" title="Рука">${I('hand', 'md')}</button>${btn('', { icon: 'send', kind: 'primary', cls: 'btn2--icon', act: 'toast', data: 'data-text="Отправлено"' })}</div></div>`;
    },
    mount() {
      P.liveChat($('#c-chat'), false);
      const L = ['Анна: Опора — это не отсутствие тревоги, а способность оставаться в контакте с собой', 'Дмитрий: Если тревога держится больше полугода и мешает спать — это повод прийти к специалисту', 'Анна: Давайте прямо сейчас сделаем упражнение «пять-четыре-три-два-один»'];
      let i = 0; const put = () => { const h = $('#csubs'); if (!h) return; h.insertAdjacentHTML('beforeend', `<p class="fade-up">${esc(L[i++ % L.length])}</p>`); if (h.children.length > 3) h.firstElementChild.remove(); }; put(); every(3200, put);
    },
  });

  // ───────────── участник в сессионном зале ─────────────
  add({
    id: 'breakout-room', after: 'breakout', group: 'Инструменты в комнате', title: 'Участник в сессионном зале', icon: 'users', gentle: true, more: 'guest', phase: 'фаза 5', plan: 'Приложение Ж.2 — залы, тройки со сменой ролей, «позвать ведущего», голос во все залы',
    desc: 'Так зал видит участник: тройка «терапевт — клиент — наблюдатель», своя роль и задание, таймер, сообщения и голос ведущей во все залы, «Позвать ведущую», возврат в общий зал.',
    tips: ['«Позвать ведущую» — она придёт в зал', 'Через 4 секунды ведущая скажет во все залы', '«Задание» — что делает каждая роль'],
    acts: {
      callhost: (el) => { el.classList.add('is-on'); el.querySelector('span').textContent = 'Ведущая идёт'; toast('Анна получила просьбу — придёт через минуту', { icon: 'hand' }); later(2600, () => { const t = $('.st-grid'); t && t.insertAdjacentHTML('beforeend', P.tl('anna', { name: 'Анна · ведущая', cls: 'fade-up' })); toast('Анна в зале', { icon: 'door' }); }); },
      back: () => { toast('Вы вернулись в общий зал'); go('meeting'); },
    },
    render() {
      const roles = [['olga', 'терапевт', 'вы'], ['ivan', 'клиент'], ['kira', 'наблюдатель']];
      const task = `<div class="card" style="padding:14px"><div class="b">Ваша роль — терапевт</div><div class="t-sm muted mt8" style="line-height:1.55">Задайте три открытых вопроса о ситуации клиента. Не советуйте — уточняйте. 8 минут.</div></div><div class="pn__sec">Роли в тройке</div>${[['Клиент', 'приносит реальную, но небольшую ситуацию'], ['Наблюдатель', 'следит за вопросами и в конце даёт обратную связь']].map(([a, b]) => li({ t: a, s: b })).join('')}<div class="mt12">${yuNote('Юя в зале следит за временем: за 2 минуты до смены ролей тихо напомнит. Итог зала увидит только ведущая.')}</div>`;
      return P.room({ top: { title: 'Зал 2 · тройка', sub: '· раунд 1 из 3', clock: '07:42', recLabel: 'Без записи · Юя следит за временем', extra: `<span class="top-pill">${I('timer', 'xs')} смена ролей через 7:42</span>` },
        stage: `<div style="flex:1;display:flex;flex-direction:column;gap:10px;min-width:0"><div class="bo-msg" id="bo-msg" hidden></div><div class="st-grid" data-layout="grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">${roles.map(([id, r, me]) => P.tl(id, { self: !!me, extra: `<span class="tl__role">${r}</span>` })).join('')}</div></div>`,
        panels: P.pn('task', 'Задание', task, { open: true }),
        bar: `${P.rbBase()}${P.rbPanel('task', 'notes', 'Задание', { on: true })}${P.rb('hand', 'Позвать ведущую', 'callhost', { cls: 'rb--core' })}${P.rb('door-exit', 'В общий зал', 'back')}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Выйти')}` });
    },
    mount(root) {
      P.cam.attach(root); let s = 462; every(1000, () => { s = Math.max(0, s - 1); const c = $('#clock'); if (c) c.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; });
      later(4000, () => { const m = $('#bo-msg'); if (!m) return; m.hidden = false; m.innerHTML = `${I('volume')}<span class="sp"><b>Анна во все залы, голосом:</b> «Осталось две минуты, заканчивайте вопросы и переходите к обратной связи»</span>`; });
    },
  });
})();

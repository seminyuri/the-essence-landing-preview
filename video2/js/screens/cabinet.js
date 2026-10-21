(function () {
  const { D, S, add, I, av, esc, rub, num, shell, videoNav, toast, modal, go, later, $, $$, btn, chip, sw, opt, seg, pick, li, kpi, tile, tabs, pane, yuNote, note, page } = P;
  const G = 'Кабинет специалиста';
  const kindGo = { call: 'prejoin', meeting: 'meeting', stage: 'event', practice: 'practice', constellation: 'constellation' };
  const shellV = (on, body) => shell({ module: 'Встречи', active: 'video', compose: { label: 'Начать встречу', icon: 'video', go: 'prejoin' }, nav: videoNav(on), body });

  // подготовка к сессии — Юя говорит языком психолога
  const brief = () => modal(`<div class="row"><span class="yu2 yu2--lg">${I('sparkles', 'lg')}</span><div><div class="t-sm muted">Юя · подготовка к сессии</div><div class="modal2__t" style="padding:0">Мария, 9-я встреча</div></div></div>
    <div class="col mt24" style="gap:16px;font-size:15px;line-height:1.6">
      <div><div class="b">С прошлой встречи</div><div class="muted">Тема — страх оценки. Задание «сказать „нет“ коллеге» в работе.</div></div>
      <div><div class="b">В переписке за неделю</div><div class="muted">17 октября не спала перед планёркой. 19 октября получилось отказаться от лишнего проекта: «было страшно, но я сказала».</div></div>
      <div><div class="b">Как она сегодня</div><div class="muted">Анкета в зале ожидания: 6 из 10, хочет поговорить о работе и сне.</div></div>
      <div><div class="b">Динамика</div><div class="muted">Тревога по опроснику GAD-7: 15 → 7 за восемь встреч.</div></div>
      <div><div class="b">Что предлагаю обсудить</div><div class="muted">Первый успешный отказ как опору. Сон перед планёрками.</div></div></div>
    <div class="modal2__f">${btn('Войти в комнату', { kind: 'primary', size: 'lg', icon: 'video', go: 'prejoin' })}</div><div class="t-xs muted mt12" style="text-align:center">Видно только вам</div>`);

  const IMG = { Эфир: 'p32', Сессия: 'p26', Группа: 'p23', Практика: 'p20' };
  const recCard = (r) => `<a class="rec" data-go="recording"><div class="rec__th" style="background-image:url(img/people/${IMG[r.kind] || 'p32'}.jpg)"><span class="rec__play">${I('play', 'md')}</span><span class="rec__dur">${r.dur}</span></div><div class="rec__b"><div class="rec__t">${esc(r.title)}</div><div class="rec__s">${r.kind} · ${r.date} · ${esc(r.status)}</div></div></a>`;

  // ───────────── главная ─────────────
  add({
    id: 'hub', group: G, title: 'Главная', icon: 'grid', phase: 'фазы 2А–4', plan: '§ 5.11, § 6.1, Приложение К (Телемост)',
    desc: 'Ближайшая сессия и подготовка от Юи, четыре главных действия, расписание, постоянная ссылка, последние записи.',
    tips: ['«Подготовка от Юи» — что было и что обсудить', 'Плитка «Подключиться» — вход по ссылке', 'Строки расписания открывают нужную комнату'],
    acts: {
      brief,
      copy: () => { navigator.clipboard?.writeText('https://the-essence.ai/m/anna').catch(() => {}); toast('Ссылка скопирована'); },
      qr: () => modal(`<div class="modal2__t">Вход с телефона</div><div class="modal2__s">Клиент наводит камеру и входит в браузере, без установки.</div><div style="display:grid;place-items:center;margin-top:20px">${C.qr(220, 11)}</div>`),
      join: () => modal(`<div class="modal2__t">Подключиться к встрече</div><label class="fld"><span class="fld__l">Ссылка или номер встречи</span><input class="in" placeholder="the-essence.ai/m/…"></label><div class="modal2__f">${btn('Подключиться', { kind: 'primary', size: 'lg', go: 'prejoin' })}</div>`),
    },
    render() {
      const rows = D.sessions.map((s) => `<div class="li li--click" data-go="${kindGo[s.kind]}"><div class="li__time"><b>${s.time}</b><span>${s.day}</span></div>${av(s.who, 44)}<div class="li__m"><div class="li__t">${esc(s.title)}</div><div class="li__s">${esc(s.sub)}</div></div>${s.state === 'soon' ? chip('через 36 мин', 'accent') : I('chevron-right', 'md', 'subtle')}</div>`).join('');
      return shellV('hub', `<div class="page">
        <div class="phead"><div class="phead__t"><h1 class="h1">Доброе утро, Анна</h1><div class="phead__sub">Среда, 21 октября. Сегодня две встречи, в четверг — эфир.</div></div></div>
        <div class="next">${av('maria', 64, 'av--ring')}<div class="next__m"><span class="next__in">Через 36 минут</span><div class="next__t">Мария Иванова · 9-я встреча</div><div class="next__s">10:00–11:00 · оплачено · согласие на запись есть · анкета: 6 из 10</div></div>
          ${btn('Подготовка от Юи', { size: 'lg', icon: 'sparkles', act: 'brief', kind: 'white' })}${btn('Войти', { kind: 'primary', size: 'lg', icon: 'video', go: 'prejoin' })}</div>
        <div class="tiles mt16">${tile({ primary: true, icon: 'video', t: 'Начать встречу', s: 'Комната сразу, ссылку — в любой мессенджер', go: 'prejoin' })}${tile({ icon: 'calendar', t: 'Запланировать', s: 'Сессия, группа, практика', go: 'new', params: 'tpl=call' })}${tile({ icon: 'broadcast', t: 'Новый эфир', s: 'Страница, билеты, напоминания', go: 'new', params: 'tpl=paid' })}${tile({ icon: 'link', t: 'Подключиться', s: 'По ссылке или номеру', act: 'join' })}</div>
        <div class="grid g-main mt32">
          <section><div class="sec__h"><h2 class="h2">Расписание</h2><a class="sec__link" data-go="event">Эфир в четверг ${I('arrow-right', 'xs')}</a></div><div class="list">${rows}</div></section>
          <aside class="col" style="gap:16px">
            <div class="card"><div class="card__t">${I('link', 'md', 'accent')} Постоянная ссылка</div><div class="card__s">Одна ссылка на все сессии. Записанные клиенты входят сами, незнакомых Юя оставит в зале ожидания.</div>
              <div class="row mt16"><input class="in mono" value="the-essence.ai/m/anna" readonly style="font-size:14px" aria-label="Ссылка">${btn('', { icon: 'copy', act: 'copy', cls: 'btn2--icon', kind: 'primary' })}</div>
              <div class="card__f">${btn('QR для телефона', { icon: 'qrcode', act: 'qr', kind: 'white', size: 'sm' })}</div></div>
            <div class="card"><div class="card__t"><span class="yu2">${I('sparkles')}</span> Юя за неделю</div>
              <div class="grid g2 mt16" style="gap:14px">${[['214', 'действий'], ['1,4 %', 'вы отменили'], ['3 ч 10 мин', 'сэкономлено на итогах'], ['12', 'задач в задачник']].map(([v, l]) => `<div><div class="h2">${v}</div><div class="t-sm muted">${l}</div></div>`).join('')}</div>
              <div class="card__f">${btn('Доверие и журнал', { go: 'yuia', kind: 'white', size: 'sm' })}</div></div>
          </aside></div>
        <section class="sec"><div class="sec__h"><h2 class="h2">Последние записи</h2><a class="sec__link" data-go="recordings">Все записи ${I('arrow-right', 'xs')}</a></div><div class="recs">${D.recordings.slice(0, 3).map(recCard).join('')}</div></section></div>`);
    },
  });

  // ───────────── день специалиста на телефоне ─────────────
  add({
    id: 'hub-mobile', group: G, title: 'День специалиста на телефоне', icon: 'device-mobile', frame: 'phone', pair: 'hub', phase: 'фаза 4', plan: '§ 6.1, § 13.4',
    desc: 'Ближайшая сессия и вход в одно касание, подготовка от Юи, расписание, новые сообщения клиентов. Веб-приложение на экране «Домой».',
    acts: { brief, tab: (el) => toast(`Раздел «${el.dataset.text}»`) },
    render() {
      return `<div class="mob"><div class="mob__top"><div class="sp"><div class="t-sm muted">Среда, 21 октября</div><div class="h1" style="font-size:26px">Сегодня</div></div>${av('anna', 40)}</div>
        <div class="mob__body"><div class="cab-next"><div class="t-sm" style="opacity:.85">Через 36 минут</div><div class="h2" style="margin-top:4px">Мария Иванова</div><div class="t-sm" style="opacity:.85">10:00–11:00 · 9-я встреча · оплачено</div>
          <div class="mt16">${btn('Войти', { kind: 'white', size: 'lg', icon: 'video', go: 'call-mobile', block: true })}</div><button class="btn2 btn2--block mt8" data-act="brief">${I('sparkles')} Подготовка от Юи</button></div>
          <div class="h3 mt24">Дальше сегодня и на неделе</div><div class="list mt8">${D.sessions.slice(1, 4).map((s) => li({ lead: `<div class="li__time"><b>${s.time}</b><span>${s.day}</span></div>`, t: esc(s.title.split(' · ')[0]), s: esc(s.sub.split(' · ')[0]), go: kindGo[s.kind] })).join('')}</div>
          <div class="h3 mt24">Новые сообщения</div><div class="list mt8">${D.messengerChats.filter((c) => c.unread).slice(0, 3).map((c) => li({ lead: c.who ? av(c.who, 44) : `<span class="li__ic">${I('users')}</span>`, t: esc(c.who ? P.person(c.who).name : c.title), s: esc(c.last), right: `<span class="ub">${c.unread}</span>`, go: 'messenger' })).join('')}</div></div>
        <nav class="mob__tab">${[['grid', 'Сегодня', 1], ['messenger', 'Чаты'], ['play', 'Записи'], ['wallet', 'Деньги'], ['dots', 'Ещё']].map(([i, t, on]) => `<a class="${on ? 'is-on' : ''}" data-act="tab" data-text="${t}">${I(i, 'md')}${t}</a>`).join('')}</nav></div>`;
    },
  });

  // ───────────── мастер новой встречи ─────────────
  const TPL = {
    call: { icon: 'user', title: 'Индивидуальная сессия', kind: 'Разговор 1:1', size: '2 человека', wait: 2, money: 'session' },
    practice: { icon: 'leaf', title: 'Групповая практика', kind: 'Встреча в режиме практики', size: 'до 100', wait: 1 },
    webinar: { icon: 'gift', title: 'Эфир с подарками', kind: 'Сцена и зрители', size: 'до 3 000', wait: 0, money: 'donate' },
    paid: { icon: 'ticket', title: 'Платный эфир', kind: 'Сцена и зрители', size: 'до 3 000', wait: 1, money: 'tickets' },
    constellation: { icon: 'node', title: 'Расстановка', kind: 'Встреча с полем расстановки', size: 'до 20', wait: 2 },
  };
  add({
    id: 'new', group: G, title: 'Новая встреча из шаблона', icon: 'template', phase: 'фазы 2А / 4', plan: '§ 3 п. 13 — шаблоны вместо настроек',
    desc: 'Пять шагов: шаблон, время, вход и деньги, запись и Юя, готово. Всё безопасно по умолчанию — менять ничего не обязательно.',
    tips: ['Выберите другой шаблон — изменится набор включённого', '«Дальше» — следующий шаг', 'На последнем шаге — «Создать»'],
    acts: {
      tpl: (el) => go('new', { tpl: el.dataset.v, step: 0 }),
      step: (el) => go('new', { tpl: P.current.params.tpl || 'paid', step: el.dataset.s }),
      create: () => { const t = P.current.params.tpl || 'paid'; toast(`Создано: «${TPL[t].title}». Ссылки, напоминания и страница готовы`); go(t === 'paid' || t === 'webinar' ? 'event' : 'hub'); },
    },
    render(p) {
      const k = TPL[p.tpl] ? p.tpl : 'paid', t = TPL[k], step = Math.min(4, +(p.step || 0));
      const names = ['Шаблон', 'Когда', 'Вход и деньги', 'Запись и Юя', 'Готово'];
      const steps = `<div class="steps">${names.map((n, i) => `<button class="${i === step ? 'is-on' : ''} ${i < step ? 'is-done' : ''}" data-act="step" data-s="${i}"><span>${i < step ? I('check', 'xs') : i + 1}</span>${n}</button>`).join('')}</div>`;
      const isWeb = k === 'paid' || k === 'webinar';
      const panes = [
        `<div class="pick" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${Object.entries(TPL).map(([key, v]) => `<button class="pick__i ${key === k ? 'is-on' : ''}" data-act="tpl" data-v="${key}" style="flex-direction:column;gap:14px"><span class="tile-a__i">${I(v.icon, 'lg')}</span><span><span class="pick__t" style="display:block;font-size:17px">${v.title}</span><span class="pick__s" style="display:block">${v.kind} · ${v.size}</span></span></button>`).join('')}</div>
          <div class="card mt24"><div class="card__t">Что будет включено</div><ul style="margin:12px 0 0;padding-left:20px;line-height:1.9;font-size:15px">
          <li>Зал ожидания: ${['все входят сразу', 'записанные и оплатившие — сразу, остальные ждут', 'ждут все, кроме вас'][t.wait]}</li><li>Запись и расшифровка — с плашкой для всех и согласием на входе</li>
          ${isWeb ? '<li>Страница с регистрацией, напоминания в почту, Telegram и MAX</li>' : '<li>Личная ссылка и приглашение в календарь</li>'}${{ donate: '<li>Кнопка «Поддержать ведущую» и цель сбора</li>', tickets: '<li>Билеты, доступ к записи по билету, предложение в эфире</li>', session: '<li>Оплата сессии до входа, анкета «как вы сегодня» в зале ожидания</li>' }[t.money] || ''}
          <li>Юя впускает по правилам, следит за чатом и временем, делает итоги</li></ul></div>`,
        `<div class="grid g2" style="gap:32px"><div><label class="fld" style="margin-top:0"><span class="fld__l">Название</span><input class="in" value="${isWeb ? 'Тревога и опора: как вернуть себе почву' : t.title}"></label>
          <div class="row"><label class="fld sp"><span class="fld__l">Дата</span><input class="in" value="23.10.2026"></label><label class="fld" style="width:130px"><span class="fld__l">Начало</span><input class="in" value="19:00"></label></div>
          <label class="fld"><span class="fld__l">Длительность</span><select class="in"><option>1 ч 30 мин</option><option>60 мин</option><option>45 мин</option></select></label>
          <div class="fld"><span class="fld__l">Повтор</span>${seg(['Один раз', 'Каждую неделю', 'Серия из 6'])}</div></div>
          <div><div class="fld" style="margin-top:0"><span class="fld__l">Ведущие</span><div class="card" style="padding:8px 12px">${['anna', 'dmitry', 'elena'].map((id, i) => li({ lead: av(id, 40), t: P.person(id).name, s: ['Ведущая', 'Докладчик · войдёт в закулисье', 'Соведущая · подменит, если у вас пропадёт связь'][i] })).join('')}</div></div>
          <div class="mt12">${btn('Пригласить докладчика', { icon: 'user-plus', act: 'toast', data: 'data-text="Приглашение ушло письмом и в Telegram"' })}</div>
          <div class="mt16">${note('globe', 'Каждый увидит время в своём поясе: Берлин — 18:00, Тель-Авив — 19:00, Нью-Йорк — 12:00.')}</div></div></div>`,
        `<div class="grid g2" style="gap:32px"><div><div class="h3">Кто входит сразу</div><div class="mt12">${pick([{ t: 'Все', s: 'Для открытых эфиров' }, { t: 'Записанные и оплатившие', s: 'Остальные ждут, Юя покажет их вам' }, { t: 'Только после вашего «впустить»', s: 'Для сессий и закрытых групп' }], t.wait)}</div>
          <div class="mt16">${opt('Личные ссылки', 'Пересланная ссылка не пустит второго человека', true)}${opt('Водяной знак с почтой зрителя', 'Для платных эфиров', false, { text: 'Водяной знак включён' })}</div></div>
          <div><div class="h3">Деньги</div>${opt('Билеты', D.event.tickets.map((x) => `${x.name} — ${x.price ? rub(x.price) : 'бесплатно'}`).join(' · '), t.money === 'tickets')}${opt('Подарки ведущей', 'Подарок ничего не открывает', !!t.money && t.money !== 'session')}${opt('Предложение в эфире', 'Курс «Опора» — по кнопке или в 20:10', isWeb)}${opt('Карты других стран', 'Комиссия около 10 % видна вам заранее', true)}
          <div class="mt12">${note('wallet', 'С билета 990 ₽ вы получите <b>891 ₽</b>. Чеки пробивает платформа как ваш агент.')}</div></div></div>`,
        `<div class="grid g2" style="gap:32px"><div>${opt('Запись по дорожкам', 'Каждый говорящий отдельно — точная расшифровка', true)}${opt('Для монтажа', 'Отдельные дорожки, ровная частота кадров', false, { text: 'Запись для монтажа включена' })}${opt('Субтитры на русском', 'Перевод у зрителя — в его браузере', true)}${opt('Итоги через 10 минут', 'Главы, вопросы, задачи — в задачник и базу знаний', true)}</div>
          <div><div class="h3">Что Юя делает сама</div><div class="mt12">${pick([{ t: 'Только подсказывает', s: 'Ничего не делает без вас' }, { t: 'Обратимое — сама', s: 'Впустить, скрыть сообщение, выключить микрофон. Удалить человека — с вашего «да»' }, { t: 'Всё сама', s: 'Предохранители работают всегда' }], 1)}</div>
          ${isWeb ? `<div class="h3 mt24">Где проводить</div><div class="mt12">${pick([{ t: 'Подобрать по странам зрителей', s: 'Москва, Франкфурт, Нью-Йорк; Тель-Авив — на время эфира' }, { t: 'Только Москва' }], 0)}</div>` : ''}</div></div>`,
        `<div class="card card--hero" style="text-align:center;padding:48px 24px"><span class="yu2 yu2--lg" style="margin:0 auto">${I('check', 'lg')}</span><div class="h1 mt16">Всё готово</div><div class="lead mt8" style="max-width:560px;margin-left:auto;margin-right:auto">Страница, личные ссылки, напоминания и проверка перед эфиром создадутся сразу.</div>
          <div class="row mt24" style="max-width:520px;margin-left:auto;margin-right:auto"><input class="in mono" value="the-essence.ai/e/trevoga-i-opora" readonly style="font-size:14px" aria-label="Ссылка">${btn('Создать', { kind: 'primary', size: 'lg', act: 'create' })}</div></div>`,
      ];
      return shellV('new', page({ title: `Новая встреча · ${t.title}`, sub: `${t.kind} · ${t.size}`, body: `${steps}<div class="fade-up">${panes[step]}</div>
        <div class="row mt32">${step > 0 ? btn('Назад', { icon: 'arrow-left', act: 'step', data: `data-s="${step - 1}"`, size: 'lg' }) : ''}<span class="sp"></span>${step < 4 ? btn('Дальше', { kind: 'primary', size: 'lg', act: 'step', data: `data-s="${step + 1}"` }) : ''}</div>` }));
    },
  });

  // ───────────── эфир: подготовка ─────────────
  const CHECKS = ['Московские узлы — свободно 74 % мощности', 'Узлы во Франкфурте и Нью-Йорке — 41 и 118 мс', 'Запись — готова', 'Запасной поток — свежий', 'Связь из России, Европы, США — есть', 'Сайт отвечает быстро — 182 мс', 'Субтитры — задержка 0,6 с', 'Юя — задание принято', 'Хранилище — 1,8 ТБ свободно', 'Нагрузка 3 000 зрителей — пройдена'];
  add({
    id: 'event', group: G, title: 'Эфир: подготовка', icon: 'presentation', phase: 'фазы 2А–3', plan: '§ 5.11, § 5.21–5.22, § 5.32',
    desc: 'Регистрации и страны зрителей, участники, билеты и предложения, напоминания, проверка перед эфиром одной кнопкой, оформление.',
    tips: ['Вкладка «Проверка» → «Запустить»', 'Юя предлагает узел в Тель-Авиве', '«Оформление» — цвет сразу в превью'],
    acts: {
      runcheck: (el) => { el.disabled = true; el.innerHTML = `${I('refresh', 'sm', 'spin')} Проверяю…`; $$('.chk2').forEach((c, i) => later(260 * (i + 1), () => { c.classList.add('is-ok'); c.querySelector('.chk2__s').innerHTML = I('check-circle', 'md'); })); later(260 * 11, () => { el.disabled = false; el.innerHTML = `${I('check')} Готово к эфиру`; toast('Проверка пройдена: 10 из 10'); }); },
      region: (el) => { el.outerHTML = chip('Узел в Тель-Авиве поднимется на время эфира', 'ok'); toast('Узел поднимется за 30 минут до эфира и выключится после'); },
      color: (el) => { $$('.swatch').forEach((s) => s.classList.toggle('is-on', s === el)); $('.bprev').style.setProperty('--brand', el.dataset.c); },
    },
    render() {
      const e = D.event;
      const regs = [120, 180, 260, 340, 410, 520, 690, 880, 1040, 1310, 1600, 1980, 2400, 2847];
      return shellV('event', page({ wide: true, crumbs: `<a data-go="hub">Главная</a>${I('chevron-right', 'xs')}<span>Эфиры</span>`, title: esc(e.title), sub: `${e.date}, ${e.time} ${e.tz} · ${e.duration} · Анна Соколова и Дмитрий Орлов`,
        actions: `${btn('Страница эфира', { icon: 'external-link', go: 'event-page' })}${btn('Открыть закулисье', { kind: 'primary', icon: 'broadcast', go: 'backstage' })}`,
        body: `<div class="grid g4">${kpi('Регистрации', num(e.registered), '+312 за сутки')}${kpi('Билеты', '421', '418 300 ₽ · VIP осталось 7')}${kpi('Подарки до эфира', rub(S.raised), `цель ${rub(D.donationGoal.goal)}`)}${kpi('Напоминания', '98,6 %', 'доставлено')}</div>
        <div class="mt32">${tabs('ev', ['Обзор', 'Участники', 'Билеты и предложения', 'Напоминания', 'Проверка', 'Оформление'])}
        ${pane('ev', 0, `<div class="grid g-main"><div class="card"><div class="card__t">Регистрации по дням</div><div class="card__s">Больше всего — из Telegram-канала (41 %) и рассылки (27 %)</div><div class="mt16">${C.area(regs, { h: 230, labels: ['10 окт', '13', '16', '19', '21 окт'], marks: [{ at: .55, label: 'рассылка' }, { at: .86, label: 'анонс' }] })}</div></div>
          <div class="card"><div class="card__t">Где зрители</div><div class="mt8">${e.countries.map((c) => `<div class="row" style="padding:9px 0;font-size:15px"><span class="sp">${c.name}</span><b class="num">${c.share} %</b></div>`).join('')}</div>
          <div class="mt16">${yuNote('8 % зрителей в Израиле. Поднять узел в Тель-Авиве на время эфира — задержка станет 31 мс вместо 74.')}</div><div class="mt12">${btn('Поднять узел', { kind: 'primary', act: 'region', block: true })}</div></div></div>`)}
        ${pane('ev', 1, `<div class="row row--wrap" style="margin-bottom:16px"><input class="in" placeholder="Поиск по имени и почте" style="max-width:360px">${seg(['Все', 'Оплатили', 'Бесплатно'])}<span class="sp"></span>${btn('Выгрузить', { icon: 'download', act: 'toast', data: 'data-text="Выгрузка готова — 2 847 строк"' })}</div>
          <div class="card card--white card--flush"><table class="tbl2"><thead><tr><th>Участник</th><th>Билет</th><th>Город</th><th>Откуда узнал</th><th class="r">Когда</th></tr></thead><tbody>${['olga|С записью|Екатеринбург|Telegram-канал|21 окт', 'lev|Разбор в эфире|Тель-Авив|рассылка|20 окт', 'sofia|Бесплатный|Мадрид|Instagram|20 окт', 'nina|С записью|Казань|сайт|19 окт', 'kate|С записью|Берлин|рассылка|18 окт'].map((r) => { const [w, t, c, s, d] = r.split('|'); return `<tr><td><div class="row" style="gap:10px">${av(w, 32)}${P.person(w).name}</div></td><td>${chip(t, t === 'Бесплатный' ? '' : 'accent')}</td><td>${c}</td><td class="muted">${s}</td><td class="r muted">${d}</td></tr>`; }).join('')}</tbody></table></div>`)}
        ${pane('ev', 2, `<div class="grid g2"><div class="card"><div class="card__t">Билеты</div><div class="list mt8">${e.tickets.map((x) => li({ t: `${x.name} · ${x.price ? rub(x.price) : 'бесплатно'}`, s: x.note + (x.left ? ` · осталось ${x.left}` : ''), right: btn('', { icon: 'edit', kind: 'ghost', cls: 'btn2--icon', act: 'toast', data: 'data-text="Редактор билета"' }) })).join('')}</div><div class="mt12">${note('lock-open', 'Доступ к записи даёт только билет. Подарок ничего не открывает — иначе он перестаёт быть подарком.')}</div></div>
          <div class="card"><div class="card__t">Предложения в эфире</div><div class="list mt8">${D.offers.map((o) => li({ t: esc(o.title), s: `${rub(o.price)} · ${o.id === 'course' ? 'в 20:10 и по кнопке' : 'по кнопке'}` })).join('')}</div><div class="card__f">${btn('Новое предложение', { icon: 'plus', go: 'sales' })}</div></div></div>`)}
        ${pane('ev', 3, `<div class="card"><div class="card__t">Напоминания</div><div class="card__s">Это сценарий: менять можно словами через Юю</div><div class="mt12">${[['За сутки', 'почта, Telegram, MAX, уведомление в браузере', '2 806 из 2 847 доставлено', 1], ['За час', 'Telegram, MAX, уведомление', '23 окт, 18:00'], ['За 5 минут', 'вход в одно касание', '23 окт, 18:55'], ['«Мы начали»', 'тем, кто не вошёл за 3 минуты', '19:03'], ['«Запись готова»', 'почта и боты — по билету', 'через 10 минут после конца'], ['«Не смогли прийти?»', 'запись и предложение', 'через 2 часа']].map(([a, b, c, d]) => `<div class="tline ${d ? 'is-done' : ''}"><span class="tline__d"></span><div class="sp"><div class="b">${a}</div><div class="t-sm muted">${b}</div></div><span class="t-sm ${d ? 'ok' : 'muted'}">${c}</span></div>`).join('')}</div>
          <div class="card__f">${btn('Прислать себе тест', { icon: 'send', act: 'toast', data: 'data-text="Тест отправлен вам в почту, Telegram и MAX"' })}${btn('Открыть сценарий', { icon: 'automation', go: 'scenarios', kind: 'ghost' })}</div></div>`)}
        ${pane('ev', 4, `<div class="grid g-main"><div class="card"><div class="row row--wrap"><div class="sp"><div class="card__t">Проверка перед эфиром</div><div class="card__s">Узлы, запись, запасной поток, связь из каждого региона, субтитры и Юя</div></div>${btn('Запустить', { kind: 'primary', icon: 'play', act: 'runcheck', size: 'lg' })}</div><div class="mt12">${CHECKS.map((c) => `<div class="chk2"><span class="chk2__s">${I('circle', 'md')}</span><span>${c}</span></div>`).join('')}</div></div>
          <div class="card"><div class="card__t">Чек-лист ведущей</div><div class="mt8">${['Закулисье с Дмитрием в 18:30', 'Генеральный прогон 21 окт — пройден', 'Предложение «Курс Опора» в 20:10', 'Дежурный инженер на связи'].map((x, i) => `<label class="row" style="padding:10px 0;font-size:15px;cursor:pointer"><input type="checkbox" ${i === 1 ? 'checked' : ''} style="width:20px;height:20px">${x}</label>`).join('')}</div></div></div>`)}
        ${pane('ev', 5, `<div class="grid g2"><div class="card"><div class="card__t">Бренд</div><div class="fld"><span class="fld__l">Цвет</span><div class="row">${['#7A5340', '#C77A8A', '#5C7E5A', '#4A7B92', '#B8623E'].map((c, i) => `<button class="swatch ${i ? '' : 'is-on'}" data-act="color" data-c="${c}" style="--c:${c}" aria-label="цвет ${c}"></button>`).join('')}</div></div>
            <label class="fld"><span class="fld__l">Свой адрес</span><input class="in" value="live.opora-anna.ru"></label><div class="fld"><span class="fld__l">Язык страницы и комнаты</span>${seg(['Русский', 'English', 'Как у зрителя'])}</div>${opt('Плашки с регалиями', '', true)}${opt('Бегущая строка', '', true)}${opt('Показывать число зрителей', '', false)}</div>
          <div class="card"><div class="card__t">Так увидят зрители</div><div class="bprev mt16" style="--brand:#7A5340;background-image:url(img/people/p32.jpg)"><span class="bprev__plate"><b>Анна Соколова</b>психолог, КПТ</span><span class="bprev__logo">Опора</span></div></div></div>`)}</div>` }));
    },
  });

  // ───────────── записи ─────────────
  add({
    id: 'recordings', group: G, title: 'Записи', icon: 'play', phase: 'фазы 2Б / 4', plan: '§ 5.14, § 5.12.4',
    desc: 'Все записи и поиск по словам внутри расшифровок: находит момент с точностью до секунды.',
    acts: { find: () => { const v = $('#recq').value.trim(); $('#hits').innerHTML = v ? `<div class="card mt16"><div class="card__t">${I('search', 'md')} «${esc(v)}» — 2 совпадения</div><div class="list mt8">${[['Эфир «Сон без тревоги»', '58:22', 'Дмитрий: «…панические атаки ночью часто связаны с гипервентиляцией…»'], ['Мария, 7-я встреча', '21:40', 'Мария: «…просыпаюсь в четыре утра, и сердце колотится…»']].map(([a, t, q]) => li({ lead: `<span class="li__ic mono" style="width:64px">${t}</span>`, t: a, s: q, go: 'recording' })).join('')}</div></div>` : ''; } },
    render() {
      return shellV('recordings', page({ title: 'Записи', sub: '48 записей · хранятся в России', actions: `<div class="row"><input class="in" id="recq" value="панические атаки ночью" style="width:min(320px, 100%)" aria-label="Поиск по расшифровкам">${btn('Найти', { kind: 'primary', icon: 'search', act: 'find' })}</div>`,
        body: `<div id="hits"></div><div class="mt24">${seg(['Все', 'Эфиры', 'Сессии', 'Группы', 'Практики'])}</div><div class="recs mt16">${D.recordings.map(recCard).join('')}</div>
          <div class="card mt24"><div class="row row--wrap"><div class="sp"><div class="card__t">Хранилище: 182 из 500 ГБ</div><div class="card__s">Записи сессий хранятся 90 дней, затем удаляются. Предупредим за 30 дней до заполнения.</div></div><div class="bar2" style="width:220px"><i style="width:36%"></i></div></div></div>` }));
    },
    mount() { this.acts.find(); $('#recq').addEventListener('keydown', (e) => e.key === 'Enter' && this.acts.find()); },
  });

  // ───────────── страница записи ─────────────
  add({
    id: 'recording', group: G, title: 'Страница записи', icon: 'file-text', phase: 'фаза 2Б', plan: '§ 5.14, § 5.22, § 12.8',
    desc: 'Плеер с главами, расшифровка (нажатие на фразу — перемотка), повтор с чатом, итоги Юи, доступ по билету, «Сделать уроком», нарезка роликов.',
    tips: ['Нажмите на фразу в расшифровке', '«Повтор с чатом»', '«Сделать уроком»'],
    acts: {
      seek: (el) => { $$('.trl').forEach((l) => l.classList.toggle('is-on', l.dataset.t === el.dataset.t)); $('#pt').textContent = el.dataset.t; $('#pf').style.width = (el.dataset.p || 30) + '%'; },
      play: (el) => { const on = el.innerHTML.includes('#play'); el.innerHTML = I(on ? 'pause' : 'play', 'xl'); },
      lesson: () => modal(`<div class="modal2__t">Сделать уроком</div><div class="modal2__s">Запись встанет уроком с главами, субтитрами и поиском. Вопросы эфира Юя превратит в задание.</div>
        <label class="fld"><span class="fld__l">Курс</span><select class="in"><option>Опора: 6 недель работы с тревогой</option></select></label><label class="fld"><span class="fld__l">Модуль</span><select class="in"><option>Неделя 1 · Тревога как сигнал</option></select></label>${opt('Вырезать блок продаж', '1:12:05–1:19:40 — ученикам он уже не нужен', true)}
        <div class="modal2__f">${btn('Добавить в курс', { kind: 'primary', size: 'lg', go: 'school' })}</div>`),
      clips: () => modal(`<div class="modal2__t">Моменты для соцсетей</div><div class="modal2__s">Юя нашла их по реакциям зрителей и вопросам.</div><div class="list mt16">${[['07:40', 'Тревога или расстройство', '0:48'], ['23:35', 'Упражнение «5-4-3-2-1»', '1:02'], ['41:10', '«Опора — не отсутствие тревоги»', '0:31']].map(([t, a, d]) => li({ lead: `<span class="mono accent">${t}</span>`, t: a, s: `вертикальное видео · субтитры · ${d}`, right: sw(true) })).join('')}</div><div class="modal2__f">${btn('Собрать ролики', { kind: 'primary', size: 'lg', act: 'toast', data: 'data-text="Пришлю в Telegram через 4 минуты"' })}</div>`),
      replay: (el) => { el.classList.toggle('btn2--primary'); const h = $('#replay'); h.innerHTML = ''; if (!el.classList.contains('btn2--primary')) return;
        [['olga', 'Добрый вечер из Екатеринбурга', '00:12'], ['vera', 'Где граница, когда пора к врачу?', '07:51'], ['yana', 'подарила 500 ₽', '1:13:02']].forEach(([w, t, at], i) => later(700 * (i + 1), () => h.insertAdjacentHTML('beforeend', `<div class="row fade-up" style="padding:6px 0"><span class="mono t-sm muted" style="width:64px">${at}</span>${av(w, 28)}<span>${t}</span></div>`))); },
    },
    render() {
      const pos = [0, 2, 8, 16, 25, 44, 62, 77], cpos = [0, 8, 25, 44, 62, 69, 77];
      return shellV('recordings', page({ wide: true, crumbs: `<a data-go="recordings">Записи</a>${I('chevron-right', 'xs')}<span>Эфир «Сон без тревоги»</span>`, title: 'Эфир «Сон без тревоги»', sub: '16 октября · 1 ч 34 мин · 3 120 просмотров',
        actions: `${btn('Повтор с чатом', { icon: 'message-circle', act: 'replay' })}${btn('Нарезать ролики', { icon: 'wand', act: 'clips' })}${btn('Сделать уроком', { kind: 'primary', icon: 'graduation-cap', act: 'lesson' })}`,
        body: `<div class="grid g-main g-main--wide"><div>
          <div class="player2"><div class="player2__v" style="background-image:url(img/people/p32.jpg)"><button class="player2__play" data-act="play" aria-label="Играть">${I('play', 'xl')}</button><span class="player2__cc">Опора — это способность оставаться в контакте с собой</span></div>
            <div class="player2__bar"><span class="mono" id="pt">41:10</span><div class="player2__track"><i id="pf" style="width:44%"></i>${cpos.map((l) => `<b style="left:${l}%"></b>`).join('')}</div><span class="mono muted">1:34:12</span>${seg(['1×', '1,5×', '2×'])}</div></div>
          <div id="replay" class="mt12"></div>
          <div class="h2 mt32">Главы</div><div class="grid g2 mt12" style="gap:8px">${D.chapters.map((c, i) => `<a class="chap" data-act="seek" data-t="${c.t}" data-p="${cpos[i]}"><span class="mono">${c.t}</span>${c.title}</a>`).join('')}</div>
          <div class="card mt24"><div class="row row--wrap"><div class="sp"><div class="card__t">Доступ к записи</div><div class="card__s">Бесплатно 3 дня — всем зарегистрированным. Навсегда — с билетом «С записью». Отдельно — 990 ₽.</div></div>${btn('Изменить', { kind: 'white', act: 'toast', data: 'data-text="Правила доступа — как у билетов"' })}</div></div></div>
          <aside class="card card--white card--flush"><div style="padding:16px 16px 0">${tabs('rt', ['Расшифровка', 'Итоги Юи', 'Вопросы'])}</div>
            ${pane('rt', 0, `<div style="padding:0 8px 12px;max-height:68vh;overflow:auto">${D.transcript.map((l, i) => `<div class="trl ${l.t === '41:10' ? 'is-on' : ''}" data-act="seek" data-t="${l.t}" data-p="${pos[i]}"><div class="row" style="gap:8px">${av(l.s, 26)}<b class="t-sm">${P.person(l.s).short}</b><span class="mono t-xs muted">${l.t}</span></div><p>${l.text}</p></div>`).join('')}</div>`)}
            ${pane('rt', 1, `<div style="padding:0 20px 20px;font-size:15px;line-height:1.7"><div class="b">Главное</div><div class="muted">Тревога — сигнал. Граница с расстройством — дольше полугода и мешает сну, работе, отношениям.</div><div class="b mt16">Практики</div><div class="muted">«5-4-3-2-1», дыхание с долгим выдохом, дневник тревоги.</div><div class="b mt16">Задачи</div>${['Выложить упражнение в материалы курса', 'Эфир про подростков — спросили 14 человек'].map((t) => `<div class="row mt8">${I('square-check', 'md', 'accent')}<span>${t}</span></div>`).join('')}<div class="mt16">${note('clock', 'Итоги готовы через 7 минут после конца эфира')}</div></div>`)}
            ${pane('rt', 2, `<div style="padding:0 16px 16px">${D.questions.map((q) => li({ lead: `<span class="li__ic b">${q.votes}</span>`, t: esc(q.text) })).join('')}</div>`)}</aside></div>` }));
    },
  });

  // ───────────── отчёт ─────────────
  add({
    id: 'report', group: G, title: 'Отчёт после эфира', icon: 'chart-bar', phase: 'фазы 2Б–3', plan: '§ 5.11, § 5.22',
    desc: 'Кто пришёл и сколько был, воронка до оплаты, выручка, связь по регионам, что решила Юя, сегменты для следующего шага.',
    acts: { segment: (el) => toast(`Сегмент «${el.dataset.s}» создан — его можно взять в рассылку или сценарий`, { icon: 'users' }) },
    render() {
      const pres = [200, 900, 1500, 1900, 2210, 2380, 2418, 2390, 2350, 2310, 2280, 2200, 2120, 2240, 2260, 2050, 1880, 1700];
      return shellV('report', page({ wide: true, title: 'Отчёт: «Сон без тревоги»', sub: '16 октября · собран через 7 минут после эфира', actions: `${btn('PDF', { icon: 'download', act: 'toast', data: 'data-text="Отчёт отправлен на почту"' })}${btn('Что делать дальше', { kind: 'primary', icon: 'automation', go: 'scenarios' })}`,
        body: `<div class="grid g4">${kpi('Пришли', '1 912', '67 % зарегистрированных')}${kpi('Больше всего сразу', '2 418', 'на 41-й минуте')}${kpi('Выручка', '1 297 600 ₽', 'билеты, курс, подарки')}${kpi('Оценка', '4,8', '1 104 оценки')}</div>
        <div class="card mt16"><div class="card__t">Сколько было в эфире</div><div class="mt16">${C.area(pres, { h: 240, labels: ['19:00', '19:20', '19:40', '20:00', '20:20', '20:34'], marks: [{ at: .12, label: 'Дмитрий на сцене' }, { at: .62, label: 'вопросы' }, { at: .77, label: 'курс' }] })}</div></div>
        <div class="grid g2 mt16"><div class="card"><div class="card__t">От страницы до оплаты</div>${C.funnel([{ l: 'Открыли страницу', v: 9840 }, { l: 'Зарегистрировались', v: 2847 }, { l: 'Пришли', v: 1912 }, { l: 'Досмотрели половину', v: 1410 }, { l: 'Открыли предложение', v: 412 }, { l: 'Оплатили курс', v: 67 }])}</div>
          <div class="card"><div class="card__t">Связь по регионам</div><div class="card__s">Цели: видео не позже 0,5 с, вход с первой попытки — не меньше 98 %</div><table class="tbl2 mt12"><thead><tr><th>Регион</th><th class="r">Зрителей</th><th class="r">Задержка</th><th class="r">С 1-й попытки</th></tr></thead><tbody>${[['Москва', '1 186', '0,31 с', '99,4 %'], ['Франкфурт', '402', '0,38 с', '99,1 %'], ['Тель-Авив', '153', '0,42 с', '98,7 %'], ['Нью-Йорк', '134', '0,47 с', '98,5 %']].map((r) => `<tr><td>${r[0]}</td><td class="r">${r[1]}</td><td class="r">${r[2]}</td><td class="r">${r[3]}</td></tr>`).join('')}</tbody></table></div></div>
        <div class="grid g2 mt16"><div class="card"><div class="card__t"><span class="yu2">${I('sparkles')}</span> Что Юя решила за зрителей</div><div class="list mt8">${[['38', 'Не было звука — громкость вкладки на нуле', 'ответила лично за 6 секунд'], ['21', 'Замирания на мобильном интернете', 'снизила качество, потом вернула'], ['14', 'Офисная сеть режет видео', 'перевела на запасной поток']].map(([n, a, b]) => li({ lead: `<span class="li__ic b">${n}</span>`, t: a, s: b })).join('')}</div></div>
          <div class="card"><div class="card__t">Кому написать дальше</div><div class="list mt8">${[['Досмотрели, не купили', '1 343'], ['Открыли предложение, не оплатили', '345'], ['Не пришли', '935'], ['Подарили', '214']].map(([a, n]) => li({ t: a, s: `${n} человек`, right: btn('Сегмент', { kind: 'white', size: 'sm', act: 'segment', data: `data-s="${a}"` }) })).join('')}</div></div></div>` }));
    },
  });

  // ───────────── Юя: доверие и журнал ─────────────
  const LEVELS = [['observe', 'Только подсказывает', 'Ничего не делает сама — показывает вам, что заметила'], ['advise', 'Готовит, вы нажимаете', 'Каждое действие — одной вашей кнопкой'], ['reversible', 'Обратимое — сама', 'Впустить, скрыть, выключить микрофон, вывести на сцену. Удалить человека и «Остановить всё» — с вашего «да»'], ['full', 'Всё сама', 'Включая удаление и «Остановить всё». Предохранители работают всегда']];
  add({
    id: 'yuia', group: G, title: 'Юя: доверие и журнал', icon: 'sparkles', phase: 'фазы 2А / 4', plan: '§ 5.13, § 5.33',
    desc: 'Что Юя делает сама, а что с вашего «да»; журнал каждого действия с отменой; проверочный набор; быстрые команды без модели.',
    tips: ['Смените уровень', 'Отмените действие в журнале', '«Прогнать» проверочный набор'],
    acts: {
      lvl: (el) => { S.trust = el.dataset.v; go('yuia'); },
      undo: (el) => { el.closest('.li').style.opacity = .5; el.outerHTML = chip('отменено'); toast('Отменено. Юя учтёт это в следующий раз', { icon: 'undo' }); },
      suite: (el) => { el.innerHTML = `${I('refresh', 'sm', 'spin')} Прогоняю…`; $$('.st-i').forEach((s, i) => later(300 * (i + 1), () => { s.querySelector('.st-s').innerHTML = I('check-circle', 'md', 'ok'); })); later(2300, () => { el.innerHTML = `${I('check')} 6 из 6`; }); },
    },
    render() {
      const lvl = Math.max(0, LEVELS.findIndex((l) => l[0] === S.trust));
      const acts = [['Впустить из зала ожидания', 1], ['Скрыть спам и оскорбления', 1], ['Выключить микрофон шумящему', 2], ['Вывести на сцену', 2], ['Удалить из встречи', 3], ['«Остановить всё»', 3], ['Вернуть деньги, удалить запись', 4]];
      return shellV('yuia', page({ title: 'Юя — помощница на встречах', sub: 'Действует теми же кнопками, что и вы, с теми же правами. Каждое действие можно отменить.', actions: btn('Остановить Юю везде', { icon: 'stop', act: 'toast', data: 'data-text="Юя остановлена. Встречи идут, быстрые команды работают"' }),
        body: `<div class="grid g-main"><div class="col" style="gap:16px">
          <div class="card"><div class="card__t">Что Юя делает сама</div><div class="mt16"><div class="pick">${LEVELS.map(([k, t, s], i) => `<button class="pick__i ${i === lvl ? 'is-on' : ''}" data-act="lvl" data-v="${k}"><span class="pick__r"></span><span><span class="pick__t" style="display:block">${t}</span><span class="pick__s" style="display:block">${s}</span></span></button>`).join('')}</div></div>
            <div class="mt8">${opt('Деньги и удаление записей', 'Отдельное разрешение. По умолчанию — только с вашего «да»', S.moneyTrust)}</div></div>
          <div class="card card--white card--flush"><table class="tbl2"><thead><tr><th>Действие</th><th class="r">Сейчас</th></tr></thead><tbody>${acts.map(([a, n]) => { const self = n === 4 ? S.moneyTrust : lvl >= n; return `<tr><td>${a}</td><td class="r">${lvl === 0 ? chip('подсказка') : self ? chip('сама', 'ok') : chip('с вашего «да»', 'warn')}</td></tr>`; }).join('')}</tbody></table></div>
          <div class="card"><div class="card__t">Журнал действий</div><div class="list mt8">${D.yuiaLog.map((l) => li({ lead: `<span class="mono t-sm muted" style="width:56px">${l.t.slice(0, 5)}</span>`, t: `${l.act}: ${esc(l.obj)}`, s: `Почему: ${esc(l.why)}`, right: l.undo ? btn('Отменить', { size: 'sm', kind: 'white', act: 'undo' }) : '' })).join('')}</div></div></div>
          <aside class="col" style="gap:16px"><div class="card card--hero"><div class="kpi__l">Вы отменили</div><div class="kpi__v">1,4 %</div><div class="kpi__s">действий Юи за 20 встреч</div>${lvl < 3 ? `<div class="mt16">${yuNote('Модерацию чата можно доверить полностью: за 20 эфиров ни одной отмены.')}</div><div class="mt12">${btn('Доверить модерацию', { kind: 'primary', block: true, act: 'lvl', data: 'data-v="full"' })}</div>` : ''}</div>
            <div class="card"><div class="row"><div class="card__t sp">Проверка Юи</div>${btn('Прогнать', { size: 'sm', kind: 'white', icon: 'play', act: 'suite' })}</div><div class="card__s">Повторяется на каждой новой модели</div><div class="mt8">${['Спам-атака', 'Чужой показывает экран', 'Шумящий участник', 'Повторяющиеся вопросы', 'Просьба голосом', 'Конфликт в чате'].map((x) => `<div class="row st-i" style="padding:8px 0;font-size:15px"><span class="st-s subtle">${I('circle', 'md')}</span><span>${x}</span></div>`).join('')}</div></div>
            <div class="card"><div class="card__t">${I('bolt', 'md', 'accent')} Мгновенно, без модели</div><ul style="margin:10px 0 0;padding-left:20px;line-height:1.9;font-size:15px">${['«Юя, выключи микрофон Ивану»', '«Закрепи последнее сообщение»', '«Выведи Марию на сцену»', 'Фильтр ссылок и мата до показа', 'Ответы «не слышно» по данным связи'].map((x) => `<li>${x}</li>`).join('')}</ul></div></aside></div>` }));
    },
  });
})();

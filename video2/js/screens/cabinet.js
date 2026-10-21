(function () {
  const { D, S, add, I, av, esc, rub, num, shell, videoNav, toast, modal, closeModal, go, every, later, $, $$ } = P;
  const G = 'Кабинет: встречи и эфиры';

  // общий переключатель вкладок: .tabs[data-tabs=X] > .tab[data-pane=Y]; панели [data-pane-of=X][data-pane=Y]
  const tabAct = (el) => {
    const box = el.closest('[data-tabs]'); const key = box.dataset.tabs;
    $$('.tab', box).forEach((t) => t.classList.toggle('is-on', t === el));
    $$(`[data-pane-of="${key}"]`).forEach((p) => (p.hidden = p.dataset.pane !== el.dataset.pane));
  };
  P.tabAct = tabAct;
  const segAct = (el) => { $$('button', el.parentElement).forEach((b) => b.classList.toggle('is-on', b === el)); };
  P.segAct = segAct;
  const tglAct = (el) => { el.classList.toggle('is-on'); if (el.dataset.text) toast(el.classList.contains('is-on') ? el.dataset.text : (el.dataset.off || 'Выключено')); };
  P.tglAct = tglAct;
  const choiceAct = (el) => { $$('.choice__item', el.closest('.choice')).forEach((c) => c.classList.toggle('is-on', c === el)); };
  P.choiceAct = choiceAct;
  const common = { tab: tabAct, seg: segAct, tgl: tglAct, choice: choiceAct };
  P.common = common;

  const kindIcon = { call: 'video', meeting: 'users', stage: 'broadcast', practice: 'leaf', constellation: 'node' };
  const kindGo = { call: 'prejoin', meeting: 'meeting', stage: 'event', practice: 'practice', constellation: 'constellation' };

  // ───────────────────────────── обзор ─────────────────────────────
  add({
    id: 'hub', group: G, title: 'Обзор встреч', icon: 'grid', phase: 'фаза 2А–4', plan: '§ 5.11; § 6',
    desc: 'Главная модуля: ближайшая сессия с подготовкой от Юи, мгновенная встреча, ссылка, шаблоны, расписание, постоянные комнаты и записи.',
    tips: ['«Резюме переписки» у ближайшей сессии', 'Карточка шаблона создаёт встречу в два клика', 'Строки расписания ведут в нужный режим комнаты'],
    acts: {
      ...common,
      brief: () => modal(`<div class="row"><span class="yu yu--lg">${I('sparkles')}</span><div><div class="eyebrow eyebrow--accent">Юя · подготовка к сессии</div><h2 class="pmodal__title" style="margin:2px 0 0">Мария Иванова, 9-я встреча</h2></div></div>
        <div class="divider"></div>
        <div class="col small" style="gap:10px;line-height:1.6">
          <div><b>С прошлой встречи (14 окт):</b> тема — страх оценки, техника «пустой стул». Домашнее задание: сказать «нет» одной просьбе коллеги — <span class="warn">не выполнено</span>.</div>
          <div><b>Переписка за неделю:</b> 17 окт Мария написала, что «опять не спала перед планёркой», 19 окт — что получилось отказаться от лишнего проекта, «было страшно, но я сказала».</div>
          <div><b>Динамика:</b> тревога по GAD-7 — 15 → 7 за 8 встреч. Анкета перед входом пока не заполнена.</div>
          <div><b>Предлагаю обсудить:</b> первый успешный отказ (19 окт) как опору; сон перед планёрками.</div>
        </div>
        <div class="pmodal__note">${I('lock')} Видно только вам. Источник — записи и расшифровки сессий, переписка в карточке клиента.</div>
        <div class="pmodal__actions"><button class="btn btn--secondary" data-go="client">Карточка клиента</button><button class="btn btn--primary" data-go="prejoin">${I('video')} Войти в комнату</button></div>`),
      copy: () => { navigator.clipboard?.writeText('https://the-essence.ai/m/anna-sokolova').catch(() => {}); toast('Ссылка скопирована: the-essence.ai/m/anna-sokolova'); },
      qr: () => modal(`<div class="eyebrow eyebrow--accent">Постоянная комната</div><h2 class="pmodal__title">Кабинет Анны — вход с телефона</h2><div style="display:grid;place-items:center;padding:12px">${C.qr(200, 11)}</div><p class="pmodal__lead small" style="text-align:center">Клиент наводит камеру — открывается браузер, без установки приложения. Незнакомых Юя оставит в зале ожидания.</p>`),
    },
    render() {
      const sessions = D.sessions.map((s) => `<div class="mrow" data-go="${kindGo[s.kind]}">
        <div class="mrow__time"><div class="mrow__time-h">${s.time}</div><div class="mrow__time-d">${s.day}</div></div><div class="mrow__div"></div>
        ${av(s.who, 36)}
        <div class="mrow__body"><div class="mrow__title">${esc(s.title)}</div><div class="mrow__sub">${I(kindIcon[s.kind], 'xs')} ${esc(s.sub)}</div></div>
        <div class="mrow__actions">${s.state === 'soon' ? '<span class="pill pill--accent">через 36 мин</span>' : ''}<button class="btn btn--secondary btn--sm">${s.kind === 'stage' ? 'Пульт эфира' : 'Открыть'}</button></div></div>`).join('');
      const tpls = [['user', 'Индивидуальная сессия', '1:1 · зал ожидания · запись по согласию', 'call'], ['users', 'Групповая практика', 'до 100 · режим практики · музыка', 'practice'], ['gift', 'Вебинар с донатами', 'до 3 000 · свободный вход · цель сбора', 'webinar'], ['ticket', 'Платный вебинар', 'билеты · запись по билету · предложение', 'paid'], ['node', 'Расстановка', 'поле с фигурками · заместители', 'constellation']];
      const body = `<div class="hub">
        <div class="hub__greet"><div class="eyebrow">Среда, 21 октября · 09:24</div><h1 class="hub__hello">Доброе утро, <em>Анна</em></h1>
          <p class="hub__sub">Через 36 минут — Мария Иванова, 9-я встреча. Комната готова, Юя собрала резюме переписки с прошлой сессии.</p></div>
        <div class="box box--glow row" style="margin-bottom:20px;gap:16px;flex-wrap:wrap">
          ${av('maria', 52, 'ring')}
          <div class="sp" style="min-width:220px"><div class="strong">Мария Иванова · 10:00–11:00</div><div class="small muted" style="margin-top:3px">Оплачено · запись и расшифровка по согласию · тревога 15 → 7 за 8 встреч</div></div>
          <button class="btn btn--secondary" data-act="brief">${I('sparkles')} Резюме от Юи</button>
          <button class="btn btn--primary" data-go="prejoin">${I('video')} Войти в комнату</button>
        </div>
        <div class="hub__grid">
          <div class="act-card"><div class="act-card__glyph">${I('video')}</div><h3>Мгновенная встреча</h3>
            <p>Комната открывается сразу, ссылку можно отправить в любой мессенджер. Незнакомых Юя придержит в зале ожидания, вы впустите одним касанием.</p>
            <div class="act-card__foot row"><button class="btn btn--primary btn--lg" data-go="prejoin">${I('video')} Начать сейчас</button><button class="btn btn--secondary btn--lg" data-go="new">${I('calendar')} Запланировать</button></div></div>
          <div class="act-card act-card--hero"><div class="act-card__glyph">${I('link')}</div><h3>Кабинет Анны — постоянная ссылка</h3>
            <p>Одна ссылка на все сессии. Клиент с оплаченной записью входит сам в своё время, остальные ждут.</p>
            <div class="invite"><div class="invite__row"><div class="invite__link">${I('link')}<span class="invite__url">the-essence.ai/m/anna-sokolova</span></div>
              <button class="btn btn--primary invite__copy" data-act="copy">${I('copy')} Копировать</button></div>
              <div class="invite__meta"><span class="invite__meta-item">${I('qrcode')}<a data-act="qr" class="accent">QR для телефона</a></span><span class="invite__meta-item">${I('messenger')} Telegram, MAX</span><span class="invite__meta-item">${I('lock')} Зал ожидания — для незнакомых</span></div></div></div>
        </div>
        <div class="sec"><div class="sec__head"><h3>Шаблоны</h3><span class="sp"></span><a class="sec__link" data-go="new">Все настройки ${I('arrow-right', 'xs')}</a></div>
          <div class="tpl-row">${tpls.map(([i, t, s, k]) => `<a class="tpl" data-go="new" data-params="tpl=${k}"><span class="tpl__glyph">${I(i, 'md')}</span><b>${t}</b><span>${s}</span></a>`).join('')}</div></div>
        <div class="grid g-side sec">
          <div><div class="sec__head"><h3>Запланировано</h3><span class="pill">5 на неделе</span><span class="sp"></span><a class="sec__link" data-go="event">Эфир в четверг ${I('arrow-right', 'xs')}</a></div>${sessions}</div>
          <div class="col" style="gap:14px">
            <div class="box"><div class="box__title"><span class="yu">${I('sparkles')}</span> Юя за неделю</div>
              <div class="grid g2" style="margin-top:12px;gap:10px"><div><div class="stat__value" style="font-size:24px">214</div><div class="tiny muted">действий в 9 встречах</div></div><div><div class="stat__value" style="font-size:24px">1,4 %</div><div class="tiny muted">вы отменили</div></div>
                <div><div class="stat__value" style="font-size:24px">3 ч 10 м</div><div class="tiny muted">сэкономлено на итогах</div></div><div><div class="stat__value" style="font-size:24px">12</div><div class="tiny muted">задач в задачник</div></div></div>
              <div class="box__foot"><button class="btn btn--secondary btn--sm" data-go="yuia">Уровень доверия</button></div></div>
            <div class="box"><div class="box__title">${I('door')} Постоянные комнаты</div>
              ${[['Кабинет Анны', 'сессии 1:1 · чат с клиентами', 'call', ''], ['Группа «Опора»', '12 участников · 5 новых в чате', 'meeting', '5'], ['Супервизия', 'по вторникам · запись для монтажа', 'meeting', '']].map(([t, s, g, n]) => `<div class="lrow lrow--click" data-go="${g}" style="padding:10px 4px"><div class="lrow__main"><div class="lrow__title">${t}</div><div class="lrow__sub">${s}</div></div>${n ? `<span class="pill pill--accent">${n}</span>` : I('chevron-right')}</div>`).join('')}</div>
          </div></div>
        <div class="sec"><div class="sec__head"><h3>Недавние записи</h3><span class="sp"></span><a class="sec__link" data-go="recordings">Все записи ${I('arrow-right', 'xs')}</a></div>
          <div class="rec-grid">${D.recordings.slice(0, 3).map(recCard).join('')}</div></div>
      </div>`;
      return shell({ module: 'Встречи', active: 'video', compose: { label: 'Начать встречу', icon: 'video', go: 'prejoin' }, nav: videoNav('hub'), body });
    },
  });

  function recCard(r) {
    const img = { Эфир: 'p32', Сессия: 'p26', Группа: 'p23', Практика: 'p20' }[r.kind] || 'p23';
    return `<div class="rec-card" data-go="recording"><div class="rec-card__thumb proto-thumb" style="background-image:linear-gradient(180deg,transparent 40%,rgba(15,13,8,.75)),url(img/people/${img}.jpg)">
      <span class="proto-thumb__play">${I('play', 'md')}</span><span class="proto-thumb__dur mono">${r.dur}</span><span class="proto-thumb__kind">${r.kind}</span></div>
      <div style="padding:12px 14px"><div class="strong" style="font-size:13.5px">${esc(r.title)}</div><div class="small muted" style="margin-top:4px">${r.date} · ${esc(r.access)}</div>
      <div class="row" style="margin-top:8px;gap:6px"><span class="pill pill--ok">${I('check', 'xs')} ${esc(r.status)}</span>${r.chapters ? `<span class="pill">${r.chapters} глав</span>` : ''}</div></div></div>`;
  }

  // ───────────────────────────── мастер новой встречи ─────────────────────────────
  const TPL = {
    call: { icon: 'user', title: 'Индивидуальная сессия', kind: 'Разговор 1:1', size: '2 человека', wait: 1, rec: true, reg: false },
    practice: { icon: 'leaf', title: 'Групповая практика', kind: 'Встреча · режим практики', size: 'до 100', wait: 1, rec: true, reg: true },
    webinar: { icon: 'gift', title: 'Вебинар с донатами', kind: 'Сцена + зрители', size: 'до 3 000 (архитектура — 10 000)', wait: 0, rec: true, reg: true, money: 'donate' },
    paid: { icon: 'ticket', title: 'Платный вебинар', kind: 'Сцена + зрители', size: 'до 3 000', wait: 1, rec: true, reg: true, money: 'tickets' },
    constellation: { icon: 'node', title: 'Расстановка', kind: 'Встреча + поле расстановки', size: 'ведущий + до 20', wait: 2, rec: false, reg: false },
  };
  add({
    id: 'new', group: G, title: 'Новая встреча из шаблона', icon: 'template', phase: 'фаза 2А / 4', plan: '§ 3 п. 13 — шаблоны вместо настроек',
    desc: 'Мастер в четыре шага: шаблон, когда, кто входит и как платит, запись/субтитры/Юя/регион. Всё безопасно по умолчанию.',
    tips: ['Переключите шаблон — настройки меняются сами', 'Регион «Авто» подберётся по странам регистраций', 'Уровень доверия Юи — прямо при создании'],
    acts: {
      ...common,
      tpl: (el) => go('new', { tpl: el.dataset.k, step: 1 }),
      step: (el) => go('new', { tpl: P.current.params.tpl || 'webinar', step: el.dataset.s }),
      create: () => { const t = P.current.params.tpl || 'webinar'; toast(`Создано: «${TPL[t].title}». Ссылки, напоминания и страница готовы`); go(t === 'webinar' || t === 'paid' ? 'event' : 'hub'); },
    },
    render(p) {
      const k = p.tpl || 'webinar'; const t = TPL[k]; const step = +(p.step || 0);
      const steps = ['Шаблон', 'Когда', 'Вход и деньги', 'Запись, Юя, регион', 'Готово'];
      const stepper = `<div class="stepper">${steps.map((s, i) => `<button class="stepper__i ${i === step ? 'is-on' : ''} ${i < step ? 'is-done' : ''}" data-act="step" data-s="${i}"><span>${i < step ? I('check', 'xs') : i + 1}</span>${s}</button>`).join('')}</div>`;
      let pane = '';
      if (step === 0) pane = `<div class="tpl-big">${Object.entries(TPL).map(([key, v]) => `<button class="tpl-card ${key === k ? 'is-on' : ''}" data-act="tpl" data-k="${key}"><span class="tpl__glyph">${I(v.icon, 'md')}</span><b>${v.title}</b><span>${v.kind}</span><span class="tiny subtle">${v.size}</span></button>`).join('')}</div>
        <div class="box" style="margin-top:16px"><div class="box__title">${I('info-circle')} Что включит «${t.title}»</div><ul class="plist">
          <li>Зал ожидания: ${['все входят сразу', 'записанные и оплатившие — сразу, остальные ждут', 'ждут все, кроме ведущих'][t.wait]}</li>
          <li>${t.rec ? 'Запись по дорожкам и расшифровка — с понятной плашкой и согласием на входе' : 'Без записи — только живое поле'}</li>
          <li>${t.reg ? 'Страница с регистрацией, напоминания за сутки, час, 5 минут и «мы начали»' : 'Личная ссылка, приглашение в календарь'}</li>
          ${t.money ? `<li>${t.money === 'donate' ? 'Кнопка «Подарить ведущему», цель сбора, оповещения на экране' : 'Билеты, доступ к записи по билету, карточка предложения в эфире'}</li>` : ''}
          <li>Юя: впускает по правилам, модерирует чат, отвечает на технические вопросы, делает итоги</li></ul></div>`;
      if (step === 1) pane = `<div class="grid g2"><div><label class="lbl">Название</label><input class="inp" value="${k === 'webinar' || k === 'paid' ? 'Тревога и опора: как вернуть себе почву' : t.title}">
          <label class="lbl">Дата и время</label><div class="row"><input class="inp" value="23.10.2026"><input class="inp" value="19:00" style="max-width:110px"><select class="inp" style="max-width:150px"><option>1 ч 30 мин</option><option>60 мин</option><option>2 ч</option></select></div>
          <label class="lbl">Повтор</label><div class="seg"><button class="is-on" data-act="seg">Один раз</button><button data-act="seg">Каждую неделю</button><button data-act="seg">Серия из 6</button></div></div>
        <div><label class="lbl">Ведущие и докладчики</label><div class="box" style="padding:8px 12px">${['anna', 'dmitry', 'elena'].map((id, i) => `<div class="lrow" style="padding:8px 2px">${av(id, 30)}<div class="lrow__main"><div class="lrow__title">${P.person(id).name}</div><div class="lrow__sub">${['Ведущая', 'Докладчик · вход из закулисья', 'Соведущая · альтернативный ведущий'][i]}</div></div></div>`).join('')}
          <button class="btn btn--ghost btn--sm" data-act="toast" data-text="Приглашение докладчику ушло письмом и в Telegram">${I('user-plus')} Пригласить докладчика</button></div>
          <div class="pmodal__note">${I('globe')} Время показывается каждому зрителю в его поясе: Берлин — 18:00, Тель-Авив — 19:00, Нью-Йорк — 12:00.</div></div></div>`;
      if (step === 2) pane = `<div class="grid g2"><div><div class="eyebrow">Зал ожидания</div><div class="choice" style="margin-top:8px">${['Все входят сразу|Для открытых эфиров', 'Записанные и оплатившие — сразу, остальные ждут|Рекомендуем: безопасно и без очереди', 'Ждут все, кроме ведущих|Для сессий и закрытых групп'].map((x, i) => { const [a, b] = x.split('|'); return `<div class="choice__item ${i === t.wait ? 'is-on' : ''}" data-act="choice"><span class="choice__radio"></span><div><div class="choice__title">${a}</div><div class="choice__sub">${b}</div></div></div>`; }).join('')}</div>
          <div class="optrow"><div class="optrow__main"><div class="optrow__title">Личные ссылки, один вход на билет</div><div class="optrow__sub">Пересланная ссылка не пустит второго человека</div></div><button class="tgl is-on" data-act="tgl"></button></div>
          <div class="optrow"><div class="optrow__main"><div class="optrow__title">Водяной знак с почтой зрителя</div><div class="optrow__sub">Для платных эфиров — видно, кто записал экран</div></div><button class="tgl" data-act="tgl" data-text="Водяной знак включён"></button></div></div>
        <div><div class="eyebrow">Деньги</div>
          <div class="optrow"><div class="optrow__main"><div class="optrow__title">Билеты</div><div class="optrow__sub">${D.event.tickets.map((x) => `${x.name} — ${x.price ? rub(x.price) : 'бесплатно'}`).join(' · ')}</div></div><button class="tgl ${t.money === 'tickets' ? 'is-on' : ''}" data-act="tgl"></button></div>
          <div class="optrow"><div class="optrow__main"><div class="optrow__title">Подарки ведущему (донаты)</div><div class="optrow__sub">Режим «Подарок»: 0 % налога, донат ничего не открывает. Цель сбора и оповещения на экране</div></div><button class="tgl ${t.money ? 'is-on' : ''}" data-act="tgl"></button></div>
          <div class="optrow"><div class="optrow__main"><div class="optrow__title">Предложение в эфире</div><div class="optrow__sub">Курс «Опора» · показ по кнопке ведущей или по расписанию в 20:10</div></div><button class="tgl is-on" data-act="tgl"></button></div>
          <div class="optrow"><div class="optrow__main"><div class="optrow__title">Зарубежные карты</div><div class="optrow__sub">Visa, Mastercard, UnionPay через кассу · комиссия ≈ 10 % видна вам заранее</div></div><button class="tgl is-on" data-act="tgl"></button></div>
          <div class="pmodal__note">${I('wallet')} Вы получите на кошелёк: билет 990 ₽ → <b>&nbsp;891 ₽</b>. Чеки за вас пробивает платформа.</div></div></div>`;
      if (step === 3) pane = `<div class="grid g2"><div>
          <div class="optrow"><div class="optrow__main"><div class="optrow__title">Запись по дорожкам</div><div class="optrow__sub">Каждый говорящий отдельно — точная расшифровка. Плашка и звук «запись началась» для всех</div></div><button class="tgl ${t.rec ? 'is-on' : ''}" data-act="tgl"></button></div>
          <div class="optrow"><div class="optrow__main"><div class="optrow__title">Для монтажа</div><div class="optrow__sub">Отдельные дорожки, постоянная частота кадров, видео докладчика рядом с экраном</div></div><button class="tgl" data-act="tgl" data-text="Запись для монтажа включена"></button></div>
          <div class="optrow"><div class="optrow__main"><div class="optrow__title">Живые субтитры на русском</div><div class="optrow__sub">GigaAM · перевод у зрителя: английский, немецкий, иврит, испанский — в браузере</div></div><button class="tgl is-on" data-act="tgl"></button></div>
          <div class="optrow"><div class="optrow__main"><div class="optrow__title">Итоги за 10 минут после конца</div><div class="optrow__sub">Главы, вопросы, задачи — в задачник, конспект — в базу знаний</div></div><button class="tgl is-on" data-act="tgl"></button></div></div>
        <div><div class="eyebrow">Юя в этой встрече</div><div class="seg" style="margin:8px 0 6px;flex-wrap:wrap">${['Наблюдает', 'Советует', 'Обратимое — сама', 'Полная самостоятельность'].map((x, i) => `<button class="${i === 2 ? 'is-on' : ''}" data-act="seg">${x}</button>`).join('')}</div>
          <div class="small muted">Удалить человека, «Остановить всё» и возвраты — с вашего подтверждения.</div>
          <div class="eyebrow" style="margin-top:20px">Где проводить</div><div class="choice" style="margin-top:8px">
          <div class="choice__item is-on" data-act="choice"><span class="choice__radio"></span><div><div class="choice__title">Авто по странам регистраций</div><div class="choice__sub">Сцена в Москве; зрители из Европы — Франкфурт, из США — Нью-Йорк, Израиль — узел поднимется на время эфира</div></div></div>
          <div class="choice__item" data-act="choice"><span class="choice__radio"></span><div><div class="choice__title">Только Москва</div><div class="choice__sub">Все зрители на московских узлах</div></div></div></div></div></div>`;
      if (step === 4) pane = `<div class="box box--glow" style="text-align:center;padding:40px 24px"><span class="yu yu--lg" style="margin:0 auto">${I('check')}</span>
          <h2 class="page__title" style="margin-top:14px">Всё готово к созданию</h2><p class="page__sub">Страница эфира, личные ссылки, напоминания в почту, Telegram и MAX, предложения и проверка перед эфиром — создадутся сразу. Юя возьмёт на себя зал ожидания и чат.</p>
          <div class="invite" style="max-width:520px;margin:20px auto 0"><div class="invite__row"><div class="invite__link">${I('link')}<span class="invite__url">the-essence.ai/e/trevoga-i-opora</span></div><button class="btn btn--primary invite__copy" data-act="create">${I('check')} Создать</button></div></div></div>`;
      const body = `<div class="page"><div class="page__head"><div class="page__titles"><div class="eyebrow eyebrow--accent">${t.kind}</div><h1 class="page__title">Новая встреча · <em>${t.title}</em></h1></div></div>
        ${stepper}<div class="fade-up" style="margin-top:20px">${pane}</div>
        <div class="row" style="margin-top:24px">${step > 0 ? `<button class="btn btn--secondary" data-act="step" data-s="${step - 1}">${I('arrow-left')} Назад</button>` : ''}<span class="sp"></span>
          ${step < 4 ? `<button class="btn btn--primary" data-act="step" data-s="${step + 1}">Дальше ${I('arrow-right')}</button>` : ''}</div></div>`;
      return shell({ module: 'Встречи', active: 'video', compose: { label: 'Начать встречу', icon: 'video', go: 'prejoin' }, nav: videoNav('new'), body });
    },
  });

  // ───────────────────────────── карточка эфира ─────────────────────────────
  const CHECKS = ['Узлы msk-a, msk-b — свободно 74 % ядер', 'Ретрансляторы Москва → Франкфурт, Нью-Йорк — задержка 41 / 118 мс', 'Egress «картинки эфира» — свободен', 'HLS-запас — плейлист свежий, 1,2 с', 'TURN из России, Европы, США — отвечает', 'API приложения — p95 входа 182 мс', 'GigaAM — 3 потока, задержка 0,6 с', 'Юя — задание принято, лимит на 4 ч', 'Хранилище записей — 1,8 ТБ свободно', 'Нагрузочный прогон: 3 000 зрителей, 30 мин — пройден'];
  add({
    id: 'event', group: G, title: 'Карточка эфира (организатор)', icon: 'presentation', phase: 'фаза 2А–3', plan: '§ 5.11; § 5.21–5.22; § 5.18',
    desc: 'Регистрации и страны → план узлов, билеты и предложения, напоминания во все каналы, проверка перед эфиром одной кнопкой, оформление.',
    tips: ['Вкладка «Проверка перед эфиром» → «Запустить»', 'Юя предлагает поднять узел в Тель-Авиве', 'Оформление: цвета бренда сразу в превью'],
    acts: {
      ...common,
      runcheck: (el) => {
        el.disabled = true; el.innerHTML = `${I('refresh', 'sm', 'spin')} Проверяю…`;
        $$('.chk').forEach((c, i) => later(350 * (i + 1), () => { c.classList.add('is-ok'); c.querySelector('.chk__st').innerHTML = I('check-circle'); }));
        later(350 * (CHECKS.length + 1), () => { el.innerHTML = `${I('check')} Готово к эфиру`; toast('Проверка перед эфиром пройдена: 10 из 10'); });
      },
      region: (el) => { el.outerHTML = '<span class="pill pill--ok">узел tlv поднят на 23 окт 18:30–21:30</span>'; toast('Узел в Тель-Авиве будет поднят за 30 минут до эфира и снят после'); },
      remind: () => toast('Тестовое напоминание отправлено вам в почту, Telegram и MAX'),
      color: (el) => { $$('.swatch').forEach((s) => s.classList.toggle('is-on', s === el)); const b = $('.brand-preview'); if (b) b.style.setProperty('--brand', el.dataset.c); },
    },
    render() {
      const e = D.event;
      const regs = [120, 180, 260, 340, 410, 520, 690, 880, 1040, 1310, 1600, 1980, 2400, 2847];
      const body = `<div class="page page--wide">
        <div class="page__head"><div class="page__titles"><div class="row" style="gap:8px"><span class="pill pill--accent">Платный вебинар</span><span class="pill">через 2 дня</span><span class="pill">${I('globe', 'xs')} 36 стран</span></div>
          <h1 class="page__title" style="margin-top:10px">${esc(e.title)}</h1><div class="page__sub">${e.date} · ${e.time} ${e.tz} · ${e.duration} · ведущая Анна Соколова, гость Дмитрий Орлов</div></div>
          <div class="page__actions"><button class="btn btn--secondary" data-go="event-page">${I('external-link')} Страница эфира</button><button class="btn btn--secondary" data-go="report">${I('chart-bar')} Отчёт прошлого</button><button class="btn btn--primary" data-go="stage">${I('broadcast')} Открыть закулисье</button></div></div>
        <div class="grid g4">
          <div class="box stat"><div class="stat__label">${I('users', 'xs')} Регистрации</div><div class="stat__value">${num(e.registered)}</div><div class="stat__delta">+312 за сутки</div></div>
          <div class="box stat"><div class="stat__label">${I('ticket', 'xs')} Билеты</div><div class="stat__value">421<small>/ 418 300 ₽</small></div><div class="stat__delta">VIP: осталось 7 мест</div></div>
          <div class="box stat"><div class="stat__label">${I('gift', 'xs')} Подарки до эфира</div><div class="stat__value">${rub(S.raised)}</div><div class="bar" style="margin-top:8px"><i style="width:${Math.round(S.raised / D.donationGoal.goal * 100)}%"></i></div></div>
          <div class="box stat"><div class="stat__label">${I('bell', 'xs')} Напоминания</div><div class="stat__value">98,6 %<small>доставлено</small></div><div class="stat__delta">почта · Telegram · MAX · push</div></div>
        </div>
        <div class="tabs" data-tabs="ev" style="margin-top:24px">${['Обзор', 'Регистрации', 'Билеты и предложения', 'Напоминания', 'Проверка перед эфиром', 'Оформление'].map((x, i) => `<button class="tab ${i ? '' : 'is-on'}" data-act="tab" data-pane="${i}">${x}${i === 1 ? '<span class="cnt">2 847</span>' : ''}</button>`).join('')}</div>
        <div data-pane-of="ev" data-pane="0"><div class="grid g-side">
          <div class="box"><div class="box__title">Регистрации по дням</div><div class="box__sub">Источники: Telegram-канал 41 %, рассылка 27 %, Instagram 14 %, сайт 10 %, партнёры 8 %</div><div style="margin-top:14px">${C.area(regs, { h: 190, labels: ['10 окт', '13', '16', '19', '21 окт'], marks: [{ at: .55, label: 'рассылка' }, { at: .86, label: 'анонс в канале' }] })}</div></div>
          <div class="box"><div class="box__title">${I('globe')} Где зрители → какие узлы</div><div class="box__sub">План собран за сутки до эфира по странам регистраций</div>
            <table class="tbl" style="margin-top:10px"><tbody>${e.countries.map((c) => `<tr><td>${c.name}</td><td class="num">${c.share} %</td><td class="small muted">${c.node}</td></tr>`).join('')}</tbody></table>
            <div class="box" style="margin-top:12px;padding:12px;background:var(--color-bg-muted);border:0"><div class="row" style="gap:10px"><span class="yu">${I('sparkles')}</span><div class="sp small">8 % зрителей в Израиле. Поднять узел в Тель-Авиве на время эфира — задержка 31 мс вместо 74.</div></div>
              <div class="row" style="margin-top:10px;justify-content:flex-end"><button class="btn btn--primary btn--sm" data-act="region">Поднять узел</button></div></div></div></div></div>
        <div data-pane-of="ev" data-pane="1" hidden><div class="box box--flush"><div class="row" style="padding:12px 14px;gap:10px;border-bottom:var(--hairline-width) solid var(--color-border)"><input class="inp" placeholder="Поиск по имени, почте, городу" style="max-width:320px"><div class="seg"><button class="is-on" data-act="seg">Все</button><button data-act="seg">Оплатили</button><button data-act="seg">Бесплатно</button><button data-act="seg">С вопросом</button></div><span class="sp"></span><button class="btn btn--secondary btn--sm" data-act="toast" data-text="Выгрузка CSV готова — 2 847 строк">${I('download')} CSV</button></div>
          <table class="tbl"><thead><tr><th>Участник</th><th>Билет</th><th>Город и пояс</th><th>Источник</th><th>Бот</th><th class="num">Когда</th></tr></thead><tbody>
          ${['olga|С записью|Екатеринбург · +5|Telegram-канал|TG ✓|21 окт', 'lev|Разбор в эфире|Тель-Авив · +3|рассылка|—|20 окт', 'sofia|Бесплатный|Мадрид · +2|Instagram|TG ✓|20 окт', 'nina|С записью|Казань · +3|сайт|MAX ✓|19 окт', 'timur|Бесплатный|Алматы · +5|партнёр «Кедр»|TG ✓|19 окт', 'kate|С записью|Берлин · +2|рассылка|—|18 окт', 'mark|Бесплатный|Нью-Йорк · −4|Telegram-канал|TG ✓|18 окт'].map((r) => { const [w, t, c, s, b, d] = r.split('|'); return `<tr><td><div class="row" style="gap:10px">${av(w, 28)}${P.person(w).name}</div></td><td>${t === 'Бесплатный' ? `<span class="pill">${t}</span>` : `<span class="pill pill--accent">${t}</span>`}</td><td class="small">${c}</td><td class="small muted">${s}</td><td class="small">${b}</td><td class="num small muted">${d}</td></tr>`; }).join('')}</tbody></table></div></div>
        <div data-pane-of="ev" data-pane="2" hidden><div class="grid g2">
          <div class="box"><div class="box__title">${I('ticket')} Билеты</div>${e.tickets.map((x) => `<div class="lrow" style="padding:12px 2px"><div class="lrow__main"><div class="lrow__title">${x.name} · ${x.price ? rub(x.price) : 'бесплатно'}</div><div class="lrow__sub">${x.note}${x.left ? ` · осталось ${x.left}` : ''}</div></div><button class="btn btn--ghost btn--sm" data-act="toast" data-text="Редактор билета — цена, лимит, доступ к записи">${I('edit')}</button></div>`).join('')}
            <div class="pmodal__note">${I('lock-open')} Доступ к записи даёт только билет. Подарок доступа не открывает — иначе он перестаёт быть подарком.</div></div>
          <div class="box"><div class="box__title">${I('target')} Предложения в эфире</div>${D.offers.map((o) => `<div class="lrow" style="padding:12px 2px"><div class="lrow__main"><div class="lrow__title">${esc(o.title)}</div><div class="lrow__sub">${rub(o.price)}${o.old ? ` <s>${rub(o.old)}</s>` : ''}${o.seats ? ` · ${o.seats} мест` : ''} · показ: ${o.id === 'course' ? 'в 20:10 и по кнопке' : 'по кнопке'}</div></div><span class="pill">${o.kind}</span></div>`).join('')}
            <button class="btn btn--secondary btn--sm" data-go="sales">${I('plus')} Новое предложение</button></div></div></div>
        <div data-pane-of="ev" data-pane="3" hidden><div class="box"><div class="box__title">Цепочка напоминаний — это сценарий</div><div class="box__sub">Шаблон «Эфир» из движка сценариев. Правится словами через Юю или в редакторе.</div>
          <div class="timeline" style="margin-top:14px">${[['За сутки', 'почта · Telegram · MAX · push', '2 847 / 2 806 доставлено', 'ok'], ['За час', 'Telegram · MAX · push', 'запланировано 23 окт 18:00', ''], ['За 5 минут', 'push · Telegram', 'вход в одно касание', ''], ['«Мы начали»', 'тем, кто не вошёл через 3 мин', 'запланировано', ''], ['«Запись готова»', 'почта и боты · по билету', 'через ≤ 10 мин после конца', ''], ['«Не смогли прийти?»', 'не пришедшим — запись и предложение', 'через 2 ч', '']].map(([a, b, c, s]) => `<div class="timeline__i ${s ? 'is-done' : ''}"><span class="timeline__dot"></span><div><b>${a}</b><div class="small muted">${b}</div></div><span class="sp"></span><span class="small ${s ? 'ok' : 'muted'}">${c}</span></div>`).join('')}</div>
          <div class="box__foot"><button class="btn btn--secondary btn--sm" data-act="remind">${I('send')} Прислать себе тест</button><button class="btn btn--ghost btn--sm" data-go="scenarios">${I('automation')} Открыть сценарий</button></div></div></div>
        <div data-pane-of="ev" data-pane="4" hidden><div class="box"><div class="row"><div class="sp"><div class="box__title">Проверка перед эфиром</div><div class="box__sub">Скрипт проходит узлы, ретрансляторы, запись, HLS, TURN из каждого региона, API, распознавание и Юю</div></div><button class="btn btn--primary" data-act="runcheck">${I('play')} Запустить</button></div>
          <div class="checks" style="margin-top:14px">${CHECKS.map((c) => `<div class="chk"><span class="chk__st">${I('circle')}</span><span>${c}</span></div>`).join('')}</div></div>
          <div class="box" style="margin-top:16px"><div class="box__title">Чек-лист ведущей</div>${['Закулисье с Дмитрием в 18:30 — проверка звука и света', 'Генеральный прогон прошёл 21 окт — 300 живых + 3 000 нагрузочных', 'Предложение «Курс Опора» — показ в 20:10', 'Дежурный инженер на связи — Глеб, в чате @support'].map((x, i) => `<label class="lrow" style="padding:10px 2px;cursor:pointer"><input type="checkbox" ${i === 1 ? 'checked' : ''}><span>${x}</span></label>`).join('')}</div></div>
        <div data-pane-of="ev" data-pane="5" hidden><div class="grid g2"><div class="box"><div class="box__title">Бренд</div>
            <label class="lbl">Цвет акцента</label><div class="row">${['#7A5340', '#C77A8A', '#5C7E5A', '#4A7B92', '#B8623E', '#6B6E8E'].map((c, i) => `<button class="swatch ${i ? '' : 'is-on'}" data-act="color" data-c="${c}" style="--c:${c}"></button>`).join('')}</div>
            <label class="lbl">Логотип</label><button class="btn btn--secondary btn--sm" data-act="toast" data-text="Логотип загружен">${I('upload')} Загрузить</button>
            <label class="lbl">Свой домен</label><input class="inp" value="live.opora-anna.ru"><div class="small muted" style="margin-top:6px">DNS проверен · сертификат выпущен</div>
            <label class="lbl">Плашки докладчиков</label><div class="small">Анна Соколова — психолог, КПТ · Дмитрий Орлов — психиатр-консультант</div></div>
          <div class="box"><div class="box__title">Так увидят зрители</div><div class="brand-preview" style="--brand:#7A5340"><div class="brand-preview__stage" style="background-image:url(img/people/p32.jpg)"><span class="brand-preview__plate"><b>Анна Соколова</b>психолог, КПТ</span><span class="brand-preview__logo">Опора</span></div>
            <div class="brand-preview__wait"><div class="tiny" style="opacity:.8">До начала</div><div class="mono" style="font-size:26px">01:58:12</div><div class="tiny">Зал ожидания · бренд клиента</div></div></div></div></div></div>
      </div>`;
      return shell({ module: 'Встречи', active: 'video', compose: { label: 'Начать встречу', icon: 'video', go: 'prejoin' }, nav: videoNav('event'), body });
    },
  });

  // ───────────────────────────── записи ─────────────────────────────
  add({
    id: 'recordings', group: G, title: 'Записи и расшифровки', icon: 'play', phase: 'фаза 2Б / 4', plan: '§ 5.14; § 5.12.4',
    desc: 'Все записи: эфиры, сессии, группы, практики. Поиск по словам внутри расшифровок, статусы итогов, доступ.',
    acts: { ...common, 'search-go': () => P.current.acts.search($('[data-input="search"]')), search: (el) => { const v = el.value.trim(); $('#rec-hits').innerHTML = v ? `<div class="box" style="margin-bottom:16px"><div class="box__title">${I('search')} «${esc(v)}» — 3 совпадения в расшифровках</div>${[['Эфир «Сон без тревоги»', '58:22', 'Дмитрий: «…панические атаки ночью часто связаны с гипервентиляцией…»'], ['Мария Иванова · 7-я встреча', '21:40', 'Мария: «…просыпаюсь в четыре утра, и сердце колотится…»'], ['Эфир «Границы без вины»', '1:14:05', 'Анна: «…ночью тревога громче, потому что…»']].map(([a, t, q]) => `<div class="lrow lrow--click" data-go="recording"><span class="mono small accent">${t}</span><div class="lrow__main"><div class="lrow__title">${a}</div><div class="lrow__sub">${q}</div></div>${I('play')}</div>`).join('')}</div>` : ''; } },
    render() {
      const body = `<div class="page page--wide"><div class="page__head"><div class="page__titles"><div class="eyebrow">48 записей · 312 часов · хранится в России</div><h1 class="page__title">Записи</h1></div>
        <div class="page__actions"><input class="inp" style="width:320px" placeholder="Поиск по словам во всех расшифровках" data-input="search" value=""><button class="btn btn--primary" data-act="search-go">${I('search')} Найти</button></div></div>
        <div id="rec-hits"></div>
        <div class="tabs" data-tabs="rec">${['Все', 'Эфиры', 'Сессии', 'Группы', 'Практики'].map((x, i) => `<button class="tab ${i ? '' : 'is-on'}" data-act="tab" data-pane="${i}">${x}</button>`).join('')}</div>
        <div class="rec-grid">${D.recordings.map(recCard).join('')}</div>
        <div class="box" style="margin-top:20px"><div class="row" style="gap:12px;flex-wrap:wrap">${I('archive', 'md', 'accent')}<div class="sp"><div class="strong">Хранилище: 182 ГБ из 500 ГБ</div><div class="small muted">Записи сессий хранятся 90 дней, затем удаляются — продлить можно для каждой. Предупредим за 30 дней до заполнения.</div></div><div class="bar" style="width:200px"><i style="width:36%"></i></div></div></div></div>`;
      return shell({ module: 'Встречи', active: 'video', compose: { label: 'Начать встречу', icon: 'video', go: 'prejoin' }, nav: videoNav('recordings'), body });
    },
    mount(root) {
      const inp = $('[data-input="search"]', root);
      const run = () => this.acts.search(inp);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); });
            inp.value = 'панические атаки ночью'; run();
    },
  });

  // ───────────────────────────── страница записи ─────────────────────────────
  add({
    id: 'recording', group: G, title: 'Страница записи', icon: 'file-text', phase: 'фаза 2Б', plan: '§ 5.14; § 5.22; § 12.8',
    desc: 'Плеер с главами, расшифровка синхронно с видео (клик по фразе — перемотка), повтор с чатом и предложениями на шкале, итоги Юи, доступ по билету, «Сделать уроком».',
    tips: ['Нажмите на любую фразу расшифровки', '«Повтор с чатом» — сообщения появляются в свой момент', '«Сделать уроком» — запись встаёт в курс'],
    acts: {
      ...common,
      seek: (el) => { $$('.tr-line').forEach((l) => l.classList.toggle('is-on', l === el)); $('#pl-time').textContent = el.dataset.t; const f = $('#pl-fill'); if (f) f.style.width = (el.dataset.p || 30) + '%'; toast(`Перемотано на ${el.dataset.t}`, { icon: 'play' }); },
      play: (el) => { el.classList.toggle('is-playing'); el.innerHTML = el.classList.contains('is-playing') ? I('pause', 'lg') : I('play', 'lg'); },
      lesson: () => modal(`<div class="eyebrow eyebrow--accent">Школа</div><h2 class="pmodal__title">Сделать уроком</h2><p class="pmodal__lead">Запись встанет уроком с главами, субтитрами и поиском. Вопросы из эфира Юя превратит в задание.</p>
        <label class="lbl">Курс</label><select class="inp"><option>Опора: 6 недель работы с тревогой</option><option>Мини-курс «Сон»</option></select><label class="lbl">Модуль</label><select class="inp"><option>Неделя 1 · Тревога как сигнал</option></select>
        <div class="optrow"><div class="optrow__main"><div class="optrow__title">Вырезать блок продаж (1:12:05–1:19:40)</div><div class="optrow__sub">Ученикам курса предложение уже не нужно</div></div><button class="tgl is-on" data-act="tgl"></button></div>
        <div class="pmodal__actions"><button class="btn btn--secondary" data-act="close-modal">Отмена</button><button class="btn btn--primary" data-go="school">${I('graduation-cap')} Добавить в курс</button></div>`),
      clips: () => modal(`<div class="eyebrow eyebrow--accent">Юя · фаза 6</div><h2 class="pmodal__title">5 лучших моментов для соцсетей</h2>${[['07:40', 'Тревога или расстройство — где граница', '0:48'], ['23:35', 'Упражнение 5-4-3-2-1 за минуту', '1:02'], ['41:10', '«Опора — не отсутствие тревоги»', '0:31'], ['58:22', 'Ночные панические атаки: дыхание', '0:55'], ['1:05:40', 'Ответ Вере про врача', '0:44']].map(([t, a, d]) => `<div class="lrow"><span class="mono small accent">${t}</span><div class="lrow__main"><div class="lrow__title">${a}</div><div class="lrow__sub">вертикальный 9:16 · субтитры вшиты · ${d}</div></div><button class="tgl is-on" data-act="tgl"></button></div>`).join('')}<div class="pmodal__actions"><button class="btn btn--primary" data-act="toast" data-text="5 роликов собираются — пришлю в Telegram через 4 минуты">Собрать ролики</button></div>`),
      replay: (el) => {
        el.classList.toggle('is-on');
        const host = $('#replay');
        if (!el.classList.contains('is-on')) { host.innerHTML = ''; return; }
        const items = [['olga', 'Добрый вечер из Екатеринбурга 🌿', '00:12'], ['vera', 'Вопрос: где граница, когда пора к врачу?', '07:51'], ['offer', 'Предложение: курс «Опора» −25 %', '1:12:10'], ['yana', '🎁 подарила 500 ₽', '1:13:02']];
        let i = 0; host.innerHTML = '';
        const h = every(1100, () => { if (i >= items.length) { clearInterval(h); return; } const [w, t, at] = items[i++];
          host.insertAdjacentHTML('beforeend', `<div class="replay__i fade-up"><span class="mono tiny subtle">${at}</span>${w === 'offer' ? `<span class="pill pill--accent">${I('target', 'xs')} ${t}</span>` : `${av(w, 22)}<span class="small">${t}</span>`}</div>`); });
      },
    },
    render() {
      const body = `<div class="page page--wide"><div class="row small muted" style="margin-bottom:10px;gap:6px"><a data-go="recordings">Записи</a>${I('chevron-right', 'xs')}<span>Эфир «Сон без тревоги»</span></div>
        <div class="grid g-side" style="grid-template-columns:minmax(0,1fr) 380px">
          <div><div class="player"><div class="player__video" style="background-image:url(img/people/p32.jpg)"><span class="player__plate"><b>Анна Соколова</b> психолог, КПТ</span>
              <button class="player__play" data-act="play">${I('play', 'lg')}</button><span class="player__cc">Опора — это не отсутствие тревоги, а способность оставаться в контакте с собой</span></div>
            <div class="player__bar"><span id="pl-time" class="mono small">41:10</span><div class="player__track"><i id="pl-fill" style="width:44%"></i>${D.chapters.map((c, i) => `<b style="left:${[0, 8, 25, 44, 62, 69, 77][i]}%" title="${c.title}"></b>`).join('')}</div><span class="mono small muted">1:34:12</span>
              <div class="seg"><button class="is-on" data-act="seg">1×</button><button data-act="seg">1,5×</button><button data-act="seg">2×</button></div><button class="btn btn--ghost btn--sm" data-act="toast" data-text="Субтитры: русский · перевод — в браузере">${I('cc')}</button></div></div>
            <div class="row" style="margin-top:16px;gap:8px;flex-wrap:wrap"><h1 class="page__title" style="font-size:24px;flex:1;min-width:260px">Эфир «Сон без тревоги»</h1>
              <button class="btn btn--secondary btn--sm replay-btn" data-act="replay">${I('message-circle')} Повтор с чатом</button><button class="btn btn--secondary btn--sm" data-act="clips">${I('wand')} Нарезать ролики</button><button class="btn btn--secondary btn--sm" data-act="toast" data-text="Архив для монтажа: 3 дорожки, постоянная частота кадров — ссылка в почте">${I('download')} Для монтажа</button><button class="btn btn--primary btn--sm" data-act="lesson">${I('graduation-cap')} Сделать уроком</button></div>
            <div class="small muted" style="margin-top:6px">16 октября · 3 120 просмотров · доступ по билету: бесплатно 3 дня, «С записью» — навсегда</div>
            <div id="replay" class="replay"></div>
            <div class="sec"><div class="sec__head"><h3>Главы</h3></div><div class="chapters">${D.chapters.map((c, i) => `<a class="chapter" data-act="seek" data-t="${c.t}" data-p="${[0, 8, 25, 44, 62, 69, 77][i]}"><span class="mono small accent">${c.t}</span><span>${c.title}</span></a>`).join('')}</div></div>
            <div class="sec"><div class="sec__head"><h3>Ключевые кадры показа экрана</h3><span class="pill">Юя · по смене картинки</span></div><div class="frames">${['Тревога: состояние и расстройство', 'Шкала GAD-7', 'Дыхание 4-7-8', 'Курс «Опора»'].map((x, i) => `<div class="frame"><div class="frame__img">${I(['chart-line', 'list-check', 'activity', 'graduation-cap'][i], 'xl')}</div><span class="tiny">${x}</span></div>`).join('')}</div></div></div>
          <div class="box box--flush" style="align-self:start;position:sticky;top:16px">
            <div class="tabs" data-tabs="rt" style="margin:0;padding:0 8px">${['Расшифровка', 'Итоги Юи', 'Вопросы', 'Доступ'].map((x, i) => `<button class="tab ${i ? '' : 'is-on'}" data-act="tab" data-pane="${i}">${x}</button>`).join('')}</div>
            <div data-pane-of="rt" data-pane="0" class="tr"><input class="inp" placeholder="Поиск по расшифровке" style="margin-bottom:10px">${D.transcript.map((l, i) => `<div class="tr-line ${l.t === '41:10' ? 'is-on' : ''}" data-act="seek" data-t="${l.t}" data-p="${[0, 2, 8, 16, 25, 44, 62, 77][i]}"><div class="row" style="gap:8px">${av(l.s, 22)}<b class="small">${P.person(l.s).short}</b><span class="mono tiny subtle">${l.t}</span></div><p>${l.text}</p></div>`).join('')}</div>
            <div data-pane-of="rt" data-pane="1" hidden class="tr"><div class="small" style="line-height:1.7"><b>Главное.</b> Тревога — сигнал, а не враг; граница с расстройством — длительность больше 6 месяцев и влияние на сон, работу и отношения. <br><br><b>Практики:</b> «5-4-3-2-1», дыхание с удлинённым выдохом, дневник тревоги.<br><br><b>Задачи:</b> ${['Выложить упражнение 5-4-3-2-1 в материалы курса', 'Ответить 14 зрителям про подростков отдельным эфиром', 'Дмитрию — список литературы для страницы записи'].map((t) => `<div class="row" style="gap:8px;margin-top:6px">${I('square-check', 'sm', 'accent')}<span>${t}</span></div>`).join('')}</div><div class="pmodal__note">${I('clock')} Итоги готовы через 7 мин 40 с после конца эфира</div></div>
            <div data-pane-of="rt" data-pane="2" hidden class="tr">${D.questions.map((q) => `<div class="lrow" style="padding:10px 4px"><span class="pill">${q.votes}</span><div class="lrow__main small">${q.text}</div></div>`).join('')}</div>
            <div data-pane-of="rt" data-pane="3" hidden class="tr"><div class="choice">${['Бесплатно 3 дня — всем зарегистрированным', 'Навсегда — билет «С записью» и VIP', 'Продаётся отдельно — 990 ₽'].map((x, i) => `<div class="choice__item ${i === 1 ? 'is-on' : ''}" data-act="choice"><span class="choice__radio"></span><div class="choice__title small">${x}</div></div>`).join('')}</div><div class="pmodal__note">${I('lock')} Подписанные ссылки со сроком · клиент видит, кто открывал его записи</div></div>
          </div></div></div>`;
      return shell({ module: 'Встречи', active: 'video', compose: { label: 'Начать встречу', icon: 'video', go: 'prejoin' }, nav: videoNav('recordings'), body });
    },
  });

  // ───────────────────────────── отчёт ─────────────────────────────
  add({
    id: 'report', group: G, title: 'Отчёт после эфира', icon: 'chart-bar', phase: 'фаза 2Б–3', plan: '§ 5.11 — отчёт о качестве; § 5.22 — воронка',
    desc: 'Посещаемость и кривая присутствия, воронка до оплаты, выручка, качество связи по регионам, проблемы зрителей и как их решила Юя, сегменты для дожима.',
    acts: { ...common, segment: (el) => toast(`Сегмент «${el.dataset.s}» создан — ${el.dataset.n} человек. Следом — сценарий`, { icon: 'users' }) },
    render() {
      const pres = [200, 900, 1500, 1900, 2210, 2380, 2418, 2390, 2350, 2310, 2280, 2200, 2120, 2240, 2260, 2050, 1880, 1700];
      const body = `<div class="page page--wide"><div class="page__head"><div class="page__titles"><div class="eyebrow">Эфир 16 октября · 1 ч 34 мин · отчёт собран через 7 мин после конца</div><h1 class="page__title">«Сон без тревоги» — <em>отчёт</em></h1></div>
        <div class="page__actions"><button class="btn btn--secondary" data-act="toast" data-text="PDF-отчёт для организатора отправлен на почту">${I('download')} PDF</button><button class="btn btn--primary" data-go="scenarios">${I('automation')} Сценарий после эфира</button></div></div>
        <div class="grid g4">${[['Пришли', '1 912', 'из 2 847 зарегистрированных · 67 %', 'users'], ['Пик онлайн', '2 418', 'на 41-й минуте', 'activity'], ['Выручка', '1 297 600 ₽', 'билеты 418 300 · курс 998 300 · подарки 96 400', 'wallet'], ['Оценка', '4,8', '1 104 оценки · связь 4,7', 'star']].map(([l, v, s, i]) => `<div class="box stat"><div class="stat__label">${I(i, 'xs')} ${l}</div><div class="stat__value">${v}</div><div class="small muted" style="margin-top:4px">${s}</div></div>`).join('')}</div>
        <div class="box" style="margin-top:16px"><div class="box__title">Кривая присутствия</div><div class="box__sub">Отметки — события эфира из журнала: выход гостя, показ предложения, вопросы</div>${C.area(pres, { h: 210, labels: ['19:00', '19:20', '19:40', '20:00', '20:20', '20:34'], marks: [{ at: .12, label: 'Дмитрий на сцене' }, { at: .62, label: 'вопросы' }, { at: .77, label: 'курс −25 %' }] })}</div>
        <div class="grid g2" style="margin-top:16px">
          <div class="box"><div class="box__title">Воронка</div>${C.funnel([{ l: 'Страница эфира', v: 9840 }, { l: 'Регистрация', v: 2847 }, { l: 'Пришли', v: 1912 }, { l: 'Досмотрели > 50 %', v: 1410 }, { l: 'Открыли предложение', v: 412 }, { l: 'Оплатили курс', v: 67 }])}</div>
          <div class="box"><div class="box__title">Качество связи по регионам</div><div class="box__sub">Цели: задержка видео ≤ 0,5 с, замирания < 1 на 10 мин, вход с первой попытки ≥ 98 %</div>
            <table class="tbl" style="margin-top:10px"><thead><tr><th>Регион</th><th class="num">Зрителей</th><th class="num">Задержка</th><th class="num">Замирания</th><th class="num">HLS</th><th class="num">С 1-й попытки</th></tr></thead><tbody>
            ${[['Москва', '1 186', '0,31 с', '0,2', '0,8 %', '99,4 %'], ['Франкфурт', '402', '0,38 с', '0,3', '1,1 %', '99,1 %'], ['Тель-Авив', '153', '0,42 с', '0,4', '1,9 %', '98,7 %'], ['Нью-Йорк', '134', '0,47 с', '0,6', '2,4 %', '98,5 %'], ['Прочие', '37', '0,52 с', '0,9', '4,1 %', '97,3 %']].map((r) => `<tr><td>${r[0]}</td>${r.slice(1).map((x, i) => `<td class="num ${i === 1 && r[0] === 'Прочие' ? 'warn' : ''}">${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
        <div class="grid g2" style="margin-top:16px">
          <div class="box"><div class="box__title"><span class="yu">${I('sparkles')}</span> Проблемы зрителей и как решены</div>${[['Нет звука (громкость вкладки 0 %)', '38', 'Юя ответила лично за 6 с'], ['Замирания на мобильном интернете', '21', 'переведены на 360p, затем вернулись'], ['Сеть режет WebRTC (офисы)', '14', 'автопереход на HLS за 3 с'], ['Не пришло письмо со ссылкой', '9', 'Юя прислала ссылку в Telegram'], ['Карта не прошла', '4', 'предложено СБП — 3 оплатили']].map(([a, n, b]) => `<div class="lrow" style="padding:10px 2px"><span class="pill">${n}</span><div class="lrow__main"><div class="lrow__title small">${a}</div><div class="lrow__sub">${b}</div></div></div>`).join('')}</div>
          <div class="box"><div class="box__title">${I('users')} Сегменты для следующего шага</div>${[['Досмотрели > 50 %, не купили', '1 343', 'запись + курс со скидкой 48 ч'], ['Открыли предложение, не оплатили', '345', 'напоминание о скидке'], ['Подарили, но нет билета', '61', 'благодарность + запись'], ['Не пришли', '935', 'запись на 3 дня']].map(([a, n, b]) => `<div class="lrow" style="padding:10px 2px"><div class="lrow__main"><div class="lrow__title small">${a}</div><div class="lrow__sub">${n} чел · ${b}</div></div><button class="btn btn--secondary btn--sm" data-act="segment" data-s="${a}" data-n="${n}">Сегмент</button></div>`).join('')}</div></div></div>`;
      return shell({ module: 'Встречи', active: 'video', compose: { label: 'Начать встречу', icon: 'video', go: 'prejoin' }, nav: videoNav('report'), body });
    },
  });

  // ───────────────────────────── Юя и доверие ─────────────────────────────
  const LEVELS = [
    ['observe', 'Наблюдает', 'Только читает и подсказывает вам. Ничего не делает сама.'],
    ['advise', 'Советует', 'Готовит действие — вы нажимаете одну кнопку.'],
    ['reversible', 'Обратимое — сама', 'Впустить, скрыть, закрепить, выключить микрофон, вывести на сцену, залы. Удалить, заблокировать, «Остановить всё» — с вашего «да».'],
    ['full', 'Полная самостоятельность', 'Всё, включая удаление, блокировку и «Остановить всё». Предохранители работают всегда.'],
  ];
  add({
    id: 'yuia', group: G, title: 'Юя: доверие и журнал', icon: 'sparkles', phase: 'фаза 2А / 4', plan: '§ 5.13; § 5.33 — MCP насквозь, уровни доверия',
    desc: 'Уровни доверия, точечные исключения, предохранители, «доверие по фактам» с проверочным набором, журнал каждого действия с отменой, подключение «мозга» и агентов специалистов.',
    tips: ['Смените уровень — меняется таблица «сама / с подтверждения»', 'Отмените действие в журнале', '«Остановить Юю» — у ведущего всегда под рукой'],
    acts: {
      ...common,
      level: (el) => { S.trust = el.dataset.k; P.go('yuia'); toast(`Уровень доверия: ${LEVELS.find((l) => l[0] === S.trust)[1]}`, { icon: 'sparkles' }); },
      undoLog: (el) => { const r = el.closest('.ylog__row'); r.classList.add('is-undone'); el.outerHTML = '<span class="pill">отменено вами</span>'; toast('Действие отменено. Юя учтёт это при следующем решении', { icon: 'undo' }); },
      raise: () => { S.trust = 'full'; P.go('yuia'); toast('Уровень поднят до «Полная самостоятельность» — для модерации чата', { icon: 'sparkles' }); },
      suite: (el) => { el.innerHTML = `${I('refresh', 'sm', 'spin')} Прогоняю…`; $$('.suite__i').forEach((s, i) => later(300 * (i + 1), () => s.classList.add('is-ok'))); later(2400, () => { el.innerHTML = `${I('check')} 6 из 6`; toast('Проверочный набор пройден на модели текущей версии'); }); },
      stop: () => toast('Юя остановлена во всех ваших встречах. Встречи продолжаются, быстрый путь работает', { icon: 'stop' }),
    },
    render() {
      const lvl = LEVELS.findIndex((l) => l[0] === S.trust);
      const acts = [['Впустить из зала ожидания', 1], ['Скрыть сообщение (спам, оскорбление)', 1], ['Склеить и поднять вопросы', 1], ['Выключить микрофон шумящему', 2], ['Вывести на сцену и убрать', 2], ['Разложить по сессионным залам', 2], ['Удалить из встречи (в зал ожидания с запретом)', 3], ['«Остановить всё»', 3], ['Возврат денег, удаление записи', 4]];
      const body = `<div class="page"><div class="page__head"><div class="page__titles"><div class="eyebrow eyebrow--accent">MCP насквозь · одни и те же действия для кнопок и агентов</div><h1 class="page__title">Юя — <em>модератор и помощница</em></h1>
        <p class="page__sub">Юя действует через тот же слой управления, что и ваши кнопки, с теми же правами и журналом. Уровень — настройка, а не правило в коде.</p></div>
        <div class="page__actions"><button class="btn btn--secondary" data-act="stop">${I('stop')} Остановить Юю везде</button></div></div>
        <div class="grid g-side">
          <div class="col" style="gap:16px">
            <div class="box"><div class="box__title">Уровень доверия по умолчанию</div><div class="choice" style="margin-top:12px">${LEVELS.map(([k, t, s], i) => `<div class="choice__item ${i === lvl ? 'is-on' : ''}" data-act="level" data-k="${k}"><span class="choice__radio"></span><div><div class="choice__title">${t}</div><div class="choice__sub">${s}</div></div></div>`).join('')}</div>
              <div class="optrow" style="margin-top:6px"><div class="optrow__main"><div class="optrow__title">Деньги и стирание</div><div class="optrow__sub">Возвраты и удаление записей — отдельный переключатель. По умолчанию — с вашего подтверждения</div></div><button class="tgl ${S.moneyTrust ? 'is-on' : ''}" data-act="tgl" data-text="Юя сможет делать возвраты сама — предохранитель: не больше 3 в час"></button></div></div>
            <div class="box box--flush"><table class="tbl"><thead><tr><th>Действие</th><th>Сейчас</th></tr></thead><tbody>${acts.map(([a, need]) => { const self = need === 4 ? S.moneyTrust : lvl >= need; return `<tr><td>${a}</td><td>${lvl === 0 ? '<span class="pill">подсказка</span>' : self ? '<span class="pill pill--ok">сама</span>' : '<span class="pill pill--warn">с вашего «да»</span>'}</td></tr>`; }).join('')}</tbody></table></div>
            <div class="box"><div class="box__title">Точечно</div><div class="box__sub">Уровень можно задать для организации, шаблона встречи и конкретного агента</div>
              <table class="tbl" style="margin-top:8px"><tbody>${[['Модерация чата в эфирах', 'Полная самостоятельность'], ['Удаление людей в группах', 'С подтверждения'], ['Сессионные залы', 'Обратимое — сама'], ['Сессии 1:1', 'Наблюдает · итоги только мне']].map(([a, b]) => `<tr><td>${a}</td><td class="num"><span class="pill pill--accent">${b}</span></td></tr>`).join('')}</tbody></table></div>
            <div class="box"><div class="box__title">Журнал действий</div><div class="box__sub">Каждое действие — событие с причиной и отменой. Тот же журнал читают отчёты и аудит</div>
              <div class="ylog">${D.yuiaLog.map((l) => `<div class="ylog__row"><span class="mono tiny subtle">${l.t}</span><div class="sp"><div class="small"><b>${l.act}</b> · ${esc(l.obj)}</div><div class="tiny muted">причина: ${esc(l.why)} · агент · через Юю</div></div>${l.undo ? `<button class="btn btn--ghost btn--sm" data-act="undoLog">${I('undo')} Отменить</button>` : '<span class="pill">без отмены</span>'}</div>`).join('')}</div></div>
          </div>
          <div class="col" style="gap:16px">
            <div class="box box--glow"><div class="box__title">${I('target')} Доверие по фактам</div><div class="stat__value" style="font-size:34px">1,4 %</div><div class="small muted">действий вы отменили за последние 20 встреч (2 980 действий)</div>
              ${lvl < 3 ? `<div class="box" style="margin-top:12px;padding:12px;background:var(--color-bg-muted);border:0"><div class="small">Модерацию чата можно доверить полностью: за 20 эфиров ни одной отмены скрытия.</div><button class="btn btn--primary btn--sm" style="margin-top:10px" data-act="raise">Поднять уровень</button></div>` : '<div class="pill pill--ok" style="margin-top:12px">полная самостоятельность</div>'}</div>
            <div class="box"><div class="row"><div class="box__title sp">Проверочный набор</div><button class="btn btn--secondary btn--sm" data-act="suite">${I('play')} Прогнать</button></div><div class="box__sub">Прогоняется на каждой новой модели и новом описании инструментов</div>
              <div class="suite">${['Спам-атака 40 сообщений в секунду', '«Зумбомбинг»: незнакомый показывает экран', 'Шумящий участник', 'Поток повторяющихся вопросов', 'Просьба ведущей голосом', 'Конфликт в чате'].map((x) => `<div class="suite__i">${I('check-circle')}<span class="small">${x}</span></div>`).join('')}</div></div>
            <div class="box"><div class="box__title">Предохранители</div>${[['Не больше 5 удалений в минуту', true], ['Снизить уровень при всплеске необычных действий', true], ['Кнопка «Остановить Юю» у ведущего', true]].map(([a, on]) => `<div class="optrow"><div class="optrow__main small">${a}</div><button class="tgl ${on ? 'is-on' : ''}" data-act="tgl"></button></div>`).join('')}</div>
            <div class="box"><div class="box__title">${I('bolt')} Быстрый путь — без модели</div><div class="box__sub">Частые команды исполняются сервером мгновенно, даже если «мозг» недоступен</div>
              <ul class="plist small">${['«Юя, выключи микрофон Ивану»', '«Закрепи последнее сообщение»', '«Выведи Марию на сцену»', '«Опрос: да / нет»', 'Фильтр ссылок, флуда и мата — до показа, < 50 мс', 'Ответы «не слышно», «где запись» — по данным связи человека'].map((x) => `<li>${x}</li>`).join('')}</ul></div>
            <div class="box"><div class="box__title">${I('node')} Подключение</div><div class="lrow" style="padding:10px 2px"><span class="health-dot health-dot--good"></span><div class="lrow__main"><div class="lrow__title small">«Мозг» Юи · MCP</div><div class="lrow__sub">задания встреч · 3 сессии свободны</div></div></div>
              <div class="lrow" style="padding:10px 2px"><span class="health-dot health-dot--good"></span><div class="lrow__main"><div class="lrow__title small">Медиапомощник</div><div class="lrow__sub">субтитры GigaAM · голос Юи</div></div></div>
              <button class="btn btn--secondary btn--sm" data-act="toast" data-text="Ключ MCP для вашего агента выпущен — права как у вас, уровень «Советует»">${I('user-plus')} Подключить своего агента</button></div>
          </div></div></div>`;
      return shell({ module: 'Встречи', active: 'video', compose: { label: 'Начать встречу', icon: 'video', go: 'prejoin' }, nav: videoNav('yuia'), body });
    },
  });
})();

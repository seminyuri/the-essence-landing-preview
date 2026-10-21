/* Вместе с платформой: как видео живёт в действующих модулях (календарь, задачи, CRM, главная,
   база знаний, почта) и что прототип взял из дизайн-системы the-essence, что добавил, что
   предлагает поменять в ней. Фрагменты модулей собраны на их собственных классах продукта
   (.kanban-card, .due-date, .timeline, .chip, .card, .eyebrow, .shell-*). */
(function () {
  const { add, I, av, esc, shell, videoNav, toast, btn, chip, seg, tabs, pane, sw, kpi, page, note } = P;
  const G = 'Вместе с платформой';
  const shellV = (on, body) => shell({ module: 'Видео', active: 'video', compose: { label: 'Начать встречу', icon: 'video', go: 'prejoin' }, nav: videoNav(on), body });

  // окно модуля: шапка как у Shell::SidebarHeaderComponent, справа — что тут делает видео
  const win = (icon, mod, body, how, phase) => `<section class="tp card">
    <header class="tp__h"><span class="tp__ic">${I(icon, 'md')}</span><span class="shell-sidebar__name"><span class="shell-sidebar__brandname">Суть</span> <span class="shell-sidebar__x">✕</span> <span class="shell-sidebar__module">${mod}</span></span><span class="sp"></span>${chip('работает сейчас')}</header>
    <div class="tp__b">${body}</div>
    <footer class="tp__f">${I('video', 'sm')}<div><b>Что делает видео:</b> ${how}<div class="tp__ph">${phase}</div></div></footer></section>`;

  const calendar = `<div class="tpcal"><div class="tpcal__days"><span></span>${[['вт', 20], ['ср', 21, 1], ['чт', 22]].map(([d, n, on]) => `<span class="tpcal__d ${on ? 'is-on' : ''}"><i>${d}</i><b>${n}</b></span>`).join('')}</div>
    <div class="tpcal__grid">${['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'].map((h, r) => `<span class="tpcal__h" style="grid-row:${r + 1};grid-column:1">${h}</span>${[2, 3, 4].map((c) => `<span style="grid-row:${r + 1};grid-column:${c}"></span>`).join('')}`).join('')}
      <a class="tpcal__ev" style="grid-column:3;grid-row:2" data-go="prejoin">${I('video', 'xs')} Мария Иванова · сессия</a>
      <a class="tpcal__ev tpcal__ev--grp" style="grid-column:2;grid-row:4/6" data-go="meeting">${I('users', 'xs')} Супервизия «Опора»</a>
      <div class="tpcal__pop"><div class="eyebrow">сегодня · 10:00–11:00</div><div class="b mt8">Мария Иванова · 9-я встреча</div><div class="t-xs muted mt8">оплачено · согласие на запись есть</div>
        <div class="row mt12" style="gap:6px">${btn('Войти', { kind: 'primary', size: 'sm', icon: 'video', go: 'prejoin' })}${btn('Подготовка', { size: 'sm', go: 'yuia' })}</div>
        <div class="tpcal__link mono">the-essence.ai/m/anna</div></div></div></div>`;

  const tasks = `<div class="tpkb"><div class="tpkb__col"><div class="tpkb__h"><span class="eyebrow">К выполнению</span><span class="shell-nav__count">3</span></div>
    ${[['Отправить Марии анкету перед 10-й встречей', 'today', 'сегодня', '12:40'], ['Подобрать статьи о дыхательных практиках', 'soon', 'пт', '34:12'], ['Перенести группу «Опора» на 19:00', 'upcoming', '28 окт', '58:05']].map(([t, d, dl, ts]) => `<div class="kanban-card"><div class="kanban-card__title">${t}</div>
      <div class="kanban-card__meta"><a class="tpkb__src" data-go="recording">${I('play', 'xs')} встреча 21.10 · ${ts}</a><span class="sp"></span><span class="due-date due-date--${d}">${dl}</span>${av('anna', 22)}</div></div>`).join('')}</div></div>`;

  const crm = `<div class="row" style="gap:14px">${av('maria', 52)}<div class="sp"><div class="h3">Мария Иванова</div><div class="row mt8" style="gap:6px">${chip('клиент с марта', 'accent')}${chip('согласие на запись', 'ok')}</div></div>${btn('', { icon: 'video', kind: 'white', cls: 'btn2--icon', go: 'prejoin' })}</div>
    <ul class="timeline mt16">${[['Сессия 9', 'запись и итоги · 58 мин', 'сегодня', 'recording'], ['Оплата 4 500 ₽', 'ЮKassa · чек в «Мой налог»', 'вчера', 'sales'], ['Анкета перед встречей', 'заполнено 6 из 10', '19 окт', 'questionnaire'], ['Сессия 8', 'запись удалена по сроку', '14 окт', 'recordings']].map(([a, t, w, g]) => `<li class="timeline__item" data-go="${g}" style="cursor:pointer"><span class="timeline__actor">${a}</span><span class="timeline__text">${t}</span><span class="timeline__when">${w}</span></li>`).join('')}</ul>`;

  const home = `<div class="eyebrow">ближайшее</div><div class="tphome mt12">${av('maria', 44)}<div class="sp"><div class="b">Мария Иванова · через 36 минут</div><div class="t-xs muted">10:00 · анкета 6 из 10 · Юя приготовила три темы</div></div>${btn('Войти', { kind: 'primary', size: 'sm', icon: 'video', go: 'prejoin' })}</div>
    <div class="tphome tphome--sub mt8">${I('play')}<div class="sp t-sm">3 записи ждут вашего конспекта</div><a class="sec__link" data-go="recordings">Открыть ${I('arrow-right', 'xs')}</a></div>`;

  const kb = `<div class="t-xs muted">Пространство «Супервизии» · документ</div><div class="h3 mt8">Супервизия «Опора» · 21 октября</div><div class="t-xs muted mt8">конспект без имён клиентов · сделала Юя, проверила Анна</div>
    <ol class="tpkbdoc mt12">${[['00:04', 'Запрос группы'], ['12:40', 'Случай: границы в работе с семьёй'], ['34:12', 'Техника «два стула» — разбор'], ['58:05', 'Договорённости и следующая встреча']].map(([ts, t]) => `<li><a class="mono" data-go="recording">${ts}</a><span>${t}</span></li>`).join('')}</ol>`;

  const mail = `<div class="tpmail"><div class="row t-sm"><b>Анна Соколова</b><span class="muted">anna@the-essence.ai</span><span class="sp"></span><span class="t-xs muted">09:00</span></div>
    <div class="b mt8">Встреча сегодня в 10:00</div><div class="t-sm muted mt8">Мария, жду вас. Камера и микрофон проверятся на входе, ставить ничего не нужно. Если что-то сорвётся — позвоните, номер в письме.</div>
    <div class="row mt12" style="gap:8px">${btn('Войти в комнату', { kind: 'primary', size: 'sm', go: 'prejoin' })}${btn('В календарь', { size: 'sm', icon: 'calendar', act: 'toast', data: 'data-text="Событие с ссылкой на комнату — в календаре"' })}</div></div>`;

  add({
    id: 'touchpoints', after: 'report', group: G, eyebrow: 'Связи с модулями', title: 'Видео в других модулях', icon: 'layout-grid', phase: 'фазы 1–4', plan: '§ 1.8 «один продукт, отдельные модули», § 5.9 итоги, § 12.6 CRM',
    desc: 'Видео не живёт отдельно: встреча — событие календаря с кнопкой «Войти», итоги — задачи со ссылкой на момент записи, клиент — та же карточка CRM, конспект — документ базы знаний, приглашение — письмо из вашего ящика. Фрагменты собраны на классах самих модулей.',
    tips: ['Нажмите на событие в календаре — откроется проверка перед входом', 'Ссылка «встреча 21.10 · 34:12» в задаче ведёт ровно в этот момент записи', 'Строки ленты CRM ведут в запись, оплату и анкету'],
    render() {
      return shellV('', page({ wide: true, title: 'Видео в <em>других</em> модулях', sub: 'Одна встреча — шесть мест, где она уже нужна. Ничего не копируется: модули показывают одну и ту же встречу.', body: `<div class="tpgrid">
        ${win('calendar', 'Календарь', calendar, 'встреча — событие календаря; «Войти» и подготовка Юи прямо во всплывающем окне события, ссылка на комнату постоянная.', 'фаза 1 · уже есть: Calendar::Event, Session')}
        ${win('square-check', 'Задачи', tasks, 'договорённости из итогов Юя ставит задачами; у каждой — ссылка на момент записи и срок из разговора. Исполнитель — тот, кто договорился.', 'фаза 2А · § 5.9 итоги')}
        ${win('users', 'CRM', crm, 'клиент встречи и контакт CRM — одна запись: лента собирает встречи, оплаты и анкеты; кнопка видео зовёт в комнату.', 'фаза 4 · § 12.6')}
        ${win('home', 'Главная', home, 'на главной платформы — ближайшая встреча с обратным отсчётом и записи, ждущие конспекта.', 'фаза 1')}
        ${win('book', 'База знаний', kb, 'конспект встречи — документ с главами и ссылками на моменты; в групповых — без имён клиентов.', 'фаза 3 · § 5.12.4')}
        ${win('mail', 'Почта', mail, 'приглашения, напоминания и итоги уходят из вашего ящика, а не с безликого адреса; ответ приходит вам.', 'фаза 2А')}
      </div>` }));
    },
  });

  // ───────────── дизайн-система ─────────────
  const TAKEN = [
    ['Оболочка', 'Shell::SidebarHeaderComponent, SidebarActionComponent, .shell-nav', 'шторка модуля: «Суть ✕ Видео», поиск с «/», главная кнопка, пункты со счётчиками; плашки пространства нет — в видео оно одно'],
    ['Юя', 'Shell::YuiaPanelComponent (.yuia, yuia/_panel.css)', 'правая шторка с чатом; итоги встреч приходят в этот чат автосообщением'],
    ['Правая панель модулей', 'Shell::AppRailComponent (MODULES)', 'аватар, колокол, модули в порядке продукта, помощь и настройки внизу; новые модули плана стоят рядом с родственными'],
    ['Колокол и меню профиля', '.shell-bell__menu, .shell-menu', 'те же строки уведомлений с цветным значком и меню профиля'],
    ['Телефон', 'shared/_mobile_shell, MobileModuleSwitcherComponent', 'шапка 48 px: меню, модуль, панель модулей, колокол, аватар'],
    ['Поиск', 'командная палитра «/» и ⌘K', 'экраны, люди, встречи — одним окном'],
    ['Поддержка', '.wg-launcher (support/widget.css)', 'круглая кнопка внизу справа, общая для всех модулей'],
    ['Заголовок страницы', '.eyebrow + тонкий H1 + курсив Lora (video/hub)', '«ВИДЕО · ЗАПИСИ», «Доброе утро, Анна»'],
    ['Карточки и плитки', '.card, .act-card', 'белые, тонкая рамка, мягкая тень; глиф 46 px на accent-soft'],
    ['Кнопки, чипы, вкладки', 'ButtonComponent, .chip, .tabs, .segmented, .undo-toast', 'классы продукта в разметке; цвета и скругления — его'],
    ['Показатели', '.stat-card', 'моно-подпись, тонкая цифра'],
    ['Поля', '.field, .input', 'белые, рамка, кольцо accent-soft в фокусе'],
    ['Задачи, лента, сроки', '.kanban-card, .timeline, .due-date', 'в экране «Видео в других модулях»'],
    ['Токены и шрифты', '_design_tokens.css, _fonts.css', 'Manrope 200/400/600, Lora italic, JetBrains Mono; светлая и тёмная темы'],
  ];
  const NEW = [
    ['Панель управления встречей', 'подписи под значками, меню устройства у микрофона и камеры, «Ещё» с поиском, ужимание подписей по ширине', 'Video::ControlBarComponent'],
    ['Плитка участника и сцены', 'говорящий, сетка, докладчик, сцены эфира, «картинка в картинке»', 'Video::TileComponent, Video::StageComponent'],
    ['Тёмная тема комнаты', 'та же палитра токенов, тёмная поверхность и персиковая главная кнопка — как у «Проверки перед входом» в продукте', 'data-theme="dark" на комнате'],
    ['Боковые панели комнаты', 'чат, участники, опросы, вопросы, заметки — одна выезжающая панель', 'на основе .side-panel'],
    ['Пауза безопасности и кризисный протокол', 'красная кнопка, спокойный экран, телефоны помощи', '§ 5.23 плана'],
  ];
  const PROPOSE = [
    ['Касание 44 px у вкладок и сегментов', 'в _mobile.css правило «44 px на касание» есть у .btn и .input, но нет у .tabs__tab и .segmented__option: на телефоне они 24–33 px', 'дефект ДС, править в продукте'],
    ['Шаг крупнее для рабочих экранов', 'основной текст 15 px вместо 13,5–14,5 и кнопки 44 px на компьютере — как у Яндекса: меньше промахов и усталости на длинной сессии', 'решение Юрия — меняет все модули'],
    ['Серая кнопка без рамки', 'вторичная кнопка — заливка bg-muted без рамки (как у Яндекса); в продукте --secondary — белая с рамкой', 'вкус; вместе с шагом выше'],
    ['Карточка «ближайшее событие»', 'заливка, аватар с кольцом, обратный отсчёт и одна главная кнопка — годится главной, календарю и CRM', 'новый компонент ДС'],
    ['Без плашки пространства в видео', 'в продукте внизу шторки видео стоит переключатель пространства «Суть · Test / Специалист», хотя у специалиста оно одно — переключать нечего', 'решение Юрия 21.10 — убрать'],
    ['Метка «новый модуль» в рельсе', 'точка у значка и подпись «новый модуль», пока человек туда не заходил', 'небольшое дополнение AppRail'],
  ];

  add({
    id: 'ds', after: 'touchpoints', group: G, eyebrow: 'Для разработки', title: 'Дизайн-система', icon: 'palette', phase: 'все фазы', plan: 'docs/design-system the-essence; прототип: css/ds — копия продукта',
    desc: 'Что прототип взял из дизайн-системы the-essence как есть, что добавляет видео (в продукте этого нет) и что прототип предлагает поменять в самой системе. Внизу — живые образцы на классах продукта.',
    tips: ['Вкладки переключают три списка', 'Образцы внизу — те же классы, что в коде продукта'],
    render() {
      const rows = (list, cols) => `<div class="card card--flush"><table class="tbl2"><thead><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${list.map((r) => `<tr>${r.map((c, i) => `<td class="${i === 1 && cols[1] === 'Компонент продукта' ? 'mono t-xs' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      const spec = `<div class="dsx">
        <div class="dsx__i"><div class="eyebrow">ButtonComponent</div><div class="row row--wrap mt8">${btn('Войти', { kind: 'primary', icon: 'video', act: 'toast', data: 'data-text="btn btn--primary — главная кнопка, одна на блок"' })}${btn('Пригласить', { act: 'toast', data: 'data-text="btn btn--secondary — в прототипе серая заливка без рамки"' })}${btn('Отмена', { kind: 'ghost', act: 'toast', data: 'data-text="btn btn--ghost"' })}${btn('Завершить', { kind: 'danger', act: 'toast', data: 'data-text="btn btn--danger — только необратимое"' })}</div></div>
        <div class="dsx__i"><div class="eyebrow">.chip</div><div class="row row--wrap mt8">${chip('оплачено', 'ok')}${chip('ждёт', 'warn')}${chip('отменено', 'bad')}${chip('9-я встреча', 'accent')}${chip('черновик')}</div></div>
        <div class="dsx__i"><div class="eyebrow">.segmented · .tabs</div><div class="mt8">${seg(['Сетка', 'Докладчик', 'Сцена'])}</div><div class="mt12">${tabs('dsx', ['Предстоящие', 'Прошедшие', 'Записи'])}</div></div>
        <div class="dsx__i"><div class="eyebrow">.field · .input · toggle</div><label class="fld" style="margin-top:8px"><span class="fld__l">Название встречи</span><input class="in" value="Супервизия «Опора»"></label><div class="row mt12">${sw(true)}<span class="t-sm">Запись с согласия</span></div></div>
        <div class="dsx__i">${kpi('Выручка · октябрь', '1 412 900 ₽', '+38 % к сентябрю')}</div>
        <div class="dsx__i"><div class="eyebrow">.undo-toast</div><div class="mt8">${btn('Показать тост', { act: 'toast', data: 'data-text="Запись удалена — можно вернуть 6 секунд"' })}</div></div>
      </div>`;
      return shellV('', page({ wide: true, title: 'Дизайн-<em>система</em>', sub: `Прототип собран на дизайн-системе the-essence: ${TAKEN.length} частей взяты как есть, ${NEW.length} — новое для видео, ${PROPOSE.length} предложений поменять саму систему.`, body: `
        ${tabs('ds', [`Взяли из продукта <span class="cnt">${TAKEN.length}</span>`, `Новое для видео <span class="cnt">${NEW.length}</span>`, `Предлагаем в ДС <span class="cnt">${PROPOSE.length}</span>`])}
        ${pane('ds', 0, rows(TAKEN, ['Что', 'Компонент продукта', 'Как в прототипе']))}
        ${pane('ds', 1, rows(NEW, ['Что', 'Зачем и как', 'Будущий компонент']))}
        ${pane('ds', 2, rows(PROPOSE, ['Предложение', 'Почему', 'Кто решает']) + note('info-circle', 'Каждое предложение заведено задачей в проекте «Видеомодуль 2.0». Оболочка и общие части в прототипе — как в продукте; крупный шаг (15 px, кнопки 44 px, серые вторичные кнопки) прототип уже показывает, чтобы было с чем сравнить.'))}
        <div class="sec"><div class="sec__h"><h2 class="h2">Образцы на классах продукта</h2></div>${spec}</div>` }));
    },
  });
})();

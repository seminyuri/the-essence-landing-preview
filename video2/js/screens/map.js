(function () {
  const { add, I, esc, screens } = P;

  const GROUPS = {
    'Кабинет: встречи и эфиры': 'Где специалист и организатор готовят встречи, видят записи, отчёты и настраивают Юю',
    'Вход участника': 'Страница эфира, регистрация, проверка устройств, залы ожидания',
    'Комната': 'Одна комната — все форматы: разговор, встреча, сцена, зритель',
    'Инструменты в комнате': 'Режим практики, сессионные залы, расстановки, доска, проверка связи',
    'После встречи': 'Итоги, задачи, следующая сессия и оплата',
    'Модули вокруг эфира': 'Мессенджер, продажи, страницы и рассылки, школа, CRM и сценарии',
    'Эксплуатация': 'Пульт дежурного и публичная страница статуса',
  };

  add({
    id: 'map', group: 'Старт', title: 'Карта прототипа', icon: 'layout-grid',
    desc: 'Все экраны прототипа по разделам плана',
    render() {
      const groups = {};
      screens.filter((s) => s.id !== 'map' && !s.hidden).forEach((s) => (groups[s.group] = groups[s.group] || []).push(s));
      return `<div class="map">
        <section class="map-hero">
          <div class="map-hero__brand"><img src="seal-compact.svg" width="30" height="30" alt=""><span class="shell-sidebar__name"><span class="shell-sidebar__brandname">Суть</span><span class="shell-sidebar__x">✕</span><span class="shell-sidebar__module">Встречи и эфиры 2.0</span></span>
            <span class="pill pill--accent" style="margin-left:8px">прототип · данные вымышленные</span></div>
          <h1>Эфиры, сессии и практика — <em>в одном кабинете</em>, где Юя ведёт встречу вместе с вами</h1>
          <p>Кликабельный прототип всего функционала плана «Видеомодуль 2.0»: от страницы эфира и оплаты в эфире до сессии 1:1 с карточкой клиента, режима практики, расстановок, мессенджера и школы. Построен на настоящей дизайн-системе the-essence — токены, шрифты, иконки и оболочка взяты из кода платформы.</p>
          <div class="map-hero__cta">
            <button class="btn btn--primary btn--lg" data-go="hub">${I('play')} Начать с кабинета</button>
            <button class="btn btn--secondary btn--lg" data-go="stage">${I('broadcast')} Сразу в эфир</button>
            <button class="btn btn--ghost btn--lg" data-go="call">${I('video')} Сессия 1:1</button>
          </div>
          <div class="map-facts">
            <div><b>${screens.filter((s) => !s.hidden).length - 1}</b><span>экранов</span></div>
            <div><b>7</b><span>разделов</span></div>
            <div><b>0</b><span>мёртвых кнопок — всё отвечает</span></div>
            <div><b>Alt ← →</b><span>листать экраны</span></div>
          </div>
        </section>
        <div class="map-body">
          ${Object.entries(groups).map(([g, items]) => `<section class="map-group">
            <div class="map-group__head"><h2>${esc(g)}</h2><p>${esc(GROUPS[g] || '')}</p></div>
            <div class="map-grid">${items.map((s) => `<a class="map-card" data-go="${s.id}">
              <div class="map-card__top"><span class="map-card__glyph">${I(s.icon || 'dot', 'md')}</span><span class="map-card__title">${esc(s.title)}</span>${s.frame === 'phone' ? I('device-mobile', 'sm', 'subtle') : ''}</div>
              <div class="map-card__desc">${esc(s.desc || '')}</div>
              <div class="map-card__meta">${s.phase ? `<span class="pill pill--accent">${esc(s.phase)}</span>` : ''}${s.plan ? `<span class="pill">${esc(s.plan.split(';')[0])}</span>` : ''}</div></a>`).join('')}</div></section>`).join('')}
        </div></div>`;
    },
  });
})();

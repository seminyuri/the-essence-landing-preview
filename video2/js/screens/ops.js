(function () {
  const { add, I, esc, toast, modal, go, every, later, shell, $, $$ } = P;
  const G = 'Эксплуатация';
  const NODES = [
    { id: 'msk-a', role: 'сцена + российские зрители', cpu: 61, rooms: 14, ppl: 1286, dc: 'Москва · ДЦ-1' },
    { id: 'msk-b', role: 'переполнение · картинка эфира · резерв', cpu: 38, rooms: 9, ppl: 412, dc: 'Москва · ДЦ-2' },
    { id: 'fra-edge', role: 'зеркало: Европа, Израиль', cpu: 22, rooms: 2, ppl: 402, dc: 'Франкфурт' },
    { id: 'use-edge', role: 'зеркало: Америка', cpu: 9, rooms: 1, ppl: 134, dc: 'Нью-Йорк' },
    { id: 'tlv', role: 'по требованию: эфир 23 окт', cpu: 14, rooms: 1, ppl: 153, dc: 'Тель-Авив', temp: true },
  ];

  add({
    id: 'ops', group: G, title: 'Пульт дежурного', icon: 'server', phase: 'фаза 0–3', plan: '§ 5.17 — наблюдаемость; § 5.27 — надёжность; § 5.2 — регион по требованию',
    desc: 'Узлы и их нагрузка, ретрансляторы, запись и HLS, распознавание, Юя, приложение; синтетический пробник из регионов; учения — выключить узел и посмотреть, что всё происходит само; поднять регион под эфир за ~15 минут; выкат по ступеням.',
    tips: ['«Учения: выключить msk-a» — сцена переезжает на msk-b', '«Поднять регион» — узел встаёт кодом', 'Проверка перед эфиром — там же'],
    acts: {
      drill: (el) => {
        el.disabled = true; const card = $('[data-node="msk-a"]'); card.classList.add('is-down'); card.querySelector('.node__st').innerHTML = '<span class="pill pill--bad">недоступен</span>';
        const log = $('#drill'); log.innerHTML = '';
        const steps = [['0,0 с', 'msk-a перестал отвечать — пробник и метрики'], ['0,8 с', 'зрители msk-a спросили «где моё мероприятие» → msk-b'], ['2,9 с', '1 286 зрителей переехали · HLS подхватил 41 человека'], ['6,4 с', 'исходная комната сцены поднята на msk-b'], ['11,7 с', 'докладчики и ретрансляторы переподключились · запись дорожек продолжена на msk-b'], ['12,0 с', 'сцена восстановлена — цель ≤ 15 с выполнена']];
        steps.forEach(([t, s], i) => later(700 * (i + 1), () => log.insertAdjacentHTML('beforeend', `<div class="lrow fade-up" style="padding:6px 2px"><span class="mono tiny accent">${t}</span><span class="small">${s}</span></div>`)));
        later(700 * 7, () => { card.classList.remove('is-down'); card.querySelector('.node__st').innerHTML = '<span class="pill pill--ok">в строю</span>'; el.disabled = false; toast('Учения пройдены: переезд 2,9 с, сцена 12,0 с · разбор сохранён', { icon: 'check-circle' }); });
      },
      region: () => modal(`<div class="eyebrow eyebrow--accent">Регион по требованию</div><h2 class="pmodal__title">Поднять узел под эфир</h2><label class="lbl">Страна</label><select class="inp"><option>Казахстан · Алматы</option><option>Израиль · Тель-Авив</option><option>Германия · Франкфурт</option></select>
        <label class="lbl">Когда</label><input class="inp" value="23 окт 18:30 — 21:30"><div class="pmodal__note">${I('server')} LiveKit + nginx + ретранслятор описаны кодом, встают за ~15 минут у почасового провайдера. На время эфира узел не принимает других встреч.</div>
        <div id="rprog"></div><div class="pmodal__actions"><button class="btn btn--primary" id="rgo">${I('play')} Поднять</button></div>`),
      canary: (el) => { el.textContent = 'Расширено до 25 %'; toast('Выкат на 25 % комнат · бюджет ошибок цел · откат автоматический при сгорании', { icon: 'route' }); },
    },
    render() {
      const nodes = NODES.map((n) => `<div class="node box" data-node="${n.id}"><div class="row"><b class="mono">${n.id}</b>${n.temp ? '<span class="pill pill--accent">временный</span>' : ''}<span class="sp"></span><span class="node__st"><span class="pill pill--ok">в строю</span></span></div>
        <div class="tiny muted" style="margin-top:4px">${n.dc} · ${n.role}</div><div class="row small" style="margin-top:10px;gap:12px"><span>${I('cpu', 'xs')} ${n.cpu} %</span><span>${I('door', 'xs')} ${n.rooms}</span><span>${I('users', 'xs')} ${n.ppl.toLocaleString('ru-RU')}</span></div><div class="bar" style="margin-top:8px"><i style="width:${n.cpu}%"></i></div></div>`).join('');
      const body = `<div class="page page--wide"><div class="page__head"><div class="page__titles"><div class="eyebrow">Дежурный · Глеб · эфир «Тревога и опора» идёт 42 мин</div><h1 class="page__title">Пульт дежурного</h1></div>
        <div class="page__actions"><button class="btn btn--secondary" data-act="region">${I('globe')} Поднять регион</button><button class="btn btn--danger" data-act="drill">${I('bolt-off')} Учения: выключить msk-a</button></div></div>
        <div class="nodes">${nodes}</div>
        <div class="grid g3" style="margin-top:16px">
          <div class="box"><div class="box__title">${I('route')} Ретрансляторы</div>${[['Москва → Франкфурт', '41 мс · 3 слоя · PLI 0,2/мин'], ['Москва → Нью-Йорк', '118 мс · 3 слоя'], ['Москва → Тель-Авив', '56 мс · туннель не нужен']].map(([a, b]) => `<div class="lrow" style="padding:8px 2px"><span class="health-dot health-dot--good"></span><div class="lrow__main small">${a}<div class="tiny muted">${b}</div></div></div>`).join('')}</div>
          <div class="box"><div class="box__title">${I('circle-dot')} Запись и HLS</div>${[['Запись дорожек · msk-a', '3 докладчика · S3 в России'], ['Картинка эфира · msk-b', '720p · свежесть плейлиста 1,1 с'], ['Кэш HLS на периферии', 'попаданий 97 %']].map(([a, b]) => `<div class="lrow" style="padding:8px 2px"><span class="health-dot health-dot--good"></span><div class="lrow__main small">${a}<div class="tiny muted">${b}</div></div></div>`).join('')}</div>
          <div class="box"><div class="box__title">${I('cc')} Речь и Юя</div>${[['GigaAM · субтитры', '3 говорящих · 0,6 с'], ['GigaAM · итоговая', 'очередь 4 записи'], ['Юя · MCP', 'цикл 1,8 с · 3 сессии свободны'], ['Приложение', 'p95 входа 182 мс · рассылка событий 34 мс']].map(([a, b]) => `<div class="lrow" style="padding:8px 2px"><span class="health-dot health-dot--good"></span><div class="lrow__main small">${a}<div class="tiny muted">${b}</div></div></div>`).join('')}</div></div>
        <div class="grid g2" style="margin-top:16px">
          <div class="box"><div class="box__title">${I('activity')} Синтетический пробник · раз в 5 минут</div><table class="tbl" style="margin-top:8px"><thead><tr><th>Откуда</th><th class="num">Вход</th><th class="num">DNSMOS</th><th class="num">Замирания</th></tr></thead><tbody>${[['Москва', '0,62 с', '3,9', '0'], ['Новосибирск', '0,81 с', '3,8', '0'], ['Франкфурт', '0,74 с', '3,9', '0'], ['Нью-Йорк', '0,93 с', '3,8', '0']].map((r) => `<tr><td>${r[0]}</td><td class="num">${r[1]}</td><td class="num">${r[2]}</td><td class="num">${r[3]}</td></tr>`).join('')}</tbody></table></div>
          <div class="box"><div class="box__title">${I('bolt-off')} Учения</div><div class="box__sub">Выключаем узел во время эфира — проверяем, что всё происходит само, как в карте отказов</div><div id="drill" style="margin-top:8px"></div></div></div>
        <div class="box" style="margin-top:16px"><div class="row"><div class="sp"><div class="box__title">${I('route')} Выкат по ступеням</div><div class="box__sub">Версия 2.0.14 · 5 % комнат · бюджет ошибок: 92 % остатка · заморозка за сутки до крупных эфиров</div></div><button class="btn btn--secondary btn--sm" data-act="canary">Расширить до 25 %</button></div></div></div>`;
      return shell({ module: 'Эксплуатация', active: '', compose: { label: 'Проверка эфира', icon: 'list-check', go: 'event' }, nav: [{ icon: 'server', label: 'Узлы', on: true }, { icon: 'activity', label: 'Пробник' }, { icon: 'alert-triangle', label: 'Карта отказов' }, { icon: 'route', label: 'Выкаты' }, { icon: 'globe', label: 'Статус для клиентов', go: 'status' }], body });
    },
    mount() {
      P.onLeave(() => document.removeEventListener('click', h));
      document.addEventListener('click', h);
      function h(e) {
        if (e.target.closest('#rgo')) {
          const pr = $('#rprog'); let p = 0; e.target.closest('#rgo').disabled = true;
          const steps = ['сервер заказан', 'LiveKit и nginx установлены', 'ретранслятор подключён к Москве', 'TURN и сертификат', 'пробник из Алматы — 12 мс'];
          const t = setInterval(() => { p += 4; if (!pr.isConnected) return clearInterval(t); pr.innerHTML = `<div class="bar" style="margin-top:14px"><i style="width:${p}%"></i></div><div class="small muted" style="margin-top:6px">${steps[Math.min(4, Math.floor(p / 21))]} · ${Math.round(15 - p * .15)} мин осталось (ускорено)</div>`; if (p >= 100) { clearInterval(t); toast('Узел alm-edge поднят и включён в выбор по задержке', { icon: 'server' }); } }, 120);
        }
      }
    },
  });

  add({
    id: 'status', group: G, title: 'Страница статуса', icon: 'globe', phase: 'фаза 2Б', plan: '§ 5.27 — страница статуса для организаторов',
    desc: 'Публичная страница для организаторов и зрителей: состояние компонентов, 90 дней доступности, инциденты и разборы.',
    render() {
      const bars = (bad = []) => `<div class="uptime">${Array.from({ length: 90 }, (_, i) => `<i class="${bad.includes(i) ? 'is-bad' : ''}"></i>`).join('')}</div>`;
      return `<div class="lp"><header class="lp__top"><img src="seal-compact.svg" width="26" height="26" alt=""><span class="shell-sidebar__name"><span class="shell-sidebar__brandname">Суть</span><span class="shell-sidebar__x">✕</span><span class="shell-sidebar__module">Статус</span></span></header>
        <section class="page"><div class="box box--glow row" style="gap:12px"><span class="ok">${I('check-circle', 'lg')}</span><div><div style="font-size:20px;font-weight:300">Все системы работают</div><div class="small muted">Обновлено 21 окт, 09:24 МСК · пробник каждые 5 минут из 4 регионов</div></div></div>
        <div class="box" style="margin-top:16px">${[['Видеосвязь · Россия', []], ['Видеосвязь · Европа', [61]], ['Видеосвязь · Америка', []], ['Эфиры и запасной поток', []], ['Запись и расшифровка', [33]], ['Оплаты', []], ['Мессенджер и уведомления', []]].map(([n, b]) => `<div style="padding:12px 0;border-bottom:var(--hairline-width) solid var(--color-border)"><div class="row"><b class="small sp">${n}</b><span class="small ok">${b.length ? '99,93 %' : '100 %'}</span></div>${bars(b)}</div>`).join('')}<div class="row tiny muted" style="margin-top:6px"><span>90 дней назад</span><span class="sp"></span><span>сегодня</span></div></div>
        <div class="box" style="margin-top:16px"><div class="box__title">Инциденты</div><div class="lrow"><span class="mono small subtle">21 авг</span><div class="lrow__main small"><b>Задержка видео у части зрителей во Франкфурте</b><div class="tiny muted">18 мин · ретранслятор перезапущен автоматически, зрители на запасном потоке · разбор: добавлен горячий двойник</div></div></div></div></section></div>`;
    },
  });
})();

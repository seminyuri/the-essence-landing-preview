(function () {
  const { add, I, toast, modal, later, every, shell, $, btn, chip, li, page, note } = P;
  const G = 'Эксплуатация';
  const NODES = [
    { id: 'msk-a', role: 'сцена и зрители из России', cpu: 61, rooms: 14, ppl: 1286, dc: 'Москва · ДЦ-1' },
    { id: 'msk-b', role: 'переполнение, картинка эфира, резерв', cpu: 38, rooms: 9, ppl: 412, dc: 'Москва · ДЦ-2' },
    { id: 'fra-edge', role: 'зеркало: Европа и Израиль', cpu: 22, rooms: 2, ppl: 402, dc: 'Франкфурт' },
    { id: 'use-edge', role: 'зеркало: Америка', cpu: 9, rooms: 1, ppl: 134, dc: 'Нью-Йорк' },
    { id: 'tlv', role: 'на время эфира 23 октября', cpu: 14, rooms: 1, ppl: 153, dc: 'Тель-Авив', temp: true },
  ];
  const dotRow = (a, b) => `<div class="row" style="padding:10px 0;font-size:15px"><span class="dot"></span><div class="sp"><div>${a}</div><div class="t-sm muted">${b}</div></div></div>`;

  add({
    id: 'ops', group: G, title: 'Пульт дежурного', icon: 'server', phase: 'фазы 0–3', plan: '§ 5.17, § 5.27, § 5.2 — регион по требованию',
    desc: 'Узлы и нагрузка, ретрансляторы, запись и запасной поток, распознавание и Юя; пробник из регионов; учения — выключить узел и увидеть, что всё переезжает само; поднять регион под эфир; выкат по ступеням.',
    tips: ['«Учения: выключить msk-a» — сцена переезжает на msk-b', '«Поднять регион» — узел встаёт по описанию', 'Страница статуса для клиентов уже есть в платформе'],
    acts: {
      drill: (el) => {
        el.disabled = true; const card = $('[data-node="msk-a"]'); card.classList.add('is-down'); card.querySelector('.nst').innerHTML = chip('недоступен', 'bad');
        const log = $('#drill'); log.innerHTML = '';
        [['0,0 с', 'msk-a перестал отвечать — видно по пробнику и метрикам'], ['0,8 с', 'зрители msk-a спросили «где моё мероприятие» → msk-b'], ['2,9 с', '1 286 зрителей переехали, запасной поток подхватил 41 человека'], ['6,4 с', 'комната сцены поднята на msk-b'], ['11,7 с', 'докладчики и ретрансляторы переподключились, запись продолжена'], ['12,0 с', 'сцена восстановлена — цель 15 с выполнена']].forEach(([t, s], i) => later(650 * (i + 1), () => log.insertAdjacentHTML('beforeend', li({ lead: `<span class="mono accent" style="width:56px">${t}</span>`, t: s }))));
        later(650 * 7, () => { card.classList.remove('is-down'); card.querySelector('.nst').innerHTML = chip('в строю', 'ok'); el.disabled = false; toast('Учения пройдены: переезд 2,9 с, сцена 12 с. Разбор сохранён', { icon: 'check-circle' }); });
      },
      region: () => modal(`<div class="modal2__t">Поднять узел под эфир</div><label class="fld"><span class="fld__l">Где</span><select class="in"><option>Казахстан · Алматы</option><option>Израиль · Тель-Авив</option><option>Германия · Франкфурт</option></select></label><label class="fld"><span class="fld__l">Когда</span><input class="in" value="23 окт, 18:30–21:30"></label>
        <div class="mt16">${note('server', 'Узел описан кодом и встаёт примерно за 15 минут у почасового провайдера. На время эфира других встреч не принимает.')}</div><div id="rprog"></div><div class="modal2__f">${btn('Поднять', { kind: 'primary', size: 'lg', icon: 'play', act: 'rgo' })}</div>`),
      rgo: (el) => { el.disabled = true; const pr = $('#rprog'); let p = 0; const steps = ['сервер заказан', 'медиасервер установлен', 'ретранслятор подключён к Москве', 'сертификат и TURN', 'пробник из Алматы — 12 мс']; const h = every(110, () => { p += 4; if (!pr.isConnected) return clearInterval(h); pr.innerHTML = `<div class="bar2 mt16"><i style="width:${Math.min(100, p)}%"></i></div><div class="t-sm muted mt8">${steps[Math.min(4, Math.floor(p / 21))]} · осталось ${Math.max(0, Math.round(15 - p * .15))} мин (ускорено)</div>`; if (p >= 100) { clearInterval(h); toast('Узел в Алматы поднят и участвует в выборе по задержке', { icon: 'server' }); } }); },
      canary: (el) => { el.innerHTML = '<span>Расширено до 25 %</span>'; toast('Новая версия на 25 % комнат. Откат автоматический, если растут ошибки', { icon: 'route' }); },
    },
    render() {
      const nodes = NODES.map((n) => `<div class="card node2" data-node="${n.id}"><div class="row"><b class="mono">${n.id}</b>${n.temp ? chip('временный', 'accent') : ''}<span class="sp"></span><span class="nst">${chip('в строю', 'ok')}</span></div><div class="t-sm muted mt8">${n.dc} · ${n.role}</div><div class="row mt12 t-sm" style="gap:14px"><span>${I('cpu', 'xs')} ${n.cpu} %</span><span>${I('door', 'xs')} ${n.rooms}</span><span>${I('users', 'xs')} ${n.ppl.toLocaleString('ru-RU')}</span></div><div class="bar2 mt8"><i style="width:${n.cpu}%"></i></div></div>`).join('');
      return shell({ module: 'Админка', active: 'admin', compose: { label: 'Проверка эфира', icon: 'list-check', go: 'event' }, nav: [{ icon: 'server', label: 'Узлы', on: true }, { icon: 'activity', label: 'Пробник' }, { icon: 'alert-triangle', label: 'Карта отказов' }, { icon: 'route', label: 'Выкаты' }],
        body: page({ wide: true, title: 'Пульт дежурного', sub: 'Дежурный Глеб · эфир «Тревога и опора» идёт 42 минуты', actions: `${btn('Поднять регион', { icon: 'globe', act: 'region' })}${btn('Учения: выключить msk-a', { kind: 'danger', icon: 'bolt-off', act: 'drill' })}`,
          body: `<div class="nodes2">${nodes}</div>
          <div class="grid g3 mt16"><div class="card"><div class="card__t">${I('route', 'md', 'accent')} Ретрансляторы</div>${dotRow('Москва → Франкфурт', '41 мс · 3 слоя')}${dotRow('Москва → Нью-Йорк', '118 мс · 3 слоя')}${dotRow('Москва → Тель-Авив', '56 мс')}</div>
            <div class="card"><div class="card__t">${I('circle-dot', 'md', 'accent')} Запись и запасной поток</div>${dotRow('Запись дорожек · msk-a', '3 докладчика · хранилище в России')}${dotRow('Картинка эфира · msk-b', '720p · свежесть 1,1 с')}${dotRow('Кэш запасного потока', 'попаданий 97 %')}</div>
            <div class="card"><div class="card__t">${I('cc', 'md', 'accent')} Речь и Юя</div>${dotRow('Субтитры', '3 говорящих · 0,6 с')}${dotRow('Итоговые расшифровки', 'в очереди 4 записи')}${dotRow('Юя', 'цикл 1,8 с · 3 сессии свободны')}</div></div>
          <div class="grid g2 mt16"><div class="card"><div class="card__t">${I('activity', 'md', 'accent')} Пробник · раз в 5 минут</div><table class="tbl2 mt8"><thead><tr><th>Откуда</th><th class="r">Вход</th><th class="r">Качество звука</th><th class="r">Замирания</th></tr></thead><tbody>${[['Москва', '0,62 с', '3,9 из 5', '0'], ['Новосибирск', '0,81 с', '3,8 из 5', '0'], ['Франкфурт', '0,74 с', '3,9 из 5', '0'], ['Нью-Йорк', '0,93 с', '3,8 из 5', '0']].map((r) => `<tr><td>${r[0]}</td><td class="r">${r[1]}</td><td class="r">${r[2]}</td><td class="r">${r[3]}</td></tr>`).join('')}</tbody></table></div>
            <div class="card"><div class="card__t">${I('bolt-off', 'md', 'accent')} Учения</div><div class="card__s">Выключаем узел во время эфира и проверяем, что всё происходит само, как в карте отказов</div><div id="drill" class="mt8"></div></div></div>
          <div class="card mt16"><div class="row row--wrap"><div class="sp"><div class="card__t">${I('route', 'md', 'accent')} Выкат по ступеням</div><div class="card__s">Версия 2.0.14 на 5 % комнат · запас ошибок 92 % · заморозка за сутки до крупных эфиров</div></div>${btn('Расширить до 25 %', { act: 'canary', kind: 'white' })}</div></div>` }) });
    },
  });
})();

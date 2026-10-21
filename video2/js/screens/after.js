(function () {
  const { D, S, add, I, av, esc, toast, go, $, $$, btn, chip, seg, li, yuNote, note, page } = P;
  const G = 'После встречи';
  const TPL = { 'Индивидуальная': ['Запрос сессии', 'Ключевые темы', 'Применённые техники', 'Динамика', 'Цитаты'], 'Первичная': ['С чем пришёл', 'История запроса', 'Гипотезы', 'План работы', 'Договорённости'], 'Супервизия': ['Случай', 'Вопрос к супервизору', 'Перенос и контрперенос', 'Что попробовать'], 'Группа': ['Тема встречи', 'Кто что принёс', 'Групповая динамика', 'Задание группе'] };
  const SUM = { 'Запрос сессии': 'Тревога перед планёрками и сон; первый успешный отказ коллеге 19 октября.', 'Ключевые темы': 'Страх оценки и его связь с отцом («почему не пятёрка») — звучит вторую встречу подряд. Телесная опора: «жар в груди, потом легче дышать».', 'Применённые техники': 'Сократический диалог, фиксация телесного ощущения как ресурса, рефрейминг отказа, метафорическая карта «Дорога».', 'Динамика': 'Анкета перед входом — 6 из 10 (неделю назад было 4). GAD-7: 7.', 'Цитаты': '«Я сказала „нет“, и мир не рухнул» — 14:22' };

  add({
    id: 'end', group: G, title: 'Экран после встречи', icon: 'check-circle', phase: 'фазы 2Б / 4', plan: '§ 1.2 — итоги за 10 минут, Приложение Ж.7, Приложение Л',
    desc: 'Итоги Юи по шаблону типа сессии, задачи — в задачник, конспект клиенту без клинических слов, следующая сессия с оплатой в одно нажатие, оценка связи.',
    tips: ['Переключите «Специалист / Клиент»', 'Смените шаблон итогов', 'Клиент выбирает время и оплачивает сразу'],
    acts: {
      who: (el) => { $$('.whoseg button').forEach((b) => b.classList.toggle('is-on', b === el)); const c = el.dataset.v === 'client'; $('.end-spec').hidden = c; $('.end-client').hidden = !c; },
      tpl: (el) => { $$('.tplseg button').forEach((b) => b.classList.toggle('is-on', b === el)); const keys = TPL[el.dataset.v]; $('#sumb').innerHTML = keys.map((k) => `<div class="sumb"><b>${k}</b><p>${SUM[k] || 'Юя заполнит по расшифровке, когда выберете этот шаблон для встречи.'}</p></div>`).join(''); toast(`Итоги пересобраны по шаблону «${el.dataset.v}»`, { icon: 'sparkles' }); },
      totasks: () => toast(`${$$('.tpick input:checked').length} задачи в задачнике, исполнитель — вы`, { icon: 'kanban' }),
      sendsum: (el) => { el.outerHTML = chip(`${I('check', 'xs')} Отправлено Марии в чат и на почту`, 'ok'); },
      slot: (el) => { $$('.slots2 button').forEach((s) => s.classList.toggle('is-on', s === el)); $('#slot-pay').innerHTML = `${I('credit-card')}<span>Записаться и оплатить · ${el.dataset.t}</span>`; },
      paynext: () => P.payModal(6500, 'Сессия с Анной, 28 октября', () => { S.paidNext = true; $('#slot-pay').outerHTML = chip(`${I('check', 'xs')} 28 октября, 10:00 · оплачено · в календаре`, 'ok'); }),
      rate: (el) => { $$('.stars2 button').forEach((b, i) => b.classList.toggle('is-on', i <= +el.dataset.i)); toast('Спасибо — оценка попала в сводку качества'); },
    },
    render(p) {
      const from = p.from === 'inperson' ? 'Олег Мартынов · очная встреча' : 'Мария Иванова · 9-я встреча';
      return `<div class="pub" style="background:var(--c-canvas)"><div class="page page--wide"><div class="row" style="margin-bottom:24px"><div class="seg2 whoseg">${[['Специалист', 'spec'], ['Клиент', 'client']].map(([t, v], i) => `<button class="${i ? '' : 'is-on'}" data-act="who" data-v="${v}">${t}</button>`).join('')}</div><span class="sp"></span>${btn('В кабинет', { icon: 'grid', go: 'hub', kind: 'white' })}</div>
        <div class="end-spec"><div class="phead"><div class="phead__t"><div class="t-sm muted">Встреча завершена · 58 мин · итоги готовы через 3 мин 12 с</div><h1 class="h1 mt8">${from}</h1></div></div>
          <div class="grid g-main g-main--wide">
            <div class="col" style="gap:16px"><div class="card card--white"><div class="row row--wrap"><div class="card__t sp"><span class="yu2">${I('sparkles')}</span> Итоги для вас</div><div class="seg2 tplseg">${Object.keys(TPL).map((t, i) => `<button class="${i ? '' : 'is-on'}" data-act="tpl" data-v="${t}">${t}</button>`).join('')}</div></div>
                <div id="sumb">${TPL['Индивидуальная'].map((k) => `<div class="sumb"><b>${k}</b><p>${SUM[k]}</p></div>`).join('')}</div>
                <div class="row t-sm muted mt16" style="gap:6px">${I('lock', 'xs')} Видны только вам · по расшифровке каждого говорящего · <a class="accent" data-go="recording">открыть расшифровку</a></div></div>
              <div class="card card--white"><div class="card__t">Задачи из встречи</div>${['Подготовить для Марии аудио «телесная опора» на 5 минут', 'Обсудить на супервизии: оценивающая фигура отца', 'Напомнить Марии про дневник мыслей в пятницу'].map((t, i) => `<label class="row tpick" style="padding:12px 0;cursor:pointer;font-size:15px"><input type="checkbox" ${i < 2 ? 'checked' : ''} style="width:20px;height:20px"><span>${t}</span></label>`).join('')}
                <div class="card__f">${btn('В задачник', { kind: 'primary', icon: 'kanban', act: 'totasks' })}${btn('Только напоминание Марии', { icon: 'bell', kind: 'white', act: 'toast', data: 'data-text="Напоминание Марии в пятницу в 18:00 в Telegram"' })}</div></div></div>
            <div class="col" style="gap:16px"><div class="card card--white"><div class="card__t">Конспект для Марии</div><div class="card__s">Юя написала без клинических формулировок — можно поправить</div><div class="draft2">Мария, спасибо за встречу! Главное сегодня: ваш отказ 19 октября — это опора, к которой можно возвращаться. Задание на неделю: три раза записать мысли перед планёркой и отметить, где в теле тревога. До встречи 28-го.</div>
                <div class="card__f">${btn('Отправить', { kind: 'primary', icon: 'send', act: 'sendsum' })}${btn('Править', { icon: 'edit', kind: 'white', act: 'toast', data: 'data-text="Черновик открыт для правки"' })}</div></div>
              <div class="card card--white"><div class="card__t">Связь</div><div class="mt8" style="font-size:15px">${I('check-circle', 'sm', 'ok')} Задержка 34 мс, потерь почти нет, замираний не было</div><div class="t-sm muted mt8">У Марии iPhone и мобильный интернет: 3 минуты видео было 360p, звук не пострадал.</div></div>
              <div class="card card--white"><div class="card__t">Оплата</div><div class="mt8" style="font-size:15px">Сессия 6 500 ₽ · в кошелёк после окна возврата: <b>5 850 ₽</b></div><div class="t-sm muted mt8">Следующая — 28 октября, ждёт оплаты</div></div></div></div></div>
        <div class="end-client" hidden><div class="card card--white" style="max-width:560px;margin:0 auto;padding:32px"><div class="row">${av('anna', 56)}<div><div class="t-sm muted">Встреча завершена · 58 мин</div><div class="h2">Спасибо, Мария</div></div></div>
          <div class="draft2" style="background:var(--c-fill)">Главное сегодня: ваш отказ 19 октября — это опора. Задание на неделю: три раза записать мысли перед планёркой и отметить, где в теле тревога.</div>
          <div class="h3 mt24">Следующая встреча с Анной</div><div class="slots2 mt12">${['пн 27 · 18:00', 'вт 28 · 10:00', 'чт 30 · 12:00'].map((t, i) => `<button class="${i === 1 ? 'is-on' : ''}" data-act="slot" data-t="${t}">${t}</button>`).join('')}</div>
          <div class="mt16">${btn('Записаться и оплатить · вт 28 · 10:00', { kind: 'primary', size: 'lg', block: true, icon: 'credit-card', act: 'paynext', id: 'slot-pay' })}</div>
          <div class="h3 mt24">Как была связь?</div><div class="stars2 mt8">${[0, 1, 2, 3, 4].map((i) => `<button data-act="rate" data-i="${i}" aria-label="${i + 1} из 5">${I('star', 'lg')}</button>`).join('')}</div>
          <div class="mt24">${note('lock', 'Запись хранится 90 дней. Вы видите, кто её открывал. <a class="accent" data-go="client-cabinet">Мой кабинет</a>')}</div></div></div></div></div>`;
    },
  });

  // ───────────── кабинет клиента ─────────────
  add({
    id: 'client-cabinet', group: G, title: 'Кабинет клиента', icon: 'user', frame: 'phone', phase: 'фаза 4', plan: '§ 5.29 — журнал доступа, § 5.26 — согласия',
    desc: 'Всё клиента в одном месте: ближайшая встреча, конспекты, задания, согласия с отзывом одной кнопкой и журнал — кто и когда открывал его записи.',
    tips: ['Вкладка «Приватность» — кто открывал записи', '«Отозвать» — согласие снимается сразу'],
    acts: {
      ctab: (el) => { $$('.ctabs button').forEach((b) => b.classList.toggle('is-on', b === el)); $$('[data-cp]').forEach((p) => (p.hidden = p.dataset.cp !== el.dataset.v)); },
      revoke: (el) => { el.closest('.opt').querySelector('.opt__s').textContent = 'отозвано сейчас — запись и расшифровка удалятся в течение 30 дней'; el.remove(); toast('Согласие отозвано'); },
      hwdone: (el) => { el.classList.toggle('is-on'); },
    },
    render() {
      const c = D.myCabinet;
      return `<div class="mob"><div class="mob__top"><div class="sp"><div class="t-sm muted">Мой кабинет</div><div class="h2">Мария</div></div>${av('maria', 40)}</div>
        <div class="mob__body"><div class="cab-next"><div class="t-sm" style="opacity:.85">Следующая встреча</div><div class="h2 mt8">${c.next.when}</div><div class="t-sm" style="opacity:.85">с Анной Соколовой · оплачено</div><div class="mt16">${btn('Войти', { kind: 'white', size: 'lg', block: true, icon: 'video', go: 'waiting' })}</div></div>
          <div class="seg2 seg2--block ctabs mt16">${[['Встречи', 'm'], ['Задание', 'h'], ['Приватность', 'p']].map(([t, v], i) => `<button class="${i ? '' : 'is-on'}" data-act="ctab" data-v="${v}">${t}</button>`).join('')}</div>
          <div data-cp="m" class="mt12">${c.sessions.map(([d, t, k]) => li({ lead: `<span class="li__ic t-xs" style="width:56px">${d}</span>`, t, s: k, act: 'toast', data: `data-text="Конспект: ${t}"` })).join('')}</div>
          <div data-cp="h" class="mt12" hidden>${D.client.homework.map((h) => `<button class="pick__i ${h.done ? 'is-on' : ''}" data-act="hwdone" style="margin-bottom:8px"><span class="pick__r"></span><span class="pick__t">${esc(h.t)}</span></button>`).join('')}<div class="card mt12" style="padding:14px"><div class="b">Как вы сейчас?</div><div class="t-sm muted mt8">Короткий опросник перед встречей — Анна увидит динамику</div><div class="mt12">${btn('Заполнить, 2 минуты', { kind: 'primary', block: true, act: 'toast', data: 'data-text="Спасибо — Анна увидит ответы перед встречей"' })}</div></div></div>
          <div data-cp="p" class="mt12" hidden><div class="h3">Согласия</div>${[['Запись встреч', 'с 3 июня'], ['Расшифровка', 'с 3 июня'], ['Разбор Юей для Анны', 'с 3 июня']].map(([t, s]) => `<div class="opt"><div class="opt__m"><div class="opt__t">${t}</div><div class="opt__s">${s}</div></div>${btn('Отозвать', { size: 'sm', act: 'revoke' })}</div>`).join('')}
            <div class="h3 mt24">Кто открывал мои записи</div>${c.access.map(([w, t, what]) => li({ lead: `<span class="li__ic">${I(w.startsWith('Анна') ? 'user' : 'shield-check')}</span>`, t: w, s: `${t} · ${what}` })).join('')}
            <div class="mt12">${btn('Скачать все мои данные', { icon: 'download', block: true, act: 'toast', data: 'data-text="Архив будет готов через несколько минут — пришлём ссылку на почту"' })}</div></div></div>
        <nav class="mob__tab">${[['grid', 'Главная', 1], ['messenger', 'Чат'], ['calendar', 'Записаться'], ['user', 'Профиль']].map(([i, t, on]) => `<a class="${on ? 'is-on' : ''}" ${t === 'Чат' ? 'data-go="messenger"' : 'data-act="toast" data-text="' + t + '"'}>${I(i, 'md')}${t}</a>`).join('')}</nav></div>`;
    },
  });
})();

(function () {
  const { D, S, add, I, av, esc, rub, toast, modal, go, later, $, $$ } = P;

  add({
    id: 'end', group: 'После встречи', title: 'Экран после встречи', icon: 'check-circle', phase: 'фаза 2Б / 4', plan: '§ 1.2 — итоги ≤ 10 мин; Приложение И — экран после встречи; МТС Линк — шаблоны итогов',
    desc: 'Вместо «Вы покинули встречу»: итоги Юи по шаблону типа сессии, задачи — в задачник, заметки в профессиональной структуре, следующая сессия и её оплата в одно нажатие, отправка итогов клиенту, оценка связи.',
    tips: ['Переключите «Специалист / Клиент»', 'Отметьте задачи → «В задачник»', 'Клиент выбирает следующую сессию и оплачивает сразу'],
    acts: {
      ...P.common,
      who: (el) => { P.segAct(el); const c = el.dataset.w === 'client'; $('.end-spec').hidden = c; $('.end-client').hidden = !c; },
      totasks: () => { const n = $$('.task-pick input:checked').length; toast(`${n} задачи в задачнике · проект «Практика» · исполнитель — вы`, { icon: 'kanban' }); },
      sendsum: (el) => { el.outerHTML = `<span class="pill pill--ok">${I('check', 'xs')} Отправлено в чат и на почту Марии</span>`; },
      slot: (el) => { $$('.slot').forEach((s) => s.classList.toggle('is-on', s === el)); $('#slot-pay').innerHTML = `${I('credit-card')} Записаться и оплатить · ${el.dataset.t}`; },
      paynext: () => P.payModal(6500, 'Сессия 28 октября', () => { S.paidNext = true; $('#slot-pay').outerHTML = `<span class="pill pill--ok">${I('check', 'xs')} 28 октября, 10:00 · оплачено · в календаре</span>`; }),
      rate: (el) => { $$('.stars button').forEach((b, i) => b.classList.toggle('is-on', i <= +el.dataset.i)); toast('Спасибо за оценку — она в сводке качества звонка'); },
      tpl: (el) => { $$('.tplsum').forEach((x) => x.classList.toggle('is-on', x === el)); toast(`Итоги пересобраны по шаблону «${el.textContent}»`, { icon: 'sparkles' }); },
    },
    render() {
      return `<div class="end-wrap"><div class="page"><div class="row" style="margin-bottom:16px"><div class="seg"><button class="is-on" data-act="who" data-w="spec">Специалист</button><button data-act="who" data-w="client">Клиент</button></div><span class="sp"></span><button class="btn btn--secondary btn--sm" data-go="hub">${I('grid')} В кабинет</button></div>
        <div class="end-spec">
          <div class="page__head"><div class="page__titles"><div class="eyebrow">Сессия завершена · 58 мин · итоги готовы через 3 мин 12 с</div><h1 class="page__title">Мария Иванова, <em>9-я встреча</em></h1></div></div>
          <div class="grid g-side">
            <div class="col" style="gap:16px">
              <div class="box box--glow"><div class="row"><div class="box__title sp"><span class="yu">${I('sparkles')}</span> Итоги для вас</div>${['Индивидуальная', 'Супервизия', 'Группа', 'Астро-консультация', 'Мой шаблон'].map((t, i) => `<button class="chipq tplsum ${i ? '' : 'is-on'}" data-act="tpl">${t}</button>`).join('')}</div>
                <div class="sumblock"><b>Запрос сессии</b><p>Тревога перед планёрками и сон; первый успешный отказ коллеге 19 октября.</p></div>
                <div class="sumblock"><b>Ключевые темы</b><p>Страх оценки и его связь с отцом («почему не пятёрка») — звучит вторую встречу подряд. Телесная опора: «жар в груди, потом легче дышать».</p></div>
                <div class="sumblock"><b>Применённые техники</b><p>Сократический диалог · фиксация телесного ощущения как ресурса · рефрейминг отказа.</p></div>
                <div class="sumblock"><b>Динамика</b><p>Анкета перед входом — 6/10 (было 4/10 неделю назад). GAD-7: 7.</p></div>
                <div class="sumblock"><b>Цитаты</b><p class="ital">«Я сказала “нет”, и мир не рухнул» — 14:22</p></div>
                <div class="row tiny muted" style="gap:6px">${I('lock', 'xs')} Видны только вам · основано на расшифровке по дорожкам · <a class="accent" data-go="recording">открыть расшифровку</a></div></div>
              <div class="box"><div class="box__title">Задачи из встречи</div>${['Подготовить для Марии упражнение «телесная опора» — аудио 5 минут', 'Обсудить на супервизии: перенос на фигуру отца', 'Напомнить Марии про дневник мыслей в пятницу'].map((t, i) => `<label class="lrow task-pick" style="padding:10px 2px;cursor:pointer"><input type="checkbox" ${i < 2 ? 'checked' : ''}><span class="small">${t}</span></label>`).join('')}
                <div class="box__foot"><button class="btn btn--primary btn--sm" data-act="totasks">${I('kanban')} В задачник</button><button class="btn btn--ghost btn--sm" data-act="toast" data-text="Напоминание Марии запланировано на пятницу 18:00 в Telegram">${I('bell')} Только напоминание</button></div></div></div>
            <div class="col" style="gap:16px">
              <div class="box"><div class="box__title">Клиенту</div><div class="box__sub">Юя подготовила короткий конспект для Марии — без клинических формулировок</div>
                <div class="draft small">Мария, спасибо за встречу! Главное сегодня: ваш отказ 19 октября — это опора, к которой можно возвращаться. Задание на неделю: 3 раза записать мысли перед планёркой и отметить, где в теле тревога. До встречи 28-го ✨</div>
                <div class="box__foot"><button class="btn btn--primary btn--sm" data-act="sendsum">${I('send')} Отправить</button><button class="btn btn--ghost btn--sm" data-act="toast" data-text="Черновик открыт для правки">${I('edit')} Править</button></div></div>
              <div class="box"><div class="box__title">Связь на встрече</div><div class="small" style="margin-top:6px">${I('check-circle', 'xs', 'ok')} Задержка 34 мс · потери 0,1 % · замираний 0 · звук без дорисовки</div><div class="tiny muted" style="margin-top:6px">У Марии: iPhone 13, LTE, 3 мин на слабой сети — видео снижалось до 360p, звук не пострадал</div></div>
              <div class="box"><div class="box__title">Оплата</div><div class="small" style="margin-top:6px">Сессия 6 500 ₽ · в кошельке после окна возврата: <b>5 850 ₽</b></div><div class="small muted" style="margin-top:4px">Следующая — 28 окт, ждёт оплаты клиентом</div></div></div></div></div>
        <div class="end-client" hidden><div class="end-client__card box"><div class="row" style="gap:12px">${av('anna', 48)}<div><div class="eyebrow">Встреча завершена · 58 мин</div><div style="font-size:20px;font-weight:300">Спасибо, Мария</div></div></div>
          <div class="draft small" style="margin-top:14px">Главное сегодня: ваш отказ 19 октября — это опора. Задание на неделю: 3 раза записать мысли перед планёркой и отметить, где в теле тревога.</div>
          <div class="eyebrow" style="margin-top:18px">Следующая встреча с Анной</div><div class="slots">${['пн 27 · 18:00', 'вт 28 · 10:00', 'чт 30 · 12:00'].map((t, i) => `<button class="slot ${i === 1 ? 'is-on' : ''}" data-act="slot" data-t="${t}">${t}</button>`).join('')}</div>
          <button class="btn btn--primary btn--lg" style="width:100%;margin-top:12px" id="slot-pay" data-act="paynext">${I('credit-card')} Записаться и оплатить · вт 28 · 10:00</button>
          <div class="eyebrow" style="margin-top:18px">Как была связь?</div><div class="stars">${[0, 1, 2, 3, 4].map((i) => `<button data-act="rate" data-i="${i}">${I('star', 'lg')}</button>`).join('')}</div>
          <div class="row tiny muted" style="gap:6px;margin-top:14px">${I('lock', 'xs')} Запись хранится 90 дней · вы видите, кто её открывал · <a class="accent" data-act="toast" data-text="Согласие отозвано — запись и расшифровка удалены">отозвать согласие</a></div></div></div></div></div>`;
    },
  });
})();

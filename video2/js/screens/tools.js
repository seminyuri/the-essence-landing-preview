(function () {
  const { D, S, add, I, av, esc, toast, modal, closeModal, go, every, later, onLeave, $, $$ } = P;
  const G = 'Инструменты в комнате';

  // ───────────────────────────── режим практики ─────────────────────────────
  add({
    id: 'practice', group: G, title: 'Режим практики', icon: 'leaf', phase: 'фаза 4', plan: '§ 5.23 — режим практики; § 6.5',
    desc: 'Гипноз, медитация, регресс: микрофоны у всех выключены, минимальный интерфейс и затемнение, музыка ведущего смешивается с голосом с автоприглушением, мягкие сигналы, таймер, запись практики — участникам аудиофайлом.',
    tips: ['«Мягкий сигнал» — звучит у всех', 'Говорите — музыка автоматически стихает (полоска «музыка»)', '«Как видят участники» — минимальный экран'],
    acts: {
      ...P.common,
      bell: () => { try { const ac = new AudioContext(); [528, 792].forEach((f, i) => { const o = ac.createOscillator(); const g = ac.createGain(); o.frequency.value = f; g.gain.setValueAtTime(.0001, ac.currentTime); g.gain.exponentialRampToValueAtTime(.06 / (i + 1), ac.currentTime + .05); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + 2.6); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 2.7); }); setTimeout(() => ac.close(), 3000); } catch (e) {} toast('Мягкий сигнал прозвучал у всех', { icon: 'bell' }); },
      pview: (el) => { el.classList.toggle('is-on'); $('.practice').classList.toggle('as-participant', el.classList.contains('is-on')); },
      endp: () => { toast('Практика завершена · аудиофайл отправится участникам после обработки'); go('meeting'); },
      track: (el) => { $$('.track').forEach((t) => t.classList.toggle('is-on', t === el)); toast(`Музыка: ${el.dataset.t}`, { icon: 'music' }); },
    },
    render() {
      return `<div class="room practice" data-theme="dark"><div class="practice__glow"></div>
        <div class="room__top"><div class="room__title"><b>Практика · «Безопасное место»</b><span class="muted">· 18 участников · микрофоны выключены у всех</span></div><span class="sp"></span><button class="rec-ind"><span class="rec-dot"></span>Запись практики → аудио участникам</button><button class="chipq" data-act="pview">Как видят участники</button></div>
        <div class="practice__center"><div class="practice__host" style="background-image:url(img/people/p32.jpg)"></div>
          <div class="practice__timer mono" id="ptimer">18:42</div><div class="practice__phrase">…и с каждым выдохом тело становится чуть тяжелее и спокойнее…</div>
          <div class="practice__dots">${D.group.slice(1).concat(['kate', 'mark', 'yana', 'ruslan', 'liza', 'gleb', 'zoya']).map((id) => `<span title="${P.person(id).name}">${av(id, 26)}</span>`).join('')}</div></div>
        <aside class="practice__panel"><div class="eyebrow">Звук ведущей</div>
          <div class="mix"><div class="mix__row"><span class="small">Голос</span><span class="meter meter--wide" id="m-voice">${'<i></i>'.repeat(20)}</span></div><div class="mix__row"><span class="small">Музыка</span><span class="meter meter--wide meter--music" id="m-music">${'<i></i>'.repeat(20)}</span></div>
            <div class="tiny muted" id="duck">Автоприглушение: музыка тише, пока вы говорите</div></div>
          <div class="eyebrow" style="margin-top:16px">Музыка</div>${['Тибетские чаши · 432 Гц', 'Дождь и далёкий гром', 'Пианино — медленно'].map((t, i) => `<button class="track ${i ? '' : 'is-on'}" data-act="track" data-t="${t}">${I('music')}<span>${t}</span></button>`).join('')}
          <div class="tiny muted" style="margin-top:6px">Стерео 128 кбит/с, обработка выключена · у вас наушники ✓</div>
          <div class="eyebrow" style="margin-top:16px">Ведение</div><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn btn--secondary btn--sm" data-act="bell">${I('bell')} Мягкий сигнал</button><button class="btn btn--secondary btn--sm" data-act="toast" data-text="Таймер практики: 25 минут">${I('timer')} Таймер</button><button class="btn btn--secondary btn--sm" data-act="toast" data-text="Участники видят затемнённый экран и вашу фразу">${I('moon')} Затемнить</button></div>
          <div class="optrow"><div class="optrow__main small">Включать микрофон может только ведущая</div><button class="tgl is-on" data-act="tgl"></button></div>
          <div class="optrow"><div class="optrow__main small">Вернуть участника, если он вышел (обрыв)</div><button class="tgl is-on" data-act="tgl"></button></div>
          <button class="btn btn--primary" style="width:100%;margin-top:12px" data-act="endp">Завершить практику</button></aside></div>`;
    },
    mount() {
      let s = 18 * 60 + 42; every(1000, () => { s--; const el = $('#ptimer'); if (el) el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; });
      let t = 0; every(120, () => { t++; const speaking = Math.sin(t / 18) > -0.1; const v = speaking ? .45 + Math.random() * .35 : .05; const m = speaking ? .25 : .7 + Math.random() * .1;
        $$('#m-voice i').forEach((b, i) => b.classList.toggle('is-on', i / 20 < v)); $$('#m-music i').forEach((b, i) => b.classList.toggle('is-on', i / 20 < m));
        const d = $('#duck'); if (d) d.textContent = speaking ? 'Вы говорите — музыка приглушена на 12 дБ' : 'Пауза — музыка возвращается'; });
    },
  });

  // ───────────────────────────── сессионные залы ─────────────────────────────
  add({
    id: 'breakout', group: G, title: 'Сессионные залы', icon: 'columns', phase: 'фаза 5', plan: 'Приложение Ж.2 — залы целиком; работа в парах и тройках',
    desc: 'Авто, вручную или «выбери сам»; перетаскивание людей между залами; тройки «терапевт — клиент — наблюдатель» со сменой ролей по раундам; сообщение и голос во все залы; ведущая заходит в любой зал; итоги залов от Юи.',
    tips: ['Перетащите участника в другой зал', 'Шаблон «Тройки со сменой ролей» → «Следующий раунд»', '«Голос во все залы» — удерживайте кнопку'],
    acts: {
      ...P.common,
      mode: (el) => { P.segAct(el); const tri = el.dataset.m === 'tri'; $('.bo').classList.toggle('is-tri', tri); },
      shuffle: () => { const chips = $$('.bo .chip-p'); const rooms = $$('.bo__room .bo__list'); chips.sort(() => Math.random() - .5).forEach((c, i) => rooms[i % rooms.length].appendChild(c)); toast('Распределено автоматически — поровну, без повторов пар с прошлого раза'); },
      open: (el) => { el.textContent = 'Залы открыты'; el.disabled = true; $('.bo').classList.add('is-live'); toast('Залы открыты · 4 зала · 12 минут', { icon: 'columns' }); let s = 720; every(1000, () => { s--; const t = $('#bo-timer'); if (t) t.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }); },
      round: () => { $$('.bo__room').forEach((r) => { const roles = $$('.role', r).map((x) => x.textContent); $$('.role', r).forEach((x, i) => (x.textContent = roles[(i + roles.length - 1) % roles.length])); }); const n = $('#round'); n.textContent = +n.textContent + 1; toast('Следующий раунд: роли сменились у всех троек', { icon: 'rotate' }); },
      broadcast: () => { const i = $('#bo-msg'); toast(`Сообщение во все залы: «${esc(i.value || 'Осталось 2 минуты — завершайте')}»`, { icon: 'send' }); i.value = ''; },
      join: (el) => toast(`Вы вошли в «${el.dataset.r}» — участники видят вас`, { icon: 'door' }),
      close: () => modal(`<div class="row"><span class="yu yu--lg">${I('sparkles')}</span><h2 class="pmodal__title" style="margin:0 0 0 10px">Итоги залов от Юи</h2></div>${['Зал 1: обсуждали страх ошибки; Олег впервые сказал про отца', 'Зал 2: Кира и Вера практиковали «я-сообщения», получилось с третьей попытки', 'Зал 3: тройка не успела поменяться ролями — мало времени', 'Зал 4: Лев попросил индивидуальную сессию'].map((x) => `<div class="lrow small">${I('check', 'xs', 'accent')}${x}</div>`).join('')}<div class="pmodal__actions"><button class="btn btn--primary" data-go="meeting">Вернуть всех в общий зал</button></div>`),
    },
    render() {
      const ppl = D.group.slice(1);
      const rooms = [ppl.slice(0, 3), ppl.slice(3, 6), ppl.slice(6, 9), ppl.slice(9, 11)];
      const roles = ['терапевт', 'клиент', 'наблюдатель'];
      return `<div class="room room--bo" data-theme="dark">
        <div class="room__top"><div class="room__title"><b>Сессионные залы</b><span class="muted">· Группа «Опора» · раунд <b id="round">1</b></span></div><span class="room__clock mono" id="bo-timer">12:00</span><span class="sp"></span><button class="btn btn--secondary btn--sm" data-go="meeting">${I('arrow-left')} В общий зал</button></div>
        <div class="bo-wrap"><div class="bo__ctrl">
          <div class="seg"><button class="is-on" data-act="mode" data-m="free">Обычные залы</button><button data-act="mode" data-m="tri">Тройки со сменой ролей</button><button data-act="mode" data-m="self">«Выбери сам»</button></div>
          <button class="btn btn--secondary btn--sm" data-act="shuffle">${I('refresh')} Автораспределение</button><button class="btn btn--secondary btn--sm tri-only" data-act="round">${I('rotate')} Следующий раунд</button><span class="sp"></span>
          <button class="btn btn--primary btn--sm" data-act="open">${I('play')} Открыть залы</button><button class="btn btn--secondary btn--sm" data-act="close">Закрыть и собрать итоги</button></div>
          <div class="bo">${rooms.map((r, i) => `<div class="bo__room" data-room="${i}"><div class="row"><b class="small">Зал ${i + 1}</b><span class="sp"></span><span class="live-only pill pill--ok">идёт</span><button class="chipq" data-act="join" data-r="Зал ${i + 1}">Войти</button></div>
            <div class="bo__list">${r.map((id, k) => `<span class="chip-p" draggable="true" data-id="${id}">${av(id, 24)}${P.person(id).short}<em class="role">${roles[k % 3]}</em></span>`).join('')}</div></div>`).join('')}</div>
          <div class="bo__msg"><input class="inp" id="bo-msg" placeholder="Сообщение во все залы: «Осталось 2 минуты»"><button class="btn btn--secondary" data-act="broadcast">${I('send')} Отправить</button><button class="btn btn--primary bo__ptt">${I('mic')} Голос во все залы — удерживайте</button></div>
          <div class="tiny muted" style="margin-top:8px">${I('sparkles', 'xs')} Юя в каждом зале: следит за временем и после закрытия даёт короткий итог · «позвать ведущую» — кнопка у участников</div></div></div>`;
    },
    mount(root) {
      let dragEl = null;
      $$('.chip-p', root).forEach((c) => { c.addEventListener('dragstart', () => { dragEl = c; c.classList.add('is-drag'); }); c.addEventListener('dragend', () => c.classList.remove('is-drag')); });
      $$('.bo__room', root).forEach((r) => { r.addEventListener('dragover', (e) => { e.preventDefault(); r.classList.add('is-over'); }); r.addEventListener('dragleave', () => r.classList.remove('is-over')); r.addEventListener('drop', (e) => { e.preventDefault(); r.classList.remove('is-over'); if (dragEl) { $('.bo__list', r).appendChild(dragEl); toast(`${dragEl.textContent.trim().split(/терапевт|клиент|наблюдатель/)[0]} → Зал ${+r.dataset.room + 1}`); } }); });
      const ptt = $('.bo__ptt', root);
      ptt.addEventListener('pointerdown', () => { ptt.classList.add('is-live'); ptt.innerHTML = `${I('mic')} Вас слышат все залы…`; });
      ptt.addEventListener('pointerup', () => { ptt.classList.remove('is-live'); ptt.innerHTML = `${I('mic')} Голос во все залы — удерживайте`; });
    },
  });

  // ───────────────────────────── расстановка ─────────────────────────────
  const FIG = { m: ['Мужчина', 'figure'], f: ['Женщина', 'figure'], c: ['Ребёнок', 'figure'], o: ['Объект', 'box'], s: ['Чувство', 'heart'] };
  let figs;
  const resetFigs = () => (figs = [
    { id: 1, k: 'f', label: 'Ольга (клиент)', x: 46, y: 55, r: 0, sub: 'olga' },
    { id: 2, k: 'm', label: 'Отец', x: 30, y: 30, r: 140, sub: 'ivan' },
    { id: 3, k: 'f', label: 'Мать', x: 62, y: 28, r: 210, sub: 'nina' },
    { id: 4, k: 'c', label: 'Ольга-ребёнок', x: 24, y: 70, r: 60, sub: 'kira' },
    { id: 5, k: 's', label: 'Тревога', x: 70, y: 66, r: 270, sub: 'vera' },
  ]);
  resetFigs();
  let sel = 1;
  const figHtml = (f) => `<div class="fig fig--${f.k} ${f.id === sel ? 'is-sel' : ''}" data-fid="${f.id}" style="left:${f.x}%;top:${f.y}%;--r:${f.r}deg"><span class="fig__body"><span class="fig__nose"></span>${I(FIG[f.k][1], 'md')}</span><span class="fig__label">${esc(f.label)}</span></div>`;
  add({
    id: 'constellation', group: G, title: 'Модуль расстановок', icon: 'node', phase: 'фаза 5+', plan: '§ 5.24 — инструменты в комнате; § 6.6',
    desc: 'Общее поле с фигурками-заместителями: ведущая двигает и поворачивает (направление взгляда важно), участнику можно дать право двигать свою фигурку, снимки этапов — в итог сессии. Работает и с телефона.',
    tips: ['Перетащите фигурку', 'Поверните кнопками ↺ ↻ или колесом мыши над фигуркой', '«Снимок этапа» — сохраняется в итог'],
    acts: {
      ...P.common,
      addfig: (el) => { const id = Math.max(...figs.map((f) => f.id)) + 1; figs.push({ id, k: el.dataset.k, label: FIG[el.dataset.k][0], x: 50, y: 50, r: 0 }); sel = id; redraw(); toast(`Добавлена фигурка «${FIG[el.dataset.k][0]}»`); },
      rot: (el) => { const f = figs.find((x) => x.id === sel); f.r = (f.r + +el.dataset.d + 360) % 360; redraw(); },
      snap: () => { const n = $$('.snap').length + 1; $('.snaps').insertAdjacentHTML('beforeend', `<div class="snap fade-up"><div class="snap__f">${figs.map((f) => `<i style="left:${f.x}%;top:${f.y}%;--r:${f.r}deg" class="fig--${f.k}"></i>`).join('')}</div><span class="tiny">Этап ${n} · ${new Date().toTimeString().slice(0, 5)}</span></div>`); toast(`Снимок этапа ${n} сохранён в итог сессии`, { icon: 'cam' }); },
      perm: (el) => { el.classList.toggle('is-on'); toast(el.classList.contains('is-on') ? 'Заместители могут двигать свои фигурки' : 'Двигает только ведущая'); },
      rename: () => { const f = figs.find((x) => x.id === sel); const v = $('#fig-name').value.trim(); if (v) { f.label = v; redraw(); } },
      reset: () => { resetFigs(); sel = 1; redraw(); },
    },
    render() {
      return `<div class="room room--cons" data-theme="dark">
        <div class="room__top"><div class="room__title"><b>Расстановка · запрос Ольги</b><span class="muted">· 7 участников · видят все в реальном времени</span></div><span class="sp"></span>
          <div class="avs">${['olga', 'ivan', 'nina', 'kira', 'vera'].map((id) => av(id, 26)).join('')}</div><button class="rec-ind"><span class="rec-dot"></span>Запись</button><button class="btn btn--secondary btn--sm" data-go="meeting">${I('video')} Видео группы</button></div>
        <div class="cons"><div class="cons__tools"><div class="eyebrow">Фигурки</div>${Object.entries(FIG).map(([k, [t, ic]]) => `<button class="cons__add" data-act="addfig" data-k="${k}"><span class="fig--${k} cons__sw">${I(ic, 'sm')}</span>${t}</button>`).join('')}
            <div class="eyebrow" style="margin-top:14px">Выбрана</div><div id="selbox"></div>
            <div class="optrow" style="margin-top:6px"><div class="optrow__main small">Заместители двигают свои фигурки</div><button class="tgl" data-act="perm"></button></div>
            <button class="btn btn--primary btn--sm" style="width:100%;margin-top:10px" data-act="snap">${I('cam')} Снимок этапа</button><button class="btn btn--ghost btn--sm" style="width:100%;margin-top:6px" data-act="reset">${I('refresh')} Начальная позиция</button></div>
          <div class="field" id="field"><div class="field__grid"></div>${figs.map(figHtml).join('')}<div class="field__hint tiny">Поле видят все · вид сверху · 3D — по запросу</div></div>
          <div class="cons__side"><div class="eyebrow">Этапы</div><div class="snaps"></div><div class="eyebrow" style="margin-top:14px">Заметки ведущей</div><textarea class="inp" rows="6">Мать отворачивается от Ольги-ребёнка. Отец смотрит на Тревогу. После поворота матери — облегчение у Ольги (сказала «стало теплее»).</textarea></div></div></div>`;
    },
    mount(root) {
      const field = $('#field', root);
      let drag = null;
      field.addEventListener('pointerdown', (e) => { const el = e.target.closest('.fig'); if (!el) return; sel = +el.dataset.fid; drag = { el, f: figs.find((x) => x.id === sel) }; el.setPointerCapture(e.pointerId); $$('.fig', field).forEach((x) => x.classList.toggle('is-sel', x === el)); selBox(); });
      field.addEventListener('pointermove', (e) => { if (!drag) return; const r = field.getBoundingClientRect(); drag.f.x = Math.max(4, Math.min(96, (e.clientX - r.left) / r.width * 100)); drag.f.y = Math.max(6, Math.min(92, (e.clientY - r.top) / r.height * 100)); drag.el.style.left = drag.f.x + '%'; drag.el.style.top = drag.f.y + '%'; });
      field.addEventListener('pointerup', () => (drag = null));
      field.addEventListener('wheel', (e) => { const el = e.target.closest('.fig'); if (!el) return; e.preventDefault(); const f = figs.find((x) => x.id === +el.dataset.fid); f.r = (f.r + (e.deltaY > 0 ? 15 : -15) + 360) % 360; el.style.setProperty('--r', f.r + 'deg'); }, { passive: false });
      selBox();
    },
  });
  function redraw() { const field = $('#field'); if (!field) return; $$('.fig', field).forEach((x) => x.remove()); field.insertAdjacentHTML('beforeend', figs.map(figHtml).join('')); selBox(); }
  function selBox() {
    const f = figs.find((x) => x.id === sel); const host = $('#selbox'); if (!host || !f) return;
    host.innerHTML = `<input class="inp" id="fig-name" value="${esc(f.label)}"><div class="row" style="gap:6px;margin-top:8px"><button class="btn btn--secondary btn--sm" data-act="rot" data-d="-15">↺</button><button class="btn btn--secondary btn--sm" data-act="rot" data-d="15">↻</button><button class="btn btn--secondary btn--sm" data-act="rename">Имя</button></div>
      <div class="small muted" style="margin-top:8px">Заместитель: ${f.sub ? `${av(f.sub, 20)} ${P.person(f.sub).name}` : '<a class="accent" data-act="toast" data-text="Выберите участника из списка">назначить</a>'}</div><div class="tiny subtle" style="margin-top:4px">Взгляд: ${f.r}°</div>`;
  }

  // ───────────────────────────── доска ─────────────────────────────
  add({
    id: 'board', group: G, title: 'Доска и общие заметки', icon: 'edit', phase: 'фаза 5', plan: '§ 5.24 — Yjs + Excalidraw; Приложение В',
    desc: 'Совместная доска на одном механизме инструментов (Yjs): рисуют несколько человек, курсоры видны, опоздавший сразу видит актуальное. После встречи — снимок в итог и документ в базу знаний.',
    tips: ['Рисуйте мышью или пальцем', 'Добавьте стикер', 'Курсоры участников движутся сами'],
    acts: {
      color: (el) => { $$('.swatch').forEach((s) => s.classList.toggle('is-on', s === el)); P.boardColor = el.dataset.c; },
      sticky: () => { $('.board').insertAdjacentHTML('beforeend', `<div class="sticky fade-up" contenteditable="true" style="left:${30 + Math.random() * 40}%;top:${20 + Math.random() * 50}%">Новая мысль…</div>`); },
      clear: () => { const c = $('#bc'); c.getContext('2d').clearRect(0, 0, c.width, c.height); },
      tokb: () => toast('Доска и общие заметки сохранены документом в базу знаний «Группа Опора»', { icon: 'book' }),
    },
    render() {
      return `<div class="room room--board" data-theme="dark"><div class="room__top"><div class="room__title"><b>Доска · Группа «Опора»</b><span class="muted">· рисуют 3 участника</span></div><span class="sp"></span>
          <div class="row" style="gap:6px">${['#E8B898', '#88D6AB', '#9CC6E6', '#F1A19A', '#F4EFE7'].map((c, i) => `<button class="swatch ${i ? '' : 'is-on'}" data-act="color" data-c="${c}" style="--c:${c}"></button>`).join('')}</div>
          <button class="btn btn--secondary btn--sm" data-act="sticky">${I('notes')} Стикер</button><button class="btn btn--ghost btn--sm" data-act="clear">${I('trash')}</button><button class="btn btn--primary btn--sm" data-act="tokb">${I('book')} В базу знаний</button><button class="btn btn--secondary btn--sm" data-go="meeting">${I('video')}</button></div>
        <div class="board"><canvas id="bc"></canvas>
          <div class="sticky" style="left:12%;top:18%">Что даёт опору: <br>— дыхание <br>— люди рядом <br>— режим сна</div><div class="sticky sticky--b" style="left:62%;top:22%">Что забирает: <br>новости ночью, кофе после 16:00</div>
          <div class="cursor" id="cur1"><span>${I('arrow-up', 'xs')}</span>Кира</div><div class="cursor cursor--b" id="cur2"><span>${I('arrow-up', 'xs')}</span>Тимур</div></div></div>`;
    },
    mount(root) {
      const c = $('#bc', root); const b = $('.board', root);
      const fit = () => { const r = b.getBoundingClientRect(); c.width = r.width; c.height = r.height; };
      fit(); window.addEventListener('resize', fit); onLeave(() => window.removeEventListener('resize', fit));
      const ctx = c.getContext('2d'); let draw = false; P.boardColor = '#E8B898';
      c.addEventListener('pointerdown', (e) => { draw = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
      c.addEventListener('pointermove', (e) => { if (!draw) return; ctx.strokeStyle = P.boardColor; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); });
      c.addEventListener('pointerup', () => (draw = false));
      // «чужие» штрихи
      let t = 0; every(60, () => { t++; const x = c.width * (.25 + .15 * Math.sin(t / 30)), y = c.height * (.65 + .1 * Math.sin(t / 13));
        const c1 = $('#cur1'); if (c1) { c1.style.left = x + 'px'; c1.style.top = y + 'px'; }
        const c2 = $('#cur2'); if (c2) { c2.style.left = c.width * (.7 + .1 * Math.cos(t / 40)) + 'px'; c2.style.top = c.height * (.6 + .12 * Math.sin(t / 25)) + 'px'; }
        if (t % 2 === 0 && t < 400) { ctx.strokeStyle = '#88D6AB'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.stroke(); } });
    },
  });
})();

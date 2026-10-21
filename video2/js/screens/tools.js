(function () {
  const { D, add, I, av, esc, toast, modal, closeModal, go, every, later, $, $$, btn, chip, seg, li, yuNote, note, opt } = P;
  const G = 'Инструменты в комнате';
  const toRoom = btn('Вернуться к встрече', { icon: 'arrow-left', go: 'meeting', size: 'sm' });

  // ───────────── режим практики ─────────────
  add({
    id: 'practice', group: G, title: 'Режим практики', icon: 'leaf', more: 'group', phase: 'фаза 4', plan: '§ 5.23, § 6.5',
    desc: 'Гипноз, медитация, регресс: микрофоны у всех выключены, у участников минимальный экран и затемнение, музыка смешивается с голосом и стихает, когда ведущая говорит, мягкие сигналы, таймер, запись — участникам аудиофайлом.',
    tips: ['«Мягкий сигнал» — прозвучит у всех', 'Следите за полосками: музыка тише, когда звучит голос', '«Как видят участники» — минимальный экран'],
    acts: {
      bell: () => { try { const ac = new AudioContext(); [528, 792].forEach((f, i) => { const o = ac.createOscillator(); const g = ac.createGain(); o.frequency.value = f; g.gain.setValueAtTime(.0001, ac.currentTime); g.gain.exponentialRampToValueAtTime(.06 / (i + 1), ac.currentTime + .05); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + 2.6); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 2.7); }); setTimeout(() => ac.close(), 3000); } catch (e) {} toast('Мягкий сигнал прозвучал у всех', { icon: 'bell' }); },
      pview: (el) => { el.classList.toggle('is-on'); $('.rm').classList.toggle('as-participant', el.classList.contains('is-on')); },
      endp: () => { toast('Практика завершена. Аудиофайл уйдёт участникам после обработки'); go('meeting'); },
      track: (el) => { $$('.trk').forEach((t) => t.classList.toggle('is-on', t === el)); toast(`Музыка: ${el.dataset.t}`, { icon: 'music' }); },
    },
    render() {
      const ppl = D.group.slice(1).concat(['kate', 'mark', 'yana', 'ruslan', 'liza', 'gleb']);
      return P.room({ top: { title: 'Практика «Безопасное место»', sub: '· 17 участников · микрофоны выключены', recLabel: 'Запись → аудио участникам' },
        stage: `<div class="pr-center"><div class="pr-glow"></div><div class="pr-host" style="background-image:url(img/people/p32.jpg)"></div><div class="pr-timer mono" id="ptimer">18:42</div><div class="pr-phrase">…и с каждым выдохом тело становится чуть тяжелее и спокойнее…</div><div class="avs" style="opacity:.7">${ppl.slice(0, 12).map((id) => av(id, 32)).join('')}</div></div>`,
        panels: P.pn('mix', 'Звук ведущей', `<div class="row" style="gap:12px"><span style="width:64px">Голос</span><span class="meter" id="m-voice"></span></div><div class="row mt12" style="gap:12px"><span style="width:64px">Музыка</span><span class="meter meter--music" id="m-music"></span></div><div class="t-sm muted mt12" id="duck">Музыка стихает, пока вы говорите</div>
          <div class="pn__sec">Музыка</div>${['Тибетские чаши · 432 Гц', 'Дождь и далёкий гром', 'Пианино — медленно'].map((t, i) => `<button class="trk ${i ? '' : 'is-on'}" data-act="track" data-t="${t}">${I('music')}<span class="sp">${t}</span></button>`).join('')}<div class="t-xs muted mt8">Стерео, без обработки · у вас наушники</div>
          <div class="pn__sec">Ведение</div><div class="row row--wrap" style="gap:8px">${btn('Мягкий сигнал', { icon: 'bell', size: 'sm', act: 'bell' })}${btn('Таймер 25 мин', { icon: 'timer', size: 'sm', act: 'toast', data: 'data-text="Таймер практики: 25 минут"' })}${btn('Затемнить', { icon: 'moon', size: 'sm', act: 'toast', data: 'data-text="У участников затемнённый экран и ваша фраза"' })}</div>
          ${opt('Микрофон включает только ведущая', '', true)}${opt('Вернуть участника после обрыва', 'Без зала ожидания', true)}`, { open: true, foot: btn('Завершить практику', { kind: 'primary', block: true, act: 'endp' }) }),
        bar: `${P.rbBase()}${P.rbPanel('mix', 'music', 'Звук', { on: true })}${P.rb('eye', 'Как видят участники', 'pview')}${P.rb('bell', '', 'bell', { title: 'Мягкий сигнал' })}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Завершить')}` });
    },
    mount() {
      ['m-voice', 'm-music'].forEach((id) => ($(`#${id}`).innerHTML = '<i></i>'.repeat(20)));
      let s = 18 * 60 + 42; every(1000, () => { s = Math.max(0, s - 1); const el = $('#ptimer'); if (el) el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; });
      let t = 0; every(120, () => { t++; const sp = Math.sin(t / 18) > -0.1; const v = sp ? .45 + Math.random() * .35 : .05; const m = sp ? .25 : .75;
        $$('#m-voice i').forEach((b, i) => b.classList.toggle('is-on', i / 20 < v)); $$('#m-music i').forEach((b, i) => b.classList.toggle('is-on', i / 20 < m));
        const d = $('#duck'); if (d) d.textContent = sp ? 'Вы говорите — музыка тише на 12 дБ' : 'Пауза — музыка возвращается'; });
    },
  });

  // ───────────── сессионные залы ─────────────
  add({
    id: 'breakout', group: G, title: 'Сессионные залы', icon: 'columns', more: 'group', phase: 'фаза 5', plan: 'Приложение Ж.2',
    desc: 'Автоматически, вручную или «выбери сам»; перетаскивание людей; тройки «терапевт — клиент — наблюдатель» со сменой ролей; сообщение и голос во все залы; итоги каждого зала от Юи.',
    tips: ['Перетащите участника в другой зал', '«Тройки» → «Следующий раунд»', '«Голос во все залы» — удерживайте кнопку'],
    acts: {
      mode: (el) => { $$('.bo-mode button').forEach((b) => b.classList.toggle('is-on', b === el)); $('.bo2').classList.toggle('is-tri', el.dataset.v === 'tri'); },
      shuffle: () => { const ch = $$('.bo2 .cp'); const rooms = $$('.bo2__l'); ch.sort(() => Math.random() - .5).forEach((c, i) => rooms[i % rooms.length].appendChild(c)); toast('Распределено поровну, без повторов пар с прошлого раза'); },
      open: (el) => { el.disabled = true; el.innerHTML = 'Залы открыты'; $('.bo2').classList.add('is-live'); toast('Залы открыты: 4 зала, 12 минут'); let s = 720; every(1000, () => { s = Math.max(0, s - 1); const t = $('#clock'); if (t) t.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }); },
      round: () => { $$('.bo2__r').forEach((r) => { const roles = $$('.role', r).map((x) => x.textContent); $$('.role', r).forEach((x, i) => (x.textContent = roles[(i + roles.length - 1) % roles.length])); }); const n = $('#round'); n.textContent = +n.textContent + 1; toast('Следующий раунд: роли сменились у всех троек', { icon: 'rotate' }); },
      bmsg: () => { const i = $('#bo-msg'); toast(`Во все залы: «${esc(i.value || 'Осталось 2 минуты')}»`, { icon: 'send' }); i.value = ''; },
      join: (el) => toast(`Вы вошли в «${el.dataset.r}» — участники видят вас`, { icon: 'door' }),
      close: () => modal(`<div class="row"><span class="yu2 yu2--lg">${I('sparkles', 'lg')}</span><div class="modal2__t" style="padding:0">Итоги залов от Юи</div></div><div class="col mt16" style="gap:10px;font-size:15px">${['Зал 1: страх ошибки; Олег впервые сказал про отца', 'Зал 2: Кира и Вера пробовали «я-сообщения», получилось с третьей попытки', 'Зал 3: тройка не успела поменяться ролями — мало времени', 'Зал 4: Лев попросил индивидуальную сессию'].map((x) => `<div class="row row--top">${I('check', 'sm', 'accent')}<span>${x}</span></div>`).join('')}</div><div class="modal2__f">${btn('Вернуть всех в общий зал', { kind: 'primary', size: 'lg', go: 'meeting' })}</div>`, { dark: true }),
    },
    render() {
      const ppl = D.group.slice(1); const rooms = [ppl.slice(0, 3), ppl.slice(3, 6), ppl.slice(6, 9), ppl.slice(9, 11)]; const roles = ['терапевт', 'клиент', 'наблюдатель'];
      return P.room({ rec: false, top: { title: 'Сессионные залы', sub: '· раунд <b id="round">1</b>', clock: '12:00', rec: false, extra: toRoom },
        stage: `<div style="flex:1;display:flex;flex-direction:column;gap:12px;min-width:0;overflow:auto"><div class="row row--wrap"><div class="seg2 bo-mode" style="background:rgba(244,239,231,.08)">${[['Обычные', 'free'], ['Тройки со сменой ролей', 'tri'], ['«Выбери сам»', 'self']].map(([t, v], i) => `<button class="${i ? '' : 'is-on'}" data-act="mode" data-v="${v}">${t}</button>`).join('')}</div>${btn('Распределить', { icon: 'refresh', act: 'shuffle' })}${btn('Следующий раунд', { icon: 'rotate', act: 'round' })}<span class="sp"></span>${btn('Открыть залы', { kind: 'primary', icon: 'play', act: 'open' })}${btn('Закрыть и собрать итоги', { act: 'close' })}</div>
          <div class="bo2">${rooms.map((r, i) => `<div class="bo2__r" data-room="${i}"><div class="row"><b>Зал ${i + 1}</b><span class="sp"></span><span class="live chip2 chip2--ok">идёт</span>${btn('Войти', { size: 'sm', act: 'join', data: `data-r="Зал ${i + 1}"` })}</div><div class="bo2__l">${r.map((id, k) => `<span class="cp" draggable="true">${av(id, 32)}${P.person(id).short}<em class="role">${roles[k % 3]}</em></span>`).join('')}</div></div>`).join('')}</div>
          <div class="row"><input class="in" id="bo-msg" placeholder="Сообщение во все залы: «Осталось 2 минуты»" style="background:rgba(244,239,231,.08);color:#F4EFE7">${btn('Отправить', { icon: 'send', act: 'bmsg' })}${btn('Голос во все залы — удерживайте', { kind: 'primary', icon: 'mic', cls: 'ptt' })}</div>
          <div class="t-sm muted">${I('sparkles', 'xs')} Юя в каждом зале следит за временем и после закрытия даёт короткий итог. У участников есть кнопка «Позвать ведущую».</div></div>`,
        bar: `${P.rbBase()}${P.rb('users', 'Залы', 'toast', { on: true, data: 'data-text="Вы в управлении залами"' })}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Завершить')}` });
    },
    mount(root) {
      let dragEl = null;
      $$('.cp', root).forEach((c) => { c.addEventListener('dragstart', () => { dragEl = c; c.classList.add('is-drag'); }); c.addEventListener('dragend', () => c.classList.remove('is-drag')); });
      $$('.bo2__r', root).forEach((r) => { r.addEventListener('dragover', (e) => { e.preventDefault(); r.classList.add('is-over'); }); r.addEventListener('dragleave', () => r.classList.remove('is-over')); r.addEventListener('drop', (e) => { e.preventDefault(); r.classList.remove('is-over'); if (dragEl) { $('.bo2__l', r).appendChild(dragEl); toast(`Перенесено в зал ${+r.dataset.room + 1}`); } }); });
      const ptt = $('.ptt', root);
      ptt.addEventListener('pointerdown', () => { ptt.innerHTML = `${I('mic')}<span>Вас слышат все залы…</span>`; });
      ptt.addEventListener('pointerup', () => { ptt.innerHTML = `${I('mic')}<span>Голос во все залы — удерживайте</span>`; });
    },
  });

  // ───────────── расстановка ─────────────
  const FIG = { m: ['Мужчина', 'figure'], f: ['Женщина', 'figure'], c: ['Ребёнок', 'figure'], o: ['Объект', 'box'], s: ['Чувство', 'heart'] };
  let figs, sel = 1;
  const resetFigs = () => (figs = [
    { id: 1, k: 'f', label: 'Ольга', x: 46, y: 55, r: 0 }, { id: 2, k: 'm', label: 'Отец', x: 30, y: 30, r: 140 }, { id: 3, k: 'f', label: 'Мать', x: 62, y: 28, r: 210 },
    { id: 4, k: 'c', label: 'Ольга-ребёнок', x: 24, y: 70, r: 60 }, { id: 5, k: 's', label: 'Тревога', x: 72, y: 66, r: 270 }]);
  resetFigs();
  const figHtml = (f) => `<div class="fig fig--${f.k} ${f.id === sel ? 'is-sel' : ''}" data-fid="${f.id}" style="left:${f.x}%;top:${f.y}%;--r:${f.r}deg"><span class="fig__body"><span class="fig__nose"></span>${I(FIG[f.k][1], 'md')}</span><span class="fig__label">${esc(f.label)}</span></div>`;
  const selBox = () => { const f = figs.find((x) => x.id === sel); const b = $('#selbox'); if (!b || !f) return; b.innerHTML = `<input class="in" id="fig-name" value="${esc(f.label)}" aria-label="Подпись"><div class="row mt8" style="gap:8px">${btn('', { icon: 'rotate', act: 'rot', data: 'data-d="-30" title="Повернуть влево"', cls: 'btn2--icon' })}${btn('', { icon: 'refresh', act: 'rot', data: 'data-d="30" title="Повернуть вправо"', cls: 'btn2--icon' })}<span class="t-sm muted">${f.r}°</span></div>`; $('#fig-name').onchange = () => { f.label = $('#fig-name').value; redraw(); }; };
  const redraw = () => { const fl = $('#field'); if (!fl) return; $$('.fig', fl).forEach((x) => x.remove()); fl.insertAdjacentHTML('beforeend', figs.map(figHtml).join('')); selBox(); };
  add({
    id: 'constellation', group: G, title: 'Расстановка', icon: 'node', more: 'group', phase: 'фаза 5+', plan: '§ 5.24, § 6.6',
    desc: 'Общее поле с фигурками-заместителями. Ведущая двигает и поворачивает их — направление взгляда важно. Участнику можно дать право двигать свою фигурку. Снимки этапов уходят в итог сессии.',
    tips: ['Перетащите фигурку', 'Поверните кнопками или колесом мыши', '«Снимок этапа» — сохранится в итог'],
    acts: {
      addfig: (el) => { const id = Math.max(...figs.map((f) => f.id)) + 1; figs.push({ id, k: el.dataset.k, label: FIG[el.dataset.k][0], x: 50, y: 50, r: 0 }); sel = id; redraw(); },
      rot: (el) => { const f = figs.find((x) => x.id === sel); f.r = (f.r + +el.dataset.d + 360) % 360; redraw(); },
      snap: () => { const n = $$('.snap2').length + 1; $('#snaps').insertAdjacentHTML('beforeend', `<div class="snap2 fade-up mt8"><div class="snap__f">${figs.map((f) => `<i style="left:${f.x}%;top:${f.y}%" class="fig--${f.k}"></i>`).join('')}</div><span class="t-xs muted">Этап ${n}</span></div>`); toast(`Снимок этапа ${n} сохранён в итог сессии`); },
      reset: () => { resetFigs(); sel = 1; redraw(); },
    },
    render() {
      return P.room({ top: { title: 'Расстановка', sub: '· запрос Ольги · 7 участников видят поле', extra: toRoom },
        stage: `<div class="field2" id="field"><div class="field2__grid"></div>${figs.map(figHtml).join('')}</div>`,
        panels: P.pn('tools', 'Фигурки', `<div class="grid g2" style="gap:8px">${Object.entries(FIG).map(([k, [t]]) => `<button class="trk" style="margin:0" data-act="addfig" data-k="${k}"><span class="fig--${k}" style="width:14px;height:14px;border-radius:50%;background:var(--fc)"></span>${t}</button>`).join('')}</div>
          <div class="pn__sec">Выбрана</div><div id="selbox"></div>${opt('Заместители двигают свои фигурки', '', false, { text: 'Заместители могут двигать свои фигурки' })}
          <div class="col mt12" style="gap:8px">${btn('Снимок этапа', { kind: 'primary', icon: 'cam', act: 'snap', block: true })}${btn('Начальная позиция', { icon: 'refresh', act: 'reset', block: true })}</div>
          <div class="pn__sec">Этапы</div><div id="snaps"></div><div class="pn__sec">Заметки ведущей</div><textarea class="in" rows="4">Мать отворачивается от Ольги-ребёнка. После поворота матери Ольга сказала «стало теплее».</textarea>`, { open: true }),
        bar: `${P.rbBase()}${P.rbPanel('tools', 'node', 'Фигурки', { on: true })}${P.rbReact()}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Завершить')}` });
    },
    mount(root) {
      selBox();
      const field = $('#field', root); let drag = null;
      field.addEventListener('pointerdown', (e) => { const el = e.target.closest('.fig'); if (!el) return; sel = +el.dataset.fid; drag = { el, f: figs.find((x) => x.id === sel) }; el.setPointerCapture(e.pointerId); $$('.fig', field).forEach((x) => x.classList.toggle('is-sel', x === el)); selBox(); });
      field.addEventListener('pointermove', (e) => { if (!drag) return; const r = field.getBoundingClientRect(); drag.f.x = Math.max(4, Math.min(96, (e.clientX - r.left) / r.width * 100)); drag.f.y = Math.max(6, Math.min(92, (e.clientY - r.top) / r.height * 100)); drag.el.style.left = drag.f.x + '%'; drag.el.style.top = drag.f.y + '%'; });
      field.addEventListener('pointerup', () => (drag = null));
      field.addEventListener('wheel', (e) => { const el = e.target.closest('.fig'); if (!el) return; e.preventDefault(); sel = +el.dataset.fid; const f = figs.find((x) => x.id === sel); f.r = (f.r + (e.deltaY > 0 ? 15 : -15) + 360) % 360; el.querySelector('.fig__body').style.setProperty('--r', f.r + 'deg'); el.style.setProperty('--r', f.r + 'deg'); selBox(); }, { passive: false });
    },
  });

  // ───────────── доска ─────────────
  add({
    id: 'board', group: G, title: 'Доска и общие заметки', icon: 'edit', more: 'group', phase: 'фаза 5', plan: '§ 5.24',
    desc: 'Общая доска: рисуют все, у кого есть право; стикеры правятся вместе; видно курсоры. Снимок доски уходит в итог встречи.',
    tips: ['Рисуйте мышью или пальцем', 'Нажмите на стикер и пишите', 'Выберите цвет'],
    acts: { color: (el) => { $$('.swatch2').forEach((s) => s.classList.toggle('is-on', s === el)); P.current.color = el.dataset.c; }, clear: () => { const c = $('#bcv'); c.getContext('2d').clearRect(0, 0, c.width, c.height); }, snapb: () => toast('Снимок доски добавлен в итог встречи') },
    render() {
      return P.room({ top: { title: 'Доска', sub: '· группа «Опора»', extra: toRoom },
        stage: `<div class="board2"><canvas id="bcv"></canvas><div class="sticky" contenteditable="true" style="left:8%;top:12%">Что мне помогает, когда тревожно?<br>— дыхание<br>— позвонить сестре</div><div class="sticky sticky--b" contenteditable="true" style="left:40%;top:20%">Что мешает:<br>— «надо держаться»<br>— телефон перед сном</div><div class="cursor" style="left:62%;top:58%">${I('arrow-up', 'xs')} Кира</div><div class="cursor cursor--b" style="left:30%;top:66%">${I('arrow-up', 'xs')} Иван</div></div>`,
        bar: `${P.rbBase()}${['#E8B898', '#88D6AB', '#9CC6E6', '#F4EFE7'].map((c, i) => `<button class="swatch2 ${i ? '' : 'is-on'}" data-act="color" data-c="${c}" style="--c:${c}" aria-label="цвет"></button>`).join('')}<span class="rb-gap"></span>${P.rb('trash', 'Очистить', 'clear')}${P.rb('cam', 'Снимок в итог', 'snapb')}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Завершить')}` });
    },
    mount() {
      this.color = '#E8B898';
      const c = $('#bcv'); const r = c.parentElement.getBoundingClientRect(); c.width = r.width; c.height = r.height; const g = c.getContext('2d'); g.lineWidth = 3; g.lineCap = 'round';
      let d = false;
      c.addEventListener('pointerdown', (e) => { d = true; g.strokeStyle = this.color; g.beginPath(); g.moveTo(e.offsetX, e.offsetY); });
      c.addEventListener('pointermove', (e) => { if (!d) return; g.lineTo(e.offsetX, e.offsetY); g.stroke(); });
      c.addEventListener('pointerup', () => (d = false));
      g.strokeStyle = '#88D6AB'; g.beginPath(); [[0.15, 0.7], [0.25, 0.62], [0.35, 0.75], [0.45, 0.6]].forEach(([x, y], i) => (i ? g.lineTo(x * c.width, y * c.height) : g.moveTo(x * c.width, y * c.height))); g.stroke();
    },
  });

  // ───────────── метафорические карты ─────────────
  const CARDS = [['Дверь', 'door', '#6E7B42', '#2E3A1C'], ['Дорога', 'route', '#C98A5E', '#5A3420'], ['Окно', 'sun', '#E8C271', '#8A5A2B'], ['Мост', 'node', '#4E7397', '#1E2F42'], ['Дом', 'home', '#9C5A72', '#3E1F2C'], ['Лодка', 'moon-stars', '#6F5D91', '#241C38']];
  add({
    id: 'cards', group: G, title: 'Метафорические карты', icon: 'cards', more: 'host1', phase: 'по запросу', plan: '§ 5.24 — МАК, кандидат',
    desc: 'Колода в комнате: перемешать, клиент вытягивает карту сам, обе стороны видят её крупно и чётко — не картинку показа экрана. Что сказал клиент, Юя кладёт в заметки.',
    tips: ['«Перемешать» и «Вытянуть»', 'Нажмите на карту — она перевернётся', 'Юя записывает, что клиент увидел'],
    acts: {
      shuf: () => { $$('.mak').forEach((c) => { c.classList.remove('is-open'); c.style.transform = `rotate(${Math.random() * 10 - 5}deg)`; }); toast('Колода перемешана'); },
      draw: () => { const c = $$('.mak:not(.is-open)')[0]; if (c) c.classList.add('is-open'); },
      flip: (el) => el.classList.toggle('is-open'),
    },
    render() {
      return P.room({ top: { title: 'Метафорические карты', sub: '· сессия с Марией', extra: btn('Вернуться к сессии', { icon: 'arrow-left', go: 'call', size: 'sm' }) },
        stage: `<div class="maks">${CARDS.map(([t, ic, c1, c2], i) => `<button class="mak ${i === 1 ? 'is-open' : ''}" data-act="flip" style="transform:rotate(${(i - 2.5) * 3}deg)"><span class="mak__back">${I('sparkles', 'xl')}</span><span class="mak__face" style="background:radial-gradient(120% 90% at 30% 20%, ${c1}, ${c2})"><span class="mak__ic">${I(ic, 'xl')}</span><b>${t}</b></span></button>`).join('')}</div>`,
        panels: P.pn('mnotes', 'Что видит клиент', `${yuNote('Мария вытянула «Дорогу». Её слова: «Длинная, но я уже иду — и никто не оценивает, как я иду». Добавила в заметки к встрече.')}<div class="pn__sec">Колода</div>${seg(['Ресурсы', 'Состояния', 'Отношения'])}<div class="mt12">${opt('Клиент тянет карту сам', '', true)}${opt('Показывать карту крупно обоим', '', true)}</div>`, { open: true }),
        bar: `${P.rbBase()}${P.rb('refresh', 'Перемешать', 'shuf')}${P.rb('cards', 'Вытянуть', 'draw')}${P.rbPanel('mnotes', 'notes', 'Заметки', { on: true })}${P.rb('dots', '', 'more', { title: 'Ещё' })}${P.rbEnd('Завершить')}` });
    },
  });
})();

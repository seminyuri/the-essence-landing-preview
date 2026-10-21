/* Графики прототипа: чистый SVG на токенах. */
(function () {
  const C = {};

  C.path = (vals, w, h, pad = 2, min, max) => {
    const lo = min ?? Math.min(...vals), hi = max ?? Math.max(...vals);
    const span = hi - lo || 1;
    return vals.map((v, i) => {
      const x = pad + (i / (vals.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - lo) / span) * (h - pad * 2);
      return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };

  C.spark = (vals, w = 120, h = 32, cls = '') =>
    `<svg class="spark ${cls}" viewBox="0 0 ${w} ${h}" style="display:block;width:100%;max-width:${w}px;height:${h}px" preserveAspectRatio="none"><path d="${C.path(vals, w, h)}" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;

  // площадь: линия в SVG (тянется по ширине), подписи и отметки — HTML, чтобы текст не растягивался
  C.area = (vals, { w = 760, h = 200, labels = [], marks = [], min = 0, max, color = 'var(--color-accent)', id = 'a' + Math.random().toString(36).slice(2, 7) } = {}) => {
    const mx = max ?? Math.max(...vals) * 1.1;
    const H = h - 26;
    const line = C.path(vals, w, H, 4, min, mx);
    const area = `${line} L${w - 4},${H} L4,${H} Z`;
    const grid = [0.25, 0.5, 0.75].map((g) => `<line x1="0" x2="${w}" y1="${H * g}" y2="${H * g}" stroke="var(--color-border)" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join('');
    const mk = marks.map((m) => `<span class="area2__mk" style="left:${m.at * 100}%"><span>${m.label}</span></span>`).join('');
    const lbl = labels.map((l, i) => `<span style="left:${(i / (labels.length - 1)) * 100}%">${l}</span>`).join('');
    return `<div class="area2" style="height:${h}px"><svg viewBox="0 0 ${w} ${H}" preserveAspectRatio="none" style="width:100%;height:${H}px;display:block">
      <defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      ${grid}<path d="${area}" fill="url(#${id})"/><path d="${line}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>${mk}<div class="area2__x">${lbl}</div></div>`;
  };

  C.hbars = (items, { suffix = '' } = {}) => {
    const max = Math.max(...items.map((i) => i.v));
    return `<div class="hbars2">${items.map((i) => `<div class="hbars2__r"><span class="hbars2__l">${i.l}</span>
      <span class="hbars2__b"><i style="width:${(i.v / max) * 100}%"></i></span><span class="hbars2__v mono">${i.f || i.v}${suffix}</span></div>`).join('')}</div>`;
  };

  C.funnel = (steps) => {
    const top = steps[0].v;
    return `<div class="fun2">${steps.map((s, i) => `<div class="fun2__s">
      <div class="fun2__b" style="--w:${Math.max(8, (s.v / top) * 100)}%"><span>${s.l}</span></div>
      <div class="fun2__v"><b class="mono">${s.v.toLocaleString('ru-RU')}</b>${i ? `<em>${Math.round((s.v / steps[i - 1].v) * 100)} %</em>` : ''}</div></div>`).join('')}</div>`;
  };

  // псевдо-QR — детерминированный узор
  C.qr = (size = 120, seed = 7) => {
    const n = 25, cell = size / n; let x = seed; const rnd = () => (x = (x * 9301 + 49297) % 233280) / 233280;
    let s = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#fff"/>`;
    const finder = (fx, fy) => `<rect x="${fx * cell}" y="${fy * cell}" width="${7 * cell}" height="${7 * cell}" fill="#111"/><rect x="${(fx + 1) * cell}" y="${(fy + 1) * cell}" width="${5 * cell}" height="${5 * cell}" fill="#fff"/><rect x="${(fx + 2) * cell}" y="${(fy + 2) * cell}" width="${3 * cell}" height="${3 * cell}" fill="#111"/>`;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const inF = (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9);
      if (!inF && rnd() > .52) s += `<rect x="${i * cell}" y="${j * cell}" width="${cell}" height="${cell}" fill="#111"/>`;
    }
    return s + finder(0, 0) + finder(n - 7, 0) + finder(0, n - 7) + '</svg>';
  };

  // звуковая волна (для голосовых и уровня микрофона)
  C.wave = (n = 36, seed = 3) => { let x = seed; const r = () => (x = (x * 16807) % 2147483647) / 2147483647;
    return `<span class="wave">${Array.from({ length: n }, () => `<i style="height:${20 + r() * 80}%"></i>`).join('')}</span>`; };

  window.C = C;
})();

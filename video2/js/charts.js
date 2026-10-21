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
    `<svg class="spark ${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none"><path d="${C.path(vals, w, h)}" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round"/></svg>`;

  // площадь с осью X и отметками событий
  C.area = (vals, { w = 760, h = 200, labels = [], marks = [], min = 0, max, color = 'var(--color-accent)', id = 'a' + Math.random().toString(36).slice(2, 7) } = {}) => {
    const mx = max ?? Math.max(...vals) * 1.1;
    const line = C.path(vals, w, h - 22, 4, min, mx);
    const area = `${line} L${w - 4},${h - 22} L4,${h - 22} Z`;
    const lbl = labels.map((l, i) => `<text x="${4 + (i / (labels.length - 1)) * (w - 8)}" y="${h - 4}" font-size="10.5" fill="var(--color-fg-subtle)" text-anchor="${i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'}">${l}</text>`).join('');
    const mk = marks.map((m) => {
      const x = 4 + m.at * (w - 8);
      return `<line x1="${x}" x2="${x}" y1="6" y2="${h - 22}" stroke="var(--color-border-strong)" stroke-dasharray="3 3"/><text x="${x + 4}" y="16" font-size="10.5" fill="var(--color-fg-muted)">${m.label}</text>`;
    }).join('');
    const grid = [0.25, 0.5, 0.75].map((g) => `<line x1="4" x2="${w - 4}" y1="${(h - 22) * g}" y2="${(h - 22) * g}" stroke="var(--color-border)" stroke-width=".6"/>`).join('');
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:${h}px">
      <defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      ${grid}<path d="${area}" fill="url(#${id})"/><path d="${line}" fill="none" stroke="${color}" stroke-width="1.8" vector-effect="non-scaling-stroke"/>${mk}${lbl}</svg>`;
  };

  C.hbars = (items, { suffix = '' } = {}) => {
    const max = Math.max(...items.map((i) => i.v));
    return `<div class="hbars">${items.map((i) => `<div class="hbars__row"><span class="hbars__l">${i.l}</span>
      <span class="hbars__bar"><i style="width:${(i.v / max) * 100}%"></i></span><span class="hbars__v mono">${i.f || i.v}${suffix}</span></div>`).join('')}</div>`;
  };

  C.funnel = (steps) => {
    const top = steps[0].v;
    return `<div class="funnel">${steps.map((s, i) => `<div class="funnel__step">
      <div class="funnel__bar" style="--w:${Math.max(8, (s.v / top) * 100)}%"><span>${s.l}</span></div>
      <div class="funnel__v"><b class="mono">${s.v.toLocaleString('ru-RU')}</b>${i ? `<em>${Math.round((s.v / steps[i - 1].v) * 100)} %</em>` : ''}</div></div>`).join('')}</div>`;
  };

  // натальная карта — круг знаков, дома, планеты, аспекты
  const SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((g) => g + '\uFE0E');
  const PLAN0 = [['☉', 351], ['☽', 128], ['☿', 335], ['♀', 12], ['♂', 79], ['♃', 112], ['♄', 302], ['♅', 281], ['♆', 287], ['♇', 230], ['☊', 288], ['AC', 112]];
  const PLAN = PLAN0.map(([g, d]) => [g.length === 1 ? g + '\uFE0E' : g, d]);
  C.natal = (size = 300, { transits = false, pointer = null } = {}) => {
    const c = size / 2, r1 = c - 4, r2 = c - 30, r3 = c - 70, rp = c - 48;
    const pt = (deg, r) => { const a = (180 - deg) * Math.PI / 180; return [c + r * Math.cos(a), c + r * Math.sin(a)]; };
    let s = `<svg class="natal" viewBox="0 0 ${size} ${size}" width="100%" style="max-width:${size}px">`;
    s += `<circle cx="${c}" cy="${c}" r="${r1}" fill="var(--color-bg-elevated)" stroke="var(--color-border-strong)"/>`;
    s += `<circle cx="${c}" cy="${c}" r="${r2}" fill="none" stroke="var(--color-border-strong)"/><circle cx="${c}" cy="${c}" r="${r3}" fill="var(--color-bg)" stroke="var(--color-border)"/>`;
    for (let i = 0; i < 12; i++) {
      const [x1, y1] = pt(i * 30, r1), [x2, y2] = pt(i * 30, r2);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--color-border-strong)"/>`;
      const [tx, ty] = pt(i * 30 + 15, (r1 + r2) / 2);
      s += `<text x="${tx}" y="${ty + 5}" text-anchor="middle" font-size="${size / 22}" fill="var(--color-accent)">${SIGNS[i]}</text>`;
      const [hx1, hy1] = pt(i * 30 + 112, r3), [hx2, hy2] = pt(i * 30 + 112, 18);
      s += `<line x1="${hx1}" y1="${hy1}" x2="${hx2}" y2="${hy2}" stroke="var(--color-border)" stroke-width="${i % 3 === 0 ? 1.2 : .6}"/>`;
      const [nx, ny] = pt(i * 30 + 127, r3 - 12);
      s += `<text x="${nx}" y="${ny + 4}" text-anchor="middle" font-size="9" fill="var(--color-fg-subtle)">${i + 1}</text>`;
    }
    const asp = [[0, 2, 'var(--color-info)'], [1, 5, 'var(--color-success)'], [0, 6, 'var(--color-danger)'], [3, 4, 'var(--color-info)'], [4, 9, 'var(--color-danger)'], [2, 7, 'var(--color-success)'], [5, 8, 'var(--color-warning)']];
    asp.forEach(([a, b, col]) => { const [x1, y1] = pt(PLAN[a][1], r3 - 2), [x2, y2] = pt(PLAN[b][1], r3 - 2); s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="1" opacity=".75"/>`; });
    PLAN.forEach(([g, d]) => { const [x, y] = pt(d, rp); s += `<circle cx="${x}" cy="${y}" r="${size / 28}" fill="var(--color-bg-elevated)" stroke="var(--color-border)"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="${size / 25}" fill="var(--color-fg)">${g}</text>`; });
    if (transits) [['♄\uFE0E', 318], ['♃\uFE0E', 140], ['♂\uFE0E', 205]].forEach(([g, d]) => { const [x, y] = pt(d, r1 + 2); s += `<circle cx="${x}" cy="${y}" r="10" fill="var(--color-accent)"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" fill="var(--color-accent-on)">${g}</text>`; });
    if (pointer != null) { const [x, y] = pt(pointer, rp); s += `<circle class="natal__ptr" cx="${x}" cy="${y}" r="${size / 16}" fill="none" stroke="var(--color-accent)" stroke-width="2.5"/>`; }
    return s + '</svg>';
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

// Pandemic.Ge — vanilla JS, no dependencies.
//
// Data strategy (stale-while-revalidate):
//   1. render the snapshot baked in at build time (data/*.json, same origin, fast)
//   2. fetch the live API in the background and re-render if it is newer
//   3. refresh again every 5 minutes while the tab is visible
// Day-by-day history comes from data/history/<ISO>.json, falling back to the API.

const API = 'https://disease.sh/v3/covid-19';
const REFRESH_MS = 5 * 60 * 1000;
const DAY = 86400000;
const GEORGIA = 'GE';

const MONTHS = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];

const CONTINENTS = {
  Europe: 'ევროპა',
  Asia: 'აზია',
  'North America': 'ჩრდილოეთ ამერიკა',
  'South America': 'სამხრეთ ამერიკა',
  Africa: 'აფრიკა',
  'Australia-Oceania': 'ავსტრალია და ოკეანეთი',
};

// Entries without an ISO code, or where the generated name reads poorly.
const NAME_OVERRIDES = {
  'Diamond Princess': 'ბრილიანტის პრინცესა (საკრუიზო გემი)',
  'MS Zaandam': 'MS Zaandam (საკრუიზო გემი)',
  USA: 'აშშ',
  UK: 'დიდი ბრიტანეთი',
};

const METRICS = {
  cases: { label: 'შემთხვევები', daily: 'ახალი შემთხვევები', color: 'var(--s-cases)' },
  deaths: { label: 'გარდაცვალება', daily: 'ახალი გარდაცვალება', color: 'var(--s-deaths)' },
  vaccines: { label: 'ვაქცინაცია', daily: 'დღიური დოზები', color: 'var(--s-vaccines)' },
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ---------- formatting (Georgian conventions: space grouping, decimal comma) ----------

const GROUP = ' ';
function num(v) {
  if (!Number.isFinite(v)) return '—';
  const s = Math.round(Math.abs(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, GROUP);
  return v < 0 ? `−${s}` : s;
}
function dec(v, digits = 2) {
  if (!Number.isFinite(v)) return '—';
  let s = v.toFixed(digits);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s.replace('.', ',');
}
function compact(v) {
  if (!Number.isFinite(v)) return '—';
  const a = Math.abs(v);
  if (a >= 1e9) return `${dec(v / 1e9, a >= 1e10 ? 1 : 2)} მლრდ`;
  if (a >= 1e6) return `${dec(v / 1e6, a >= 1e7 ? 1 : 2)} მლნ`;
  if (a >= 1e4) return `${dec(v / 1e3, 1)} ათ.`;
  return num(v);
}
const pct = (part, whole, digits = 2) => (whole > 0 && Number.isFinite(part) ? `${dec((part / whole) * 100, digits)}%` : '—');
const signed = (v) => (Number.isFinite(v) && v > 0 ? `+${num(v)}` : num(v));

function fmtDate(ms, withDay = true) {
  const d = new Date(ms);
  const s = `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  return withDay ? `${d.getUTCDate()} ${s}` : s;
}
function fmtDateTime(ms) {
  if (!ms) return '—';
  const d = new Date(ms);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
}

// ---------- names ----------

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(['ka'], { type: 'region' });
  } catch {
    return null;
  }
})();

// Filled from data/names-ka.json (generated at build time); Intl is the fallback.
let kaNames = {};
const namesReady = getJson('data/names-ka.json')
  .then((n) => {
    kaNames = n;
  })
  .catch(() => {});

function nameOf(c) {
  if (NAME_OVERRIDES[c.country]) return NAME_OVERRIDES[c.country];
  if (c.iso2 && kaNames[c.iso2]) return kaNames[c.iso2];
  if (c.iso2 && regionNames) {
    try {
      const n = regionNames.of(c.iso2);
      if (n && n !== c.iso2) return n;
    } catch {
      /* unknown code */
    }
  }
  return c.country;
}

function flagOf(iso2) {
  if (!iso2 || iso2.length !== 2) return '🏳️';
  return String.fromCodePoint(...[...iso2.toUpperCase()].map((ch) => 0x1f1a5 + ch.charCodeAt(0)));
}

const codeOf = (c) => (c.iso2 || c.country).toUpperCase();

// Live API returns countryInfo.iso2; the snapshot already has .iso2 flattened.
function normalizeCountry(c) {
  const iso2 = c.iso2 ?? c.countryInfo?.iso2 ?? null;
  const o = { ...c, iso2 };
  delete o.countryInfo;
  o.name = nameOf(o);
  o.continentName = CONTINENTS[o.continent] || o.continent || '';
  o.cfr = o.cases ? (o.deaths / o.cases) * 100 : 0;
  o.search = `${o.name} ${o.country}`.toLocaleLowerCase('ka');
  return o;
}

// ---------- data ----------

async function getJson(url, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const SOURCES = {
  all: { snapshot: 'data/all.json', live: `${API}/all` },
  countries: { snapshot: 'data/countries.json', live: `${API}/countries?sort=cases` },
  continents: { snapshot: 'data/continents.json', live: `${API}/continents` },
};

/**
 * Calls onData(data, isLive) with the snapshot (if any) and again with live data
 * when it arrives and is at least as new. Resolves false if neither source worked.
 */
async function load(names, onData) {
  const pick = (kind) => Promise.all(names.map((n) => getJson(SOURCES[n][kind]).catch(() => null)));
  const updatedOf = (arr) =>
    Math.max(0, ...arr.flatMap((d) => (Array.isArray(d) ? d.map((x) => x.updated || 0) : [d?.updated || 0])));
  const asObject = (arr) => Object.fromEntries(names.map((n, i) => [n, arr[i]]));

  const snapP = pick('snapshot');
  const liveP = pick('live');
  await namesReady;

  let shownAt = 0;
  const snap = await snapP;
  if (snap.every(Boolean)) {
    shownAt = updatedOf(snap) || 1;
    onData(asObject(snap), false);
  }
  const live = await liveP;
  if (live.every(Boolean)) {
    if (updatedOf(live) >= shownAt) onData(asObject(live), true);
    return true;
  }
  return shownAt > 0;
}

// {"1/22/20": 5, ...} -> { start: ms, values: [...] }
function compactTimeline(obj) {
  const keys = obj ? Object.keys(obj) : [];
  if (!keys.length) return null;
  const [m, d, y] = keys[0].split('/').map(Number);
  return { start: Date.UTC(2000 + y, m - 1, d), values: keys.map((k) => obj[k]) };
}

const historyCache = new Map();
/** History for a country code (or "world"): { cases, deaths, vaccines } timelines. */
function loadHistory(code) {
  if (historyCache.has(code)) return historyCache.get(code);
  const p = getJson(`data/history/${code}.json`)
    .then((h) => {
      for (const k of Object.keys(h)) if (h[k]) h[k].start = Date.parse(h[k].start);
      return h;
    })
    .catch(async () => {
      const world = code === 'world';
      const [hist, vacc] = await Promise.all([
        getJson(world ? `${API}/historical/all?lastdays=all` : `${API}/historical/${code}?lastdays=all`, 20000).catch(() => null),
        getJson(world ? `${API}/vaccine/coverage?lastdays=all` : `${API}/vaccine/coverage/countries/${code}?lastdays=all`, 20000).catch(() => null),
      ]);
      const t = world ? hist : hist?.timeline;
      const v = world ? vacc : vacc?.timeline;
      if (!t && !v) return null;
      return { cases: compactTimeline(t?.cases), deaths: compactTimeline(t?.deaths), vaccines: compactTimeline(v) };
    });
  historyCache.set(code, p);
  return p;
}

function autoRefresh(fn) {
  let timer = setInterval(fn, REFRESH_MS);
  document.addEventListener('visibilitychange', () => {
    clearInterval(timer);
    if (document.visibilityState === 'visible') timer = setInterval(fn, REFRESH_MS);
  });
}

function errorBox(msg = 'მონაცემების ჩატვირთვა ვერ მოხერხდა. სცადეთ მოგვიანებით.') {
  return `<p class="card error" role="alert">${msg}</p>`;
}

// ---------- series math ----------

function toDaily(cum) {
  const out = new Array(cum.length);
  let prev = 0;
  for (let i = 0; i < cum.length; i++) {
    const v = cum[i] ?? prev;
    out[i] = Math.max(0, v - prev);
    prev = Math.max(prev, v);
  }
  return out;
}

function movingAvg(arr, w = 7) {
  const out = new Array(arr.length);
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= w) sum -= arr[i - w];
    out[i] = sum / Math.min(i + 1, w);
  }
  return out;
}

/** Peak of the 7-day average: { value, date }. */
function peak(tl) {
  if (!tl) return null;
  const avg = movingAvg(toDaily(tl.values));
  let best = 0;
  for (let i = 1; i < avg.length; i++) if (avg[i] > avg[best]) best = i;
  return avg[best] > 0 ? { value: avg[best], date: tl.start + best * DAY } : null;
}

function firstNonZero(tl) {
  if (!tl) return null;
  const i = tl.values.findIndex((v) => v > 0);
  return i >= 0 ? tl.start + i * DAY : null;
}

const lastDate = (tl) => (tl ? tl.start + (tl.values.length - 1) * DAY : null);
const lastValue = (tl) => (tl ? tl.values[tl.values.length - 1] : null);

// ---------- SVG helpers ----------

const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs = {}, parent) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (parent) parent.appendChild(el);
  return el;
}

function niceTicks(max, target = 4) {
  if (!(max > 0)) return [0, 1];
  const raw = max / target;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw);
  const ticks = [];
  for (let v = 0; v < max + step * 0.999; v += step) ticks.push(v);
  return ticks;
}

// ---------- time-series chart ----------

/**
 * Responsive SVG chart. Daily mode: faint bars + 7-day average line.
 * Cumulative mode: line with a 10% area wash. Crosshair + tooltip on hover,
 * arrow keys when focused.
 */
class TimeChart {
  constructor(host) {
    this.host = host;
    this.host.classList.add('tchart');
    this.svg = svgEl('svg', { role: 'img', tabindex: '0', class: 'tchart-svg' }, host);
    this.tip = document.createElement('div');
    this.tip.className = 'tchart-tip';
    this.tip.hidden = true;
    host.appendChild(this.tip);
    this.width = 0;
    new ResizeObserver(() => {
      const w = Math.round(this.host.clientWidth);
      if (w && w !== this.width) {
        this.width = w;
        this.render();
      }
    }).observe(host);
    this.svg.addEventListener('pointermove', (e) => this.hover(e));
    this.svg.addEventListener('pointerleave', () => this.hide());
    this.svg.addEventListener('blur', () => this.hide());
    this.svg.addEventListener('keydown', (e) => this.key(e));
  }

  set(opts) {
    this.opts = opts;
    this.render();
  }

  render() {
    const o = this.opts;
    if (!o || !this.width) return;
    const svg = this.svg;
    svg.replaceChildren();
    const W = this.width;
    const H = W < 560 ? 230 : 300;
    const m = { t: 14, r: 12, b: 28, l: 56 };
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    const pw = W - m.l - m.r;
    const ph = H - m.t - m.b;
    const n = o.values.length;
    const line = o.daily ? movingAvg(o.values) : o.values;
    let max = 1;
    for (let i = 0; i < n; i++) max = Math.max(max, o.values[i], line[i]);
    const ticks = niceTicks(max, H < 260 ? 3 : 4);
    const yMax = ticks[ticks.length - 1];
    const x = (i) => m.l + (n <= 1 ? pw / 2 : (i / (n - 1)) * pw);
    const y = (v) => m.t + ph - (v / yMax) * ph;
    Object.assign(this, { x, y, m, pw, ph, n, line, H });

    svg.setAttribute('aria-label', o.summary || '');

    // grid + y labels
    const grid = svgEl('g', { class: 'tchart-grid' }, svg);
    for (const t of ticks) {
      const yy = Math.round(y(t)) + 0.5;
      svgEl('line', { x1: m.l, x2: W - m.r, y1: yy, y2: yy, class: t === 0 ? 'base' : '' }, grid);
      const label = svgEl('text', { x: m.l - 8, y: yy + 4, 'text-anchor': 'end' }, grid);
      label.textContent = compact(t);
    }

    // x labels: years for long spans, months otherwise
    const t0 = o.start;
    const t1 = o.start + (n - 1) * DAY;
    const d0 = new Date(t0);
    const stepMonths = n > 900 ? 12 : n > 400 ? (W < 560 ? 6 : 3) : n > 150 ? (W < 560 ? 3 : 2) : 1;
    const cur = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + 1, 1));
    for (; cur.getTime() <= t1; cur.setUTCMonth(cur.getUTCMonth() + 1)) {
      if (cur.getUTCMonth() % stepMonths !== 0) continue;
      const t = cur.getTime();
      const xx = x((t - t0) / DAY);
      if (xx < m.l + 14 || xx > W - m.r - 14) continue;
      const lbl = svgEl('text', { x: xx, y: H - 8, 'text-anchor': 'middle' }, grid);
      lbl.textContent = cur.getUTCMonth() === 0 ? String(cur.getUTCFullYear()) : MONTHS[cur.getUTCMonth()];
      svgEl('line', { x1: xx, x2: xx, y1: m.t + ph, y2: m.t + ph + 4, class: 'tick' }, grid);
    }

    const series = svgEl('g', { style: `--c:${o.color}` }, svg);
    const base = y(0);
    if (o.daily) {
      // all bars as one path (fast for ~1,200 days)
      const bw = pw / n;
      const gap = bw > 4 ? 1 : 0;
      let dPath = '';
      for (let i = 0; i < n; i++) {
        const v = o.values[i];
        if (!v) continue;
        const xx = m.l + i * bw + gap / 2;
        dPath += `M${xx.toFixed(1)} ${base.toFixed(1)}V${y(v).toFixed(1)}h${Math.max(bw - gap, 0.6).toFixed(2)}V${base.toFixed(1)}Z`;
      }
      svgEl('path', { d: dPath, class: 'tchart-bars' }, series);
    }
    let dl = '';
    for (let i = 0; i < n; i++) dl += `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(line[i]).toFixed(1)}`;
    if (!o.daily) svgEl('path', { d: `${dl}L${x(n - 1).toFixed(1)} ${base}L${x(0).toFixed(1)} ${base}Z`, class: 'tchart-area' }, series);
    svgEl('path', { d: dl, class: 'tchart-line' }, series);
    svgEl('circle', { cx: x(n - 1), cy: y(line[n - 1]), r: 4, class: 'tchart-dot' }, series);

    // hover layer
    this.cross = svgEl('line', { y1: m.t, y2: m.t + ph, class: 'tchart-cross', visibility: 'hidden' }, svg);
    this.dot = svgEl('circle', { r: 4.5, class: 'tchart-dot', visibility: 'hidden', style: `--c:${o.color}` }, svg);
    this.idx = null;
    this.tip.hidden = true;
  }

  show(i) {
    const o = this.opts;
    i = Math.max(0, Math.min(this.n - 1, i));
    this.idx = i;
    const xx = this.x(i);
    const yy = this.y(this.line[i]);
    this.cross.setAttribute('x1', xx);
    this.cross.setAttribute('x2', xx);
    this.cross.setAttribute('visibility', 'visible');
    this.dot.setAttribute('cx', xx);
    this.dot.setAttribute('cy', yy);
    this.dot.setAttribute('visibility', 'visible');

    const tip = this.tip;
    tip.replaceChildren();
    const date = document.createElement('div');
    date.className = 'tip-date';
    date.textContent = fmtDate(o.start + i * DAY);
    tip.appendChild(date);
    const rows = o.daily
      ? [
          [num(o.values[i]), o.label, 'bar'],
          [num(this.line[i]), '7 დღის საშუალო', 'line'],
        ]
      : [[num(o.values[i]), o.label, 'line']];
    for (const [v, l, key] of rows) {
      const row = document.createElement('div');
      row.className = 'tip-row';
      const k = document.createElement('span');
      k.className = `tip-key ${key}`;
      k.style.setProperty('--c', o.color);
      const strong = document.createElement('strong');
      strong.textContent = v;
      const lab = document.createElement('span');
      lab.textContent = l;
      row.append(k, strong, lab);
      tip.appendChild(row);
    }
    tip.hidden = false;
    const tw = tip.offsetWidth;
    const left = xx + 14 + tw > this.width ? xx - 14 - tw : xx + 14;
    tip.style.transform = `translate(${Math.max(0, left)}px, ${Math.max(0, Math.min(yy - 30, this.H - tip.offsetHeight))}px)`;
  }

  hide() {
    if (!this.cross) return;
    this.cross.setAttribute('visibility', 'hidden');
    this.dot.setAttribute('visibility', 'hidden');
    this.tip.hidden = true;
  }

  hover(e) {
    if (!this.opts) return;
    const r = this.svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * this.width;
    this.show(Math.round(((px - this.m.l) / this.pw) * (this.n - 1)));
  }

  key(e) {
    if (!this.opts) return;
    const step = e.shiftKey ? 30 : 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const i = this.idx ?? this.n - 1;
      this.show(i + (e.key === 'ArrowRight' ? step : -step));
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      this.show(e.key === 'Home' ? 0 : this.n - 1);
    } else if (e.key === 'Escape') this.hide();
  }
}

function segmented(name, options, value) {
  return `<div class="segmented" role="group" aria-label="${escapeHtml(name)}">${options
    .map(([v, l]) => `<button type="button" data-value="${v}" aria-pressed="${v === value}">${escapeHtml(l)}</button>`)
    .join('')}</div>`;
}

function bindSegmented(group, onChange) {
  group.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-value]');
    if (!b || b.getAttribute('aria-pressed') === 'true') return;
    $$('button', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    onChange(b.dataset.value);
  });
}

/** Timeline card: metric × mode × range controls, chart, source line, CSV. */
function mountTimeline(card, hist, { title, filename }) {
  const available = Object.keys(METRICS).filter((k) => hist?.[k]?.values?.length > 1);
  if (!available.length) {
    card.innerHTML = `<h2 class="card-title">${escapeHtml(title)}</h2><p class="muted">ისტორიული მონაცემები მიუწვდომელია.</p>`;
    return;
  }
  const state = { metric: available[0], mode: 'daily', range: 'all' };
  card.innerHTML = `
    <div class="chart-head">
      <div>
        <h2 class="card-title">${escapeHtml(title)}</h2>
        <p class="chart-sub muted" data-sub></p>
      </div>
      <div class="chart-controls">
        ${segmented('მაჩვენებელი', available.map((k) => [k, METRICS[k].label]), state.metric)}
        ${segmented('რეჟიმი', [['daily', 'დღიური'], ['total', 'ჯამური']], state.mode)}
        ${segmented('პერიოდი', [['90', '90 დღე'], ['365', '1 წელი'], ['all', 'სრული']], state.range)}
      </div>
    </div>
    <div class="chart-body" data-chart></div>
    <div class="chart-foot">
      <span class="muted" data-source></span>
      <button type="button" class="link-btn" data-csv>CSV ჩამოტვირთვა</button>
    </div>`;
  const chart = new TimeChart($('[data-chart]', card));
  const groups = $$('.segmented', card);

  function draw() {
    const tl = hist[state.metric];
    const meta = METRICS[state.metric];
    const daily = state.mode === 'daily';
    let values = daily ? toDaily(tl.values) : tl.values.slice();
    let start = tl.start;
    if (state.range !== 'all') {
      const keep = Math.min(values.length, Number(state.range));
      start += (values.length - keep) * DAY;
      values = values.slice(-keep);
    }
    const label = daily ? meta.daily : meta.label;
    $('[data-sub]', card).textContent = daily ? `${label} დღეების მიხედვით · ხაზი — 7 დღის საშუალო` : `${label} ჯამურად`;
    $('[data-source]', card).textContent = `${fmtDate(tl.start)} — ${fmtDate(lastDate(tl))} · წყარო: ${
      state.metric === 'vaccines' ? 'Our World in Data' : 'Johns Hopkins CSSE'
    }`;
    chart.set({
      values,
      start,
      daily,
      color: meta.color,
      label,
      summary: `${label}: ${fmtDate(start)} — ${fmtDate(start + (values.length - 1) * DAY)}, ბოლო მნიშვნელობა ${num(values[values.length - 1])}`,
    });
  }

  bindSegmented(groups[0], (v) => ((state.metric = v), draw()));
  bindSegmented(groups[1], (v) => ((state.mode = v), draw()));
  bindSegmented(groups[2], (v) => ((state.range = v), draw()));
  $('[data-csv]', card).addEventListener('click', () => {
    const start = Math.min(...available.map((k) => hist[k].start));
    const end = Math.max(...available.map((k) => lastDate(hist[k])));
    const rows = [['date', ...available].join(',')];
    for (let t = start; t <= end; t += DAY) {
      rows.push([new Date(t).toISOString().slice(0, 10), ...available.map((k) => hist[k].values[(t - hist[k].start) / DAY] ?? '')].join(','));
    }
    download(`${filename}.csv`, rows.join('\n'));
  });
  draw();
}

function download(name, text) {
  const url = URL.createObjectURL(new Blob(['﻿', text], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- shared components ----------

function kpiTiles(d) {
  const tiles = [
    { s: 'cases', label: 'სულ შემთხვევა', value: num(d.cases), sub: d.todayCases ? `${signed(d.todayCases)} დღეს` : `${pct(d.cases, d.population)} მოსახლეობის` },
    { s: 'deaths', label: 'გარდაცვალება', value: num(d.deaths), sub: d.todayDeaths ? `${signed(d.todayDeaths)} დღეს` : `ლეტალობა ${pct(d.deaths, d.cases)}` },
    { s: 'recovered', label: 'გამოჯანმრთელდა', value: num(d.recovered), sub: `${pct(d.recovered, d.cases)} შემთხვევების` },
    { s: 'active', label: 'აქტიური', value: num(d.active), sub: `${pct(d.active, d.cases)} შემთხვევების` },
    { s: 'critical', label: 'კრიტიკული', value: num(d.critical), sub: d.active ? `${pct(d.critical, d.active)} აქტიურის` : '' },
    { s: 'tests', label: 'ტესტები', value: num(d.tests), sub: d.population && d.tests ? `${dec(d.tests / d.population, 2)} ერთ ადამიანზე` : '' },
  ];
  return tiles
    .map(
      (t) => `<article class="kpi" style="--c:var(--s-${t.s})">
        <h3><span class="key" aria-hidden="true"></span>${t.label}</h3>
        <p class="kpi-value">${t.value}</p>
        <p class="kpi-sub">${escapeHtml(t.sub)}</p>
      </article>`,
    )
    .join('');
}

function kpiSkeleton(n = 6) {
  return '<article class="kpi is-loading"><h3>&nbsp;</h3><p class="kpi-value">&nbsp;</p><p class="kpi-sub">&nbsp;</p></article>'.repeat(n);
}

/** Horizontal bars: one series → one hue, value at each tip. */
function hbars(rows, fmt, color = 'var(--s-cases)') {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return rows
    .map((r) => {
      const label = r.href ? `<a href="${r.href}">${r.label}</a>` : `<span>${r.label}</span>`;
      return `<div class="hbar">
        <div class="hbar-label">${label}</div>
        <div class="hbar-track"><i style="width:${Math.max((r.value / max) * 100, 0.6)}%;--c:${color}"></i></div>
        <div class="hbar-value">${fmt(r.value)}</div>
      </div>`;
    })
    .join('');
}

function facts(rows) {
  return `<dl class="facts">${rows
    .filter(Boolean)
    .map(([k, v, hint]) => `<div><dt>${k}</dt><dd>${v}${hint ? `<small>${hint}</small>` : ''}</dd></div>`)
    .join('')}</dl>`;
}

// ---------- pages ----------

function pageOverview() {
  // Old links pointed at index.html#FR for a country.
  if (/^#[A-Za-z]{2}$/.test(location.hash)) {
    location.replace(`countries.html${location.hash}`);
    return;
  }
  const hero = $('[data-hero]');
  const heroMeta = $('[data-hero-meta]');
  const kpis = $('[data-kpis]');
  const geBody = $('[data-ge-body]');
  const cont = $('[data-continents]');
  const top = $('[data-top]');
  let metric = 'cases';
  let data = null;

  kpis.innerHTML = kpiSkeleton();

  const metricFmt = (v) => (metric === 'casesPerOneMillion' ? num(v) : compact(v));
  const metricColor = () => (metric === 'deaths' ? 'var(--s-deaths)' : 'var(--s-cases)');

  function renderRanks() {
    if (!data) return;
    const { continents, countries } = data;
    if (continents) {
      cont.innerHTML = hbars(
        continents
          .map((c) => ({
            label: escapeHtml(CONTINENTS[c.continent] || c.continent),
            value: metric === 'casesPerOneMillion' ? (c.population ? (c.cases / c.population) * 1e6 : 0) : c[metric],
          }))
          .sort((a, b) => b.value - a.value),
        metricFmt,
        metricColor(),
      );
    }
    // per-million ranking ignores micro-states, which otherwise fill the top 10
    const pool = countries.filter((c) => metric !== 'casesPerOneMillion' || c.population > 1e6);
    top.innerHTML = hbars(
      pool
        .slice()
        .sort((a, b) => b[metric] - a[metric])
        .slice(0, 10)
        .map((c) => ({
          label: `<span class="flag" aria-hidden="true">${flagOf(c.iso2)}</span>${escapeHtml(c.name)}`,
          value: c[metric],
          href: `countries.html#${escapeHtml(codeOf(c))}`,
        })),
      metricFmt,
      metricColor(),
    );
  }

  function render({ all, countries, continents }) {
    const list = countries.map(normalizeCountry);
    data = { all, countries: list, continents };
    hero.textContent = num(all.cases);
    const affected = list.filter((c) => c.cases > 0).length;
    heroMeta.textContent = `${affected} ქვეყანა · განახლდა ${fmtDateTime(all.updated)}`;
    kpis.innerHTML = kpiTiles(all);

    const ge = list.find((c) => c.iso2 === GEORGIA);
    if (ge) {
      geBody.innerHTML = `
        <span class="ge-num">${num(ge.cases)}</span><span class="muted">შემთხვევა</span>
        <span class="ge-num">${num(ge.deaths)}</span><span class="muted">გარდაცვალება</span>
        <span class="ge-num">#${list.indexOf(ge) + 1}</span><span class="muted">ადგილი მსოფლიოში</span>`;
    }
    renderRanks();
  }

  bindSegmented($('[data-rank-metric]'), (v) => ((metric = v), renderRanks()));

  loadHistory('world').then((h) => mountTimeline($('[data-timeline]'), h, { title: 'მსოფლიო ქრონოლოგია', filename: 'covid19-world' }));

  const run = () => load(['all', 'countries', 'continents'], render).catch(() => false);
  run().then((ok) => {
    if (!ok) kpis.innerHTML = errorBox();
  });
  autoRefresh(run);
}

/** Full detail for one country. `fixedCode` = Georgia page; otherwise a picker drives it. */
function pageCountry(fixedCode) {
  const host = $('[data-country]');
  const form = $('[data-picker]');
  let countries = [];
  let world = null;
  let current = (fixedCode || location.hash.slice(1) || GEORGIA).toUpperCase();

  host.innerHTML = `<div class="kpis">${kpiSkeleton()}</div>`;

  const findByCode = (code) => countries.find((c) => codeOf(c) === code);

  function compareBars(c) {
    const perM = (v, pop) => (pop ? (v / pop) * 1e6 : 0);
    const rows = [
      ['შემთხვევა 1 მლნ-ზე', perM(c.cases, c.population), perM(world.cases, world.population), num],
      ['გარდაცვალება 1 მლნ-ზე', perM(c.deaths, c.population), perM(world.deaths, world.population), num],
      ['ტესტი 1 მლნ-ზე', perM(c.tests, c.population), perM(world.tests, world.population), compact],
      ['ლეტალობა', c.cfr, world.cases ? (world.deaths / world.cases) * 100 : 0, (v) => `${dec(v)}%`],
    ];
    return (
      `<div class="legend"><span><i class="sw" style="--c:var(--s-cases)"></i>${escapeHtml(c.name)}</span><span><i class="sw" style="--c:var(--s-world)"></i>მსოფლიო</span></div>` +
      rows
        .map(([label, a, b, fmt]) => {
          const max = Math.max(a, b) || 1;
          return `<div class="cmp">
            <p class="cmp-label">${label}</p>
            <div class="cmp-row"><span class="hbar-track"><i style="width:${(a / max) * 100}%;--c:var(--s-cases)"></i></span><b>${fmt(a)}</b></div>
            <div class="cmp-row"><span class="hbar-track"><i style="width:${(b / max) * 100}%;--c:var(--s-world)"></i></span><b>${fmt(b)}</b></div>
          </div>`;
        })
        .join('')
    );
  }

  function render(c) {
    if (!c) return;
    current = codeOf(c);
    const rank = countries.indexOf(c) + 1;
    const perM = (v) => (c.population ? (v / c.population) * 1e6 : 0);
    host.innerHTML = `
      <header class="country-head">
        <span class="flag-xl" aria-hidden="true">${flagOf(c.iso2)}</span>
        <div>
          <p class="eyebrow">${escapeHtml(c.continentName || 'COVID-19')}</p>
          <h1>${escapeHtml(c.name)}</h1>
          <p class="muted">მოსახლეობა ${num(c.population)} · #${rank} მსოფლიოში შემთხვევებით · განახლდა ${fmtDateTime(c.updated)}</p>
        </div>
      </header>
      <div class="kpis">${kpiTiles(c)}</div>
      <section class="card chart-card" data-timeline><div class="chart-placeholder"></div></section>
      <div class="grid-2">
        <section class="card">
          <h2 class="card-title">მაჩვენებლები 1 მილიონ მოსახლეზე</h2>
          ${facts([
            ['შემთხვევა', num(c.casesPerOneMillion ?? perM(c.cases))],
            ['გარდაცვალება', num(c.deathsPerOneMillion ?? perM(c.deaths))],
            ['ტესტი', num(c.testsPerOneMillion ?? perM(c.tests))],
            ['აქტიური', num(c.activePerOneMillion ?? perM(c.active))],
            ['გამოჯანმრთელდა', num(c.recoveredPerOneMillion ?? perM(c.recovered))],
            ['კრიტიკული', num(c.criticalPerOneMillion ?? perM(c.critical))],
          ])}
        </section>
        <section class="card">
          <h2 class="card-title">კოეფიციენტები</h2>
          ${facts([
            ['ლეტალობა', pct(c.deaths, c.cases), 'გარდაცვლილი / შემთხვევა'],
            ['გამოჯანმრთელება', pct(c.recovered, c.cases)],
            ['დაინფიცირდა მოსახლეობის', pct(c.cases, c.population)],
            ['1 შემთხვევა ყოველ', c.oneCasePerPeople ? `${num(c.oneCasePerPeople)} ადამიანზე` : '—'],
            ['1 გარდაცვალება ყოველ', c.oneDeathPerPeople ? `${num(c.oneDeathPerPeople)} ადამიანზე` : '—'],
            ['ტესტის დადებითობა', c.tests ? pct(c.cases, c.tests) : '—', 'შემთხვევა / ტესტი'],
          ])}
        </section>
      </div>
      <div class="grid-2">
        <section class="card" data-peaks>
          <h2 class="card-title">პიკები და ვაქცინაცია</h2>
          <div class="skeleton-block"></div>
        </section>
        <section class="card">
          <h2 class="card-title">შედარება მსოფლიოსთან</h2>
          <div data-compare>${world ? compareBars(c) : ''}</div>
        </section>
      </div>`;

    if (!fixedCode) {
      document.title = `${c.name} · Pandemic.Ge`;
      $$('button', $('[data-chips]')).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.code === current)));
      if (location.hash.slice(1).toUpperCase() !== current) history.replaceState(null, '', `#${current}`);
    }

    const code = current;
    loadHistory(c.iso2 || c.country).then((h) => {
      if (code !== current) return;
      mountTimeline($('[data-timeline]', host), h, { title: 'ქრონოლოგია', filename: `covid19-${code.toLowerCase()}` });
      const pc = peak(h?.cases);
      const pd = peak(h?.deaths);
      const first = firstNonZero(h?.cases);
      const vacc = lastValue(h?.vaccines);
      $('[data-peaks]', host).innerHTML = `<h2 class="card-title">პიკები და ვაქცინაცია</h2>${facts([
        ['პირველი შემთხვევა', first ? fmtDate(first) : '—'],
        ['შემთხვევების პიკი', pc ? `${num(pc.value)} დღეში` : '—', pc ? `7 დღის საშუალო · ${fmtDate(pc.date)}` : ''],
        ['გარდაცვალების პიკი', pd ? `${num(pd.value)} დღეში` : '—', pd ? `7 დღის საშუალო · ${fmtDate(pd.date)}` : ''],
        ['ვაქცინის დოზები', vacc ? num(vacc) : '—', vacc ? `${fmtDate(lastDate(h.vaccines))}-ის მდგომარეობით` : ''],
        ['დოზა 100 ადამიანზე', vacc && c.population ? dec((vacc / c.population) * 100, 1) : '—'],
      ])}`;
    });
  }

  let pickerReady = false;
  function setupPicker() {
    const list = $('#country-list');
    const chips = $('[data-chips]');
    const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name, 'ka'));
    list.innerHTML = sorted.map((c) => `<option value="${escapeHtml(c.name)}"></option>`).join('');
    const quick = [GEORGIA, ...countries.slice(0, 6).map((c) => c.iso2)].filter((v, i, a) => v && a.indexOf(v) === i);
    chips.innerHTML = quick
      .map(findByCode)
      .filter(Boolean)
      .map((c) => `<button type="button" class="chip" data-code="${c.iso2}" aria-pressed="${c.iso2 === current}"><span class="flag" aria-hidden="true">${flagOf(c.iso2)}</span>${escapeHtml(c.name)}</button>`)
      .join('');
    if (pickerReady) return;
    pickerReady = true;
    const input = $('#country');
    const findByText = (text) => {
      const q = text.trim().toLocaleLowerCase('ka');
      if (!q) return null;
      return countries.find((c) => c.name.toLocaleLowerCase('ka') === q || c.country.toLowerCase() === q) || countries.find((c) => c.search.includes(q));
    };
    const choose = (c) => {
      render(c);
      input.value = '';
      input.blur();
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const c = findByText(input.value);
      if (c) choose(c);
      else {
        input.setCustomValidity('ქვეყანა ვერ მოიძებნა');
        input.reportValidity();
      }
    });
    input.addEventListener('input', () => {
      input.setCustomValidity('');
      const exact = countries.find((c) => c.name === input.value);
      if (exact) choose(exact);
    });
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('[data-code]');
      if (b) render(findByCode(b.dataset.code));
    });
    window.addEventListener('hashchange', () => {
      const c = findByCode(location.hash.slice(1).toUpperCase());
      if (c && codeOf(c) !== current) render(c);
    });
  }

  // Re-render only when the shown country's numbers change, so a background
  // refresh doesn't reset the chart the reader is looking at.
  let lastKey = '';
  function onData({ countries: raw, all }) {
    countries = raw.map(normalizeCountry);
    world = all;
    if (form) setupPicker();
    const c = findByCode(current) || findByCode(GEORGIA) || countries[0];
    if (!c) {
      host.innerHTML = errorBox('ქვეყანა ვერ მოიძებნა.');
      return;
    }
    const key = `${codeOf(c)}:${c.updated}:${c.cases}:${c.deaths}`;
    if (key === lastKey) return;
    lastKey = key;
    render(c);
  }

  const run = () => load(['countries', 'all'], onData).catch(() => false);
  run().then((ok) => {
    if (!ok) host.innerHTML = errorBox();
  });
  autoRefresh(run);
}

function pageTable() {
  const tbody = $('[data-rows]');
  const filter = $('[data-filter]');
  const count = $('[data-count]');
  const chips = $('[data-continent-chips]');
  const sortButtons = $$('[data-sort]');
  let rows = [];
  let sortKey = 'cases';
  let sortDir = -1;
  let continent = '';

  const visibleRows = () => {
    const q = filter.value.trim().toLocaleLowerCase('ka');
    return rows
      .filter((r) => (!q || r.search.includes(q)) && (!continent || r.continent === continent))
      .sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name, 'ka') * sortDir;
        return ((a[sortKey] ?? -1) - (b[sortKey] ?? -1)) * sortDir;
      });
  };

  function renderTable() {
    const visible = visibleRows();
    tbody.innerHTML = visible.length
      ? visible
          .map(
            (r) => `<tr${r.iso2 === GEORGIA ? ' class="is-home"' : ''}>
              <td class="num muted">${r.rank}</td>
              <th scope="row" class="sticky-col"><a href="countries.html#${escapeHtml(codeOf(r))}"><span class="flag" aria-hidden="true">${flagOf(r.iso2)}</span>${escapeHtml(r.name)}</a></th>
              <td class="num">${num(r.cases)}</td>
              <td class="num">${r.todayCases ? `<span class="delta">+${num(r.todayCases)}</span>` : '<span class="muted">—</span>'}</td>
              <td class="num">${num(r.deaths)}</td>
              <td class="num">${r.todayDeaths ? `<span class="delta">+${num(r.todayDeaths)}</span>` : '<span class="muted">—</span>'}</td>
              <td class="num">${num(r.recovered)}</td>
              <td class="num">${num(r.active)}</td>
              <td class="num">${num(r.critical)}</td>
              <td class="num">${num(r.casesPerOneMillion)}</td>
              <td class="num">${num(r.deathsPerOneMillion)}</td>
              <td class="num">${r.cases ? `${dec(r.cfr)}%` : '—'}</td>
              <td class="num">${r.tests ? compact(r.tests) : '—'}</td>
              <td class="num">${compact(r.population)}</td>
            </tr>`,
          )
          .join('')
      : '<tr><td colspan="14" class="empty">ვერაფერი მოიძებნა</td></tr>';
    count.textContent = `ნაჩვენებია ${visible.length} / ${rows.length} ქვეყანა`;
  }

  function render({ countries }) {
    rows = countries.map(normalizeCountry).map((r, i) => ({ ...r, rank: i + 1 }));
    const updated = Math.max(...rows.map((r) => r.updated || 0));
    if (updated) $('[data-updated]').textContent = `განახლდა: ${fmtDateTime(updated)}`;
    const conts = [...new Set(rows.map((r) => r.continent).filter(Boolean))].sort((a, b) => (CONTINENTS[a] || a).localeCompare(CONTINENTS[b] || b, 'ka'));
    chips.innerHTML = [['', 'ყველა'], ...conts.map((c) => [c, CONTINENTS[c] || c])]
      .map(([v, l]) => `<button type="button" class="chip" data-continent="${escapeHtml(v)}" aria-pressed="${v === continent}">${escapeHtml(l)}</button>`)
      .join('');
    renderTable();
  }

  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-continent]');
    if (!b) return;
    continent = b.dataset.continent;
    $$('[data-continent]', chips).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderTable();
  });

  let pending;
  filter.addEventListener('input', () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(renderTable);
  });

  sortButtons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      sortDir = key === sortKey ? -sortDir : key === 'name' ? 1 : -1;
      sortKey = key;
      sortButtons.forEach((b) => b.parentElement.removeAttribute('aria-sort'));
      btn.parentElement.setAttribute('aria-sort', sortDir === 1 ? 'ascending' : 'descending');
      renderTable();
    }),
  );

  $('[data-csv]').addEventListener('click', () => {
    const cols = ['country', 'name', 'continent', 'cases', 'todayCases', 'deaths', 'todayDeaths', 'recovered', 'active', 'critical', 'casesPerOneMillion', 'deathsPerOneMillion', 'tests', 'population'];
    const esc = (v) => (typeof v === 'string' && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : (v ?? ''));
    download('covid19-countries.csv', [cols.join(','), ...visibleRows().map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n'));
  });

  const run = () => load(['countries'], render).catch(() => false);
  run().then((ok) => {
    if (!ok) tbody.innerHTML = '<tr><td colspan="14" class="empty">მონაცემები მიუწვდომელია</td></tr>';
  });
  autoRefresh(run);
}

// ---------- chrome ----------

function initTheme() {
  const btn = $('[data-theme-toggle]');
  if (!btn) return;
  const order = ['auto', 'light', 'dark'];
  const labels = { auto: 'თემა: ავტომატური', light: 'თემა: ნათელი', dark: 'თემა: მუქი' };
  const get = () => document.documentElement.dataset.theme || 'auto';
  const sync = () => {
    btn.dataset.mode = get();
    btn.title = labels[get()];
    btn.setAttribute('aria-label', labels[get()]);
  };
  sync();
  btn.addEventListener('click', () => {
    const next = order[(order.indexOf(get()) + 1) % order.length];
    if (next === 'auto') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
    try {
      if (next === 'auto') localStorage.removeItem('theme');
      else localStorage.setItem('theme', next);
    } catch {
      /* storage blocked */
    }
    sync();
  });
}

function initShare() {
  const btn = $('[data-share]');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: location.href });
      } catch {
        /* dismissed */
      }
      return;
    }
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`, '_blank', 'noopener,width=600,height=500');
  });
}

const PAGES = {
  overview: pageOverview,
  countries: () => pageCountry(null),
  georgia: () => pageCountry(GEORGIA),
  global: pageTable,
};

initTheme();
initShare();
PAGES[document.body.dataset.page]?.();

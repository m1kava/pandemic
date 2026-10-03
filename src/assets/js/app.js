// Pandemic.Ge — vanilla JS, no dependencies.
//
// Data strategy (stale-while-revalidate):
//   1. render the snapshot baked in at build time (data/*.json, same origin, fast)
//   2. fetch the live API in the background and re-render if it is newer
//   3. refresh again every 5 minutes while the tab is visible

const API = 'https://disease.sh/v3/covid-19';
const REFRESH_MS = 5 * 60 * 1000;
const GEORGIA = 'GE';

const nf = new Intl.NumberFormat('ka-GE');
const pf = new Intl.NumberFormat('ka-GE', { maximumFractionDigits: 2 });
const df = new Intl.DateTimeFormat('ka-GE', { dateStyle: 'medium', timeStyle: 'short' });
const regionNames = (() => {
  try {
    return new Intl.DisplayNames(['ka'], { type: 'region' });
  } catch {
    return null;
  }
})();

// Entries without an ISO code, or where the Intl name reads poorly.
const NAME_OVERRIDES = {
  'Diamond Princess': 'ბრილიანტის პრინცესა (საკრუიზო გემი)',
  'MS Zaandam': 'MS Zaandam (საკრუიზო გემი)',
  USA: 'აშშ',
  UK: 'დიდი ბრიტანეთი',
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const num = (v) => (Number.isFinite(v) ? nf.format(v) : '—');
const pct = (part, whole) => (whole > 0 && Number.isFinite(part) ? `${pf.format((part / whole) * 100)}%` : '');

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

// Live API returns countryInfo.iso2; snapshot already has .iso2 flattened.
function normalizeCountry(c) {
  const iso2 = c.iso2 ?? c.countryInfo?.iso2 ?? null;
  const o = { ...c, iso2 };
  delete o.countryInfo;
  o.name = nameOf(o);
  o.search = `${o.name} ${o.country}`.toLocaleLowerCase('ka');
  return o;
}

// ---------- data ----------

async function getJson(url, timeoutMs = 10000) {
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
};

/**
 * Calls onData(data, isLive) once with the snapshot (if any) and again with live
 * data when it arrives and is newer. Returns false if neither source worked.
 */
async function load(names, onData) {
  const pick = (kind) => Promise.all(names.map((n) => getJson(SOURCES[n][kind]).catch(() => null)));
  const updatedOf = (arr) =>
    Math.max(0, ...arr.flatMap((d) => (Array.isArray(d) ? d.map((x) => x.updated || 0) : [d?.updated || 0])));

  const snapP = pick('snapshot');
  const liveP = pick('live');

  let shownAt = 0;
  const snap = await snapP;
  await namesReady;
  if (snap.every(Boolean)) {
    shownAt = updatedOf(snap);
    onData(Object.fromEntries(names.map((n, i) => [n, snap[i]])), false);
  }
  const live = await liveP;
  if (live.every(Boolean)) {
    if (updatedOf(live) >= shownAt) onData(Object.fromEntries(names.map((n, i) => [n, live[i]])), true);
    return true;
  }
  return shownAt > 0;
}

function showUpdated(ts) {
  const el = $('[data-updated]');
  if (el && ts) el.textContent = `განახლდა: ${df.format(new Date(ts))}`;
}

function showError(container) {
  if (container) {
    container.innerHTML =
      '<p class="error panel">მონაცემების ჩატვირთვა ვერ მოხერხდა. სცადეთ მოგვიანებით.</p>';
  }
}

function autoRefresh(fn) {
  let timer = setInterval(fn, REFRESH_MS);
  document.addEventListener('visibilitychange', () => {
    clearInterval(timer);
    if (document.visibilityState === 'visible') {
      timer = setInterval(fn, REFRESH_MS);
    }
  });
}

// ---------- stat cards ----------

function statCards(d) {
  const cards = [
    { tone: 'cases', label: 'სულ დაინფიცირებული', value: num(d.cases), sub: d.population ? `${pct(d.cases, d.population)} მოსახლეობის` : '' },
    { tone: 'new', label: 'ახალი დაინფიცირებული', value: `+${num(d.todayCases)}`, sub: 'დღეს' },
    { tone: 'active', label: 'ამჟამად დაინფიცირებული', value: num(d.active), sub: d.cases ? `${pct(d.active, d.cases)} შემთხვევების` : '' },
    { tone: 'recovered', label: 'გამოჯანმრთელებული', value: num(d.recovered), sub: d.cases ? `${pct(d.recovered, d.cases)} გამოჯანმრთელება` : '' },
    { tone: 'deaths', label: 'გარდაცვლილი', value: num(d.deaths), sub: d.cases ? `${pct(d.deaths, d.cases)} ლეტალობა` : '' },
    { tone: 'deaths', label: 'ახალი გარდაცვლილი', value: `+${num(d.todayDeaths)}`, sub: 'დღეს' },
    { tone: 'critical', label: 'კრიტიკული', value: num(d.critical), sub: d.active ? `${pct(d.critical, d.active)} აქტიურის` : '' },
    { tone: 'tests', label: 'ჩატარებული ტესტი', value: num(d.tests), sub: d.population && d.tests ? `${pf.format(d.tests / d.population)} ერთ ადამიანზე` : '' },
  ];
  return cards
    .map(
      (c) => `<article class="stat" data-tone="${c.tone}">
        <h3>${c.label}</h3>
        <p class="stat-value">${c.value}</p>
        <p class="stat-sub">${escapeHtml(c.sub)}</p>
      </article>`,
    )
    .join('');
}

function skeleton(container, n = 8) {
  if (container && !container.children.length) {
    container.innerHTML = '<article class="stat is-loading"><h3>&nbsp;</h3><p class="stat-value">&nbsp;</p><p class="stat-sub">&nbsp;</p></article>'.repeat(n);
  }
}

// ---------- pages ----------

function pageCountries() {
  const form = $('[data-picker]');
  const input = $('#country', form);
  const list = $('#country-list');
  const chips = $('[data-chips]');
  const title = $('[data-country-title]');
  const stats = $('[data-stats]');
  let countries = [];
  let current = (location.hash.slice(1) || GEORGIA).toUpperCase();

  skeleton(stats);

  const findByCode = (code) => countries.find((c) => (c.iso2 || c.country).toUpperCase() === code);
  const findByText = (text) => {
    const q = text.trim().toLocaleLowerCase('ka');
    if (!q) return null;
    return (
      countries.find((c) => c.name.toLocaleLowerCase('ka') === q || c.country.toLowerCase() === q) ||
      countries.find((c) => c.search.includes(q))
    );
  };

  function show(c) {
    if (!c) return;
    current = (c.iso2 || c.country).toUpperCase();
    title.innerHTML = `<span class="flag" aria-hidden="true">${flagOf(c.iso2)}</span> ${escapeHtml(c.name)}`;
    stats.innerHTML = statCards(c);
    showUpdated(c.updated);
    $$('button', chips).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.code === current)));
    if (location.hash.slice(1).toUpperCase() !== current) history.replaceState(null, '', `#${current}`);
    document.title = `${c.name} · Pandemic.Ge`;
  }

  function render({ countries: raw }) {
    countries = raw.map(normalizeCountry);
    const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name, 'ka'));
    list.innerHTML = sorted.map((c) => `<option value="${escapeHtml(c.name)}"></option>`).join('');

    const quick = [GEORGIA, ...countries.slice(0, 5).map((c) => c.iso2)].filter((v, i, a) => v && a.indexOf(v) === i);
    chips.innerHTML = quick
      .map((code) => findByCode(code))
      .filter(Boolean)
      .map((c) => `<button type="button" class="chip" data-code="${c.iso2}" aria-pressed="false">${flagOf(c.iso2)} ${escapeHtml(c.name)}</button>`)
      .join('');

    show(findByCode(current) || findByCode(GEORGIA) || countries[0]);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const c = findByText(input.value);
    if (c) {
      show(c);
      input.blur();
    } else {
      input.setCustomValidity('ქვეყანა ვერ მოიძებნა');
      input.reportValidity();
    }
  });
  input.addEventListener('input', () => {
    input.setCustomValidity('');
    // Picking an option from the datalist fires `input` with an exact match.
    const exact = countries.find((c) => c.name === input.value);
    if (exact) show(exact);
  });
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-code]');
    if (b) {
      show(findByCode(b.dataset.code));
      input.value = '';
    }
  });
  window.addEventListener('hashchange', () => {
    const c = findByCode(location.hash.slice(1).toUpperCase());
    if (c) show(c);
  });

  const run = () => load(['countries'], render);
  run().then((ok) => {
    if (!ok) {
      title.textContent = '';
      showError(stats);
    }
  });
  autoRefresh(run);
}

function pageGeorgia() {
  const stats = $('[data-stats]');
  const compare = $('[data-compare]');
  skeleton(stats);

  function bars(rows) {
    return rows
      .map(({ label, ge, world, fmt }) => {
        const max = Math.max(ge, world) || 1;
        return `<div class="bar-group">
          <p class="bar-label">${label}</p>
          <div class="bar-row"><span>საქართველო</span><span class="bar"><i style="width:${(ge / max) * 100}%" data-tone="ge"></i></span><b>${fmt(ge)}</b></div>
          <div class="bar-row"><span>მსოფლიო</span><span class="bar"><i style="width:${(world / max) * 100}%" data-tone="world"></i></span><b>${fmt(world)}</b></div>
        </div>`;
      })
      .join('');
  }

  function render({ all, countries }) {
    const raw = countries.find((c) => (c.iso2 ?? c.countryInfo?.iso2) === GEORGIA);
    if (!raw) return showError(stats);
    const ge = normalizeCountry(raw);
    stats.innerHTML = statCards(ge);
    showUpdated(ge.updated);

    const perM = (v, pop) => (pop ? (v / pop) * 1e6 : 0);
    compare.innerHTML = bars([
      { label: 'შემთხვევა 1 მლნ მოსახლეზე', ge: perM(ge.cases, ge.population), world: perM(all.cases, all.population), fmt: (v) => nf.format(Math.round(v)) },
      { label: 'გარდაცვალება 1 მლნ მოსახლეზე', ge: perM(ge.deaths, ge.population), world: perM(all.deaths, all.population), fmt: (v) => nf.format(Math.round(v)) },
      { label: 'ლეტალობა', ge: ge.cases ? (ge.deaths / ge.cases) * 100 : 0, world: all.cases ? (all.deaths / all.cases) * 100 : 0, fmt: (v) => `${pf.format(v)}%` },
    ]);
  }

  const run = () => load(['all', 'countries'], render);
  run().then((ok) => ok || showError(stats));
  autoRefresh(run);
}

function pageGlobal() {
  const stats = $('[data-stats]');
  const tbody = $('[data-rows]');
  const filter = $('[data-filter]');
  const count = $('[data-count]');
  const sortButtons = $$('[data-sort]');
  let rows = [];
  let sortKey = 'cases';
  let sortDir = -1;

  skeleton(stats);

  function renderTable() {
    const q = filter.value.trim().toLocaleLowerCase('ka');
    const visible = (q ? rows.filter((r) => r.search.includes(q)) : rows.slice()).sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name, 'ka') * sortDir;
      return ((a[sortKey] ?? -1) - (b[sortKey] ?? -1)) * sortDir;
    });

    tbody.innerHTML = visible.length
      ? visible
          .map(
            (r) => `<tr${r.iso2 === GEORGIA ? ' class="is-home"' : ''}>
              <td class="num muted">${r.rank}</td>
              <th scope="row"><a href="./#${escapeHtml(r.iso2 || r.country)}"><span class="flag" aria-hidden="true">${flagOf(r.iso2)}</span>${escapeHtml(r.name)}</a></th>
              <td class="num">${num(r.cases)}</td>
              <td class="num ${r.todayCases ? 'up' : ''}">${r.todayCases ? `+${num(r.todayCases)}` : '—'}</td>
              <td class="num">${num(r.deaths)}</td>
              <td class="num ${r.todayDeaths ? 'down' : ''}">${r.todayDeaths ? `+${num(r.todayDeaths)}` : '—'}</td>
              <td class="num">${num(r.recovered)}</td>
              <td class="num">${num(r.active)}</td>
              <td class="num">${num(r.critical)}</td>
            </tr>`,
          )
          .join('')
      : '<tr><td colspan="9" class="empty">ვერაფერი მოიძებნა</td></tr>';
    count.textContent = `ნაჩვენებია ${visible.length} / ${rows.length} ქვეყანა`;
  }

  function render({ all, countries }) {
    stats.innerHTML = statCards(all);
    showUpdated(all.updated);
    rows = countries.map(normalizeCountry).map((r, i) => ({ ...r, rank: i + 1 }));
    renderTable();
  }

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

  const run = () => load(['all', 'countries'], render);
  run().then((ok) => {
    if (!ok) {
      showError(stats);
      tbody.innerHTML = '<tr><td colspan="9" class="empty">მონაცემები მიუწვდომელია</td></tr>';
    }
  });
  autoRefresh(run);
}

// ---------- shared ----------

function initShare() {
  const btn = $('[data-share]');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* dismissed */
      }
      return;
    }
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`, '_blank', 'noopener,width=600,height=500');
  });
}

const PAGES = { countries: pageCountries, georgia: pageGeorgia, global: pageGlobal };

initShare();
PAGES[document.body.dataset.page]?.();

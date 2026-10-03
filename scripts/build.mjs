// Zero-dependency static site build for GitHub Pages.
//
//   node scripts/build.mjs            -> builds ./dist
//   SITE_URL=https://x.github.io/pandemic node scripts/build.mjs
//   SKIP_DATA=1 node scripts/build.mjs  -> don't fetch the data snapshot
//
// Pages in src/pages are wrapped in src/partials/layout.html. Each page starts
// with a `<!--meta {json} -->` comment holding its title/description/nav key.
// A snapshot of the API data is saved to dist/data so the site renders
// instantly (and still works if the live API is down).

import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const out = path.join(root, 'dist');
const siteUrl = (process.env.SITE_URL || '').replace(/\/+$/, '');
const API = 'https://disease.sh/v3/covid-19';

const NAV = [
  { key: 'index', href: './', label: 'ქვეყნები' },
  { key: 'georgia', href: 'georgia.html', label: 'საქართველო' },
  { key: 'global', href: 'global.html', label: 'მსოფლიო' },
  { key: 'posts', href: 'posts.html', label: 'ბლოგი' },
];

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Collapse whitespace between tags; keeps output small without a minifier.
const minifyHtml = (html) =>
  html.replace(/<!--(?!\[)[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\n\s*/g, '\n').trim();

const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

const hash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 10);

async function fetchJson(url, timeoutMs = 20000) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

const COUNTRY_FIELDS = [
  'country', 'cases', 'todayCases', 'deaths', 'todayDeaths', 'recovered',
  'active', 'critical', 'population', 'tests', 'casesPerOneMillion', 'updated',
];

function slimCountry(c) {
  const o = {};
  for (const k of COUNTRY_FIELDS) o[k] = c[k];
  o.iso2 = c.countryInfo?.iso2 || null;
  return o;
}

// Georgian country names keyed by ISO 3166 alpha-2 code. Generated with Node's
// full ICU data because not every browser ships Georgian locale data.
function georgianRegionNames() {
  const ka = new Intl.DisplayNames(['ka'], { type: 'region', fallback: 'none' });
  const names = {};
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b);
      try {
        const n = ka.of(code);
        if (n && n !== code) names[code] = n;
      } catch {
        /* not a region code */
      }
    }
  }
  return names;
}

async function snapshotData() {
  const dir = path.join(out, 'data');
  await mkdir(dir, { recursive: true });
  const names = georgianRegionNames();
  await writeFile(path.join(dir, 'names-ka.json'), JSON.stringify(names));
  console.log(`data: ${Object.keys(names).length} Georgian country names`);
  if (process.env.SKIP_DATA) {
    console.log('data: skipped (SKIP_DATA set)');
    return;
  }
  try {
    const [all, countries] = await Promise.all([
      fetchJson(`${API}/all`),
      fetchJson(`${API}/countries?sort=cases`),
    ]);
    await writeFile(path.join(dir, 'all.json'), JSON.stringify(all));
    await writeFile(path.join(dir, 'countries.json'), JSON.stringify(countries.map(slimCountry)));
    console.log(`data: snapshot saved (${countries.length} countries)`);
  } catch (err) {
    // Not fatal: the browser falls back to the live API.
    console.warn(`data: snapshot failed (${err.message}); site will use the live API only`);
  }
}

async function build() {
  await rm(out, { recursive: true, force: true });
  await mkdir(path.join(out, 'assets'), { recursive: true });

  await cp(path.join(src, 'assets', 'img'), path.join(out, 'assets', 'img'), { recursive: true });

  // Fingerprinted CSS/JS so they can be cached forever by the browser/CDN.
  const css = minifyCss(await readFile(path.join(src, 'assets', 'css', 'app.css'), 'utf8'));
  const cssName = `assets/app.${hash(css)}.css`;
  await writeFile(path.join(out, cssName), css);

  const js = await readFile(path.join(src, 'assets', 'js', 'app.js'), 'utf8');
  const jsName = `assets/app.${hash(js)}.js`;
  await writeFile(path.join(out, jsName), js);

  const layout = await readFile(path.join(src, 'partials', 'layout.html'), 'utf8');
  const aside = await readFile(path.join(src, 'partials', 'aside.html'), 'utf8');

  const pages = (await readdir(path.join(src, 'pages'))).filter((f) => f.endsWith('.html'));
  for (const file of pages) {
    const raw = await readFile(path.join(src, 'pages', file), 'utf8');
    const m = raw.match(/^<!--meta\s+(\{[\s\S]*?\})\s*-->/);
    if (!m) throw new Error(`${file}: missing <!--meta {...} --> header`);
    const meta = JSON.parse(m[1]);
    const body = raw.slice(m[0].length).replace('{{aside}}', aside);

    const pagePath = file === 'index.html' ? '' : file;
    const canonical = siteUrl ? `<link rel="canonical" href="${siteUrl}/${pagePath}">` : '';
    const ogUrl = siteUrl ? `<meta property="og:url" content="${siteUrl}/${pagePath}">` : '';
    const ogImage = siteUrl ? `<meta property="og:image" content="${siteUrl}/assets/img/prev.jpg">` : '';
    const nav = NAV.map(
      (n) => `<a href="${n.href}"${n.key === meta.nav ? ' aria-current="page"' : ''}>${n.label}</a>`,
    ).join('');

    const html = layout
      .replaceAll('{{title}}', escapeAttr(meta.title))
      .replaceAll('{{description}}', escapeAttr(meta.description))
      .replaceAll('{{page}}', meta.page || '')
      .replace('{{canonical}}', canonical + ogUrl + ogImage)
      .replace('{{preload}}', meta.data ? '<link rel="preload" href="data/countries.json" as="fetch" crossorigin>' : '')
      .replace('{{nav}}', nav)
      .replaceAll('{{css}}', cssName)
      .replace('{{js}}', jsName)
      .replace('{{year}}', String(new Date().getFullYear()))
      .replace('{{content}}', body);

    await writeFile(path.join(out, file), minifyHtml(html));
  }

  await snapshotData();

  if (existsSync(path.join(root, 'CNAME'))) await cp(path.join(root, 'CNAME'), path.join(out, 'CNAME'));
  await writeFile(path.join(out, '.nojekyll'), '');

  console.log(`built ${pages.length} pages -> ${path.relative(root, out)}/`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

# Pandemic.Ge — Corona Virus Statistic

COVID-19 statistics in Georgian: per-country stats, Georgia vs. the world, and a sortable table of all countries.

* **Overview** — world totals, day-by-day timeline (new cases, deaths, vaccine doses; daily or cumulative;
  90 days / 1 year / full), continents and top-10 rankings
* **Countries** — full detail for any country: key numbers, timeline, per-million figures, rates,
  peaks, vaccination and comparison with the world (shareable links like `countries.html#FR`)
* **Georgia** — the same detail page for Georgia
* **Table** — every country with 13 columns, search, continent filter, sorting and CSV export
* Light / dark / auto theme, mobile-first layout, keyboard-accessible charts

## How it works

A plain static site with **no frameworks and no runtime dependencies** (one small CSS file and one JS module).

* `src/pages/*.html` — page content
* `src/partials/` — shared layout (header, footer) and sidebar
* `src/assets/` — CSS, JS, images
* `scripts/build.mjs` — zero-dependency build: assembles pages, minifies and fingerprints CSS/JS,
  and saves a snapshot of the data from [disease.sh](https://disease.sh) into `dist/data/`
  (current totals, continents, and the day-by-day history of every country)

In the browser the snapshot renders instantly, then fresh data is fetched from the live API in the
background (and again every 5 minutes while the tab is open). If the API is down, the snapshot is shown.

## Development

Requires Node.js 18+ (no `npm install` needed).

```sh
npm start          # build + serve on http://localhost:8080
npm run build      # build into ./dist
```

## Deployment (GitHub Pages)

`.github/workflows/pages.yml` builds and deploys the site on every push to `main`, once a day
(to refresh the data snapshot), and on manual runs. Pull requests are built but not deployed.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

To use a custom domain (e.g. `pandemic.ge`), add a `CNAME` file with the domain to the repo root —
the build copies it into the site — and configure DNS as described in the
[GitHub Pages docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

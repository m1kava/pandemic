# Pandemic.Ge — Corona Virus Statistic

COVID-19 statistics in Georgian: per-country stats, Georgia vs. the world, and a sortable table of all countries.

* World / country stats with percentages
* Georgia page with per-million comparison against the world
* Searchable, sortable country table
* Light and dark theme, mobile-first layout

## How it works

A plain static site with **no frameworks and no runtime dependencies** (one small CSS file and one JS module).

* `src/pages/*.html` — page content
* `src/partials/` — shared layout (header, footer) and sidebar
* `src/assets/` — CSS, JS, images
* `scripts/build.mjs` — zero-dependency build: assembles pages, minifies and fingerprints CSS/JS,
  and saves a snapshot of the data from [disease.sh](https://disease.sh) into `dist/data/`

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

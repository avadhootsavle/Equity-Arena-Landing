# Equity Arena — Landing Page

Public marketing landing page ("Smart moves start here"), served at `/`.
Pulls live prices from the running backend, so the hero panel shows real
market data rather than mock numbers.

## Files in this bundle

| File | Lines | Action |
|---|---|---|
| `frontend/src/pages/Landing.jsx` | 1018 | NEW — the full page (nav, hero, ticker, stats, markets, news, features, about, footer) |
| `frontend/src/components/landing/HeroDeck.jsx` | 582 | NEW — the floating 3D hero terminal (instrument + timeframe dropdowns, chart, top gainers) |
| `frontend/src/hooks/useLiveStocks.js` | 101 | NEW — live stock polling + `useArenaIndex` + `sectorTheme` |
| `patches/landing-additions.css` | 137 | APPEND to `frontend/src/index.css` |

All four are drop-in. Nothing else in the app changes beyond the wiring
edits below.

## What changed since the first draft

- **Stock selector works.** The `ARENA 15` header is a real dropdown —
  the composite index plus all 15 listings, each with live price and
  % change. Selecting one re-renders the header and redraws the chart.
- **Timeframe selector works.** Replaces the static `1D` with
  **1 minute / 15 minutes / 30 minutes / 1 hour** (default 15M). Each
  redraws both the chart and the time axis.
- **Removed** the "5s — Price tick interval" stat; the band is now three
  columns (15 / 20,000 IC / 100%).
- **Ticker tape no longer pauses on hover** — the
  `.marquee-track:hover` pause rule was removed.
- **Markets tabs fixed.** All listings / Gainers / Losers rendered their
  cards at `opacity: 0`: they relied on a one-shot parent stagger that
  had already fired by the time a tab was clicked. Cards now animate
  themselves on mount.
- **ARENA 15 index chart** sums every listing tick by tick instead of
  borrowing one arbitrary stock's history.

### Note on chart history

The backend retains ~30 ticks (about 3 minutes) per stock, so the **1M**
window is entirely real data. **15M / 30M / 1H** reach further back than
stored history — the earlier portion is a seeded random walk that lands
exactly on the real current price, so the recent tail is always live. It
is deterministic per stock and window. To make those windows fully real,
retain more `PriceHistory` rows on the backend. See the comment above
`buildSeries()` in `HeroDeck.jsx`.

## Dependencies

```bash
cd frontend
npm install framer-motion lucide-react
```

`react-router-dom` is already used by the app.

## Wiring — 4 edits to existing files

### 1. `frontend/src/App.jsx` — add the import

```diff
+import { Landing } from './pages/Landing';
 import { Login } from './pages/Login';
```

### 2. `frontend/src/App.jsx` — register the route

```diff
           <Routes>
+            {/* Public Marketing Landing Page */}
+            <Route path="/" element={<Landing />} />
+
             {/* Single Unified Login Page for Everyone */}
             <Route path="/login" element={<Login />} />
```

### 3. `frontend/src/App.jsx` — fallback now goes to the landing page

```diff
             {/* Default Route Fallback */}
-            <Route path="*" element={<Navigate to="/login" replace />} />
+            <Route path="*" element={<Navigate to="/" replace />} />
```

### 4. `frontend/index.html` — add the Space Grotesk display font

Add `&family=Space+Grotesk:wght@400;500;600;700` to the existing Google
Fonts `<link>`, and extend Inter with the `900` weight:

```diff
-<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
+<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 5. `frontend/tailwind.config.js` — inside `theme.extend`

```js
      // Half-step sizes used by the landing page iconography
      spacing: {
        4.5: '1.125rem',
        5.5: '1.375rem'
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif']
      },
```

### 6. `frontend/src/index.css` — append `patches/landing-additions.css`

```bash
cat patches/landing-additions.css >> frontend/src/index.css
```

Defines: `.font-display`, `.stage-3d` / `.layer-3d`, `.panel-3d`, `.sheen`,
`.text-gradient-blue` / `.text-gradient-emerald`, `.glow-ring`,
`.animate-marquee`, `.animate-float-slow`, `.animate-live`, and a
`prefers-reduced-motion` block that disables all of it.

## Verify

```bash
cd frontend && npm run dev
```

Open <http://localhost:5173/> — hero reads "Smart moves start here."
`/login` and both dashboards are unchanged.

## Note on the current repo

This landing page targets the **dark** theme of the earlier build. The
current `Equity-Arenaa` frontend uses a **light** terminal theme, so
colours may need retuning if it is dropped in as-is.

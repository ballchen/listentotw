# 聽見，福爾摩沙 — v2

Modernized rebuild of the original site (`/index.html`) using
**Astro 6 + React 19 + Tailwind v4 + GSAP ScrollTrigger**.

This folder is a parallel proof-of-concept; the legacy site is untouched at the
repo root.

## Scope completed

### Phase 0 — Asset cleanup
- Removed `img/loading.psd` (1.5 MB Photoshop source committed by accident).
- Removed empty `css/2.css`.
- Inventoried image weight (see migration plan in PR description).

### Phase 1 — Skeleton rebuild
- Extracted **all 10 tracks × 5 narrative panels** from the legacy markup
  into a single typed `src/data/tracks.ts`.
- Replaced jQuery + skrollr + TweenMax with **GSAP ScrollTrigger**.
- Replaced 3 copies of jQuery and the global `curcover / CDsta / toggle`
  vars with a 50-line `src/state/playerStore.ts` (pure
  `useSyncExternalStore`).
- Recreated the original UI/UX 1:1 on desktop:
  - `RecordPlayer.tsx` — disc spin, cover swap (`changeCD` → keyframe
    `disc-change`), tonearm lift (`changeHead` → keyframe `arm-lift`),
    play / pause / stop / story buttons.
  - `AlbumPicker.tsx` — 10 covers, with mobile-friendly horizontal
    scroll-snap that replaces the legacy 4000 px wide drag band.
  - `ScrollStory.tsx` — 5 stacked panels per track, each with a
    photo-fade and text-rise tied to the scroll position via
    ScrollTrigger `scrub`.
- Audio: native `<audio>` with `preload="metadata"` so only the chosen
  track loads (legacy site preloaded ~15 MB upfront).
- Public images / audio are **symlinked** from `../img` and `../audio`
  to avoid duplicating 40+ MB of assets in the v2 tree.

## Run

```bash
cd v2
npm install
npm run dev      # http://localhost:4321
npm run build    # static output → dist/
```

## What's left for later phases

- Phase 2 — fine-tune RWD breakpoints (mobile portrait of the disc, story
  text kerning).
- Phase 3 — full a11y pass (ARIA roles audit, focus trap on story view).
- Phase 4 — replace FB Comments iframes with Giscus or remove.
- Phase 5 — image pipeline: convert PNG/JPG → WebP/AVIF, redraw the
  recorder/disc/tonearm as SVG (currently still raster from legacy).
- Phase 6 — Lighthouse CI + Vercel/Cloudflare deploy.

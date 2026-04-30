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

### Phase 2 — RWD
- Mobile-first refactor of `RecordPlayer.tsx`: vertical stack on `<lg`
  (logo → disc → track caption → controls), original phonograph composition
  on `lg+`.
- Disc sized as `w-[min(80vw,420px)] aspect-square` so it scales fluidly.
- `AlbumPicker` cover sizes go `140 → 170 → 200px` across breakpoints with
  swipe-hint text on touch and `scrollIntoView({inline:'center'})` whenever
  the active track changes.
- `ScrollStory` typography uses fluid `text-base sm: lg:` ramps; backdrop
  overlay darkens to `bg-black/50` on small screens for legibility.

### Phase 3 — Accessibility
- Semantic landmarks: `<main>`, `<nav>`, `<section aria-labelledby>`,
  `<article>` per panel.
- All controls are real `<button>` with `aria-label`, `aria-pressed`
  (play/pause), `aria-current`, `aria-disabled`.
- Listbox semantics on the picker: `role="listbox"` + `role="option"` +
  `aria-selected`.
- Decorative images marked `aria-hidden` / empty `alt`.
- **Keyboard**: `Space` toggles play, `←/→` switch tracks, `Esc` exits the
  story view. Story view auto-focuses the back button.
- **Live region**: an `aria-live="polite"` status node announces the
  current track and play state.
- **Reduced motion**: `prefers-reduced-motion: reduce` disables disc spin,
  cover swap, tonearm lift, and replaces ScrollTrigger scrubs with static
  reveals.
- Skip-link to main content for keyboard users.
- `lang="zh-Hant"`, `theme-color`, OG image, asset preload hints.

### Comments
- Legacy `fb.html / fb0–9.html` and `img/btn-fb.png` removed entirely;
  the comment system is no longer part of the product.

## What's left for later phases

- Phase 4 — image pipeline: convert PNG/JPG → WebP/AVIF, redraw the
  recorder/disc/tonearm as SVG (currently still raster from legacy).
- Phase 5 — Lighthouse CI + Vercel/Cloudflare deploy.

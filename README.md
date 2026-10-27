# MANUL — Motion-site

A responsive, runnable reconstruction of the **visual design and cursor-reactive behavior** shown in the 43-second Japanese tutorial video `2675.mp4`.

## Quick start (no installation required)

From the `motion-site` directory:

```bash
python -m http.server 3000
```

Then visit **http://localhost:3000**. Do not double-click `index.html` and load it as `file://`; asset paths assume an HTTP server.

Alternate with Node:

```bash
npx serve -l 3000 .
```

## What works

- Japanese landing page with an EN/JP language toggle, navigation, CTA, responsive mobile menu.
- Canvas 2D renderer, **25 preloaded WebP frames** (5 x 5 directions).
- Pointer position → gaze target → `requestAnimationFrame` eased interpolation → bilinear crossfade between four closest poses.
- No `video.currentTime` scrubbing and no CSS transforms applied to the mascot for tracking.
- Tap/swipe interaction on touch devices; manual direction grid; prefers-reduced-motion handling.
- Semantic sections, keyboard-accessible controls, Open Graph image, no runtime dependencies.

## Important visual limitation

**This is a functioning visual prototype, not a frame-perfect reproduction or a proven AI-generated 3D head-turn animation.** The original multi-angle video and original character assets were not included in the source clip. The 25 WebP poses in this package were procedurally warped from a newly generated still image. They respond correctly to the cursor but do **not** exhibit true 3D perspective changes. These assets should be replaced with frames from a consistently authored multi-angle source video for production-quality eye/head tracking. This distinction is essential.

The original video appeared to use blue-scarfed Manul artwork and Japanese copy. This site recreates those visual design cues using **a new, distinct visual asset**, not source files from the original creator.

## Files

- `index.html` — website structure, SEO, accessibility.
- `style.css` — responsive visual system.
- `script.js` — preload, cursor mapping, interpolation, interaction.
- `assets/poses/pose-ROW-COL.webp` — 25 usable 5x5 directional pose assets.
- `assets/mascot-source.png` — visual starting point.
- `assets/og-preview.jpg` — social preview.
- `docs/prompts-analysis.md` — video prompt analysis, faithful transcriptions, complete replacement prompts.
- `tools/build_poses.py` — optional prototype asset pipeline (source image must be provided).

## Production asset replacement

1. Create a fixed-camera multi-direction character video with the same framing, facial identity, scarf, lighting and background on every frame. A still frame without true 3D pose changes does not suffice.
2. Export 25 clean poses covering a 5 x 5 gaze grid. Normalize canvas sizes, crop alignment, exposure and character scale identically. Convert each to transparent WebP where practicable.
3. Overwrite `assets/poses/pose-0-0.webp` through `pose-4-4.webp` in row-major order: top-left to bottom-right.
4. Run in browser and verify transition quality at horizontal, vertical and diagonal extremes.
5. If source poses do not share framing, pre-align (eyes, nose, scarf, silhouette) before exporting. Crossfades alone cannot fix inconsistent character identities.

## Publish

This is a static website. In Vercel, import the repo (or upload through the deployment flow), set Framework Preset to **Other**, Build Command empty, and Output Directory `.`. Deploy as a static site. No secrets required.

## QA checklist

- [x] HTML/CSS/JS built; no remote runtime service needed.
- [x] 25 actual WebP assets generated.
- [x] Interactive controls wired.
- [ ] Verify in target users' devices, additional browsers, and slow networks before production release.
- [ ] Replace synthesized still-image poses with genuine multi-direction animation for high fidelity.

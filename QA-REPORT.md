# QA REPORT — MANUL motion-site

Date: 2026-10-27

Test environment: Chromium headless (Playwright) using an inlined copy of the **same HTML/CSS/JS and all 25 identical WebP assets**. Local URL navigation in this execution container was administratively blocked, so browser tests used `page.set_content` with image data URLs; standalone HTTP asset response separately checked. This is not a cross-browser production test.

| Check | Result | Evidence |
|---|---|---|
| JavaScript syntax | PASS | `node --check script.js` exits successfully |
| WebP asset integrity | PASS | All 25 images open and decode with Pillow; a damaged file was detected and regenerated |
| WebP preload in browser | PASS | Counter reaches `25 / 25 FRAMES READY` (desktop and mobile) |
| Canvas creation and sizing | PASS | Rendered 1104 x 717 canvas in 1440 x 900 desktop test |
| Pointer mapping | PASS | After mouse moved to (1300,200), label became approximately X 0.80 / Y -0.55 |
| JP -> EN text change | PASS | Hero title changed to `Every move, / I see it.` |
| Direction grid / RESET | PASS | Exactly one pose button is selected |
| Responsive at 390 px | PASS | Document scroll width is 390 px (no horizontal overflow) |
| Mobile hamburger menu | PASS | Menu opened with click |
| Browser JavaScript errors | PASS | No uncaught `pageerror` in test sessions |
| True 3D look-direction pose data | LIMITATION | Prototype uses still-image warps; genuine multi-angle frames unavailable |
| Real phone/browser matrix | NOT VERIFIED | Requires devices or external browser testing |
| Public Vercel deployment | NOT DEPLOYED | No user account or target project selected for publication |

Recommended next step: replace pose WebPs with footage-derived true directional source frames, then test head alignment and flicker on mobile devices before publishing as a high-fidelity production experience.

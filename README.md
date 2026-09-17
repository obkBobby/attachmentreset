# RelationSync cohort site

Static HTML/CSS inquiry page for a live relationship-practice cohort led by Robert Sawyer. No runtime JavaScript, build step, external fonts, tracking, accounts, or backend.

## Preview

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766. The original `morehuman*.html`, `resetquiz/`, and `coach.jpg` are preserved.

## Browser tests

Node.js and npm are required. Playwright is pinned in the lockfile.

```sh
npm ci
npx playwright install chromium
npm test
```

`npm test` starts an ephemeral loopback-only server, runs the cohort tests and independent release audit, and shuts down the server. It does not require the preview server. `npm run test:release` runs the independent audit alone; `npm run test:browser` uses the preview URL or `SITE_URL`.

Checks include the exact outcome headline, cohort navigation, required content and boundaries, sourced client stories, metadata, local assets, email URI, removed legacy claims, keyboard FAQ operation, JavaScript-disabled content, reduced-motion mode, image loading, and overflow at 320, 390, 768, and 1440px. Text containers are also checked at 320, 390, and 1440px.

The tests save full-page screenshots to:

- `/tmp/relationsync-cohort-desktop.png`
- `/tmp/relationsync-cohort-mobile.png`

## Design

A large outcome-led editorial hero pairs the original coach photo with a compact description of the live format. Cream, warm white, taupe, terracotta, dark terracotta, and charcoal preserve the brand. Georgia display type pairs with a local sans-serif stack, so the page has no remote-font dependency. Dark terracotta, rather than the lighter decorative terracotta, provides contrast for small button and label text. The pattern example and numbered session sequence explain the work before the invitation. Native details elements keep FAQs usable without scripts.

## Content and launch boundaries

- The CTA is an inquiry: **Email Robert about the cohort** opens `mailto:robertsawyerco@gmail.com?subject=RelationSync%20cohort%20inquiry`.
- Sending requires the visitor's email app. The website cannot verify delivery, record a lead, enroll someone, reserve a seat, or display a submission receipt. There is no form or signup state.
- Dates, schedule, price, capacity, enrollment, and publishing integration remain owner decisions. None is invented on the page.
- Participants join individually, single or partnered. The work is short teaching, guided exercises, and selected group coaching. Private coaching turns and relationship outcomes are not guaranteed. There is no app, community platform, or between-session support.
- Exercises allow fictional scenarios and passing. Participants do not counsel peers. The FAQ distinguishes skills practice from therapy and crisis care.
- Joseph and Alex's local videos and posters are sourced from https://robertsawyer.co/#client-stories. The page uses the supplied exact quotes and explicitly labels these as previous coaching stories, not cohort results. Videos use native controls, inline playback, no preload and no autoplay. The displayed quotes are excerpts, not full video transcripts or synchronized captions.
- No full course materials have been created or promised by this implementation.
- No deployment workflow, DNS changes, production publication, or merge is part of this build. Canonical and social metadata name the intended production URL, https://relationsync.co/.

## Verification record

Implementation followed observed RED/GREEN cycles: the original headline failed; missing cohort sections failed; the named mechanism and additional takeaways failed; missing canonical metadata failed. Each passed after its corresponding implementation. The independent audit caught placeholder home anchors, which were replaced with a real `#top` target. Final `npm test` and `git diff --check` passed. Full-page desktop and phone screenshots were reviewed.

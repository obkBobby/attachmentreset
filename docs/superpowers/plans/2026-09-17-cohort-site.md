# RelationSync cohort site implementation plan

> Visual revision approved after v1: use StoryOS launch-room's actual layout and heavy sans-serif typography with RobertSawyer.co white/black/#0034e3. Include SVG/ICO/Apple favicon. This supersedes the original warm palette below; the original record is retained as history. Revision tests: `tests/visual-direction.cjs`, included in `npm test`.

## Approved design / specification
User approved building a live facilitated-practice cohort site for individuals, single or partnered. Short teaching, guided exercises, selected coaching. No app, community platform, Podia, or offsession coaching. Preserve cream #F5F0E8, warm-white #FAF7F2, taupe #C4B8A8, terracotta #C1654A, dark terracotta #A0502E, charcoal #2C2420. StoryOS launch-room-inspired hierarchy, not a copied page. Art of Accomplishment informs experiential learning explanation only, not curriculum copying. Retain original coach.jpg. No manufactured testimonials, dates, prices, outcome guarantees or capacity scarcity. No em dashes. Copy should feel human, grounded, and specific. Explain individuals participate independently regardless of relationship status. Practice can use fictional scenarios; passing is allowed. Participants do not counsel peers. No private coaching guarantee, no therapeutic or crisis-service promises.

**Goal:** Replace outdated Attachment Reset page with a polished, responsive signature-cohort marketing site and truthful inquiry path.
**Architecture:** Static HTML/CSS, native details FAQ, minimal optional JS. Preserve unrelated morehuman and resetquiz content. No new tracking, backend, accounts, or secret handling.
**Tech stack:** Existing static site; Node Playwright for browser tests.
**Source:** obkBobby/attachmentreset main fa94ad1; exact live index.html byte match verified. GitHub Pages API 404; live served through Cloudflare, publishing integration unknown. Build/push draft PR; do not merge or mutate DNS.

## Task 1: Cohort positioning and primary journey
Files: index.html, styles.css, tests/cohort.cjs.
- [x] Write a Playwright assertion that visible h1 says 'Know the pattern. Change what happens next.' and CTA 'Explore the cohort' reaches #cohort; run against existing site and observe failure.
- [x] Implement semantic navigation, large editorial hero with Robert image/program summary, recognizable problem, pattern diagram, facilitated session, roadmap, tangible outputs, coach, fit, cohort invitation, FAQ and footer.
- [x] Primary enrollment state: informational cohort inquiry, not open enrollment. State dates and pricing will be shared before enrollment, without inventing availability. Direct action is labeled 'Email Robert about the cohort' and uses mailto:robertsawyerco@gmail.com with subject RelationSync cohort inquiry. Clearly explain it opens an email draft; never display a successful-submission state. No broken Stan links or misleading waitlist.
- [x] Test anchors, no overflow, valid images and headings.

## Task 2: Accessibility, copy and delivery QA
Files: tests/cohort.cjs, README.md.
- [x] Add regression checks removing old support, prices, guarantees, Stan links. Check palette, single/partnered copy, warm identity, no em dashes.
- [x] Exercise FAQ with keyboard, primary navigation and email URI at desktop 1440 and phone 390 and 320. Test reduced-motion and JS-disabled rendering. Check local links/assets and unrelated files unchanged.
- [x] Inspect screenshots and refine actual spacing/contrast/line wrapping. All content visible without scroll reveal scripts.
- [x] Document commands, launch boundaries, no enrollment receipt verification or lead storage. Run git diff --check.

## Task 3: Delivery
- [x] Independent copy and implementation review; fix issues and rerun tests.
- [ ] Commit source/tests/docs; push feature branch; create draft PR with screenshot artifacts and actual test evidence.
- [ ] Verify remote PR head and changed files. Deliver screenshot + review URL; clearly state not published and dates/price/enrollment pending owner decisions.

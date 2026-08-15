# Kenneth Soriano — Personal Portfolio

> Live at [kennethics.github.io](https://kennethics.github.io)

Personal portfolio website for Kenneth Soriano — AI Automation Specialist, Business Analyst, and Customer Success Professional.

## Stack
- Pure HTML5 + CSS3 + Vanilla JS
- Single-page site with anchor-based navigation (no separate pages)
- Hosted on GitHub Pages (no build tools)

## Structure
| File / Folder | Description |
|---|---|
| `index.html` | The entire site — Hero, Services, About, Experience, Projects, Writing, Recommendations, Contact |
| `assets/css/shared.css` | Global styles: variables, nav, drawer, cards, buttons, fade-in reveal, back-to-top |
| `assets/css/hero-card.css` | Hero flip-card component styles |
| `assets/css/background.css` | "Business Intelligence Canvas" decorative background layer (grid, glow, section motifs) |
| `assets/js/theme.js` | Light/dark theme toggle, persisted via localStorage |
| `assets/js/interactions.js` | Scroll reveal, nav float/solidify, back-to-top, mobile drawer |
| `assets/js/hero-card.js` | Hero profile card flip interaction |
| `assets/icons/favicon.svg` | Site favicon |
| `sitemap.xml` | Lists only the homepage (the canonical, and only, page) |
| `robots.txt` | Allows standard crawling, blocks known AI-training bots, points to `sitemap.xml` |
| `LICENSE` | All Rights Reserved — reuse of design/code as a template elsewhere is prohibited |

## Sections (in-page anchors)
`#hero` · `#services` · `#about` · `#experience` · `#projects` · `#writing` · `#recommendations` · `#contact`

Scroll-spy (in `index.html`'s inline script) keeps the nav active state and the URL hash in sync with whichever section is in view, using `IntersectionObserver` + `history.replaceState()` — no new history entries are created while scrolling.

## Architecture note
`index.html` maintains its own embedded `<style>` block for homepage-only styles (hero, sections, form, etc.) **in addition to** linking `shared.css` for cross-cutting styles (nav, cards, buttons, reveal animations). Any change to a shared component (nav, cards, buttons) must be made in `shared.css` only — it is not duplicated in `index.html`'s embedded styles.

## SEO
- `sitemap.xml` — lists only `index.html`, since that's the only page that exists
- `robots.txt` — allows general crawling, explicitly disallows GPTBot, CCBot, Google-Extended, ClaudeBot, and anthropic-ai
- Previously, this repo had six separate redirect-stub pages (`about.html`, `experience.html`, etc.) forwarding to `index.html` anchors, to preserve SEO equity from any external links to the old multi-page URLs. These were removed once Search Console confirmed the sitemap referencing them had never been successfully indexed, making the stubs unnecessary.

## License
All Rights Reserved — see `LICENSE`. This code and design may not be reused as a template or basis for another portfolio without written permission.

## Contact
- Email: nethxkensoriano@gmail.com
- LinkedIn: linkedin.com/in/kennethsorianova
- GitHub: github.com/kennethics
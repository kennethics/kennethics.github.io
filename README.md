# Kenneth Soriano — Personal Portfolio

> Live at [kennethics.github.io](https://kennethics.github.io)

Personal portfolio website for Kenneth Soriano — AI Automation Specialist, Business Analyst, and Customer Success Professional.

## Stack
- Pure HTML5 + CSS3 + Vanilla JS
- Single-page application (SPA) with anchor-based navigation
- Hosted on GitHub Pages (no build tools)

## Structure
| File | Description |
|---|---|
| index.html | Single-page site — Hero, About, Experience, Projects, Writing, Recommendations, Contact |
| assets/css/shared.css | Global styles (variables, nav, cards, buttons, fade-in reveal) |
| assets/css/hero-card.css | Hero flip-card component styles |
| assets/js/theme.js | Light/dark theme toggle |
| assets/js/interactions.js | Scroll reveal, nav float/solidify, back-to-top, mobile drawer |
| assets/js/hero-card.js | Hero profile card flip interaction |
| assets/js/legacy-redirect.js | Redirect map used by legacy page stubs (see below) |

## Sections (in-page anchors)
`#hero` · `#about` · `#experience` · `#projects` · `#writing` · `#recommendations` · `#contact`

## Legacy pages
`about.html`, `experience.html`, `projects.html`, `writing.html`, `recommendations.html`, and `contact.html`
are retained as thin redirect stubs (meta-refresh + JS + canonical tag) that forward visitors and search
engines to the matching anchor section on `index.html`. This preserves any external links/SEO equity
pointing at the old multi-page URLs without duplicating content.

## SEO
- `sitemap.xml` — lists only `index.html` (the canonical page)
- `robots.txt` — allows all crawling, points to `sitemap.xml`

## Contact
- Email: nethxkensoriano@gmail.com
- LinkedIn: linkedin.com/in/kennethsorianova
- GitHub: github.com/kennethics

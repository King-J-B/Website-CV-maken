## What changed

**Sign in / Sign up / Forgot password**
- Uses the new transparent **light Folio logo** (`images/folio-logo-light.png`) and the "F" mark as favicon.
- Brand panel is now light with soft glows in the logo's blue and cyan, a gradient accent word in the slogan, and a more realistic CV preview card.
- Form sits on a white card over a pale-blue background; buttons and links use the logo blue.
- The primary button stays blue (white spinner) while signing in, instead of turning grey.

**One colour palette for the whole site**
- New `colors.css` holds every colour. All pages load it first; `auth.css` and the My resumes styles (`pages.css`, `components.css`, `base.css`) now reference it instead of their own slightly different values (e.g. primary `#0060ff` vs `#1a5ff0`, text `#071125` vs `#17233b`).
- Hard-coded colours (delete button, illustration, preview, white button text) now use tokens.
- Grey text changed to `#4f6080`: the old My resumes grey `#66748a` fell under WCAG AA (≈4.1–4.4:1) on the light-blue backgrounds. Inputs on My resumes got a visible border (3:1) and a blue focus ring.

**My resumes (index.html)**
- **Font fix:** the page fell back to Times New Roman because Inter was never loaded and `--font-main` was undefined. Both fixed.
- **Logo:** uses the transparent light logo, and a new transparent dark logo (white wordmark) in dark mode, so there's no black/white box around it any more.

## Why
The pages were built separately and had drifted apart in colour, font and logo. This makes them look like one product and puts colours in one place so new screens stay consistent.

## Notes for reviewers
- ⚠️ The primary blue now follows the logo (`#1a5ff0`), **not** the Figma/README value `#3454d1`. We should update Figma or the README design rules to match.
- I edited files from the "Resume Pagina" commit (`pages.css`, `components.css`, `base.css`, `index.html`, `js/script.js`), so please check with the author.
- `assets/logo-folio-light.png` and `assets/logo-folio-dark.png` (~2.4 MB) are no longer used but are left in place for the original author to remove.
- Known existing bug, not fixed here: on My resumes the empty state ("Nog geen cv's") always shows below the cards, because `.empty-state { display: grid }` in `pages.css` overrides `.hidden`.
- Checked in the browser at 1440 / 1024 / 390 px, and My resumes in light and dark mode.

## How to test
```bash
python -m http.server 5173
```
Open `http://localhost:5173/sign-in.html` and `http://localhost:5173/index.html` (toggle ◐ for dark mode). Hard-refresh (Ctrl+Shift+R) if you see old styles.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

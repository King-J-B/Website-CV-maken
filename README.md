# Folio — CV Builder

Folio is a website where anyone can make a CV, pick a template, and download or print it. It is our demo project.

**The short version:** a visitor clicks *Maak je cv*, picks a template, fills in their details next to a live preview, and exports a PDF. No account is needed. With an account, CVs are saved online, so they can be opened again later or on another device.

**Live:** https://simplyfacturaspain.com/studenten/

- **Design (Figma):** [Folio — CV Builder · Complete Design](https://www.figma.com/design/4P4NKgLHDm15VLJO1qYaup/)
- **Flow we build from:** `CV Builder User flow V4` (add it to `/docs`)

> The original assignment says users register and log in before making a CV. Flow v4 changes this to guest-first: registering is optional. Where the two disagree, follow flow v4.

---

## Getting started

Plain HTML, CSS and JavaScript: no build step, no install. Guests' CVs are saved in the browser (`localStorage`); signed-in users' CVs in the database (see below).

```bash
git clone https://github.com/King-J-B/Website-CV-maken.git
cd Website-CV-maken
php -S localhost:5173
```

Then open http://localhost:5173/ (the home page). Accounts need the database (below); without it the site still works for guests. `python -m http.server 5173` also works, but only for guests (it can't run PHP).

**Putting it live (cPanel):** make a zip with `git archive --format=zip -o folio-site.zip HEAD` (leaves out `.git`, `.claude` and `api/config.php`), upload it into `public_html/studenten` and extract it there. `index.html` is the start page.

### Database (PHP + MySQL)

Accounts and online CVs use PHP and MySQL. The pages above still work without them.

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. In phpMyAdmin (http://localhost/phpmyadmin): **New** → database `folio` → Create. Then select it → **Import** → `database.sql`.
3. Copy `api/config.example.php` to `api/config.php`. The example values work for XAMPP.
4. Run `php -S localhost:5173` and open http://localhost:5173/api/check.php. It should say `"database":"connected","tables":"ok"`.

**On cPanel:** make a database and user under *MySQL Databases*, import `database.sql` in phpMyAdmin, and put `api/config.php` with those details on the server (it is never in GitHub).

### Where the files are

| Folder / file | What it is |
|---|---|
| `index.html` | Home page (start page) |
| `templates.html` | Choose a template |
| `editor.html` | The CV editor (`editor.html?cv=<id>`) |
| `my-resumes.html` | My resumes |
| `about-us.html`, `personal-details.html` | About us, account details (and deleting the account) |
| `privacy.html`, `terms.html` | Privacy policy and terms of service |
| `sign-in.html`, `sign-up.html`, `forgot-password.html`, `reset-password.html` | Account pages, all using the PHP backend |
| `css/` | All styles. `colors.css` holds every colour; `cv-templates.css` holds the CV templates |
| `js/` | All scripts. `cv-store.js` is the only code that saves CVs; `templates-data.js` lists the templates; `translate.js` holds every Dutch/English text (add new texts there); `theme.js` does light/dark mode |
| `images/` | Logos and the favicon |
| `database.sql` | Creates the `users` and `cvs` tables |
| `database-update-1.sql` … `database-update-3.sql` | Only for a database made with an older `database.sql` (the live one): import them once, in order |
| `api/` | PHP backend, see below |

### The API (`api/`)

The pages talk to these PHP files with JSON. They need PHP, so test with `php -S localhost:5173` (Python's server can't run PHP).

| File | What it does |
|---|---|
| `sign-up.php` | POST `{ firstName, lastName, email, password, terms }` → makes the account and signs in |
| `sign-in.php` | POST `{ email, password, remember }` → signs in (remember = 30 days) |
| `sign-out.php` | POST → signs out |
| `me.php` | GET → `{ user }` when signed in, `{ user: null }` for guests |
| `cvs.php` | The signed-in user's CVs: GET (list or `?id=`), POST (new), PATCH `?id=` (save, rename), DELETE `?id=` |
| `profile.php` | GET / POST the Personal details (new CVs start with them), DELETE the account |
| `password-reset.php` | POST `{ email, lang }` → e-mails a reset link (same answer for unknown addresses; max 3 per hour) |
| `reset-password.php` | GET `?token=` → is the link still valid; POST `{ token, password }` → new password, signed in |
| `mail.php` | Sends e-mail. With `'mail' => 'log'` in `config.php` (XAMPP) it writes the e-mail to `folio-mail.log` in the temp folder instead |
| `check.php` | GET → is the database connected? |
| `session.php`, `db.php`, `config.php` | Shared code and the database login. These can't be opened in a browser |

---

## What Folio can do

- **Without an account:** choose a template, fill in the CV next to a live A4 preview, change colour, font and spacing, and download a PDF. CVs are kept in this browser.
- **With an account:** CVs are saved online (and CVs made as a guest move into the account after signing in), Personal details fill new CVs, forgot password by e-mail, delete the account.
- **My resumes:** every CV shows its real preview; a CV is named after the person until you rename it (✎); ⧉ makes a copy, for example for another vacancy.
- **Six templates:** Modern, Classic, Minimal, Split, Timeline, Concise.
- **Dutch and English** on every page (the flags), **light and dark mode**; both are remembered.
- **Privacy and Terms** pages.

## Still to do

- More sections in the editor (languages, projects, certificates, hobbies), and reordering or hiding sections
- Change password on Personal details
- Sign in with Google or LinkedIn (the buttons are in the HTML, hidden)
- A photo on About us

---

## Design rules

Take values from the Figma file rather than guessing. The basics:

- **Font:** Inter only. Sentence case everywhere.
- **Main colors:** primary `#1a5ff0` (the logo blue, see `css/colors.css`), text `#17233b`, page background `#f2f6ff`, surface `#ffffff`. Dark mode colours are in `css/colors.css` too.
- **Status colors:** success `#176346`, warning `#805300`, danger `#b42318`
- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 64 px. **Corner radius:** 8, 12, 16 px.
- **Buttons and touch targets:** at least 44 px high.
- **Breakpoints:** mobile under 768 px (one column), tablet 768–1199 px (Edit / Preview tabs in the editor), desktop from 1200 px (designed at 1440 px).
- The A4 preview scales to fit. It never gets squeezed. A CV stays white paper, also in dark mode.

---

## How we work

- One branch per task (for example `feature/duplicate-cv`), a pull request to `main`, and merge only when it is tested. Never push straight to `main`.
- Changed a CSS or JS file? Raise the `?v=` number in every page, so browsers load the new file.
- New text on a page? Add it to `js/translate.js` as `["Dutch", "English"]`, or the English version stays Dutch. Text people type is never translated; mark such places with `data-no-translate`.
- A database change goes in `database.sql` **and** in a new `database-update-N.sql` for the live database. Going live: import the update first, then upload the files.
- `api/config.php` holds the database password: it is never in GitHub.

## Team

- **Daan van den Hombergh**
- **Jesse Breuers**

Fourth-year Software Development students at Vista college, Maastricht. Folio is our assignment during our internship in Spain.

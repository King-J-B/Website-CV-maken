# Folio — CV Builder

Folio is a website where anyone can make a CV, pick a template, and download or print it. It is our demo project.

**The short version:** a visitor clicks *Create your CV*, picks a template, fills in their details next to a live preview, and exports a PDF. No account is needed. An account only adds one thing: the CV is saved online, so it can be opened again later or on another device.

- **Design (Figma):** [Folio — CV Builder · Complete Design](https://www.figma.com/design/4P4NKgLHDm15VLJO1qYaup/)
- **Flow we build from:** `CV Builder User flow V4` (add it to `/docs`)

> The original assignment says users register and log in before making a CV. Flow v4 changes this to guest-first: registering is optional. Where the two disagree, follow flow v4.

---

## Getting started

Plain HTML, CSS and JavaScript: no build step, no install. CVs are saved in the browser (`localStorage`).

```bash
git clone https://github.com/King-J-B/Website-CV-maken.git
cd Website-CV-maken
python -m http.server 5173
```

Then open http://localhost:5173/ (the home page).

**Putting it live (cPanel):** upload everything except `.git` and `.claude` into `public_html` (or a subfolder). `index.html` is the start page.

### Database (PHP + MySQL)

Accounts and online CVs use PHP and MySQL. The pages above still work without them.

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. In phpMyAdmin (http://localhost/phpmyadmin): **New** → database `folio` → Create. Then select it → **Import** → `database.sql`.
3. Copy `api/config.example.php` to `api/config.php`. The example values work for XAMPP.
4. Run the site with PHP instead of Python: `php -S localhost:5173`, then open http://localhost:5173/api/check.php. It should say `"database":"connected","tables":"ok"`.

**On cPanel:** make a database and user under *MySQL Databases*, import `database.sql` in phpMyAdmin, and put `api/config.php` with those details on the server (it is never in GitHub).

### Where the files are

| Folder / file | What it is |
|---|---|
| `index.html` | Home page (start page) |
| `templates.html` | Choose a template |
| `editor.html` | The CV editor (`editor.html?cv=<id>`) |
| `my-resumes.html` | My resumes |
| `about-us.html`, `personal-details.html` | About us, account details |
| `sign-in.html`, `sign-up.html`, `forgot-password.html` | Account pages (demo, no server yet) |
| `css/` | All styles. `colors.css` holds every colour; `cv-templates.css` holds the CV templates |
| `js/` | All scripts. `cv-store.js` is the only code that saves CVs; `templates-data.js` lists the templates |
| `images/` | Logos and the favicon |
| `database.sql` | Creates the `users` and `cvs` tables |
| `api/` | PHP backend. `db.php` connects to the database, `check.php` tests the connection |

When you change a CSS or JS file, raise the `?v=` number in the pages, so browsers load the new file.

---

## What we are building

### 1. Start
- Landing page → **Create your CV** → Choose a template → Editor
- Returning user: Landing page → **Sign in** → My resumes
- Three templates: **Modern**, **Classic**, **Minimal**. The template can be switched at any time.
- A new CV starts empty, with helpful placeholders. Example content only appears in template previews.

### 2. Editor
- Opens at Personal details. Suggested order: **Personal details → About me → Education → Experience → Skills**. Users can jump between sections and skip any of them.
- **Desktop:** section navigation, form and live preview side by side.
- **Mobile:** a Section selector plus Edit / Preview buttons. Switching never loses changes.
- **Add section:** projects, certificates, languages, volunteering, or a custom section (for example hobbies). Sections can be reordered or hidden. Removing a filled-in section asks for confirmation.
- **About me** has an optional *Help me write this* helper: a few questions, then suggested text the user can edit.

### 3. Customize and preview
- **Template** changes the layout. **Design** changes font, accent color and spacing. They are separate actions.
- The preview updates while typing and shows every A4 page with its edges, so page breaks are visible before export. There is no separate review screen.

### 4. Saving
Saving happens in the background from the first change. It is never a step at the end.

| Who | What happens | Message |
|---|---|---|
| Guest | Draft is saved in the browser | "Draft saved on this device" (explain it can be lost if browser data is cleared) |
| Signed-in user | Saved to the account | "Saving…" then "Saved to your account" |

- **Save online** (guest): Sign up or Sign in → the current draft moves to the account → back to the same CV, with all content and the template kept. Cancelling returns to the guest editor with the draft intact.
- **If saving fails:** keep the draft, show a clear error, offer Retry. Never show "saved" unless it really succeeded.

### 5. Export
- Editor → Export → **Download PDF** or **Print**. Both work for guests and signed-in users.
- Exporting never deletes the draft or the saved CV.
- After exporting, guests may see an optional "Create an account to save this CV online".

### 6. My resumes
- Cards show name, preview and last-edited date, with a **Draft** badge.
- Actions: Edit, Duplicate, PDF, Rename, Delete (with a clear permanent-deletion confirmation).
- No CVs yet: empty state with **Create your first resume**.

### 7. Account
- **Account** (profile), **Security** (change password), **Log out** (back to the landing page).
- Forgot password: enter email → reset sent → email link → choose new password → sign in.

---

## Scope for the demo

**Build first (core):**
1. Landing page and template choice
2. Editor with the five main sections and live A4 preview
3. Template switch and Design options
4. Download PDF
5. Guest draft saved on the device
6. Sign up / Sign in, saving to the account, My resumes

**Then:** Add section, reorder/hide, Duplicate, Rename, Delete, Print, password reset, Account and Security pages.

**Not in the core demo:** subscription and payments, two-factor authentication, active sessions, Trash with 30-day restore, the "Published" badge. These appear in the Figma file but are left out on purpose.

---

## What is designed and what is not

Most screens exist in Figma. These parts of flow v4 have **no design yet**, so agree on them in the team before building:

| Missing or unfinished | Note |
|---|---|
| Landing page | Figma starts at Sign in |
| Guest mode and local draft | Including the "Draft saved on this device" message |
| Save online button for guests | And returning to the same CV after sign-up |
| Print | Only PDF export is designed |
| Rename | Only a button exists, no input dialog |
| New-password screen | Last step of password reset |
| Writing helper for About me | Planned |
| Text size and CV photo controls | CV photo is separate from the account photo |
| Removing a section | Needs a confirmation |
| A4 page edges in the preview | To be added |
| Log out | Needs a clear action |
| Delete dialog wording | Currently mentions Trash; should say deletion is permanent |

---

## Design rules

Take values from the Figma file rather than guessing. The basics:

- **Font:** Inter only. Sentence case everywhere.
- **Main colors:** primary `#1a5ff0` (the logo blue, see `css/colors.css`), text `#17233b`, page background `#f2f6ff`, surface `#ffffff`
- **Status colors:** success `#176346`, warning `#805300`, danger `#b42318`
- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 64 px. **Corner radius:** 8, 12, 16 px.
- **Buttons and touch targets:** at least 44 px high.
- **Breakpoints:** mobile under 768 px (one column), tablet 768–1199 px (Edit / Preview tabs in the editor), desktop from 1200 px (designed at 1440 px).
- The A4 preview scales to fit. It never gets squeezed.

---

## How we work

> **TODO (team):** adjust these to what we agree on.

- One branch per task, named after it (for example `feature/editor-personal-details`).
- Open a pull request to `main` and let one teammate review it before merging.
- Before starting a screen, open it in Figma and check the flow section above.
- If the design and flow v4 disagree, ask in the team chat instead of choosing alone.

## Team

> **TODO:** names and who works on what.

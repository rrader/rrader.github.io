# Personal Website Data & Knowledge Base: Roman Rader

## 1. General Profile & Contact Information

* **Full Name:** Roman Rader / Роман Ілліч Радер
* **Location:** Kyiv, Ukraine 🇺🇦
* **Primary Email:** [roman.rader@gmail.com](mailto:roman.rader@gmail.com)
* **Website URL:** [https://rrader.github.io/](https://rrader.github.io/)

### Social & Academic Profiles
* **LinkedIn:** [https://www.linkedin.com/in/roman-rader/](https://www.linkedin.com/in/roman-rader/)
* **GitHub:** [https://github.com/rrader/](https://github.com/rrader/)
* **Google Scholar:** [https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ](https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ)
* **Stack Overflow:** [https://stackoverflow.com/users/330406/antigluk](https://stackoverflow.com/users/330406/antigluk)
* **Geektastic:** [https://app.geektastic.com/profile/public/ofUqjZqr-oppQOlOhROsCg](https://app.geektastic.com/profile/public/ofUqjZqr-oppQOlOhROsCg)

---

## 2. Main Site Structure & Sections

### Section 1: About / Profile (`about`)
* Location: Kyiv, Ukraine
* Focus Areas: Software Engineering & AI Engineering Education (K-12)

---

### Section 2: Engineering (`engineering`)
* Focus: Software engineering, DevOps, Linux, Docker, containers, virtualization, Python, and backend infrastructure.

---

### Section 3: Study (`study` / `study_posts`)
* Focus: Academic research, publications, Big Data, telecom security, malware detection, LaTeX typesetting.
* Academic Publications & Google Scholar Profile: [https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ](https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ)

---

### Section 4: Teaching (`teaching` / `teach_posts`)
* Overview: Cybersecurity awareness materials, AI engineering course resources, informatics study guides, and high-school projects.
* Educational Portals & Course Materials:
  * Educational portal: [https://class.rmn.pp.ua/](https://class.rmn.pp.ua/)
  * Methodological materials (AI Engineering): [https://class.rmn.pp.ua/method](https://class.rmn.pp.ua/method)

---

### Section 5: DIY & Hardware (`diy` / `diy_posts`)
* Focus: Hardware tinkering, microcontrollers (MSP430, ESP32), laser cutting, 3D printing, electronics, woodworking.

---

## 3. Terminal & Quake-Style Console Interface

Implemented CLI commands and features:
* `help` - List available terminal commands
* `bio` / `about` - Show bio, summary, and location
* `contact` - Display email, social media, and academic profiles
* `research` / `publications` - List academic research focus and scholar links
* `teaching` / `courses` - Display teaching materials and course links
* `clear` / `cls` - Clear the terminal screen
* `quake` / `theme` - Toggle Quake console theme/effects (scanlines, CRT, sound effects, retro prompt)
* `sl` - Retro steam locomotive animation (Trolley problem easter egg)

---

## 4. Development & Build Workflow

* **Engine & Theme:** Hugo (`/opt/homebrew/bin/hugo`), theme `nostyleplease`.
* **Output Directory:** `docs/` (served via GitHub Pages).
* **Build Command:** Always run `hugo` after editing `.scss`, templates (`layouts/`), or markdown files in `content/` to recompile assets and update `docs/`.

---

## 5. SCSS & CRT Terminal Styling Invariants

* **Shared Variables & Tokens:**
  * All entry SCSS files (`assets/scss/quake-terminal.scss`, `assets/scss/terminal-doc.scss`) must declare the complete terminal palette tokens in `:root` (`--text-color`, `--text-dim`, `--text-bright`, `--accent-color`, `--glow-color`, `--border-color`, `--font-main`, `--font-retro`).
  * Preserve base `html, body { width: 100%; height: 100%; margin: 0; padding: 0; font-family: var(--font-main); color: var(--text-color); overflow: hidden; }` on terminal pages.
  * Always provide explicit `font-family: var(--font-main)` and `color: var(--text-color)` on `.crt-wrapper`, `.terminal-container`, and `.output-line` to prevent unstyled or browser-default black serif text.
* **Web Typography Loading:**
  * Both `layouts/index.html` and `layouts/partials/head.html` must include direct `<link rel="preconnect">` and `<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=VT323&display=swap" rel="stylesheet" />` tags in `<head>` in addition to SCSS `@import`.
* **CRT Effects & Browser Performance (Firefox / Gecko):**
  * Use lightweight, hardware-accelerated static CSS for scanlines and vignette (`transform: translateZ(0); contain: strict;`).
  * Never use high-frequency DOM/canvas flickering intervals (<= 150ms) or heavy multi-stop animated CSS gradients that cause severe frame drops in Firefox.
* **ViewSonic PT775 Casing:**
  * Maintained in `assets/scss/_monitor.scss` (casing, top vents, 3-birds logo, model badge, OSD buttons, speaker grille, power button/LED, and pedestal swivel stand with desk shadow).

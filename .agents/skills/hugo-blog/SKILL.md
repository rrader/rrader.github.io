---
name: hugo-blog
description: >-
  Керує персональним блогом і сайтом rrader.github.io: збірка через Hugo у docs/,
  робота з двомовними публікаціями (UK/EN), міграція статей з blogspot_archive,
  правила збереження авторського стилю, серії публікацій, CRT/SonicTron стилізація
  та локальне розміщення медіа-файлів.
---

# Hugo Blog Manager (`rrader.github.io`)

Керує сайтом-портфоліо та блогом Романа Радера, побудованим на Hugo (тема `nostyleplease`), стилізованим під ретро-монітор ViewSonic PT775 (SonicTron) з Quake-терміналом, який публікується на GitHub Pages через теку `docs/`.

Локальний шлях до проєкту:
```bash
SITE_DIR="/Users/roma/Personal/projects/rrader.github.io"
```

---

## 1. Структура контенту та розділи

Всі публікації є **двомовними** (українська та англійська) і зберігаються у вигляді парних файлів у теці `content/`:
- `*.uk.md` — українська версія (за замовчуванням доступна за шляхом `/uk/...`).
- `*.en.md` — англійська версія (доступна за шляхом `/...`).

### Розділи сайту (`content/`):
- `engineering/` — розробка програмного забезпечення, DevOps, Linux, контейнеризація, архітектура, мови програмування (Python, Java тощо).
- `study_posts/` — наукові статті, академічні дослідження (Big Data, телеком, мережева безпека, LaTeX). У вебі та інтерфейсі терміналу відображається як **study**.
- `teach_posts/` — педагогіка, матеріали курсів з інженерії ШІ, кібергігієни, інформатики та ліцейні проєкти.
- `diy_posts/` — апаратні DIY-проєкти, мікроконтролери (MSP430, ESP32), лазерна порізка, 3D-друк, радіоелектроніка, деревообробка.
- `projects/` — інтерактивні веб-проєкти та вітрини (наприклад, Light-Bot).

---

## 2. Стандарти контенту та правила міграції

### 2.1. Zero AI Slop & Збереження авторського голосу
- **Жодного переписування чи узагальнення:** Заборонено скорочувати думки автора, перетворювати їх на абстрактні маркетингові абзаци або додавати штучні вигадки.
- **Точність перенесення:** Всі вступні зауваження (наприклад, *"I've finally got something for post"*), самоіронія, жарти, технічні деталі, коментарі колег та `tl;dr:` блоки переносяться дослівно.
- **Природний переклад:** Українська версія має звучати як жива фахова мова українського інженера, а не машинний переклад.

### 2.2. Інженерна термінологія
- Зберігати загальноприйняту в індустрії термінологію в оригіналі або природній формі.
- **Категорично уникати штучних/архаїчних кальок** (наприклад, завжди використовувати `handshake`, а не `квитування зв'язку`; `entrypoint`, а не `точка входу`, якщо це стосується директиви Dockerfile).

### 2.3. Внутрішня перелінковка (Link Migration)
- Старі посилання на `antigluk.blogspot.com` або зовнішні домени, що ведуть на інші статті блогу, **обов'язково замінюються на локальні відносні шляхи**:
  - Українська версія: `[Текст посилання](/uk/<section>/<slug>/)`
  - Англійська версія: `[Link text](/<section>/<slug>/)`
- Унизу кожної мігрованої статті додається примітка:
  - UK: `*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](URL).*`
  - EN: `*This post was migrated from the old blog [antigluk.blogspot.com](URL).*`

### 2.4. Серії публікацій (Multi-part Series)
Якщо публікація є частиною циклу (наприклад, серія про Docker та Jenkins):
На початку статті (під frontmatter) додається блок цитати з нумерованим списком усіх частин серії, де поточна стаття виділяється жирним шрифтом:

```markdown
> **Серія статей про Docker та Jenkins:**
> 1. [Використання Docker-контейнерів як Jenkins-нод](/uk/engineering/using-docker-containers-as-jenkins-nodes/) (2013-10-31)
> 2. [Docker Jenkins Slave Generator](/uk/engineering/docker-jenkins-slave-generator/) (2014-09-02)
> 3. **Кешування локального репозиторію Maven у Docker** (2015-03-13)
> 4. [Новий CentOS 7 Maven Slave у docker-jenkins-slave](/uk/engineering/new-centos-7-maven-slave-in-docker/) (2015-03-13)
> 5. [Docker-Jenkins-Slave 2.0 (DJS2)](/uk/engineering/docker-jenkins-slave-20-djs2/) (2015-03-22)
```

### 2.5. Автономність матеріалів (Self-contained Assets)
- Не залишати зовнішні ненадійні посилання на PDF, презентації чи документи.
- Завантажувати файл локально у `static/files/<filename>` та посилатися на `/files/<filename>`.
- Для зображень кожної статті використовувати власну підпапку: `static/images/<slug>/<image-name>`.

---

## 3. Робота з архівом Blogspot (`blogspot_archive/`)

Всі вивантажені архівні статті зберігаються в `projects/rrader.github.io/blogspot_archive/`.
- Файл `INDEX.md` у теці архіву містить статус та інвентар статей.
- При міграції перевіряти оригінальний `raw_content.html` на наявність вбудованих скриптів, Gist або віджетів (наприклад, `<script src="...gist..."></script>`), замінювати їх на повноцінні кодові блоки в Markdown з посиланням на вихідний Gist.

Команда для швидкої перевірки статусу міграції:
```bash
python3 -c '
import os
arch = sorted([d for d in os.listdir("projects/rrader.github.io/blogspot_archive") if os.path.isdir(os.path.join("projects/rrader.github.io/blogspot_archive", d))])
print(f"Total in archive: {len(arch)}")
'
```

---

## 4. Збірка, перевірка та деплой

### 4.1. Збірка сайту (Hugo)
Оскільки сайт публікується на GitHub Pages із гілки `main` через теку `docs/`, **будь-які зміни файлів контенту (`content/`), стилів (`assets/scss/`) чи шаблонів (`layouts/`) обов'язково супроводжуються запуском збірки**:

```bash
cd /Users/roma/Personal/projects/rrader.github.io
hugo
```

### 4.2. Локальний сервер для попереднього перегляду
```bash
hugo server --buildDrafts
# Доступний на http://localhost:1313/
```

### 4.3. Git & GitHub Personal Alias
Сайт публікується з репозиторію `git@github-personal:rrader/rrader.github.io.git`.
- **Завжди використовувати аліас `github-personal`** (корпоративний git config Grammarly інакше перепише `git@github.com:` на HTTPS з робочим акаунтом).
- Публікація:
  ```bash
  git add -A
  git commit -m "Опис змін"
  git push origin main
  ```

---

## 5. CRT Terminal & Фронтенд-інваріанти

1. **SCSS Палітра та змінні:**
   - Всі вхідні SCSS-файли (`assets/scss/quake-terminal.scss`, `assets/scss/terminal-doc.scss`) обов'язково оголошують повний набір токенів у `:root` (`--text-color`, `--text-dim`, `--bg-color`, `--font-main`, `--font-retro`).
   - Елементи `.crt-wrapper`, `.terminal-container` та `.output-line` мають містити явні `font-family: var(--font-main)` та `color: var(--text-color)`, щоб уникнути дефолтного білого фону чи чорного тексту з зарубками.
2. **Підключення веб-шрифтів:**
   - Шрифти `Fira Code` та `VT323` підключаються через прямі `<link rel="preconnect">` та `<link href="...">` у `<head>` шаблонів (`layouts/index.html` та `layouts/_default/baseof.html`).
3. **Продуктивність (Firefox / Gecko):**
   - Ефекти скануючих ліній та віньєтки мають бути статичними CSS-шарами з апаратним прискоренням (`transform: translateZ(0)`).
   - Заборонено використовувати швидкі інтервали мерехтіння (<= 150ms) або важкі анімовані CSS-градієнти через сильне навантаження на CPU/GPU.

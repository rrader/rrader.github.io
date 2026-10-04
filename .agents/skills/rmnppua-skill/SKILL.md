---
name: rmnppua-skill
description: >-
  Повний довідник та набір інструкцій для персонального сайту Романа Радера (rmn.pp.ua / rrader.github.io):
  біографія та контакти, архітектура розділів (engineering, study, teach, diy), стандарти авторського стилю
  та мови (Zero AI Slop), серії постів, архів blogspot, ретро-монітор ViewSonic PT775 (SonicTron),
  Quake-термінал, SCSS інваріанти та регламент публікації в docs/.
---

# Персональний сайт Романа Радера (`rmn.pp.ua` / `rrader.github.io`)

Цей скіл є єдиним канонічним джерелом знань про персональний сайт Романа Радера: його структуру, авторський стиль, технічну архітектуру, систему стилізації під ЕПТ-монітор (CRT) та щоденні операції з контентом.

Локальний шлях до репозиторію:
```bash
SITE_DIR="/Users/roma/Personal/projects/rrader.github.io"
```

---

## 1. Профіль автора та контактні дані

* **Повне ім'я:** Роман Ілліч Радер / Roman Rader
* **Локація:** Київ, Україна 🇺🇦
* **Основний Email:** `roman.rader@gmail.com`
* **Особистий домен / хостинг:** [https://rrader.github.io/](https://rrader.github.io/) (дзеркало/проксі через Cloudflare: `rmn.pp.ua`)
* **Освіта та спеціалізація:** Software Engineering, DevOps, хмарна та контейнерна інфраструктура, викладання інженерії штучного інтелекту (K-12).

### Профілі та зовнішні ресурси
* **GitHub:** [https://github.com/rrader/](https://github.com/rrader/)
* **LinkedIn:** [https://www.linkedin.com/in/roman-rader/](https://www.linkedin.com/in/roman-rader/)
* **Google Scholar:** [https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ](https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ)
* **Stack Overflow:** [https://stackoverflow.com/users/330406/antigluk](https://stackoverflow.com/users/330406/antigluk)
* **Geektastic:** [https://app.geektastic.com/profile/public/ofUqjZqr-oppQOlOhROsCg](https://app.geektastic.com/profile/public/ofUqjZqr-oppQOlOhROsCg)
* **Освітній портал (Google Classroom / курси):** [https://class.rmn.pp.ua/](https://class.rmn.pp.ua/)
* **Методичні матеріали з курсу ШІ:** [https://class.rmn.pp.ua/method](https://class.rmn.pp.ua/method)

---

## 2. Розділи сайту та структура контенту

Усі статті сайту є **двомовними** і організовані у вигляді парних файлів у `content/`:
- `*.uk.md` — українська версія (URL: `/uk/<section>/<slug>/`).
- `*.en.md` — англійська версія (URL: `/<section>/<slug>/`).

### Розділи:
1. `engineering/` — **Інженерія та DevOps:**
   - Linux, Docker, контейнеризація, системне адміністрування, CI/CD, Python, Java, віртуалізація (Hyper-V, VirtualBox, Vagrant), бекенд.
2. `study_posts/` (**у вебі та меню відображається як `study`**):
   - Академічні дослідження та наукові публікації: аналіз аномалій у телеком-мережах, Big Data (Hadoop, Pig), DNS-over-HTTPS (DoH), безпека мереж, оформлення псевдокоду в LaTeX (`algorithm2e`).
3. `teach_posts/` (**у вебі `teaching`**):
   - Матеріали для викладання інженерії штучного інтелекту, уроки з кібербезпеки, педагогічні експерименти (тест Тюрінга в класі), організація олімпіад та проєктної діяльності.
4. `diy_posts/` (**у вебі `diy`**):
   - Апаратні саморобки: мікроконтролери (MSP430, ESP32), модуль SIM900A, GSM-сигналізації, 3D-друк, лазерна порізка фанери (Toolbox), аудіоплеєри (Jukebox).
5. `projects/`:
   - Спеціальні інтерактивні вітрини та проєкти (наприклад, Light-Bot).

---

## 3. Регламент авторського стилю та міграції (Zero AI Slop)

### 3.1. Збереження авторського голосу
- **Заборонено "покращувати" чи перефразовувати:** Ніколи не замінювати оригінальні речення автора на абстрактний згенерований текст, маркетинговий "копірайтинг" чи шаблонні підсумкові абзаци.
- **Повна точність структури:** Зберігати всі авторські вступні репліки (наприклад, *"I've finally got something for post"*), коментарі, звернення, самоіронію, фрагменти коду, діалоги та `tl;dr:` блоки дослівними.
- **Двомовність:** Англійська та українська версії мають бути еквівалентними за структурою, написаними живою фаховою інженерною мовою.

### 3.2. Інженерна термінологія
- **Ніяких штучних або архаїчних кальок:**
  - Залишати природні усталені терміни: `handshake` (не "квитування зв'язку"), `entrypoint`, `socket`, `polling`, `payload`.
  - Усі системні команди, прапорці, назви технологій та пакетів пишуться англійською.

### 3.3. Внутрішня перелінковка та міграція посилань
- Посилання на старий блог `antigluk.blogspot.com` замінюються на відносні локальні шляхи нового сайту:
  - Українська стаття: `[Назва](/uk/engineering/<slug>/)`
  - Англійська стаття: `[Title](/engineering/<slug>/)`
- Унизу кожної мігрованої статті додається примітка:
  - UK: `*Цей пост перенесено зі старого блогу [antigluk.blogspot.com](URL).*`
  - EN: `*This post was migrated from the old blog [antigluk.blogspot.com](URL).*`

### 3.4. Оформлення серій статей (Multi-part Series)
Для взаємопов'язаних циклів публікацій (як-от серія про Docker та Jenkins) на початку статті під frontmatter вставляється блок цитати з нумерованим переліком усіх частин серії. Поточна стаття виділяється **жирним**:

```markdown
> **Серія статей про Docker та Jenkins:**
> 1. [Використання Docker-контейнерів як Jenkins-нод](/uk/engineering/using-docker-containers-as-jenkins-nodes/) (2013-10-31)
> 2. [Docker Jenkins Slave Generator](/uk/engineering/docker-jenkins-slave-generator/) (2014-09-02)
> 3. **Кешування локального репозиторію Maven у Docker** (2015-03-13)
> 4. [Новий CentOS 7 Maven Slave у docker-jenkins-slave](/uk/engineering/new-centos-7-maven-slave-in-docker/) (2015-03-13)
> 5. [Docker-Jenkins-Slave 2.0 (DJS2)](/uk/engineering/docker-jenkins-slave-20-djs2/) (2015-03-22)
```

### 3.5. Локальне розміщення асетів (Self-contained Assets)
- Захист від link rot: усі згадані наукові статті, доповіді та вкладення мають завантажуватися локально у `static/files/<filename>` (доступні на сайті за адресою `/files/<filename>`).
- Зображення до кожної публікації зберігаються в ізольованій теці: `static/images/<slug>/<filename>`.

---

## 4. Архів Blogspot (`blogspot_archive/`)

Вивантажені архіви статей зі старого блогу розташовані в `projects/rrader.github.io/blogspot_archive/`.
- Перевіряти `INDEX.md` для відстеження статусу міграції.
- При читанні `index.md` або `raw_content.html` звертати увагу на вбудовані `<script src="...gist..."></script>` чи `<iframe src="...preview">` — витягувати вихідний код і замінювати на красиві локальні кодові блоки з посиланням на Gist.

---

## 5. Фронтенд: Інтерфейс ретро-монітора ViewSonic PT775 (SonicTron) та Quake Terminal

Сайт має унікальний дизайн, стилізований під професійний ЕПТ-монітор кінця 90-х років **ViewSonic SonicTron PT775**:

### 5.1. Фізична модель монітора (`assets/scss/_monitor.scss`)
- **Корпус:** Ретро-пластик із фасками, вентиляційні отвори зверху, шильдик бренда `SonicTron PT775` з кольоровими пташками ViewSonic.
- **Екранна трубка (CRT):** Заокруглене скло, антибліковий шар, реалістичні скануючі лінії, віньєтка по кутах та світіння люмінофора (зелений/бурштиновий відтінок).
- **Нижня панель керування:**
  - Решітка динаміків.
  - Кнопки OSD: `1` (прокрутка нагору), `2` (вихід у термінал), `▼` / `▲` (плавна прокрутка на 350px).
  - Справжня кнопка живлення ⏻ з індикатором LED: вимикає трубку (стан standby, згасання екрана зі стилем `.crt-powered-off`).
- **Підставка:** Поворотна нога монітора з тінню на віртуальному столі.

### 5.2. Quake-термінал (`assets/scss/quake-terminal.scss` та `layouts/index.html`)
- Головна сторінка сайту зустрічає користувача інтерактивною командною стрічкою `rmn.pp.ua tty1`.
- Підтримувані команди: `help`, `bio`, `contact`, `research`/`study`, `teaching`, `clear`, `quake`, `sl` (пасхалка з паровозиком).
- Шрифти: `Fira Code` та `VT323` (обов'язково підключаються через Google Fonts у `<head>`).

### 5.3. Критичні CSS/SCSS правила
1. **Повні токени в `:root`:**
   Усі SCSS-файли (`quake-terminal.scss`, `terminal-doc.scss`) обов'язково містять:
   `--bg-color`, `--text-color`, `--text-dim`, `--accent-color`, `--glow-color`, `--border-color`, `--font-main`, `--font-retro`.
2. **Явне наслідування шрифтів та кольорів:**
   Для `.crt-wrapper`, `.terminal-container`, `.output-line` та `.document-canvas` обов'язково прописано `font-family: var(--font-main)` та `color: var(--text-color)`. Інакше браузер може відображати чорний текст із засічками.
3. **Оптимізація під Firefox:**
   - Жодних надважких анімацій мерехтіння з інтервалом <= 150мс.
   - Скануючі смуги та скло рендеряться з `transform: translateZ(0)` для апаратного прискорення GPU.

---

## 6. Збірка, верифікація та деплой

### 6.1. Обов'язкова збірка через Hugo
Сайт публікується на GitHub Pages із гілки `main` через теку `docs/`. Тому **після будь-якого редагування публікацій, шаблонів чи стилів потрібно обов'язково виконати збірку**:

```bash
cd /Users/roma/Personal/projects/rrader.github.io
hugo
```

### 6.2. Локальний перегляд
```bash
hugo server --buildDrafts
# Сервер запускається на http://localhost:1313/
```

### 6.3. Публікація в репозиторій
Personal GitHub-акаунт Романа — `rrader`.
Обов'язково використовувати SSH-аліас `github-personal` (через особливості налаштувань корпоративного git):

```bash
git add -A
git commit -m "Опис змін"
git push origin main
```
URL віддаленого репозиторію: `git@github-personal:rrader/rrader.github.io.git`.

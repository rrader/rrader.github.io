/**
 * Quake Terminal & CRT Console Engine v3.6
 * Roman Rader Personal Web Node
 */

(function () {
  // --- State Management ---
  const state = {
    sfx: localStorage.getItem('quake_sfx') !== 'off',
    gfx: localStorage.getItem('quake_gfx') !== 'off',
    history: [],
    historyIndex: -1,
    matrixActive: false,
    matrixInterval: null
  };

  // --- Web Audio API Synthesizer ---
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playKeyClick() {
    if (!state.sfx) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  function playEnterChime() {
    if (!state.sfx) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  function playErrorTone() {
    if (!state.sfx) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, audioCtx.currentTime);
      osc.frequency.setValueAtTime(120, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  function playTrainWhistle() {
    if (!state.sfx) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      // Dual-tone harmonic train whistle (A4 = 440Hz, C#5 = 554.37Hz)
      [440, 554.37].forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 1.03, now + 0.18);
        osc.frequency.linearRampToValueAtTime(freq, now + 0.38);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
        gain.gain.setValueAtTime(0.08, now + 0.3);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.44);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.44);
      });
    } catch (e) {}
  }

  function playTrainChug() {
    if (!state.sfx) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  const isUk = (document.documentElement.lang || '').startsWith('uk') || window.location.pathname.includes('/uk/');
  const currentLang = isUk ? 'uk' : 'en';

  // --- Commands Registry ---
  const COMMANDS = {
    help: {
      desc: isUk ? 'Показати список доступних команд' : 'Display available terminal commands',
      action: () => printHelp()
    },
    ls: {
      desc: isUk ? 'Список файлів та каталогів (ls [-l|-a] [dir])' : 'List directory contents (ls [-l|-a] [dir])',
      action: (args) => lsCmd(args)
    },
    dir: {
      desc: isUk ? 'Аліас для ls' : 'Alias for ls',
      action: (args) => lsCmd(args)
    },
    ll: {
      desc: isUk ? 'Детальний список файлів (ls -la)' : 'Detailed file listing with hidden files (ls -la)',
      action: (args) => lsCmd(['-la', ...args])
    },
    cat: {
      desc: isUk ? 'Вивести вміст текстового файлу (cat <file>)' : 'Display text file content (cat <file>)',
      action: (args) => catCmd(args)
    },
    grep: {
      desc: isUk ? 'Пошук статей або фільтрація виводу (| grep)' : 'Search articles or filter pipe output (| grep)',
      action: (args) => grepCmd(args)
    },
    sl: {
      desc: isUk ? 'Класичний паровоз (Steam Locomotive) 🚂' : 'Classic Steam Locomotive animation 🚂',
      action: (args) => runSlTrain(args)
    },
    train: {
      desc: isUk ? 'Аліас для sl (Steam Locomotive)' : 'Alias for sl (Steam Locomotive)',
      action: (args) => runSlTrain(args)
    },
    bio: {
      desc: isUk ? 'Коротка біографія, локація та ключові напрями' : 'Show bio summary, location, and core focus',
      action: () => printBio()
    },
    contact: {
      desc: isUk ? 'Контакти, пошта та посилання на профілі' : 'Show email and social/academic profile links',
      action: () => printContact()
    },
    posts: {
      desc: isUk ? 'Список усіх публікацій (DIY, навчання, дослідження)' : 'List all articles across DIY, teaching, and research',
      action: () => printAllPosts()
    },
    projects: {
      desc: isUk ? 'Програмні проєкти, бекенд, автоматизація та інструменти' : 'Show software, backend, automation & developer projects',
      action: () => printProjects()
    },
    engineering: {
      desc: isUk ? 'Системна та програмна інженерія, алгоритми та ядро Linux' : 'Systems & software engineering, algorithms, and Linux kernel',
      action: () => printEngineering()
    },
    diy: {
      desc: isUk ? 'DIY-проєкти, 3D-друк, мікроконтролери та мейкерство' : 'Show DIY hardware, 3D printing & maker projects',
      action: () => printDiy()
    },
    teaching: {
      desc: isUk ? 'Освітні матеріали та курси з інженерії ШІ для школи' : 'Show educational initiatives and teaching materials links',
      action: () => printTeaching()
    },
    research: {
      desc: isUk ? 'Дослідження кібербезпеки та профіль у Google Scholar' : 'Show cybersecurity research focus and Google Scholar profile',
      action: () => printResearch()
    },
    rss: {
      desc: isUk ? 'Посилання на RSS-стрічки сайту (загальна, DIY, навчання, дослідження)' : 'Show RSS feed URLs (Main, DIY, Teaching, Research)',
      action: () => printRss()
    },
    clear: {
      desc: isUk ? 'Очистити екран термінала' : 'Clear terminal screen',
      action: () => clearScreen()
    },
    sfx: {
      desc: isUk ? 'Увімкнути/вимкнути звукові ефекти (sfx [on|off])' : 'Toggle sound effects (usage: sfx [on|off])',
      action: (args) => toggleSfxCmd(args[0])
    },
    gfx: {
      desc: isUk ? 'Увімкнути/вимкнути ЕПТ-ефекти (gfx [on|off])' : 'Toggle CRT scanlines & glow effects (usage: gfx [on|off])',
      action: (args) => toggleGfxCmd(args[0])
    },
    date: {
      desc: isUk ? 'Поточна дата та час' : 'Display current system date & time',
      action: () => printLine(`System Date: ${new Date().toLocaleString()}`, 'system')
    },
    matrix: {
      desc: isUk ? 'Ефект матричного дощу (matrix)' : 'Toggle Matrix digital rain overlay',
      action: () => toggleMatrix()
    }
  };

  // --- DOM References ---
  let outputEl, inputEl, containerEl, wrapperEl, sfxBtn, gfxBtn;

  document.addEventListener('DOMContentLoaded', () => {
    outputEl = document.getElementById('terminal-output');
    inputEl = document.getElementById('cmd-input');
    containerEl = document.querySelector('.terminal-container');
    wrapperEl = document.querySelector('.crt-wrapper');
    sfxBtn = document.getElementById('sfx-btn');
    gfxBtn = document.getElementById('gfx-btn');

    // Apply initial settings
    applyGfx(state.gfx);
    updateSfxBtn();

    // Event Listeners
    sfxBtn.addEventListener('click', () => toggleSfx());
    gfxBtn.addEventListener('click', () => toggleGfx());

    document.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cmd = e.target.getAttribute('data-cmd');
        if (cmd) {
          executeCommand(cmd);
          inputEl.focus();
        }
      });
    });

    containerEl.addEventListener('click', () => {
      inputEl.focus();
    });

    inputEl.addEventListener('keydown', handleKeyDown);

    // Initial Welcome Screen
    printWelcome();
    inputEl.focus();
  });

  // --- Terminal Output Functions ---
  let captureBuffer = null;

  function printLine(htmlText, className = '') {
    if (captureBuffer !== null) {
      captureBuffer.push({ html: htmlText, className });
      return;
    }
    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    line.innerHTML = htmlText;
    outputEl.appendChild(line);
    scrollToBottom();
  }

  function scrollToBottom() {
    containerEl.scrollTop = containerEl.scrollHeight;
  }

  function printWelcome() {
    if (isUk) {
      printLine(`[СИСТЕМА ГОТОВА] Роман Радер — Персональний веб-вузол`, 'system');
      printLine(`Локація: Київ, Україна 🇺🇦`);
      printLine(`Напрям: Програмна інженерія та навчання інженерії ШІ у школі (10–11 класи)`);
      printLine(`Введіть <b style="color: var(--text-bright)">help</b> для списку команд, <b style="color: var(--text-bright)">ls</b> для перегляду файлів або оберіть дію з кнопок вище.\n`);
    } else {
      printLine(`[SYSTEM READY] Roman Rader — Personal Web Node`, 'system');
      printLine(`Location: Kyiv, Ukraine 🇺🇦`);
      printLine(`Focus: Software Engineering & AI Engineering Education (K-12)`);
      printLine(`Type <b style="color: var(--text-bright)">help</b> to list commands, <b style="color: var(--text-bright)">ls</b> to explore files, or tap the action pills above.\n`);
    }
  }

  function printHelp() {
    printLine(`<b>${isUk ? 'ДОСТУПНІ КОМАНДИ:' : 'AVAILABLE COMMANDS:'}</b>`, 'system');
    printLine(`--------------------------------------------------`);
    Object.keys(COMMANDS).forEach(cmd => {
      const info = COMMANDS[cmd];
      printLine(`  <b style="color: var(--accent-color); min-width: 120px; display: inline-block;">${cmd}</b> : ${info.desc}`);
    });
    printLine(`--------------------------------------------------`);
    printLine(isUk 
      ? `Підказка: використовуйте <b style="color: var(--text-bright)">TAB</b> для автодоповнення та <b style="color: var(--text-bright)">UP/DOWN</b> для історії.`
      : `Tip: Use <b style="color: var(--text-bright)">TAB</b> for autocomplete & <b style="color: var(--text-bright)">UP/DOWN</b> for history.`);
  }

  function printBio() {
    if (isUk) {
      printLine(`<b>[ПРО МЕНЕ / БІОГРАФІЯ]</b>`, 'system');
      printLine(`• <b>Повне ім'я:</b> Роман Ілліч Радер / Roman Rader`);
      printLine(`• <b>Локація:</b> Київ, Україна 🇺🇦`);
      printLine(`• <b>Напрям діяльності:</b> Програмна інженерія та методика навчання інженерії ШІ у школі (10–11 класи)`);
      printLine(`• <b>Опис:</b> Інженер-програміст та педагог. Розробляю методики курсів з інженерії штучного інтелекту, навчальні матеріали з інформатики та інтерактивні навчальні платформи.`);
    } else {
      printLine(`<b>[BIO / ABOUT ME]</b>`, 'system');
      printLine(`• <b>Full Name:</b> Roman Rader / Роман Ілліч Радер`);
      printLine(`• <b>Location:</b> Kyiv, Ukraine 🇺🇦`);
      printLine(`• <b>Focus Areas:</b> Software Engineering & AI Engineering Education (K-12)`);
      printLine(`• <b>Summary:</b> Dedicated software engineer and educator developing AI engineering course methodologies, informatics study materials, and interactive learning platforms for K-12 education.`);
    }
  }

  function printContact() {
    printLine(`<b>${isUk ? '[КОНТАКТИ ТА ПРОФІЛІ]' : '[CONTACT & PROFILES]'}</b>`, 'system');
    printLine(`• <b>Email:</b> <a href="mailto:roman.rader@gmail.com">roman.rader@gmail.com</a>`);
    printLine(`• <b>LinkedIn:</b> <a href="https://www.linkedin.com/in/roman-rader/" target="_blank">linkedin.com/in/roman-rader</a>`);
    printLine(`• <b>GitHub:</b> <a href="https://github.com/rrader/" target="_blank">github.com/rrader</a>`);
    printLine(`• <b>Google Scholar:</b> <a href="https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ" target="_blank">Google Scholar Profile</a>`);
    printLine(`• <b>Stack Overflow:</b> <a href="https://stackoverflow.com/users/330406/antigluk" target="_blank">stackoverflow.com/users/330406/antigluk</a>`);
    printLine(`• <b>Geektastic:</b> <a href="https://app.geektastic.com/profile/public/ofUqjZqr-oppQOlOhROsCg" target="_blank">Geektastic Profile</a>`);
  }

  function getDynamicPosts(sectionFilter) {
    const raw = window.__HUGO_POSTS__ || [];
    const sectionPosts = raw.filter(p => !sectionFilter || p.section === sectionFilter);
    const langPosts = sectionPosts.filter(p => p.lang === currentLang);
    return langPosts.length > 0 ? langPosts : sectionPosts.filter(p => p.lang === 'en');
  }

  function printResearch() {
    printLine(`<b>${isUk ? '[ДОСЛІДЖЕННЯ ТА НАУКОВА РОБОТА]' : '[RESEARCH & SCHOLARLY WORK]'}</b>`, 'system');
    printLine(isUk 
      ? `• <b>Ключовий фокус:</b> Програмна інженерія, аналіз шифрованого трафіку та прикладний ШІ у шкільній освіті.`
      : `• <b>Primary Focus:</b> Software Engineering, Encrypted Traffic Analysis, and Applied AI in K-12 Education.`);
    printLine(`• <b>${isUk ? 'Академічні публікації та профіль:' : 'Academic Publications & Citation Index:'}</b>`);
    printLine(`  - Google Scholar: <a href="https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ" target="_blank">Google Scholar Profile</a>`);
    
    const posts = getDynamicPosts("study_posts");
    if (posts.length > 0) {
      printLine(`• <b>${isUk ? 'Статті та дослідження:' : 'Articles & Research Notes:'}</b>`);
      posts.forEach(p => {
        printLine(`  • <a href="${p.url}" target="_blank">${p.title}</a> <span style="opacity:0.6;">(${p.date})</span>`);
      });
    }
    const secUrl = isUk ? '/uk/study_posts/' : '/study_posts/';
    printLine(`  - <b>${isUk ? 'Всі публікації розділу:' : 'View all research posts:'}</b> <a href="${secUrl}" target="_blank">${secUrl}</a>`);
  }

  function printProjects() {
    printLine(`<b>${isUk ? '[ПРОЄКТИ ТА РОЗРОБКА]' : '[PROJECTS & SOFTWARE]'}</b>`, 'system');
    printLine(isUk 
      ? `• <b>Напрями:</b> Бекенд-системи, автоматизація інфраструктури, моніторинг, боти та відкритий код.`
      : `• <b>Focus Areas:</b> Backend systems, infrastructure automation, monitoring bots, and open-source software.`);
    
    const posts = getDynamicPosts("projects");
    if (posts.length > 0) {
      printLine(`• <b>${isUk ? 'Проєкти та огляди:' : 'Featured Projects & Articles:'}</b>`);
      posts.forEach(p => {
        printLine(`  • <a href="${p.url}" target="_blank">${p.title}</a> <span style="opacity:0.6;">(${p.date})</span>`);
      });
    }
    const secUrl = isUk ? '/uk/projects/' : '/projects/';
    printLine(`  - <b>${isUk ? 'Всі публікації розділу:' : 'View all projects:'}</b> <a href="${secUrl}" target="_blank">${secUrl}</a>`);
  }

  function printEngineering() {
    printLine(`<b>${isUk ? '[СИСТЕМНА ТА ПРОГРАМНА ІНЖЕНЕРІЯ]' : '[SYSTEMS & SOFTWARE ENGINEERING]'}</b>`, 'system');
    printLine(isUk 
      ? `• <b>Напрями:</b> Ядро Linux, низькорівнева C-розробка, структури даних, системна архітектура та оптимізації.`
      : `• <b>Focus Areas:</b> Linux kernel internals, low-level C programming, data structures, systems architecture, and optimization.`);
    
    const posts = getDynamicPosts("engineering");
    if (posts.length > 0) {
      printLine(`• <b>${isUk ? 'Статті та інженерні нотатки:' : 'Articles & Engineering Notes:'}</b>`);
      posts.forEach(p => {
        printLine(`  • <a href="${p.url}" target="_blank">${p.title}</a> <span style="opacity:0.6;">(${p.date})</span>`);
      });
    }
    const secUrl = isUk ? '/uk/engineering/' : '/engineering/';
    printLine(`  - <b>${isUk ? 'Всі публікації розділу:' : 'View all engineering posts:'}</b> <a href="${secUrl}" target="_blank">${secUrl}</a>`);
  }

  function printDiy() {
    printLine(`<b>${isUk ? '[DIY, 3D-ДРУК ТА HARDWARE]' : '[DIY, 3D PRINTING & HARDWARE]'}</b>`, 'system');
    printLine(isUk
      ? `• <b>Напрями:</b> Функціональний 3D-друк (PETG), вбудовані системи ESP32 / Arduino, параметричний CAD (CadQuery, build123d).`
      : `• <b>Focus Areas:</b> Functional 3D printing (PETG), ESP32 / Arduino embedded systems, parametric CAD (CadQuery, build123d).`);
    
    const posts = getDynamicPosts("diy_posts");
    if (posts.length > 0) {
      printLine(`• <b>${isUk ? 'Проєкти та лоґи збірки:' : 'Featured Projects & Build Logs:'}</b>`);
      posts.forEach(p => {
        printLine(`  • <a href="${p.url}" target="_blank">${p.title}</a> <span style="opacity:0.6;">(${p.date})</span>`);
      });
    }
    const secUrl = isUk ? '/uk/diy_posts/' : '/diy_posts/';
    printLine(`  - <b>${isUk ? 'Всі DIY публікації:' : 'View all DIY posts:'}</b> <a href="${secUrl}" target="_blank">${secUrl}</a>`);
  }

  function printTeaching() {
    printLine(`<b>${isUk ? '[ВИКЛАДАННЯ ТА ШКІЛЬНА ІНФОРМАТИКА]' : '[TEACHING & K-12 EDUCATION]'}</b>`, 'system');
    printLine(isUk
      ? `• <b>Напрями:</b> Інженерія штучного інтелекту у школі (10–11 класи), навчальна програма з інформатики, кібербезпека.`
      : `• <b>Focus Areas:</b> AI Engineering Education (K-12), Informatics Curriculum, and Cybersecurity Awareness.`);
    printLine(`• <b>${isUk ? 'Освітні портали:' : 'Educational Portals:'}</b>`);
    printLine(`  - <a href="https://class.rmn.pp.ua/" target="_blank">https://class.rmn.pp.ua/</a> (Classroom Portal)`);
    printLine(`  - <a href="https://class.rmn.pp.ua/method" target="_blank">https://class.rmn.pp.ua/method</a> (AI Methodological Guide)`);
    
    const posts = getDynamicPosts("teach_posts");
    if (posts.length > 0) {
      printLine(`• <b>${isUk ? 'Статті та педагогічні кейси:' : 'Articles & Case Studies:'}</b>`);
      posts.forEach(p => {
        printLine(`  • <a href="${p.url}" target="_blank">${p.title}</a> <span style="opacity:0.6;">(${p.date})</span>`);
      });
    }
    const secUrl = isUk ? '/uk/teach_posts/' : '/teach_posts/';
    printLine(`  - <b>${isUk ? 'Всі освітні публікації:' : 'View all teaching posts:'}</b> <a href="${secUrl}" target="_blank">${secUrl}</a>`);
  }

  function printAllPosts() {
    printLine(`<b>${isUk ? '[ВСІ ПУБЛІКАЦІЇ ТА СТАТТІ]' : '[ALL ARTICLES & POSTS]'}</b>`, 'system');
    printLine(`--------------------------------------------------`);
    
    const sections = [
      { id: "projects", title: isUk ? "💻 Проєкти та софт" : "💻 Projects & Software" },
      { id: "engineering", title: isUk ? "⚙️ Інженерія" : "⚙️ Engineering" },
      { id: "diy_posts", title: isUk ? "🛠️ DIY та мейкерство" : "🛠️ DIY & Hardware" },
      { id: "teach_posts", title: isUk ? "🎓 Викладання та інформатика" : "🎓 Teaching & Informatics" },
      { id: "study_posts", title: isUk ? "🔬 Дослідження" : "🔬 Research" }
    ];

    sections.forEach(sec => {
      const posts = getDynamicPosts(sec.id);
      if (posts.length > 0) {
        printLine(`<b>${sec.title}:</b>`);
        posts.forEach(p => {
          printLine(`  • <a href="${p.url}" target="_blank">${p.title}</a> <span style="opacity:0.6;">(${p.date})</span>`);
        });
      }
    });
    printLine(`--------------------------------------------------`);
  }

  function printRss() {
    printLine(`<b>${isUk ? '[RSS-СТРІЧКИ САЙТУ]' : '[WEBSITE RSS FEEDS]'}</b>`, 'system');
    printLine(isUk 
      ? `Підпишіться через ваш улюблений RSS-рідер (Feedly, NetNewsWire, Miniflux тощо):`
      : `Subscribe using your favorite RSS reader (Feedly, NetNewsWire, Miniflux, etc.):`);
    printLine(`--------------------------------------------------`);
    const baseUrl = window.location.origin;
    printLine(`• <b>${isUk ? 'Головна стрічка (EN):' : 'Main Feed (English):'}</b> <a href="${baseUrl}/index.xml" target="_blank">${baseUrl}/index.xml</a>`);
    printLine(`• <b>${isUk ? 'Головна стрічка (UA):' : 'Main Feed (Ukrainian):'}</b> <a href="${baseUrl}/uk/index.xml" target="_blank">${baseUrl}/uk/index.xml</a>`);
    printLine(`• <b>Engineering:</b> <a href="${baseUrl}/engineering/index.xml" target="_blank">${baseUrl}/engineering/index.xml</a>`);
    printLine(`• <b>Projects:</b> <a href="${baseUrl}/projects/index.xml" target="_blank">${baseUrl}/projects/index.xml</a>`);
    printLine(`• <b>DIY & Hardware:</b> <a href="${baseUrl}/diy_posts/index.xml" target="_blank">${baseUrl}/diy_posts/index.xml</a>`);
    printLine(`• <b>Teaching & AI:</b> <a href="${baseUrl}/teach_posts/index.xml" target="_blank">${baseUrl}/teach_posts/index.xml</a>`);
    printLine(`• <b>Research / Study:</b> <a href="${baseUrl}/study_posts/index.xml" target="_blank">${baseUrl}/study_posts/index.xml</a>`);
    printLine(`--------------------------------------------------`);
  }

  function clearScreen() {
    outputEl.innerHTML = '';
  }

  // --- Settings & Toggles ---
  function toggleSfx() {
    state.sfx = !state.sfx;
    localStorage.setItem('quake_sfx', state.sfx ? 'on' : 'off');
    updateSfxBtn();
    if (state.sfx) playEnterChime();
  }

  function toggleSfxCmd(val) {
    if (val === 'off') state.sfx = false;
    else if (val === 'on') state.sfx = true;
    else state.sfx = !state.sfx;

    localStorage.setItem('quake_sfx', state.sfx ? 'on' : 'off');
    updateSfxBtn();
    printLine(`Sound effects: <b>${state.sfx ? 'ON' : 'OFF'}</b>`, 'system');
    if (state.sfx) playEnterChime();
  }

  function updateSfxBtn() {
    if (sfxBtn) {
      sfxBtn.innerHTML = state.sfx ? '🔊 SFX: ON' : '🔇 SFX: OFF';
      sfxBtn.classList.toggle('active', state.sfx);
    }
  }

  function applyGfx(enabled) {
    state.gfx = enabled;
    localStorage.setItem('quake_gfx', state.gfx ? 'on' : 'off');
    if (wrapperEl) {
      wrapperEl.classList.toggle('gfx-off', !state.gfx);
    }
    if (gfxBtn) {
      gfxBtn.innerHTML = state.gfx ? '📺 GFX: ON' : '📺 GFX: OFF';
      gfxBtn.classList.toggle('active', state.gfx);
    }
  }

  function toggleGfx() {
    applyGfx(!state.gfx);
    if (state.sfx) playEnterChime();
  }

  function toggleGfxCmd(val) {
    if (val === 'off') applyGfx(false);
    else if (val === 'on') applyGfx(true);
    else applyGfx(!state.gfx);
    printLine(`CRT GFX Effects: <b>${state.gfx ? 'ON' : 'OFF'}</b>`, 'system');
  }

  // --- Command Execution & Key Handling ---
  function handleKeyDown(e) {
    playKeyClick();

    if (e.key === 'Enter') {
      const rawInput = inputEl.value.trim();
      inputEl.value = '';
      if (rawInput) {
        executeCommand(rawInput);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (state.history.length > 0) {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
        }
        inputEl.value = state.history[state.history.length - 1 - state.historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (state.historyIndex > 0) {
        state.historyIndex--;
        inputEl.value = state.history[state.history.length - 1 - state.historyIndex] || '';
      } else if (state.historyIndex === 0) {
        state.historyIndex = -1;
        inputEl.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleAutocomplete();
    }
  }

  // --- Virtual File System & Commands (ls, cat, grep, sl) ---
  const VFS_DIRS = {
    projects: { section: 'projects', desc: isUk ? 'Програмні проєкти та розробка' : 'Software projects & dev' },
    engineering: { section: 'engineering', desc: isUk ? 'Системна та програмна інженерія' : 'Systems & software engineering' },
    diy: { section: 'diy_posts', desc: isUk ? 'DIY, 3D-друк та апаратні проєкти' : 'DIY, 3D printing & hardware' },
    diy_posts: { section: 'diy_posts', aliasOf: 'diy' },
    teaching: { section: 'teach_posts', desc: isUk ? 'Матеріали з інформатики та курси ШІ' : 'Informatics & AI course materials' },
    teach_posts: { section: 'teach_posts', aliasOf: 'teaching' },
    research: { section: 'study_posts', desc: isUk ? 'Дослідження безпеки та публікації' : 'Cybersecurity research & papers' },
    study_posts: { section: 'study_posts', aliasOf: 'research' }
  };

  const VFS_FILES = {
    'README.md': {
      size: 1024,
      date: '2026-10-04',
      getContent: () => isUk
        ? `# rmn.pp.ua — Персональний веб-вузол Романа Радера\n\nЛаскаво просимо до інтерактивного термінала!\nТут можна переглядати проєкти, статті, дослідження та навчальні матеріали.\n\nОсновні команди:\n  ls         - перегляд списку файлів та каталогів\n  cat <file> - вивід вмісту текстового файлу\n  grep <tex> - пошук за статтями або фільтрація через pipe (| grep)\n  sl         - класичний паровоз (Steam Locomotive) 🚂\n  posts      - повний перелік усіх публікацій\n  help       - повна довідка з усіх команд`
        : `# rmn.pp.ua — Roman Rader Personal Web Node\n\nWelcome to the interactive Quake terminal!\nExplore software projects, DIY builds, cybersecurity research, and AI curricula.\n\nCore commands:\n  ls         - list directory contents\n  cat <file> - display text file contents\n  grep <txt> - search articles or filter pipeline (| grep)\n  sl         - classic Steam Locomotive animation 🚂\n  posts      - list all publications\n  help       - view all available commands`
    },
    'bio.txt': {
      size: 512,
      date: '2026-10-04',
      getContent: () => isUk
        ? `[БІОГРАФІЯ]\nРоман Ілліч Радер — інженер-програміст та педагог (Київ, Україна 🇺🇦).\nНапрям: Програмна інженерія та методика навчання інженерії ШІ у школі (10-11 класи).\nРозробляю навчальні платформи, матеріали з інформатики та апаратні DIY-рішення.`
        : `[BIOGRAPHY]\nRoman Rader — Software Engineer & Educator (Kyiv, Ukraine 🇺🇦).\nFocus: Software Engineering & AI Engineering Education (K-12).\nBuilding educational platforms, informatics curricula, and hardware DIY solutions.`
    },
    'contact.txt': {
      size: 384,
      date: '2026-10-04',
      getContent: () => `Email: roman.rader@gmail.com\nLinkedIn: https://www.linkedin.com/in/roman-rader/\nGitHub: https://github.com/rrader/\nGoogle Scholar: https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ`
    },
    'rss.xml': {
      size: 256,
      date: '2026-10-04',
      getContent: () => `Main (EN): ${window.location.origin}/index.xml\nMain (UA): ${window.location.origin}/uk/index.xml\nDIY: ${window.location.origin}/diy_posts/index.xml\nTeaching: ${window.location.origin}/teach_posts/index.xml\nResearch: ${window.location.origin}/study_posts/index.xml`
    },
    '.bashrc': {
      size: 128,
      date: '2026-10-04',
      hidden: true,
      getContent: () => `# rmn.pp.ua bash config\nalias ll='ls -la'\nalias cls='clear'\nalias train='sl'`
    },
    '.profile': {
      size: 64,
      date: '2026-10-04',
      hidden: true,
      getContent: () => `export PS1='[guest@rmn.pp.ua ~]$ '\nexport TERM='xterm-256color'`
    }
  };

  function lsCmd(args = []) {
    let showAll = false;
    let longFormat = false;
    let targetPath = '';

    for (const arg of args) {
      if (arg.startsWith('-')) {
        if (arg.includes('a')) showAll = true;
        if (arg.includes('l')) longFormat = true;
      } else if (!targetPath) {
        targetPath = arg.trim();
      }
    }

    targetPath = targetPath.replace(/^\.\//, '').replace(/\/$/, '');

    // Case 1: Target directory or file
    if (targetPath && targetPath !== '~' && targetPath !== '.') {
      const dirKey = targetPath.toLowerCase();

      if (VFS_DIRS[dirKey]) {
        const sec = VFS_DIRS[dirKey].section;
        const posts = getDynamicPosts(sec);
        if (posts.length === 0) {
          printLine(isUk ? '(порожній каталог)' : '(empty directory)', 'system');
          return;
        }

        if (longFormat) {
          printLine(`total ${posts.length * 4}`);
          posts.forEach(p => {
            const slug = p.url.replace(/^\/(uk\/)?/, '').replace(/\/$/, '').split('/').pop() || 'article';
            const fn = `${slug}.md`;
            printLine(`-rw-r--r-- 1 guest guest 4096 ${p.date} <a href="${p.url}" target="_blank" class="ls-file">${escapeHtml(fn)}</a> <span style="opacity:0.65;"># ${escapeHtml(p.title)}</span>`);
          });
        } else {
          const links = posts.map(p => {
            const slug = p.url.replace(/^\/(uk\/)?/, '').replace(/\/$/, '').split('/').pop() || 'article';
            return `<a href="${p.url}" target="_blank" class="ls-file">${escapeHtml(slug)}.md</a>`;
          });
          printLine(links.join('&nbsp;&nbsp;&nbsp;'));
        }
        return;
      }

      if (dirKey === '..' || dirKey === '/') {
        printLine(`<span class="ls-dir">bin/</span>   <span class="ls-dir">dev/</span>   <span class="ls-dir">etc/</span>   <span class="ls-dir">home/</span>   <span class="ls-dir">usr/</span>   <span class="ls-dir">var/</span>`);
        return;
      }

      if (dirKey === 'bin' || dirKey === '/bin') {
        printLine(`<span class="ls-exec">cat*</span>   <span class="ls-exec">clear*</span>   <span class="ls-exec">date*</span>   <span class="ls-exec">grep*</span>   <span class="ls-exec">help*</span>   <span class="ls-exec">ls*</span>   <span class="ls-exec">matrix*</span>   <span class="ls-exec">sl*</span>`);
        return;
      }

      if (VFS_FILES[dirKey]) {
        const f = VFS_FILES[dirKey];
        if (longFormat) {
          printLine(`-rw-r--r-- 1 guest guest ${String(f.size).padStart(5, ' ')} ${f.date} <span class="ls-file">${escapeHtml(dirKey)}</span>`);
        } else {
          printLine(`<span class="ls-file">${escapeHtml(dirKey)}</span>`);
        }
        return;
      }

      printLine(`ls: cannot access '${escapeHtml(targetPath)}': No such file or directory`, 'error');
      return;
    }

    // Case 2: default ls in current home directory ~
    const dirs = ['projects/', 'diy/', 'teaching/', 'research/'];
    const regularFiles = ['README.md', 'bio.txt', 'contact.txt', 'rss.xml'];
    const execFiles = ['sl*'];
    const hiddenFiles = ['.', '..', '.bashrc', '.profile'];

    if (longFormat) {
      printLine(`total 32`);
      if (showAll) {
        printLine(`drwxr-xr-x 6 guest guest 4096 Oct 04 22:00 <span class="ls-dir">.</span>`);
        printLine(`drwxr-xr-x 3 root  root  4096 Oct 04 22:00 <span class="ls-dir">..</span>`);
        printLine(`-rw-r--r-- 1 guest guest  128 Oct 04 22:00 <span class="ls-file">.bashrc</span>`);
        printLine(`-rw-r--r-- 1 guest guest   64 Oct 04 22:00 <span class="ls-file">.profile</span>`);
      }
      dirs.forEach(d => {
        printLine(`drwxr-xr-x 2 guest guest 4096 Oct 04 22:00 <span class="ls-dir">${d}</span>`);
      });
      regularFiles.forEach(f => {
        const size = VFS_FILES[f] ? VFS_FILES[f].size : 1024;
        const date = VFS_FILES[f] ? VFS_FILES[f].date : 'Oct 04 22:00';
        printLine(`-rw-r--r-- 1 guest guest ${String(size).padStart(5, ' ')} ${date} <span class="ls-file">${f}</span>`);
      });
      execFiles.forEach(e => {
        printLine(`-rwxr-xr-x 1 guest guest  8192 Oct 04 22:00 <span class="ls-exec">${e}</span>`);
      });
    } else {
      let items = [];
      if (showAll) {
        items.push(...hiddenFiles.map(h => `<span class="${h === '.' || h === '..' ? 'ls-dir' : 'ls-file'}">${h}</span>`));
      }
      items.push(...dirs.map(d => `<span class="ls-dir">${d}</span>`));
      items.push(...regularFiles.map(f => `<span class="ls-file">${f}</span>`));
      items.push(...execFiles.map(e => `<span class="ls-exec">${e}</span>`));

      printLine(items.join('&nbsp;&nbsp;&nbsp;&nbsp;'));
    }
  }

  function catCmd(args = []) {
    if (!args || args.length === 0) {
      printLine('usage: cat &lt;filename&gt;', 'system');
      return;
    }
    const filename = args[0].replace(/^~\//, '');
    if (VFS_FILES[filename]) {
      const content = VFS_FILES[filename].getContent();
      printLine(escapeHtml(content));
      return;
    }
    if (VFS_DIRS[filename]) {
      printLine(`cat: ${escapeHtml(filename)}: Is a directory`, 'error');
      return;
    }
    const allPosts = window.__HUGO_POSTS__ || [];
    const matched = allPosts.find(p => {
      const slug = p.url.replace(/^\/(uk\/)?/, '').replace(/\/$/, '').split('/').pop();
      return filename === slug || filename === `${slug}.md`;
    });
    if (matched) {
      printLine(`<b>${escapeHtml(matched.title)}</b> <span style="opacity:0.6;">(${matched.date})</span>`);
      printLine(`Section: ${matched.section}`);
      printLine(`URL: <a href="${matched.url}" target="_blank">${matched.url}</a>`);
      return;
    }
    printLine(`cat: ${escapeHtml(filename)}: No such file or directory`, 'error');
  }

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function highlightMatch(html, pattern, ignoreCase = true) {
    if (!pattern) return html;
    const escPat = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(<[^>]+>)|(${escPat})`, ignoreCase ? 'gi' : 'g');
    return html.replace(re, (match, tag, textGroup) => {
      if (tag) return tag;
      return `<span class="grep-highlight">${textGroup}</span>`;
    });
  }

  function grepCmd(args = []) {
    let ignoreCase = true;
    let showLineNum = false;
    let invertMatch = false;
    let countOnly = false;
    const cleanArgs = [];

    for (const a of args) {
      if (a === '-i') ignoreCase = true;
      else if (a === '-n') showLineNum = true;
      else if (a === '-v') invertMatch = true;
      else if (a === '-c') countOnly = true;
      else if (a.startsWith('-')) {
        if (a.includes('i')) ignoreCase = true;
        if (a.includes('n')) showLineNum = true;
        if (a.includes('v')) invertMatch = true;
        if (a.includes('c')) countOnly = true;
      } else {
        cleanArgs.push(a);
      }
    }

    if (cleanArgs.length === 0) {
      printLine('usage: grep [-i] &lt;pattern&gt; [file...] or &lt;command&gt; | grep &lt;pattern&gt;', 'system');
      return;
    }

    const pattern = cleanArgs[0];
    const targetFile = cleanArgs[1] || '';

    let regex;
    try {
      regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ignoreCase ? 'i' : '');
    } catch (e) {
      printLine(`grep: invalid pattern: ${escapeHtml(pattern)}`, 'error');
      return;
    }

    // Subcase A: Search inside a specific file
    if (targetFile) {
      const fn = targetFile.replace(/^~\//, '');
      if (VFS_FILES[fn]) {
        const text = VFS_FILES[fn].getContent();
        const lines = text.split('\n');
        let matchCount = 0;
        lines.forEach((line, idx) => {
          const matched = regex.test(line);
          const shouldShow = invertMatch ? !matched : matched;
          if (shouldShow) {
            matchCount++;
            if (!countOnly) {
              const prefix = showLineNum ? `<span style="opacity:0.6;">${idx + 1}:</span> ` : '';
              const highlighted = highlightMatch(escapeHtml(line), pattern, ignoreCase);
              printLine(`${prefix}${highlighted}`);
            }
          }
        });
        if (countOnly) {
          printLine(`${matchCount}`);
        } else if (matchCount === 0 && !invertMatch) {
          printLine(`grep: '${escapeHtml(pattern)}': no matches in ${escapeHtml(fn)}`, 'system');
        }
        return;
      } else {
        printLine(`grep: ${escapeHtml(targetFile)}: No such file or directory`, 'error');
        return;
      }
    }

    // Subcase B: Global search across all posts and files
    const allPosts = window.__HUGO_POSTS__ || [];
    const matchedPosts = allPosts.filter(p => {
      const textToSearch = `${p.title} ${p.section} ${p.url} ${p.date}`;
      const matched = regex.test(textToSearch);
      return invertMatch ? !matched : matched;
    });

    const matchedFiles = [];
    Object.keys(VFS_FILES).forEach(fn => {
      if (VFS_FILES[fn].hidden) return;
      const text = VFS_FILES[fn].getContent();
      if (regex.test(text)) {
        matchedFiles.push(fn);
      }
    });

    if (countOnly) {
      printLine(`${matchedPosts.length + matchedFiles.length}`);
      return;
    }

    if (matchedPosts.length === 0 && matchedFiles.length === 0) {
      printLine(
        isUk
          ? `grep: збігів для "<b>${escapeHtml(pattern)}</b>" не знайдено.`
          : `grep: no matches found for "<b>${escapeHtml(pattern)}</b>".`,
        'system'
      );
      return;
    }

    printLine(`<b>${isUk ? 'РЕЗУЛЬТАТИ ПОШУКУ GREP:' : 'GREP SEARCH RESULTS:'} "${escapeHtml(pattern)}"</b>`, 'system');
    printLine('--------------------------------------------------');

    if (matchedPosts.length > 0) {
      printLine(`<b>${isUk ? 'Публікації та проєкти:' : 'Articles & Projects:'}</b> (${matchedPosts.length})`);
      matchedPosts.forEach(p => {
        const highlightedTitle = highlightMatch(escapeHtml(p.title), pattern, ignoreCase);
        const highlightedSec = highlightMatch(escapeHtml(p.section), pattern, ignoreCase);
        printLine(`  • [${highlightedSec}] <a href="${p.url}" target="_blank">${highlightedTitle}</a> <span style="opacity:0.6;">(${p.date})</span>`);
      });
    }

    if (matchedFiles.length > 0) {
      printLine(`<b>${isUk ? 'Текстові файли вузла:' : 'System Text Files:'}</b>`);
      matchedFiles.forEach(fn => {
        printLine(`  • <span class="ls-file">${fn}</span> (cat ${fn})`);
      });
    }
    printLine('--------------------------------------------------');
  }

  function runPipedGrep(capturedLines, args) {
    let ignoreCase = true;
    let showLineNum = false;
    let invertMatch = false;
    let countOnly = false;
    const cleanArgs = [];

    for (const a of args) {
      if (a === '-i') ignoreCase = true;
      else if (a === '-n') showLineNum = true;
      else if (a === '-v') invertMatch = true;
      else if (a === '-c') countOnly = true;
      else if (a.startsWith('-')) {
        if (a.includes('i')) ignoreCase = true;
        if (a.includes('n')) showLineNum = true;
        if (a.includes('v')) invertMatch = true;
        if (a.includes('c')) countOnly = true;
      } else {
        cleanArgs.push(a);
      }
    }

    if (cleanArgs.length === 0) {
      printLine('grep: missing search pattern', 'error');
      return;
    }

    const pattern = cleanArgs[0];
    let regex;
    try {
      regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ignoreCase ? 'i' : '');
    } catch (e) {
      printLine(`grep: invalid pattern: ${escapeHtml(pattern)}`, 'error');
      return;
    }

    let matchCount = 0;
    capturedLines.forEach((item, idx) => {
      const plainText = stripHtml(item.html);
      const isMatch = regex.test(plainText);
      const shouldInclude = invertMatch ? !isMatch : isMatch;

      if (shouldInclude) {
        matchCount++;
        if (!countOnly) {
          const highlighted = highlightMatch(item.html, pattern, ignoreCase);
          const prefix = showLineNum ? `<span style="opacity:0.6;">${idx + 1}:</span> ` : '';
          printLine(`${prefix}${highlighted}`, item.className);
        }
      }
    });

    if (countOnly) {
      printLine(`${matchCount}`);
    }
  }

  // --- Steam Locomotive (SL) Animation ---
  const SL_FRAMES = [
    // Frame 0
    [
      "                       (  ) (@@) ( )  )",
      "                      (    )    (@@@@)",
      "                     (@@@)",
      "                    ====        ________                ___________",
      "                _D _|  |_______/        \\__I_I_____===__|_________|",
      "                 |(_)---  |   H\\________/ _____ \\   |    | -------|",
      "                 /     |  |   H  |  |   |     | |   |    |        |",
      "                |      |  |   H  |__--------------------|--------|",
      "                | ________|___H__/__/_____/[][]~\\_______|________|",
      "                |/ |   |_____I........................I______|",
      "               __(O)(O)______[(O)(O)]______[(O)(O)]______[(O)(O)]__"
    ].join('\n'),
    // Frame 1
    [
      "                   (@@@)  (   )   (@@)",
      "                  (     )   (@@@@)  ( )",
      "                 (@@@@)",
      "                    ====        ________                ___________",
      "                _D _|  |_______/        \\__I_I_____===__|_________|",
      "                 |(_)---  |   H\\________/ _____ \\   |    | -------|",
      "                 /     |  |   H  |  |   |     | |   |    |        |",
      "                |      |  |   H  |__--------------------|--------|",
      "                | ________|___H__/__/_____/[][]~\\_______|________|",
      "                |/ |   |_____I........................I______|",
      "               __(o)(o)______[(o)(o)]______[(o)(o)]______[(o)(o)]__"
    ].join('\n'),
    // Frame 2
    [
      "                      (@@)  (  )  (@@@)",
      "                     (    )   (@@)   ( )",
      "                      (@@@@)",
      "                    ====        ________                ___________",
      "                _D _|  |_______/        \\__I_I_____===__|_________|",
      "                 |(_)---  |   H\\________/ _____ \\   |    | -------|",
      "                 /     |  |   H  |  |   |     | |   |    |        |",
      "                |      |  |   H  |__--------------------|--------|",
      "                | ________|___H__/__/_____/[][]~\\_______|________|",
      "                |/ |   |_____I........................I______|",
      "               __(*)-(*)______[(*)-(*)]______[(*)-(*)]______[(*)-(*)]__"
    ].join('\n')
  ];

  const SL_FRAMES_ACCIDENT = [
    [
      "                       (  ) (@@) ( )  )",
      "                      (    )    (@@@@)",
      "                     (@@@)",
      "                    ====        ________                ___________",
      "                _D _|  |_______/        \\__I_I_____===__|HELP! SOS|",
      "                 |(_)---  |   H\\________/ _____ \\   |    | -------|",
      "                 /     |  |   H  |  |   |     | |   |    |        |",
      "                |      |  |   H  |__--------------------|--------|",
      "                | ________|___H__/__/_____/[][]~\\_______|________|",
      "                |/ |   |_____I........................I______|",
      "               __(O)(O)______[(O)(O)]______[(O)(O)]______[(O)(O)]__"
    ].join('\n'),
    [
      "                   (@@@)  (   )   (@@)",
      "                  (     )   (@@@@)  ( )",
      "                 (@@@@)",
      "                    ====        ________                ___________",
      "                _D _|  |_______/        \\__I_I_____===__|HELP! SOS|",
      "                 |(_)---  |   H\\________/ _____ \\   |    | -------|",
      "                 /     |  |   H  |  |   |     | |   |    |        |",
      "                |      |  |   H  |__--------------------|--------|",
      "                | ________|___H__/__/_____/[][]~\\_______|________|",
      "                |/ |   |_____I........................I______|",
      "               __(o)(o)______[(o)(o)]______[(o)(o)]______[(o)(o)]__"
    ].join('\n'),
    [
      "                      (@@)  (  )  (@@@)",
      "                     (    )   (@@)   ( )",
      "                      (@@@@)",
      "                    ====        ________                ___________",
      "                _D _|  |_______/        \\__I_I_____===__|HELP! SOS|",
      "                 |(_)---  |   H\\________/ _____ \\   |    | -------|",
      "                 /     |  |   H  |  |   |     | |   |    |        |",
      "                |      |  |   H  |__--------------------|--------|",
      "                | ________|___H__/__/_____/[][]~\\_______|________|",
      "                |/ |   |_____I........................I______|",
      "               __(*)-(*)______[(*)-(*)]______[(*)-(*)]______[(*)-(*)]__"
    ].join('\n')
  ];

  let slRunning = false;

  function runSlTrain(args = []) {
    if (slRunning) return;
    slRunning = true;

    const isAccident = args.includes('-a');
    const frames = isAccident ? SL_FRAMES_ACCIDENT : SL_FRAMES;

    inputEl.disabled = true;
    const oldPlaceholder = inputEl.placeholder;
    inputEl.placeholder = isUk ? '🚂 Проїжджає паровоз SL...' : '🚂 SL Steam Locomotive passing...';

    playTrainWhistle();

    const slContainer = document.createElement('div');
    slContainer.className = 'sl-container';

    // Detailed animated tied person on the track (Trolley Problem demonstration)
    const MAN_FRAMES = [
      [
        "         ___  <- putin",
        "        (o.O)  \"HELP!\"",
        "       /( X )\\ /      ",
        "      ==[#X#]==       ",
        "        /   \\         ",
        "=======d     b========"
      ].join('\n'),
      [
        "         ___  <- putin",
        "        (O.o)  \"HELP!\"",
        "       /( X )\\ /      ",
        "      ==[#X#]==       ",
        "        |   |         ",
        "=======d     b========"
      ].join('\n')
    ];

    const obstacleEl = document.createElement('div');
    obstacleEl.className = 'sl-obstacle';
    obstacleEl.style.cssText = 'position: absolute; left: 120px; bottom: 0px; font-family: var(--font-retro), monospace; font-size: clamp(8px, 1.3vw, 13px); color: var(--accent-color); text-shadow: 0 0 6px var(--glow-color); z-index: 2; line-height: 1.15; white-space: pre; pointer-events: none;';
    obstacleEl.textContent = MAN_FRAMES[0];
    slContainer.appendChild(obstacleEl);

    const pre = document.createElement('pre');
    pre.className = 'sl-train';
    pre.textContent = frames[0];
    slContainer.appendChild(pre);
    outputEl.appendChild(slContainer);
    scrollToBottom();

    const containerWidth = containerEl.clientWidth || window.innerWidth;
    let posX = containerWidth;
    let frameIdx = 0;
    let manIdx = 0;
    let tick = 0;
    let hit = false;
    const trainWidth = 650;

    const interval = setInterval(() => {
      posX -= 12;
      tick++;

      if (tick % 3 === 0) {
        frameIdx = (frameIdx + 1) % frames.length;
        pre.textContent = frames[frameIdx];
      }

      // Animate struggling tied person before impact
      if (!hit && tick % 6 === 0) {
        manIdx = (manIdx + 1) % MAN_FRAMES.length;
        obstacleEl.textContent = MAN_FRAMES[manIdx];
      }

      if (tick % 6 === 0) {
        playTrainChug();
      }

      // Contact with the tied figure around 130px
      if (!hit && posX <= 180) {
        hit = true;
        playTrainChug();
        obstacleEl.textContent = '\n\n   💥 *POOF* 💥\n======================';
        setTimeout(() => {
          if (obstacleEl.parentNode) {
            obstacleEl.textContent = '\n\n         ...\n======================';
          }
        }, 260);
      }

      pre.style.transform = `translateX(${posX}px)`;

      if (posX < -trainWidth) {
        finishSl();
      }
    }, 30);

    function finishSl() {
      clearInterval(interval);
      slRunning = false;
      if (slContainer.parentNode) {
        slContainer.parentNode.removeChild(slContainer);
      }
      inputEl.disabled = false;
      inputEl.placeholder = oldPlaceholder;
      printLine(
        isUk
          ? `🚂 <i>Тепер, коли путін здох, можливо, ви мали на увазі <b style="color: var(--accent-color)">ls</b>?</i>`
          : `🚂 <i>Now when putin is dead, did you mean <b style="color: var(--accent-color)">ls</b>?</i>`,
        'system'
      );
      inputEl.focus();
      scrollToBottom();
    }

    const abortHandler = (e) => {
      if (slRunning && (e.key === 'Escape' || (e.key === 'c' && e.ctrlKey))) {
        window.removeEventListener('keydown', abortHandler);
        finishSl();
      }
    };
    window.addEventListener('keydown', abortHandler, { once: true });
  }

  function executeCommand(rawInput) {
    printLine(`<span style="color: var(--prompt-color)">[guest@rmn.pp.ua ~]$</span> ${escapeHtml(rawInput)}`, 'command-echo');
    
    // History
    state.history.push(rawInput);
    state.historyIndex = -1;

    // Check pipeline support (e.g. ls | grep diy)
    if (rawInput.includes('|')) {
      const pipeIndex = rawInput.indexOf('|');
      const leftPart = rawInput.slice(0, pipeIndex).trim();
      const rightPart = rawInput.slice(pipeIndex + 1).trim();
      const rightTokens = rightPart.split(/\s+/);
      const rightCmd = rightTokens[0].toLowerCase();

      if (rightCmd === 'grep') {
        const grepArgs = rightTokens.slice(1);
        captureBuffer = [];
        executeSingleCommand(leftPart, false);
        const captured = captureBuffer;
        captureBuffer = null;
        runPipedGrep(captured, grepArgs);
        return;
      }
    }

    executeSingleCommand(rawInput, true);
  }

  function executeSingleCommand(cmdStr, playChime = true) {
    const parts = cmdStr.trim().split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (COMMANDS[cmdName]) {
      if (playChime) playEnterChime();
      COMMANDS[cmdName].action(args);
    } else {
      if (playChime) playErrorTone();
      printLine(`Command not found: <b>${escapeHtml(cmdName)}</b>. Type <b style="color: var(--text-bright)">help</b> for a list of available commands.`, 'error');
    }
  }

  function handleAutocomplete() {
    const val = inputEl.value.trim().toLowerCase();
    if (!val) return;

    if (val.startsWith('ls ') || val.startsWith('cat ')) {
      const parts = val.split(/\s+/);
      const prefix = parts.slice(0, -1).join(' ') + ' ';
      const target = parts[parts.length - 1];
      const available = [...Object.keys(VFS_DIRS), ...Object.keys(VFS_FILES)];
      const matches = available.filter(name => name.startsWith(target));
      if (matches.length === 1) {
        inputEl.value = prefix + matches[0] + (VFS_DIRS[matches[0]] ? '/' : ' ');
      } else if (matches.length > 1) {
        printLine(`Matches: ${matches.join(', ')}`, 'system');
      }
      return;
    }

    const matches = Object.keys(COMMANDS).filter(cmd => cmd.startsWith(val));
    if (matches.length === 1) {
      inputEl.value = matches[0] + ' ';
    } else if (matches.length > 1) {
      printLine(`Matches: ${matches.join(', ')}`, 'system');
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // --- Matrix Effect ---
  function toggleMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    if (state.matrixActive) {
      state.matrixActive = false;
      canvas.style.display = 'none';
      if (state.matrixInterval) clearInterval(state.matrixInterval);
      printLine(`Matrix rain: <b>OFF</b>`, 'system');
      return;
    }

    state.matrixActive = true;
    canvas.style.display = 'block';
    printLine(`Matrix rain: <b>ON</b> (type 'matrix' to toggle off)`, 'system');

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZアカサタナハマヤラワ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    state.matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);
  }

})();

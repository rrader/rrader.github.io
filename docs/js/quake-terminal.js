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

  // --- Commands Registry ---
  const COMMANDS = {
    help: {
      desc: 'Display available terminal commands',
      action: () => printHelp()
    },
    bio: {
      desc: 'Show bio summary, location, and core focus',
      action: () => printBio()
    },
    about: {
      desc: 'Alias for bio',
      action: () => printBio()
    },
    contact: {
      desc: 'Show email and social/academic profile links',
      action: () => printContact()
    },
    research: {
      desc: 'Show cybersecurity research focus and Google Scholar profile',
      action: () => printResearch()
    },
    publications: {
      desc: 'Alias for research',
      action: () => printResearch()
    },
    teaching: {
      desc: 'Show educational initiatives and teaching materials links',
      action: () => printTeaching()
    },
    courses: {
      desc: 'Alias for teaching',
      action: () => printTeaching()
    },
    clear: {
      desc: 'Clear terminal screen',
      action: () => clearScreen()
    },
    cls: {
      desc: 'Alias for clear',
      action: () => clearScreen()
    },
    sfx: {
      desc: 'Toggle sound effects (usage: sfx [on|off])',
      action: (args) => toggleSfxCmd(args[0])
    },
    gfx: {
      desc: 'Toggle CRT scanlines & glow effects (usage: gfx [on|off])',
      action: (args) => toggleGfxCmd(args[0])
    },
    date: {
      desc: 'Display current system date & time',
      action: () => printLine(`System Date: ${new Date().toLocaleString()}`, 'system')
    },
    matrix: {
      desc: 'Toggle Matrix digital rain overlay',
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
  function printLine(htmlText, className = '') {
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
    printLine(`[SYSTEM READY] Roman Rader — Personal Web Node`, 'system');
    printLine(`Location: Kyiv, Ukraine 🇺🇦`);
    printLine(`Focus: Software Engineering & AI Engineering Education (K-12)`);
    printLine(`Type <b style="color: var(--text-bright)">help</b> to list commands, or tap the action pills above.\n`);
  }

  function printHelp() {
    printLine(`<b>AVAILABLE COMMANDS:</b>`, 'system');
    printLine(`--------------------------------------------------`);
    Object.keys(COMMANDS).forEach(cmd => {
      const info = COMMANDS[cmd];
      printLine(`  <b style="color: var(--accent-color); min-width: 120px; display: inline-block;">${cmd}</b> : ${info.desc}`);
    });
    printLine(`--------------------------------------------------`);
    printLine(`Tip: Use <b style="color: var(--text-bright)">TAB</b> for autocomplete & <b style="color: var(--text-bright)">UP/DOWN</b> for history.`);
  }

  function printBio() {
    printLine(`<b>[BIO / ABOUT ME]</b>`, 'system');
    printLine(`• <b>Full Name:</b> Roman Rader / Роман Ілліч Радер`);
    printLine(`• <b>Location:</b> Kyiv, Ukraine 🇺🇦`);
    printLine(`• <b>Focus Areas:</b> Software Engineering & AI Engineering Education (K-12)`);
    printLine(`• <b>Summary:</b> Dedicated software engineer and educator developing AI engineering course methodologies, informatics study materials, and interactive learning platforms for K-12 education.`);
  }

  function printContact() {
    printLine(`<b>[CONTACT & PROFILES]</b>`, 'system');
    printLine(`• <b>Email:</b> <a href="mailto:roman.rader@gmail.com">roman.rader@gmail.com</a>`);
    printLine(`• <b>LinkedIn:</b> <a href="https://www.linkedin.com/in/roman-rader/" target="_blank">linkedin.com/in/roman-rader</a>`);
    printLine(`• <b>GitHub:</b> <a href="https://github.com/rrader/" target="_blank">github.com/rrader</a>`);
    printLine(`• <b>Google Scholar:</b> <a href="https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ" target="_blank">Google Scholar Profile</a>`);
    printLine(`• <b>Stack Overflow:</b> <a href="https://stackoverflow.com/users/330406/antigluk" target="_blank">stackoverflow.com/users/330406/antigluk</a>`);
    printLine(`• <b>Geektastic:</b> <a href="https://app.geektastic.com/profile/public/ofUqjZqr-oppQOlOhROsCg" target="_blank">Geektastic Profile</a>`);
  }

  function printResearch() {
    printLine(`<b>[RESEARCH & SCHOLARLY WORK]</b>`, 'system');
    printLine(`• <b>Primary Focus:</b> Software Engineering, Encrypted Traffic Analysis, and Applied AI in K-12 Education.`);
    printLine(`• <b>Academic Publications & Citation Index:</b>`);
    printLine(`  Visit Google Scholar for peer-reviewed papers:`);
    printLine(`  👉 <a href="https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ" target="_blank">https://scholar.google.com.ua/citations?user=hisJj1IAAAAJ</a>`);
  }

  function printTeaching() {
    printLine(`<b>[TEACHING & K-12 EDUCATION]</b>`, 'system');
    printLine(`• <b>Focus Areas:</b> AI Engineering Education (K-12), Informatics Curriculum, and Cybersecurity Awareness.`);
    printLine(`• <b>Educational Portal:</b> <a href="https://class.rmn.pp.ua/" target="_blank">https://class.rmn.pp.ua/</a>`);
    printLine(`• <b>AI Engineering Methodological Materials:</b> <a href="https://class.rmn.pp.ua/method" target="_blank">https://class.rmn.pp.ua/method</a>`);
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

  function executeCommand(rawInput) {
    printLine(`<span style="color: var(--prompt-color)">[guest@rmn.pp.ua ~]$</span> ${escapeHtml(rawInput)}`, 'command-echo');
    
    // History
    state.history.push(rawInput);
    state.historyIndex = -1;

    const parts = rawInput.trim().split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (COMMANDS[cmdName]) {
      playEnterChime();
      COMMANDS[cmdName].action(args);
    } else {
      playErrorTone();
      printLine(`Command not found: <b>${escapeHtml(cmdName)}</b>. Type <b style="color: var(--text-bright)">help</b> for a list of available commands.`, 'error');
    }
  }

  function handleAutocomplete() {
    const val = inputEl.value.trim().toLowerCase();
    if (!val) return;

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

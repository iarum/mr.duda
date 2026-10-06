(() => {
  const $ = id => document.getElementById(id);
  const chat = $('chat');
  const input = $('input');
  const sendBtn = $('sendBtn');
  const quick = $('quickActions');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let busy = false;

  // ---------- Interface language ----------
  // Static page text is tagged in index.html; this fills it in the current language.
  function applyI18n() {
    document.documentElement.lang = lang();
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-label]').forEach(el => {
      el.title = t(el.dataset.i18nLabel);
      el.setAttribute('aria-label', t(el.dataset.i18nLabel));
    });
  }

  function setLang(id) {
    Settings.save({ ...Settings.load(), lang: id });
    applyI18n();
  }

  // ---------- Rendering ----------
  // Wrap runs of Georgian script so they get the Georgian font.
  const GEO_RUN = /[Ⴀ-ჿᲐ-Ჿ]+(?:[\s,.!?…'’-]+[Ⴀ-ჿᲐ-Ჿ]+)*/g;
  const wrapGeorgian = html => html.replace(GEO_RUN, m => `<span class="ka">${m}</span>`);

  function chip(a) {
    const cls = `chip${a.ka ? ' ka' : ''}`;
    if (a.add) {
      const added = SRS.has(a.add.ka);
      return `<button class="${cls}${added ? ' added' : ''}" data-add='${esc(JSON.stringify(a.add))}'>` +
        `${icon(added ? 'check' : 'plus')}<span>${esc(added ? t('saved', { x: a.add.ka }) : a.label)}</span></button>`;
    }
    return `<button class="${cls}" data-send="${esc(a.send)}">${a.icon ? icon(a.icon) : ''}<span>${esc(a.label)}</span></button>`;
  }

  function actionsHtml(actions) {
    if (!actions?.length) return '';
    return `<div class="actions">${actions.map(chip).join('')}</div>`;
  }

  function bubble(role, html, extra = '') {
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerHTML = html + extra;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
  }

  // ---------- Chat ----------
  const log = {
    load: () => Store.get('chat', []),
    save: l => Store.set('chat', l.slice(-200)),
  };

  function render() {
    chat.innerHTML = '';
    const l = log.load();
    if (!l.length) {
      l.push(...Offline.welcome().map(m => ({ role: 'bot', ...m })));
      log.save(l);
    }
    l.forEach((m, i) => bubble(m.role, m.html, i === l.length - 1 ? actionsHtml(m.actions) : ''));
    quick.innerHTML = Offline.mainActions().map(chip).join('');
  }

  async function send(text) {
    text = text.trim();
    if (!text || busy) return;
    input.value = '';
    chat.querySelectorAll('.msg .actions').forEach(a => a.remove()); // old buttons are stale
    const userMsg = { role: 'user', html: wrapGeorgian(esc(text)) };
    bubble('user', userMsg.html);
    let replies = Offline.reply(text);
    if (replies instanceof Promise) {
      // Online lookup: show an indicator while it loads.
      const typing = bubble('bot typing', esc(t('translating')));
      setBusy(true);
      try { replies = await replies; } finally { typing.remove(); setBusy(false); }
    }
    const l = log.load();
    l.push(userMsg);
    replies.forEach((r, i) => {
      l.push({ role: 'bot', ...r });
      bubble('bot', r.html, i === replies.length - 1 ? actionsHtml(r.actions) : '');
    });
    log.save(l);
  }

  function setBusy(b) {
    busy = b;
    sendBtn.disabled = b;
  }

  // ---------- Text to speech (browser built-in, free) ----------
  let kaVoice = null;
  function pickVoice() {
    kaVoice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('ka')) || null;
    document.body.classList.toggle('no-tts', !kaVoice);
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.addEventListener('voiceschanged', pickVoice);
  } else {
    document.body.classList.add('no-tts');
  }
  function speak(text) {
    if (!kaVoice) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/…/g, ''));
    u.voice = kaVoice;
    u.lang = kaVoice.lang;
    u.rate = 0.85;
    speechSynthesis.speak(u);
  }

  // ---------- Events ----------
  $('composer').addEventListener('submit', e => { e.preventDefault(); send(input.value); });

  document.addEventListener('click', e => {
    const sendEl = e.target.closest('[data-send]');
    if (sendEl) return send(sendEl.dataset.send);
    const speakEl = e.target.closest('[data-speak]');
    if (speakEl) return speak(speakEl.dataset.speak);
    const addEl = e.target.closest('[data-add]');
    if (addEl && !addEl.classList.contains('added')) {
      const card = JSON.parse(addEl.dataset.add);
      SRS.add(card);
      addEl.classList.add('added');
      addEl.innerHTML = `${icon('check')}<span>${esc(t('saved', { x: card.ka }))}</span>`;
    }
  });

  // ---------- Theme colour ----------
  const PRESETS = ['#eab308', '#f97316', '#dc2626', '#db2777', '#7c3aed', '#2563eb', '#0284c7', '#0d9488', '#16a34a'];
  const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const rgbToHex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, k) => rgbToHex(hexToRgb(a).map((v, i) => v + (hexToRgb(b)[i] - v) * k));
  // WCAG relative luminance, used to pick readable text on the accent colour.
  const luminance = h => {
    const [r, g, b] = hexToRgb(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const textOn = c => (contrast(c, '#1f1b16') >= contrast(c, '#ffffff') ? '#1f1b16' : '#ffffff');

  // One picked colour drives the light and dark variants.
  function applyAccent(color) {
    const dark = luminance(color) < 0.18 ? mix(color, '#ffffff', 0.25) : color; // lift dark colours on dark backgrounds
    let style = $('accentStyle');
    if (!style) {
      style = document.createElement('style');
      style.id = 'accentStyle';
      document.head.appendChild(style);
    }
    style.textContent =
      `:root { --accent: ${color}; --on-accent: ${textOn(color)}; --accent-soft: ${mix(color, '#ffffff', 0.8)}; }\n` +
      `@media (prefers-color-scheme: dark) { :root { --accent: ${dark}; --on-accent: ${textOn(dark)}; --accent-soft: ${mix(dark, '#15130f', 0.75)}; } }`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  }

  const presetSwatches = current => PRESETS.map(c =>
    `<button type="button" class="swatch preset${c === current ? ' selected' : ''}" data-color="${c}" style="background:${c};color:${textOn(c)}" aria-label="${c}">` +
    `${c === current ? icon('check') : ''}</button>`).join('');

  function renderSwatches() {
    const current = Settings.load().accent;
    $('swatches').querySelectorAll('.preset').forEach(b => b.remove());
    $('swatches').insertAdjacentHTML('afterbegin', presetSwatches(current));
    const custom = $('customColor').parentElement;
    custom.classList.toggle('selected', !PRESETS.includes(current));
    custom.style.background = PRESETS.includes(current) ? '' : current;
    $('customColor').value = current;
  }

  function setAccent(color) {
    Settings.save({ ...Settings.load(), accent: color });
    applyAccent(color);
    renderSwatches();
  }

  $('swatches').addEventListener('click', e => {
    const b = e.target.closest('.preset');
    if (b) setAccent(b.dataset.color);
  });
  $('customColor').addEventListener('input', e => setAccent(e.target.value));

  // ---------- Segmented pickers (language, mood) ----------
  const segmented = (items, current, attr) => items.map(m =>
    `<button type="button" role="radio" aria-checked="${m.id === current}" class="${m.id === current ? 'selected' : ''}" ${attr}="${m.id}">` +
    `${m.icon ? icon(m.icon) : ''}<span>${esc(m.label)}</span></button>`).join('');

  function renderMoods() {
    $('moodPicker').innerHTML = segmented(Mood.list(), Mood.current(), 'data-mood');
  }
  $('moodPicker').addEventListener('click', e => {
    const b = e.target.closest('[data-mood]');
    if (!b) return;
    Settings.save({ ...Settings.load(), mood: b.dataset.mood });
    renderMoods();
  });

  function renderLangs() {
    $('langPicker').innerHTML = segmented(LANGS, lang(), 'data-lang');
  }
  $('langPicker').addEventListener('click', e => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    setLang(b.dataset.lang);
    renderSettings();
    quick.innerHTML = Offline.mainActions().map(chip).join('');
  });

  // ---------- First-launch setup wizard ----------
  // Four steps - language, name, mood, colour - each with a live preview.
  // Language applies immediately (the wizard switches to it); the rest is saved on "start".
  const wizard = { step: 0, name: '', mood: 'friendly', accent: PRESETS[0] };
  const STEPS = 4;

  function openSetup() {
    const s = Settings.load();
    Object.assign(wizard, { step: 0, name: s.name, mood: s.mood, accent: s.accent });
    $('setup').hidden = false;
    renderSetup();
  }

  function namePreview() {
    const name = wizard.name.trim();
    if (!name) return esc(t('canSkip'));
    const p = pron('მე მქვია', 'me mkvia');
    return t('nameInGeorgian', {
      ka: `<span class="ka">მე მქვია ${esc(name)}</span> <span class="tr">${esc(p)} ${esc(name)}</span>`,
      name: esc(name),
    });
  }

  function renderSetup() {
    const { step } = wizard;
    let body;
    if (step === 0) {
      body = `<h2>${icon('languages')} ${t('setupLangTitle')}</h2>
        <p>${t('setupLangText')}</p>
        <div class="mood-cards">${LANGS.map(l =>
          `<button type="button" class="mood-card lang-card${l.id === lang() ? ' selected' : ''}" data-setup-lang="${l.id}"><b>${esc(l.label)}</b></button>`).join('')}</div>`;
    } else if (step === 1) {
      body = `<h2>გამარჯობა! <span class="tr">${esc(pron('გამარჯობა', 'gamarjoba'))}</span></h2>
        <p>${t('setupNameText')}</p>
        <input id="setupName" maxlength="30" autocomplete="given-name" placeholder="${esc(t('yourName'))}" value="${esc(wizard.name)}">
        <p class="setup-preview-line" id="namePreview">${namePreview()}</p>`;
    } else if (step === 2) {
      body = `<h2>${t('setupMoodTitle')}</h2>
        <p>${t('setupMoodText')}</p>
        <div class="mood-cards">${Mood.list().map(m =>
          `<button type="button" class="mood-card${m.id === wizard.mood ? ' selected' : ''}" data-setup-mood="${m.id}">
            ${icon(m.icon)}<b>${esc(m.label)}</b><span>${esc(m.sample)}</span></button>`).join('')}</div>`;
    } else {
      const hello = `გამარჯობა${wizard.name.trim() ? `, ${esc(wizard.name.trim())}` : ''}!`;
      body = `<h2>${t('setupColourTitle')}</h2>
        <p>${t('setupColourText')}</p>
        <div class="swatches">${presetSwatches(wizard.accent)}
          <label class="swatch custom${PRESETS.includes(wizard.accent) ? '' : ' selected'}" title="${esc(t('customColour'))}"
            ${PRESETS.includes(wizard.accent) ? '' : `style="background:${wizard.accent}"`}>
            <input type="color" id="setupCustom" value="${wizard.accent}" aria-label="${esc(t('customColour'))}">
          </label></div>
        <div class="setup-chat">
          <div class="msg bot"><span class="ka">${hello}</span></div>
          <div class="msg user">გამარჯობა!</div>
        </div>`;
    }
    const last = step === STEPS - 1;
    const nextLabel = last ? t('start') : step === 1 && !wizard.name.trim() ? t('skip') : t('next');
    $('setup').innerHTML = `<div class="setup-card" role="dialog" aria-modal="true">
      <div class="setup-dots">${Array.from({ length: STEPS }, (_, i) => `<span class="${i === step ? 'on' : ''}"></span>`).join('')}</div>
      ${body}
      <div class="setup-nav">
        ${step > 0 ? `<button type="button" class="secondary" data-setup-back>${icon('arrow-left')}<span>${esc(t('back'))}</span></button>` : '<span></span>'}
        <button type="button" class="primary" id="setupNext" data-setup-next>${esc(nextLabel)}</button>
      </div></div>`;
    if (step === 1) $('setupName').focus();
  }

  function finishSetup() {
    Settings.save({ ...Settings.load(), name: wizard.name.trim().slice(0, 30), mood: wizard.mood, accent: wizard.accent, setupDone: true });
    applyAccent(wizard.accent);
    $('setup').hidden = true;
    Store.remove('chat'); // start the chat fresh, greeted in the chosen language and mood
    render();
    input.focus();
  }

  function setupNext() {
    if (wizard.step === STEPS - 1) return finishSetup();
    wizard.step++;
    renderSetup();
  }

  function setupColor(color) {
    wizard.accent = color;
    applyAccent(color); // preview live; saved on finish
    renderSetup();
  }

  $('setup').addEventListener('click', e => {
    if (e.target.closest('[data-setup-next]')) return setupNext();
    if (e.target.closest('[data-setup-back]')) { wizard.step--; return renderSetup(); }
    const langBtn = e.target.closest('[data-setup-lang]');
    if (langBtn) { setLang(langBtn.dataset.setupLang); return renderSetup(); }
    const mood = e.target.closest('[data-setup-mood]');
    if (mood) { wizard.mood = mood.dataset.setupMood; return renderSetup(); }
    const color = e.target.closest('.preset');
    if (color) setupColor(color.dataset.color);
  });
  $('setup').addEventListener('input', e => {
    if (e.target.id === 'setupName') {
      wizard.name = e.target.value;
      $('namePreview').innerHTML = namePreview();
      $('setupNext').textContent = wizard.name.trim() ? t('next') : t('skip');
    } else if (e.target.id === 'setupCustom') {
      wizard.accent = e.target.value;
      applyAccent(wizard.accent);
    }
  });
  // The colour picker fires 'change' once the native dialog closes; re-render to mark it selected.
  $('setup').addEventListener('change', e => { if (e.target.id === 'setupCustom') setupColor(e.target.value); });
  $('setup').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'setupName') setupNext(); });

  // ---------- My words ----------
  // Every word being learned: lesson words you've opened plus ones you saved.
  // Newest first; a dot shows how well each one is known (0–5 correct reviews in a row).
  function renderWords() {
    const words = SRS.all().reverse();
    $('wordCount').textContent = words.length;
    $('wordList').innerHTML = words.length
      ? words.map(w =>
        `<li><span class="strength" style="--level:${w.box}" title="${esc(t('learned', { n: w.box }))}"></span>` +
        `<span class="ka">${esc(w.ka)}</span><span class="en">${esc(meaning(w))}</span>` +
        `<button type="button" class="remove" data-remove="${esc(w.ka)}" title="${esc(t('remove'))}" aria-label="${esc(t('remove'))} ${esc(w.ka)}">${icon('x')}</button></li>`).join('')
      : `<li class="empty">${esc(t('noWords'))}</li>`;
  }
  $('wordList').addEventListener('click', e => {
    const b = e.target.closest('[data-remove]');
    if (!b) return;
    SRS.remove(b.dataset.remove);
    renderWords();
  });

  // ---------- Settings dialog ----------
  const dlg = $('settings');
  function renderSettings() {
    $('showTranslit').checked = Settings.load().showTranslit;
    $('userName').value = Settings.load().name;
    renderLangs();
    renderMoods();
    renderSwatches();
    renderWords();
  }
  $('settingsBtn').addEventListener('click', () => {
    renderSettings();
    dlg.showModal();
  });
  $('showTranslit').addEventListener('change', e => {
    Settings.save({ ...Settings.load(), showTranslit: e.target.checked });
  });
  $('userName').addEventListener('change', e => {
    Settings.save({ ...Settings.load(), name: e.target.value.trim().slice(0, 30) });
  });
  $('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(Store.exportAll(), null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob), download: `mr-duda-backup-${new Date().toISOString().slice(0, 10)}.json`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $('importBtn').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      Store.importAll(JSON.parse(await file.text()));
      dlg.close();
      render();
    } catch {
      $('importBtn').textContent = t('invalidFile');
    }
    e.target.value = '';
  });
  let resetArmed = false;
  $('resetBtn').addEventListener('click', e => {
    // Two-click confirm instead of a blocking confirm() dialog.
    if (!resetArmed) {
      resetArmed = true;
      e.target.textContent = t('confirmReset');
      setTimeout(() => { resetArmed = false; e.target.textContent = t('reset'); }, 3000);
      return;
    }
    Store.clearAll();
    applyAccent(Settings.load().accent);
    applyI18n();
    dlg.close();
    render();
    openSetup();
  });

  // ---------- Start ----------
  // Drop data left over from removed features.
  ['ai', 'offlineChat', 'askName'].forEach(k => Store.remove(k));
  // People who already set a name before the wizard existed don't need it.
  if (!Settings.load().setupDone && Settings.load().name) Settings.save({ ...Settings.load(), setupDone: true });

  // Static icons in the page (logo, settings button).
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  applyI18n();
  applyAccent(Settings.load().accent);

  // Install as an app + offline support. Both only work over http(s): opened as a
  // local file (file://) the browser blocks them, so skip them instead of logging errors.
  if (location.protocol.startsWith('http')) {
    document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'manifest', href: 'manifest.webmanifest' }));
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(e => console.warn('Service worker failed', e));
    }
  }

  render();
  if (Settings.load().setupDone) input.focus();
  else openSetup();
})();

/* ==========================================================================
   Folio — CV editor (no dependencies)

   Sections follow flow v4: Personal → About me → Education → Experience →
   Skills. Users can jump to any section and skip any of them.

   Guests: the draft is saved in this browser (localStorage) from the first
   change. The status only says "saved" after the write really succeeded.
   ========================================================================== */

(function () {
  "use strict";

  var DRAFT_KEY = "folio:draft";
  var SAVE_DELAY = 400;

  // Order matches the flow diagram. `built: false` shows a placeholder panel.
  var SECTIONS = [
    { id: "personal", label: "Personal details", built: true },
    { id: "about", label: "About me", built: true },
    { id: "education", label: "Education", built: true },
    { id: "experience", label: "Experience", built: true },
    { id: "skills", label: "Skills", built: true, optional: true }
  ];

  // Shown after the last section; "Custom" comes after Skills in the flow.
  var AFTER_LAST = "Next in the flow: custom sections like hobbies (not built yet).";

  // Sections whose draft data is a list: { items: [...] }
  var LIST_SECTIONS = ["education", "experience", "skills"];

  // Sections whose draft data is a set of fields: { name: "...", ... }
  var FIELD_SECTIONS = ["personal", "about"];

  // CV templates. The look of each one lives in cv-templates.css under
  // .cv-page[data-template="<id>"]. The first one is the default.
  var TEMPLATES = [
    { id: "modern", name: "Modern" },
    { id: "classic", name: "Classic" },
    { id: "minimal", name: "Minimal" }
  ];

  var LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
  var MAX_SKILLS = 30;

  /* ------------------------------------------------------------------------
     Draft storage
     ------------------------------------------------------------------------ */

  function templateById(id) {
    for (var i = 0; i < TEMPLATES.length; i++) if (TEMPLATES[i].id === id) return TEMPLATES[i];
    return null;
  }

  function emptyDraft() {
    var draft = { version: 1, updatedAt: null, template: TEMPLATES[0].id, sections: {} };
    LIST_SECTIONS.forEach(function (id) {
      draft.sections[id] = { items: [] };
    });
    FIELD_SECTIONS.forEach(function (id) {
      draft.sections[id] = {};
    });
    return draft;
  }

  function loadDraft() {
    var draft = emptyDraft();
    try {
      var stored = JSON.parse(window.localStorage.getItem(DRAFT_KEY));
      if (stored && stored.sections) {
        draft.updatedAt = stored.updatedAt || null;
        if (templateById(stored.template)) draft.template = stored.template;
        Object.keys(stored.sections).forEach(function (id) {
          draft.sections[id] = stored.sections[id];
        });
      }
    } catch (error) {
      // No storage or unreadable draft: start with an empty CV.
    }
    LIST_SECTIONS.forEach(function (id) {
      var section = draft.sections[id];
      if (!section || !Array.isArray(section.items)) draft.sections[id] = { items: [] };
    });
    FIELD_SECTIONS.forEach(function (id) {
      var fields = draft.sections[id];
      if (!fields || typeof fields !== "object" || Array.isArray(fields)) draft.sections[id] = {};
    });
    return draft;
  }

  var draft = loadDraft();
  var saveTimer = null;

  var saveStatus = document.querySelector("[data-save-status]");
  var saveHint = document.querySelector("[data-save-hint]");
  var saveRetry = document.querySelector("[data-save-retry]");
  var saveBox = document.querySelector("[data-save]");

  function setSaveState(state) {
    saveBox.dataset.state = state;
    saveHint.hidden = state !== "saved";
    saveRetry.hidden = state !== "error";
    saveStatus.textContent = {
      saving: "Saving…",
      saved: "Draft saved on this device",
      error: "Couldn't save your draft. Your changes are still here."
    }[state];
  }

  function writeDraft() {
    window.clearTimeout(saveTimer);
    saveTimer = null;
    try {
      draft.updatedAt = new Date().toISOString();
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setSaveState("saved");
    } catch (error) {
      setSaveState("error");
    }
  }

  // Saving runs in the background after every change.
  function scheduleSave() {
    setSaveState("saving");
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(writeDraft, SAVE_DELAY);
  }

  // Leaving the page (reload, close, a link) right after typing would skip
  // the delayed save, so write any pending change straight away.
  function flushSave() {
    if (saveTimer) writeDraft();
  }

  window.addEventListener("pagehide", flushSave);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flushSave();
  });

  saveRetry.addEventListener("click", writeDraft);
  if (draft.updatedAt) setSaveState("saved");

  /* ------------------------------------------------------------------------
     Section navigation
     ------------------------------------------------------------------------ */

  var editor = document.querySelector("[data-editor]");
  var nav = document.querySelector("[data-section-nav]");
  var picker = document.querySelector("[data-section-picker]");
  var placeholderPanel = document.querySelector('[data-panel="placeholder"]');
  var placeholderTitle = document.querySelector("[data-placeholder-title]");
  var prevLink = document.querySelector('[data-step="prev"]');
  var nextLink = document.querySelector('[data-step="next"]');
  var stepNote = document.querySelector("[data-step-note]");
  var current = null;

  function sectionById(id) {
    for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].id === id) return SECTIONS[i];
    return null;
  }

  function sectionUrl(id) {
    return "?section=" + encodeURIComponent(id);
  }

  // Field sections get a check mark once their main field has text.
  function isFilledIn(id) {
    var mainField = { personal: "name", about: "text" }[id];
    return !!mainField && !!(draft.sections[id][mainField] || "").trim();
  }

  function countFor(section) {
    var data = draft.sections[section.id];
    return data && Array.isArray(data.items) ? data.items.length : 0;
  }

  function renderNav() {
    nav.innerHTML = "";
    picker.innerHTML = "";

    SECTIONS.forEach(function (section, index) {
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.className = "ed-nav__link";
      link.href = sectionUrl(section.id);
      link.dataset.section = section.id;
      if (section.id === current) link.setAttribute("aria-current", "step");

      var number = document.createElement("span");
      number.className = "ed-nav__num";
      number.setAttribute("aria-hidden", "true");
      number.textContent = index + 1;

      var label = document.createElement("span");
      label.className = "ed-nav__label";
      label.textContent = section.label;

      link.appendChild(number);
      link.appendChild(label);

      var count = countFor(section);
      if (!section.built) {
        link.appendChild(tag("Soon", "ed-tag ed-tag--muted"));
      } else if (isFilledIn(section.id)) {
        link.appendChild(tag("✓", "ed-tag", "Filled in"));
      } else if (count) {
        link.appendChild(tag(String(count), "ed-tag", count + " added"));
      } else if (section.optional) {
        link.appendChild(tag("Optional", "ed-tag ed-tag--muted"));
      }

      item.appendChild(link);
      nav.appendChild(item);

      var option = document.createElement("option");
      option.value = section.id;
      option.textContent = index + 1 + ". " + section.label + (section.built ? "" : " (soon)");
      option.selected = section.id === current;
      picker.appendChild(option);
    });
  }

  function tag(text, className, label) {
    var el = document.createElement("span");
    el.className = className;
    el.textContent = text;
    if (label) {
      el.setAttribute("aria-label", label);
    }
    return el;
  }

  function setStep(link, section, prefix) {
    link.hidden = !section;
    if (!section) return;
    link.href = sectionUrl(section.id);
    link.dataset.section = section.id;
    link.textContent = prefix + section.label;
  }

  function showSection(id, options) {
    var section = sectionById(id) || SECTIONS[0];
    current = section.id;

    document.querySelectorAll("[data-panel]").forEach(function (panel) {
      panel.hidden = true;
    });
    var panel = section.built ? document.querySelector('[data-panel="' + section.id + '"]') : placeholderPanel;
    if (!section.built) placeholderTitle.textContent = section.label;
    panel.hidden = false;

    var index = SECTIONS.indexOf(section);
    setStep(prevLink, SECTIONS[index - 1], "← ");
    setStep(nextLink, SECTIONS[index + 1], "Next: ");
    stepNote.hidden = index !== SECTIONS.length - 1;
    stepNote.textContent = AFTER_LAST;

    document.title = section.label + " · Edit CV · Folio";
    renderNav();

    if (options && options.push) {
      window.history.pushState({ section: section.id }, "", sectionUrl(section.id));
    }
    if (options && options.focus) {
      var heading = panel.querySelector(".ed-title");
      if (heading) heading.focus();
    }
  }

  // Any link with data-section switches panels without reloading the page.
  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[data-section]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    setMode("edit");
    showSection(link.dataset.section, { push: true, focus: true });
  });

  picker.addEventListener("change", function () {
    showSection(picker.value, { push: true });
  });

  window.addEventListener("popstate", function () {
    showSection(new URLSearchParams(window.location.search).get("section"));
  });

  /* ------------------------------------------------------------------------
     Edit / Preview toggle (tablet and mobile). Switching never loses changes:
     both views read from the same draft.
     ------------------------------------------------------------------------ */

  var modeButtons = document.querySelectorAll("[data-mode-button]");

  function setMode(mode) {
    editor.dataset.mode = mode;
    modeButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.modeButton === mode ? "true" : "false");
    });
    if (mode === "preview") fitPreview();
  }

  modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setMode(button.dataset.modeButton);
    });
  });

  /* ------------------------------------------------------------------------
     Skills
     ------------------------------------------------------------------------ */

  var skillForm = document.querySelector("[data-skill-form]");
  var skillName = document.getElementById("skill-name");
  var skillLevel = document.getElementById("skill-level");
  var skillError = document.getElementById("skill-error");
  var skillList = document.querySelector("[data-skill-list]");
  var skillEmpty = document.querySelector("[data-skill-empty]");
  var skillCount = document.querySelector("[data-skill-count]");
  var previewList = document.querySelector("[data-preview-skill-list]");
  var previewEmpty = document.querySelector("[data-preview-skill-empty]");

  function skills() {
    return draft.sections.skills.items;
  }

  function fillLevelOptions(select, selected) {
    select.innerHTML = "";
    [""].concat(LEVELS).forEach(function (level) {
      var option = document.createElement("option");
      option.value = level;
      option.textContent = level || "No level";
      option.selected = level === (selected || "");
      select.appendChild(option);
    });
  }

  function setSkillError(message) {
    skillError.textContent = message || "";
    skillError.hidden = !message;
    if (message) skillName.setAttribute("aria-invalid", "true");
    else skillName.removeAttribute("aria-invalid");
  }

  function renderSkills() {
    var items = skills();
    skillList.innerHTML = "";
    previewList.innerHTML = "";

    items.forEach(function (skill, index) {
      // Editor row
      var row = document.createElement("li");
      row.className = "skill-item";

      var name = document.createElement("span");
      name.className = "skill-item__name";
      name.textContent = skill.name;

      var level = document.createElement("select");
      level.className = "ed-select ed-select--compact";
      level.setAttribute("aria-label", "Level for " + skill.name);
      fillLevelOptions(level, skill.level);
      level.addEventListener("change", function () {
        skill.level = level.value;
        renderPreviewOnly();
        scheduleSave();
      });

      var moveUp = iconButton("↑", "Move " + skill.name + " up", index === 0, function () {
        moveSkill(index, -1);
      });
      var moveDown = iconButton("↓", "Move " + skill.name + " down", index === items.length - 1, function () {
        moveSkill(index, 1);
      });
      var remove = iconButton("×", "Remove " + skill.name, false, function () {
        items.splice(index, 1);
        update();
        // Keep keyboard focus nearby after the row disappears.
        var rows = skillList.querySelectorAll(".skill-item__remove");
        (rows[index] || rows[index - 1] || skillName).focus();
      });
      remove.classList.add("skill-item__remove");

      row.appendChild(name);
      row.appendChild(level);
      row.appendChild(moveUp);
      row.appendChild(moveDown);
      row.appendChild(remove);
      skillList.appendChild(row);
    });

    skillEmpty.hidden = items.length > 0;
    skillCount.textContent = items.length ? "Your skills (" + items.length + ")" : "Your skills";
    renderPreviewOnly();
  }

  function renderPreviewOnly() {
    previewList.innerHTML = "";
    skills().forEach(function (skill) {
      var chip = document.createElement("li");
      chip.className = "cv-page__skill";
      chip.textContent = skill.name;
      if (skill.level) {
        var level = document.createElement("span");
        level.className = "cv-page__level";
        level.textContent = skill.level;
        chip.appendChild(level);
      }
      previewList.appendChild(chip);
    });
    previewEmpty.hidden = skills().length > 0;
  }

  function iconButton(text, label, disabled, onClick) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "ed-icon-btn";
    button.textContent = text;
    button.setAttribute("aria-label", label);
    button.disabled = disabled;
    button.addEventListener("click", onClick);
    return button;
  }

  // After a move, keep focus on the same move button so it can be pressed
  // again. At the top or bottom that button is disabled, so use the other
  // move button; never fall through to Remove, where one more Enter deletes.
  function focusMoveButton(buttons, delta) {
    var same = delta < 0 ? buttons[0] : buttons[1];
    var other = delta < 0 ? buttons[1] : buttons[0];
    (same.disabled ? other : same).focus();
  }

  function moveSkill(index, delta) {
    var items = skills();
    var target = index + delta;
    var moved = items.splice(index, 1)[0];
    items.splice(target, 0, moved);
    update();
    var buttons = skillList.querySelectorAll(".skill-item")[target].querySelectorAll(".ed-icon-btn");
    focusMoveButton(buttons, delta);
  }

  function update() {
    renderSkills();
    renderNav();
    scheduleSave();
  }

  skillForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = skillName.value.replace(/\s+/g, " ").trim();

    if (!name) {
      setSkillError("Enter a skill, for example Figma or Teamwork.");
      skillName.focus();
      return;
    }
    var duplicate = skills().filter(function (skill) {
      return skill.name.toLowerCase() === name.toLowerCase();
    })[0];
    if (duplicate) {
      setSkillError("You already added " + duplicate.name + ".");
      skillName.focus();
      return;
    }
    if (skills().length >= MAX_SKILLS) {
      setSkillError("You can add up to " + MAX_SKILLS + " skills. Remove one to add another.");
      return;
    }

    setSkillError("");
    skills().push({ id: Date.now().toString(36), name: name, level: skillLevel.value });
    skillName.value = "";
    skillLevel.value = "";
    skillName.focus();
    update();
  });

  skillName.addEventListener("input", function () {
    if (skillName.getAttribute("aria-invalid") === "true") setSkillError("");
  });

  /* ------------------------------------------------------------------------
     Personal details: plain fields that fill the top of the CV. Messages
     appear when leaving a field, never while typing, and never block saving.
     ------------------------------------------------------------------------ */

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var URL_PATTERN = /^(https?:\/\/)?[^\s\/.]+(\.[^\s\/.]+)*\.[a-z]{2,}(\/\S*)?$/i;

  // "https://www.example.com/" → "example.com" for display on the CV.
  function displayUrl(value) {
    return value.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "");
  }

  var PERSONAL_CHECKS = {
    name: function (value) {
      return value ? "" : "Enter your full name. It goes at the top of your CV.";
    },
    email: function (value) {
      return !value || EMAIL_PATTERN.test(value) ? "" : "Enter an email address like name@example.com.";
    },
    phone: function (value) {
      var digits = value.replace(/\D/g, "").length;
      var ok = !value || (/^[+()\-.\s\d]+$/.test(value) && digits >= 6 && digits <= 15);
      return ok ? "" : "Enter a phone number with digits only, for example +31 6 12345678.";
    },
    linkedin: function (value) {
      if (!value) return "";
      var ok = URL_PATTERN.test(value) && /(^|\.|\/\/)linkedin\.com\//i.test(value);
      return ok ? "" : "Enter your LinkedIn link, for example linkedin.com/in/your-name.";
    },
    website: function (value) {
      return !value || URL_PATTERN.test(value) ? "" : "Enter a web address, for example yourname.com.";
    }
  };

  var personalInputs = document.querySelectorAll("[data-personal]");
  var previewName = document.querySelector("[data-preview-name]");
  var previewTitle = document.querySelector("[data-preview-title]");
  var previewContact = document.querySelector("[data-preview-contact]");

  function personal() {
    return draft.sections.personal;
  }

  function personalValue(key) {
    return (personal()[key] || "").trim();
  }

  function setPersonalError(input, message) {
    var error = document.getElementById(input.id + "-error");
    error.textContent = message || "";
    error.hidden = !message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function checkPersonal(input) {
    var check = PERSONAL_CHECKS[input.dataset.personal];
    setPersonalError(input, check ? check(input.value.trim()) : "");
  }

  function setPreviewLine(node, value, placeholder) {
    node.textContent = value || placeholder;
    node.classList.toggle("is-placeholder", !value);
  }

  function renderPersonalPreview() {
    setPreviewLine(previewName, personalValue("name"), "Your name");
    setPreviewLine(previewTitle, personalValue("title"), "Job title");

    previewContact.innerHTML = "";
    [
      personalValue("email"),
      personalValue("phone"),
      personalValue("city"),
      displayUrl(personalValue("linkedin")),
      displayUrl(personalValue("website"))
    ].filter(Boolean).forEach(function (text) {
      var item = document.createElement("li");
      item.textContent = text;
      previewContact.appendChild(item);
    });
    previewContact.hidden = !previewContact.children.length;
  }

  personalInputs.forEach(function (input) {
    var key = input.dataset.personal;
    input.value = personal()[key] || "";

    input.addEventListener("input", function () {
      var hadName = !!personalValue("name");
      input.dataset.touched = "true";
      personal()[key] = input.value;
      // Clear a message as soon as the value is fixed; new ones wait for blur.
      if (input.getAttribute("aria-invalid") === "true") checkPersonal(input);
      renderPersonalPreview();
      if (key === "name" && hadName !== !!personalValue("name")) renderNav();
      scheduleSave();
    });

    input.addEventListener("blur", function () {
      // An untouched, empty name is fine until the user has typed something.
      if (key === "name" && !input.value && !input.dataset.touched) return;
      checkPersonal(input);
    });
  });

  // Show messages for saved values that are not valid (for example after a reload).
  personalInputs.forEach(function (input) {
    if (input.value) checkPersonal(input);
  });

  /* ------------------------------------------------------------------------
     About me: one short introduction under the name on the CV.
     The counter is advice, not a rule: only the hard maximum stops typing.
     ------------------------------------------------------------------------ */

  var ABOUT_MAX = 700;
  var ABOUT_ADVICE = 450; // past this, suggest keeping it short

  var aboutInput = document.getElementById("about-text");
  var aboutCount = document.querySelector("[data-about-count]");
  var previewAbout = document.querySelector("[data-preview-about]");
  var previewAboutEmpty = document.querySelector("[data-preview-about-empty]");

  function aboutText() {
    return (draft.sections.about.text || "").trim();
  }

  function renderAboutCount() {
    var length = aboutInput.value.length;
    aboutCount.textContent = length + " / " + ABOUT_MAX;
    aboutCount.classList.toggle("is-long", length > ABOUT_ADVICE);
    aboutCount.title = length > ABOUT_ADVICE ? "Recruiters skim: 2 to 4 sentences works best." : "";
  }

  function renderAboutPreview() {
    previewAbout.textContent = aboutText();
    previewAbout.hidden = !aboutText();
    previewAboutEmpty.hidden = !!aboutText();
  }

  aboutInput.maxLength = ABOUT_MAX;
  aboutInput.value = draft.sections.about.text || "";
  renderAboutCount();

  aboutInput.addEventListener("input", function () {
    var wasFilled = !!aboutText();
    draft.sections.about.text = aboutInput.value;
    renderAboutCount();
    renderAboutPreview();
    if (wasFilled !== !!aboutText()) renderNav();
    scheduleSave();
  });

  /* ------------------------------------------------------------------------
     Entry lists (Education, Experience): a list of cards, each with
     a title, a place, start and end dates and an optional description.
     Typing updates the item and the preview without re-rendering the card,
     so focus and cursor position are never lost.
     ------------------------------------------------------------------------ */

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var THIS_YEAR = new Date().getFullYear();

  function formatDate(month, year) {
    if (!year) return "";
    return (month ? MONTHS[month - 1] + " " : "") + year;
  }

  function formatRange(item) {
    var start = formatDate(item.startMonth, item.startYear);
    var end = item.current ? "Present" : formatDate(item.endMonth, item.endYear);
    if (start && end) return start + " – " + end;
    if (end) return item.current ? "Present" : "Until " + end;
    return start;
  }

  // Compare as months since year 0; a missing start month counts as January,
  // a missing end month as December, so "2021 – 2021" is never an error.
  function endsBeforeStart(item) {
    if (item.current || !item.startYear || !item.endYear) return false;
    var start = item.startYear * 12 + (item.startMonth || 1);
    var end = item.endYear * 12 + (item.endMonth || 12);
    return end < start;
  }

  function hasContent(item) {
    return Object.keys(item).some(function (key) {
      return key !== "id" && key !== "current" && item[key];
    });
  }

  function el(tagName, className, text) {
    var node = document.createElement(tagName);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function dateSelect(id, label, placeholder, values, selected) {
    var select = el("select", "ed-select");
    select.id = id;
    select.setAttribute("aria-label", label);
    var blank = el("option", "", placeholder);
    blank.value = "";
    select.appendChild(blank);
    values.forEach(function (entry) {
      var option = el("option", "", entry.text);
      option.value = String(entry.value);
      option.selected = Number(selected) === entry.value;
      select.appendChild(option);
    });
    return select;
  }

  // One bullet per non-empty line; a single line stays a normal paragraph.
  function bulletList(text) {
    var lines = text.split(/\n+/).map(function (line) {
      return line.replace(/^\s*[-•*]\s*/, "").trim();
    }).filter(Boolean);
    if (lines.length < 2) return el("p", "cv-entry__desc", lines[0] || "");
    var list = el("ul", "cv-entry__bullets");
    lines.forEach(function (line) {
      list.appendChild(el("li", "", line));
    });
    return list;
  }

  var MONTH_OPTIONS = MONTHS.map(function (name, index) {
    return { value: index + 1, text: name };
  });

  var YEAR_OPTIONS = [];
  for (var y = THIS_YEAR + 6; y >= THIS_YEAR - 60; y--) YEAR_OPTIONS.push({ value: y, text: String(y) });

  function entrySection(cfg) {
    var panel = document.querySelector('[data-panel="' + cfg.id + '"]');
    var list = panel.querySelector("[data-entry-list]");
    var empty = panel.querySelector("[data-entry-empty]");
    var addButton = panel.querySelector("[data-entry-add]");
    var preview = document.querySelector('[data-preview-entries="' + cfg.id + '"]');
    var previewEmpty = document.querySelector('[data-preview-empty="' + cfg.id + '"]');
    var expanded = {};

    function items() {
      return draft.sections[cfg.id].items;
    }

    function headline(item) {
      return (item[cfg.titleField] || "").trim() || cfg.newTitle;
    }

    function summary(item) {
      return [item[cfg.placeField], formatRange(item)].filter(Boolean).join(" · ");
    }

    function changed() {
      renderPreview();
      scheduleSave();
    }

    function setError(input, errorEl, message) {
      errorEl.textContent = message || "";
      errorEl.hidden = !message;
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }

    function textField(item, field, baseId, onInput) {
      var wrap = el("div", "ed-field" + (field.wide ? " ed-field--wide" : ""));
      var id = baseId + "-" + field.name;
      var label = el("label", "ed-label", field.label);
      label.htmlFor = id;
      if (!field.required) label.appendChild(el("span", "ed-optional", " (optional)"));

      var input = el(field.multiline ? "textarea" : "input", field.multiline ? "ed-input ed-textarea" : "ed-input");
      input.id = id;
      if (!field.multiline) input.type = "text";
      input.value = item[field.name] || "";
      input.placeholder = field.placeholder || "";
      input.maxLength = field.maxLength || 120;
      if (field.multiline) input.rows = 4;

      var error = el("p", "ed-error");
      error.id = id + "-error";
      error.hidden = true;
      var describedBy = [error.id];
      var hint = null;
      if (field.hint) {
        hint = el("p", "ed-hint", field.hint);
        hint.id = id + "-hint";
        describedBy.unshift(hint.id);
      }
      input.setAttribute("aria-describedby", describedBy.join(" "));

      input.addEventListener("input", function () {
        item[field.name] = input.value;
        if (field.required && input.value.trim()) setError(input, error, "");
        onInput();
        changed();
      });
      if (field.required) {
        input.addEventListener("blur", function () {
          if (!input.value.trim()) setError(input, error, field.requiredMessage);
        });
      }

      wrap.appendChild(label);
      if (hint) wrap.appendChild(hint);
      wrap.appendChild(input);
      wrap.appendChild(error);
      return wrap;
    }

    function datesField(item, baseId, onInput) {
      var wrap = el("fieldset", "ed-dates ed-field--wide");
      wrap.appendChild(el("legend", "ed-label", "Dates"));

      var startMonth = dateSelect(baseId + "-start-month", "Start month", "Month", MONTH_OPTIONS, item.startMonth);
      var startYear = dateSelect(baseId + "-start-year", "Start year", "Year", YEAR_OPTIONS, item.startYear);
      var endMonth = dateSelect(baseId + "-end-month", "End month", "Month", MONTH_OPTIONS, item.endMonth);
      var endYear = dateSelect(baseId + "-end-year", "End year", "Year", YEAR_OPTIONS, item.endYear);

      var current = el("input", "ed-check__input");
      current.type = "checkbox";
      current.id = baseId + "-current";
      current.checked = !!item.current;
      var currentLabel = el("label", "ed-check");
      currentLabel.htmlFor = current.id;
      currentLabel.appendChild(current);
      currentLabel.appendChild(document.createTextNode(cfg.currentLabel));

      var error = el("p", "ed-error");
      error.id = baseId + "-dates-error";
      error.hidden = true;
      endYear.setAttribute("aria-describedby", error.id);

      function group(title, month, year) {
        var box = el("div", "ed-dates__group");
        box.appendChild(el("span", "ed-dates__label", title));
        var row = el("div", "ed-dates__row");
        row.appendChild(month);
        row.appendChild(year);
        box.appendChild(row);
        return box;
      }

      function sync() {
        item.startMonth = Number(startMonth.value) || null;
        item.startYear = Number(startYear.value) || null;
        item.current = current.checked;
        endMonth.disabled = endYear.disabled = current.checked;
        item.endMonth = current.checked ? null : Number(endMonth.value) || null;
        item.endYear = current.checked ? null : Number(endYear.value) || null;
        setError(endYear, error, endsBeforeStart(item) ? "The end date can't be before the start date." : "");
        onInput();
        changed();
      }

      [startMonth, startYear, endMonth, endYear, current].forEach(function (control) {
        control.addEventListener("change", sync);
      });
      endMonth.disabled = endYear.disabled = current.checked;
      if (endsBeforeStart(item)) {
        setError(endYear, error, "The end date can't be before the start date.");
      }

      wrap.appendChild(group("Start", startMonth, startYear));
      wrap.appendChild(group("End", endMonth, endYear));
      wrap.appendChild(currentLabel);
      wrap.appendChild(error);
      return wrap;
    }

    function card(item, index) {
      var all = items();
      var baseId = cfg.id + "-" + item.id;
      var isOpen = !!expanded[item.id];
      var li = el("li", "entry" + (isOpen ? " is-open" : ""));
      li.dataset.entryId = item.id;

      var head = el("div", "entry__head");
      var toggle = el("button", "entry__toggle");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (isOpen) toggle.setAttribute("aria-controls", baseId + "-body");
      var title = el("span", "entry__title", headline(item));
      var meta = el("span", "entry__meta", summary(item));
      toggle.appendChild(title);
      toggle.appendChild(meta);
      toggle.addEventListener("click", function () {
        expanded[item.id] = !expanded[item.id];
        render();
        focusEntry(item.id, "toggle");
      });

      var name = headline(item);
      head.appendChild(toggle);
      head.appendChild(iconButton("↑", "Move " + name + " up", index === 0, function () {
        move(index, -1);
      }));
      head.appendChild(iconButton("↓", "Move " + name + " down", index === all.length - 1, function () {
        move(index, 1);
      }));
      var remove = iconButton("×", "Remove " + name, false, function () {
        removeEntry(index);
      });
      remove.classList.add("skill-item__remove");
      head.appendChild(remove);
      li.appendChild(head);

      if (isOpen) {
        var body = el("div", "entry__body");
        body.id = baseId + "-body";
        var refreshHead = function () {
          title.textContent = headline(item);
          meta.textContent = summary(item);
        };
        cfg.fields.forEach(function (field) {
          body.appendChild(field.dates ? datesField(item, baseId, refreshHead) : textField(item, field, baseId, refreshHead));
        });
        var done = el("button", "ed-btn ed-btn--secondary entry__done", "Done");
        done.type = "button";
        done.addEventListener("click", function () {
          expanded[item.id] = false;
          render();
          focusEntry(item.id, "toggle");
        });
        body.appendChild(done);
        li.appendChild(body);
      }
      return li;
    }

    function focusEntry(id, target) {
      var li = list.querySelector('[data-entry-id="' + id + '"]');
      if (!li) return;
      var node = target === "first-field"
        ? li.querySelector(".entry__body input, .entry__body select")
        : li.querySelector(".entry__toggle");
      if (node) node.focus();
    }

    function move(index, delta) {
      var all = items();
      var moved = all.splice(index, 1)[0];
      all.splice(index + delta, 0, moved);
      render();
      renderPreview();
      scheduleSave();
      var buttons = list.querySelectorAll(".entry")[index + delta].querySelectorAll(".entry__head .ed-icon-btn");
      focusMoveButton(buttons, delta);
    }

    // Removing an entry that has content asks first; an empty one just goes.
    function removeEntry(index) {
      var item = items()[index];
      if (!hasContent(item)) {
        finishRemove(item);
        return;
      }
      var question = cfg.confirmRemove(headline(item));
      folioConfirm({
        title: question.title,
        message: question.message,
        confirmLabel: "Remove",
        cancelLabel: "Cancel"
      }).then(function (confirmed) {
        if (confirmed) {
          finishRemove(item);
        } else {
          // Back to the Remove button the user came from.
          var li = list.querySelector('[data-entry-id="' + item.id + '"]');
          var button = li && li.querySelector(".skill-item__remove");
          if (button) button.focus();
        }
      });
    }

    function finishRemove(item) {
      var all = items();
      var index = all.indexOf(item);
      if (index === -1) return;
      all.splice(index, 1);
      delete expanded[item.id];
      render();
      renderPreview();
      renderNav();
      scheduleSave();
      var rows = list.querySelectorAll(".entry__toggle");
      (rows[index] || rows[index - 1] || addButton).focus();
    }

    function render() {
      list.innerHTML = "";
      items().forEach(function (item, index) {
        list.appendChild(card(item, index));
      });
      empty.hidden = items().length > 0;
    }

    function renderPreview() {
      preview.innerHTML = "";
      items().forEach(function (item) {
        var heading = (item[cfg.titleField] || "").trim();
        var place = [item[cfg.placeField], item.city].map(function (part) {
          return (part || "").trim();
        }).filter(Boolean).join(", ");
        if (!heading && !place) return;

        var entry = el("div", "cv-entry");
        var top = el("div", "cv-entry__top");
        top.appendChild(el("p", "cv-entry__title", heading));
        top.appendChild(el("p", "cv-entry__dates", formatRange(item)));
        entry.appendChild(top);
        if (place) entry.appendChild(el("p", "cv-entry__sub", place));
        var description = (item.description || "").trim();
        if (description) entry.appendChild(cfg.bullets ? bulletList(description) : el("p", "cv-entry__desc", description));
        preview.appendChild(entry);
      });
      previewEmpty.hidden = preview.children.length > 0;
    }

    addButton.addEventListener("click", function () {
      var item = { id: Date.now().toString(36), current: false };
      items().push(item);
      expanded[item.id] = true;
      render();
      renderNav();
      scheduleSave();
      focusEntry(item.id, "first-field");
    });

    // A single saved entry opens straight away; with more, the list stays tidy.
    if (items().length === 1) expanded[items()[0].id] = true;

    return { render: render, renderPreview: renderPreview };
  }

  var education = entrySection({
    id: "education",
    titleField: "study",
    placeField: "school",
    newTitle: "New education",
    currentLabel: "I still study here",
    confirmRemove: function (name) {
      return {
        title: "Remove this education?",
        message: "\u201c" + name + "\u201d will be removed from your CV. This can't be undone."
      };
    },
    fields: [
      {
        name: "study",
        label: "Study or degree",
        required: true,
        requiredMessage: "Enter your study or degree, for example Bachelor Communication.",
        placeholder: "For example: Bachelor Communication and Multimedia Design",
        wide: true
      },
      {
        name: "school",
        label: "School",
        required: true,
        requiredMessage: "Enter the name of the school.",
        placeholder: "For example: Avans University"
      },
      { name: "city", label: "City", placeholder: "For example: Breda", maxLength: 60 },
      { dates: true },
      {
        name: "description",
        label: "Description",
        multiline: true,
        maxLength: 600,
        placeholder: "Relevant courses, projects or results",
        wide: true
      }
    ]
  });

  var experience = entrySection({
    id: "experience",
    titleField: "role",
    placeField: "company",
    newTitle: "New job",
    currentLabel: "I currently work here",
    bullets: true,
    confirmRemove: function (name) {
      return {
        title: "Remove this job?",
        message: "\u201c" + name + "\u201d will be removed from your CV. This can't be undone."
      };
    },
    fields: [
      {
        name: "role",
        label: "Job title",
        required: true,
        requiredMessage: "Enter your job title, for example Junior designer.",
        placeholder: "For example: Junior UX designer",
        wide: true
      },
      {
        name: "company",
        label: "Company or organisation",
        required: true,
        requiredMessage: "Enter the company or organisation.",
        placeholder: "For example: Studio Kite"
      },
      { name: "city", label: "City", placeholder: "For example: Eindhoven", maxLength: 60 },
      { dates: true },
      {
        name: "description",
        label: "What you did",
        hint: "One task or result per line. Each line becomes a bullet point.",
        multiline: true,
        maxLength: 1000,
        placeholder: "Designed the new checkout flow\nRan usability tests with 12 customers",
        wide: true
      }
    ]
  });

  /* ------------------------------------------------------------------------
     Live A4 preview: the page keeps its A4 shape and scales to fit.
     ------------------------------------------------------------------------ */

  var stage = document.querySelector("[data-preview-stage]");
  var page = document.querySelector("[data-cv-page]");
  var A4_WIDTH = 794; // 210 mm at 96 dpi
  var A4_HEIGHT = 1123; // 297 mm at 96 dpi
  var PAGE_PADDING_BOTTOM = 64; // keep in sync with .cv-page padding

  /* A CV is one A4 page. When the content no longer fits, the part that
     falls off stays visible below a red line, and a warning explains what
     to do. Nothing is cut off silently. */
  var overflowArea = document.createElement("div");
  overflowArea.className = "cv-page__overflow";
  overflowArea.setAttribute("aria-hidden", "true");
  overflowArea.innerHTML = '<span class="cv-page__overflow-label">Doesn\u2019t fit on one page</span>';
  page.appendChild(overflowArea);

  var templateCaption = document.querySelector("[data-template-caption]");
  var templatePicker = document.querySelector("[data-template-picker]");

  TEMPLATES.forEach(function (template) {
    var option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.name;
    templatePicker.appendChild(option);
  });

  // Switching only changes draft.template; the CV data stays the same.
  templatePicker.addEventListener("change", function () {
    draft.template = templatePicker.value;
    applyTemplate();
    updateFit(); // another template can take more or less space
    scheduleSave();
  });

  // Show the draft in its template.
  function applyTemplate() {
    var template = templateById(draft.template) || TEMPLATES[0];
    page.dataset.template = template.id;
    templatePicker.value = template.id;
    templateCaption.textContent = "A4 \u00b7 " + template.name + " template";
  }

  var fitWarnings = document.querySelectorAll("[data-fit-warning]");
  var overflowPx = 0;

  // How far the content runs past the page, in page pixels (0 = it fits).
  function measureOverflow() {
    var bottom = 0;
    Array.prototype.forEach.call(page.children, function (child) {
      if (child === overflowArea || child.hidden) return;
      bottom = Math.max(bottom, child.offsetTop + child.offsetHeight);
    });
    return Math.max(0, Math.ceil(bottom + PAGE_PADDING_BOTTOM - A4_HEIGHT));
  }

  function updateFit() {
    var overflow = measureOverflow();
    if (overflow === overflowPx) return;
    overflowPx = overflow;

    var tooLong = overflow > 0;
    page.classList.toggle("is-overflowing", tooLong);
    overflowArea.style.height = overflow + "px";
    fitWarnings.forEach(function (warning) {
      warning.hidden = !tooLong;
    });
    fitPreview();
  }

  function fitPreview() {
    var width = stage.clientWidth;
    if (!width) return;
    var scale = Math.min(width / A4_WIDTH, 1);
    page.style.transform = "scale(" + scale + ")";
    // Make room under the page for the part that does not fit.
    stage.style.height = Math.round((A4_HEIGHT + overflowPx) * scale) + "px";
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(fitPreview).observe(stage);
  } else {
    window.addEventListener("resize", fitPreview);
  }

  // Every edit changes the preview, so check the fit whenever it changes.
  if ("MutationObserver" in window) {
    new MutationObserver(function (records) {
      var onlyOverlay = records.every(function (record) {
        return record.target === overflowArea || overflowArea.contains(record.target);
      });
      if (!onlyOverlay) updateFit();
    }).observe(page, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["hidden"] });
  }

  /* ------------------------------------------------------------------------
     Start
     ------------------------------------------------------------------------ */

  renderPersonalPreview();
  renderAboutPreview();
  fillLevelOptions(skillLevel, "");
  renderSkills();
  education.render();
  education.renderPreview();
  experience.render();
  experience.renderPreview();
  // Flow: the editor opens at Personal details unless a section is linked.
  showSection(new URLSearchParams(window.location.search).get("section") || SECTIONS[0].id);
  applyTemplate();
  updateFit();
  fitPreview();
})();

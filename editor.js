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
    { id: "personal", label: "Personal details", built: false },
    { id: "about", label: "About me", built: false },
    { id: "education", label: "Education", built: false },
    { id: "experience", label: "Experience", built: false },
    { id: "skills", label: "Skills", built: true, optional: true }
  ];

  // Shown after the last section; "Custom" comes after Skills in the flow.
  var AFTER_LAST = "Next in the flow: custom sections like hobbies (not built yet).";

  var LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
  var MAX_SKILLS = 30;

  /* ------------------------------------------------------------------------
     Draft storage
     ------------------------------------------------------------------------ */

  function emptyDraft() {
    return { version: 1, updatedAt: null, sections: { skills: { items: [] } } };
  }

  function loadDraft() {
    var draft = emptyDraft();
    try {
      var stored = JSON.parse(window.localStorage.getItem(DRAFT_KEY));
      if (stored && stored.sections) {
        draft.updatedAt = stored.updatedAt || null;
        Object.keys(stored.sections).forEach(function (id) {
          draft.sections[id] = stored.sections[id];
        });
      }
    } catch (error) {
      // No storage or unreadable draft: start with an empty CV.
    }
    var skills = draft.sections.skills;
    if (!skills || !Array.isArray(skills.items)) draft.sections.skills = { items: [] };
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

  function countFor(section) {
    if (section.id === "skills") return draft.sections.skills.items.length;
    return 0;
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

  function moveSkill(index, delta) {
    var items = skills();
    var target = index + delta;
    var moved = items.splice(index, 1)[0];
    items.splice(target, 0, moved);
    update();
    var buttons = skillList.querySelectorAll(".skill-item")[target].querySelectorAll(".ed-icon-btn");
    var focusTarget = delta < 0 ? buttons[0] : buttons[1];
    (focusTarget.disabled ? buttons[2] : focusTarget).focus();
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
     Live A4 preview: the page keeps its A4 shape and scales to fit.
     ------------------------------------------------------------------------ */

  var stage = document.querySelector("[data-preview-stage]");
  var page = document.querySelector("[data-cv-page]");
  var A4_WIDTH = 794; // 210 mm at 96 dpi
  var A4_HEIGHT = 1123; // 297 mm at 96 dpi

  function fitPreview() {
    var width = stage.clientWidth;
    if (!width) return;
    var scale = Math.min(width / A4_WIDTH, 1);
    page.style.transform = "scale(" + scale + ")";
    stage.style.height = Math.round(A4_HEIGHT * scale) + "px";
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(fitPreview).observe(stage);
  } else {
    window.addEventListener("resize", fitPreview);
  }

  /* ------------------------------------------------------------------------
     Start
     ------------------------------------------------------------------------ */

  fillLevelOptions(skillLevel, "");
  renderSkills();
  // Flow: the editor opens at Personal details unless a section is linked.
  showSection(new URLSearchParams(window.location.search).get("section") || SECTIONS[0].id);
  fitPreview();
})();

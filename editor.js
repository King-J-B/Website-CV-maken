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
    { id: "education", label: "Education", built: true },
    { id: "experience", label: "Experience", built: true },
    { id: "skills", label: "Skills", built: true, optional: true }
  ];

  // Shown after the last section; "Custom" comes after Skills in the flow.
  var AFTER_LAST = "Next in the flow: custom sections like hobbies (not built yet).";

  // Sections whose draft data is a list: { items: [...] }
  var LIST_SECTIONS = ["education", "experience", "skills"];

  var LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
  var MAX_SKILLS = 30;

  /* ------------------------------------------------------------------------
     Draft storage
     ------------------------------------------------------------------------ */

  function emptyDraft() {
    var draft = { version: 1, updatedAt: null, sections: {} };
    LIST_SECTIONS.forEach(function (id) {
      draft.sections[id] = { items: [] };
    });
    return draft;
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
    LIST_SECTIONS.forEach(function (id) {
      var section = draft.sections[id];
      if (!section || !Array.isArray(section.items)) draft.sections[id] = { items: [] };
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
    return start || end;
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
      var target = delta < 0 ? buttons[0] : buttons[1];
      (target.disabled ? buttons[2] : target).focus();
    }

    // Removing an entry that has content asks first; an empty one just goes.
    function removeEntry(index) {
      var all = items();
      var item = all[index];
      if (hasContent(item) && !window.confirm(cfg.confirmRemove(headline(item)))) return;
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
      return "Remove " + name + " from your CV? This can't be undone.";
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
      return "Remove " + name + " from your CV? This can't be undone.";
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
  education.render();
  education.renderPreview();
  experience.render();
  experience.renderPreview();
  // Flow: the editor opens at Personal details unless a section is linked.
  showSection(new URLSearchParams(window.location.search).get("section") || SECTIONS[0].id);
  fitPreview();
})();

/* ==========================================================================
   Folio — draws a saved CV as an A4 page

   Same HTML and classes as the editor's live preview, so cv-templates.css
   makes it look the same. Used for the small previews on My resumes, and
   by the editor for the dates on the CV.

     FolioRender.page(content)      → <article class="cv-page"> element
     FolioRender.formatRange(item)  → "mei 2021 – heden"
     FolioRender.fit(stage)         → scales the page to the stage's width

   Words of our own (headings, dates, levels) follow the chosen language
   (js/translate.js). The user's own text is used as typed.
   ========================================================================== */

window.FolioRender = (function () {
  "use strict";

  var A4_WIDTH = 794; // 210 mm at 96 dpi
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function L(text) {
    return window.FolioLang ? window.FolioLang.t(text) : text;
  }

  function isDutch() {
    return Boolean(window.FolioLang && window.FolioLang.current === "nl");
  }

  function el(tagName, className, text) {
    var node = document.createElement(tagName);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function formatDate(month, year) {
    if (!year) return "";
    return (month ? L(MONTHS[month - 1]) + " " : "") + year;
  }

  function formatRange(item) {
    var start = formatDate(item.startMonth, item.startYear);
    var end = item.current ? L("Present") : formatDate(item.endMonth, item.endYear);
    if (start && end) return start + " – " + end;
    if (end) return item.current ? L("Present") : (isDutch() ? "Tot " : "Until ") + end;
    return start;
  }

  // "https://www.example.com/" → "example.com"
  function displayUrl(value) {
    return (value || "").replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "");
  }

  // One line is a paragraph; several lines become bullet points.
  function description(text, bullets) {
    var lines = text.split(/\n+/).map(function (line) {
      return line.replace(/^\s*[-•*]\s*/, "").trim();
    }).filter(Boolean);
    if (!bullets) return el("p", "cv-entry__desc", text);
    if (lines.length < 2) return el("p", "cv-entry__desc", lines[0] || "");
    var list = el("ul", "cv-entry__bullets");
    lines.forEach(function (line) {
      list.appendChild(el("li", "", line));
    });
    return list;
  }

  function section(id, heading) {
    var node = el("section", "cv-page__section");
    node.dataset.cvSection = id;
    node.appendChild(el("h2", "cv-page__heading", L(heading)));
    return node;
  }

  function entries(items, titleField, placeField, bullets) {
    var box = el("div", "cv-page__entries");
    (items || []).forEach(function (item) {
      var title = (item[titleField] || "").trim();
      var place = [item[placeField], item.city].map(function (part) {
        return (part || "").trim();
      }).filter(Boolean).join(", ");
      if (!title && !place) return;

      var entry = el("div", "cv-entry");
      var top = el("div", "cv-entry__top");
      top.appendChild(el("p", "cv-entry__title", title));
      top.appendChild(el("p", "cv-entry__dates", formatRange(item)));
      entry.appendChild(top);
      if (place) entry.appendChild(el("p", "cv-entry__sub", place));
      var text = (item.description || "").trim();
      if (text) entry.appendChild(description(text, bullets));
      box.appendChild(entry);
    });
    return box;
  }

  function page(content) {
    content = content || {};
    var sections = content.sections || {};
    var personal = sections.personal || {};
    var design = content.design || {};

    var cv = el("article", "cv-page");
    cv.dataset.template = content.template || "modern";
    ["color", "font", "spacing"].forEach(function (key) {
      if (design[key]) cv.dataset[key] = design[key];
    });

    // Head: name, job title and contact details
    var head = el("header", "cv-page__head");
    var name = (personal.name || "").trim();
    var nameLine = el("p", "cv-page__name" + (name ? "" : " is-placeholder"), name || L("Your name"));
    head.appendChild(nameLine);
    if ((personal.title || "").trim()) head.appendChild(el("p", "cv-page__role", personal.title.trim()));
    var contact = [personal.email, personal.phone, personal.city, displayUrl(personal.linkedin), displayUrl(personal.website)]
      .map(function (part) {
        return (part || "").trim();
      })
      .filter(Boolean);
    if (contact.length) {
      var list = el("ul", "cv-page__contact");
      contact.forEach(function (part) {
        list.appendChild(el("li", "", part));
      });
      head.appendChild(list);
    }
    cv.appendChild(head);

    // Only filled-in sections, like in the PDF
    var about = ((sections.about || {}).text || "").trim();
    if (about) {
      var aboutSection = section("about", "About me");
      aboutSection.appendChild(el("p", "cv-page__about", about));
      cv.appendChild(aboutSection);
    }

    [
      { id: "education", heading: "Education", title: "study", place: "school", bullets: false },
      { id: "experience", heading: "Experience", title: "role", place: "company", bullets: true }
    ].forEach(function (cfg) {
      var box = entries((sections[cfg.id] || {}).items, cfg.title, cfg.place, cfg.bullets);
      if (!box.children.length) return;
      var node = section(cfg.id, cfg.heading);
      node.appendChild(box);
      cv.appendChild(node);
    });

    var skills = ((sections.skills || {}).items || []).filter(function (skill) {
      return (skill.name || "").trim();
    });
    if (skills.length) {
      var skillSection = section("skills", "Skills");
      var chips = el("ul", "cv-page__skills");
      skills.forEach(function (skill) {
        var chip = el("li", "cv-page__skill", skill.name.trim());
        if (skill.level) chip.appendChild(el("span", "cv-page__level", L(skill.level)));
        chips.appendChild(chip);
      });
      skillSection.appendChild(chips);
      cv.appendChild(skillSection);
    }

    return cv;
  }

  // Scale the A4 page inside `stage` to the stage's width.
  function fit(stage) {
    var cv = stage.querySelector(".cv-page");
    if (!cv || !stage.clientWidth) return;
    cv.style.transform = "scale(" + stage.clientWidth / A4_WIDTH + ")";
  }

  return { page: page, formatRange: formatRange, fit: fit };
})();

/* ==========================================================================
   Folio — draws a saved CV as an A4 page

   Same HTML and classes as the editor's live preview, so cv-templates.css
   makes it look the same. Used for the small previews on My resumes, and
   by the editor for the dates on the CV.

     FolioRender.page(content)      → <article class="cv-page"> element
     FolioRender.formatRange(item)  → "mei 2021 – heden"
     FolioRender.fit(stage)         → scales the page to the stage's width
     FolioRender.order(content)     → the section ids in the CV's order
     FolioRender.arrange(cv, content) → puts a drawn page's sections in that order

   Words of our own (headings, dates, levels) follow the chosen language
   (js/translate.js). The user's own text is used as typed.

   With content.anonymous it draws the anonymous version (js/anonymize.js,
   load it before this file).
   ========================================================================== */

window.FolioRender = (function () {
  "use strict";

  var A4_WIDTH = 794; // 210 mm at 96 dpi

  /* The order of the sections under the head. Each CV can have its own
     (content.order, chosen in the editor); missing sections follow in this
     default order. Personal details are the head and always stay on top.
     In the Split template the SIDE sections stay in the left column. */
  var ORDER = ["about", "education", "experience", "projects", "volunteering", "certificates", "skills", "languages", "hobbies"];
  var SIDE = ["skills", "languages", "hobbies"];

  // The CV's own order, cleaned up: only known sections, each once, all there.
  function order(content) {
    var chosen = content && Array.isArray(content.order) ? content.order : [];
    var result = chosen.filter(function (id, index) {
      return ORDER.indexOf(id) !== -1 && chosen.indexOf(id) === index;
    });
    ORDER.forEach(function (id) {
      if (result.indexOf(id) === -1) result.push(id);
    });
    return result;
  }

  // Put the sections of a drawn .cv-page in the CV's order. Used here and by
  // the editor's live preview. The DOM order is also the PDF's reading order.
  function arrange(cv, content) {
    var main = cv.querySelector(".cv-page__main");
    var side = cv.querySelector(".cv-page__side");
    var split = cv.dataset.template === "split";
    order(content).forEach(function (id) {
      var node = cv.querySelector('[data-cv-section="' + id + '"]');
      if (node) (split && SIDE.indexOf(id) !== -1 ? side : main).appendChild(node);
    });
  }
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

  // "mei 2021 – heden"; a certificate only has a year.
  function formatRange(item) {
    if (!item.startYear && !item.endYear && item.year) return String(item.year).trim();
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

  // Anonymous CVs show a duration (or nothing) instead of dates (js/anonymize.js).
  function entries(items, titleField, placeField, bullets, anonymousSection) {
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
      var dates = anonymousSection ? window.FolioAnonymize.dates(anonymousSection, item) : formatRange(item);
      top.appendChild(el("p", "cv-entry__dates", dates));
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
    // Anonymous mode: draw the copy without photo, name, contact details,
    // dates and hobbies (js/anonymize.js; a shared link is already cleaned).
    var anonymous = content.anonymous === true && Boolean(window.FolioAnonymize);
    if (anonymous) content = window.FolioAnonymize.content(content);
    var sections = content.sections || {};
    var personal = sections.personal || {};
    var design = content.design || {};

    var cv = el("article", "cv-page");
    cv.dataset.template = content.template || "modern";
    ["color", "font", "spacing", "photo"].forEach(function (key) {
      if (design[key]) cv.dataset[key] = design[key];
    });

    // Head: name, job title and contact details
    var head = el("header", "cv-page__head");
    // Only a photo made by the editor (a small JPEG); anything else is ignored.
    if (/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(personal.photo || "")) {
      var photo = el("img", "cv-page__photo");
      photo.alt = "";
      photo.src = personal.photo;
      head.appendChild(photo);
    }
    var name = anonymous ? L("Candidate") : (personal.name || "").trim();
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

    // Two groups, like the editor: Split shows them as two columns.
    var main = el("div", "cv-page__main");
    var side = el("div", "cv-page__side");

    // Only filled-in sections, like in the PDF
    var about = ((sections.about || {}).text || "").trim();
    if (about) {
      var aboutSection = section("about", "About me");
      aboutSection.appendChild(el("p", "cv-page__about", about));
      main.appendChild(aboutSection);
    }

    [
      { id: "education", heading: "Education", title: "study", place: "school", bullets: false },
      { id: "experience", heading: "Experience", title: "role", place: "company", bullets: true },
      { id: "projects", heading: "Projects", title: "name", place: "organisation", bullets: true },
      { id: "volunteering", heading: "Volunteering", title: "role", place: "organisation", bullets: true },
      { id: "certificates", heading: "Certificates", title: "name", place: "issuer", bullets: false }
    ].forEach(function (cfg) {
      var box = entries((sections[cfg.id] || {}).items, cfg.title, cfg.place, cfg.bullets, anonymous ? cfg.id : null);
      if (!box.children.length) return;
      var node = section(cfg.id, cfg.heading);
      node.appendChild(box);
      main.appendChild(node);
    });

    // Short lists: name (and level) as chips
    [
      { id: "skills", heading: "Skills" },
      { id: "languages", heading: "Languages" },
      { id: "hobbies", heading: "Hobbies" }
    ].forEach(function (cfg) {
      var items = ((sections[cfg.id] || {}).items || []).filter(function (item) {
        return (item.name || "").trim();
      });
      if (!items.length) return;
      var node = section(cfg.id, cfg.heading);
      var chips = el("ul", "cv-page__skills");
      items.forEach(function (item) {
        var chip = el("li", "cv-page__skill", item.name.trim());
        if (item.level) chip.appendChild(el("span", "cv-page__level", L(item.level)));
        chips.appendChild(chip);
      });
      node.appendChild(chips);
      side.appendChild(node);
    });

    cv.appendChild(main);
    cv.appendChild(side);
    arrange(cv, content);
    return cv;
  }

  // Scale the A4 page inside `stage` to the stage's width.
  function fit(stage) {
    var cv = stage.querySelector(".cv-page");
    if (!cv || !stage.clientWidth) return;
    cv.style.transform = "scale(" + stage.clientWidth / A4_WIDTH + ")";
  }

  return { page: page, formatRange: formatRange, fit: fit, order: order, arrange: arrange, SIDE: SIDE };
})();

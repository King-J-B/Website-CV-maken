/* ==========================================================================
   Folio — anonymous mode (blind hiring): the rules in one place

   With content.anonymous = true a CV hides who you are and keeps what you
   can do. The real details stay saved; only what is shown changes.

     hidden:  photo, name (shown as "Candidate"), email, phone, city,
              LinkedIn, website, education dates, certificate years, hobbies
     changed: dates of experience, projects and volunteering become a
              duration ("2 years 3 months"), so no year gives away an age
     kept:    job title, about me, studies and schools, experience,
              projects, volunteering, certificates, skills, languages

     FolioAnonymize.content(content)    → a copy without the hidden details
     FolioAnonymize.dates(sectionId, item) → the date text an anonymous CV shows
     FolioAnonymize.months(item)         → the duration in months, or null
     FolioAnonymize.formatDuration(n)    → "2 jaar en 3 maanden"
     FolioAnonymize.check(content)       → own texts that may give you away

   cv.php does the same on the server (anonymize_cv), so a shared link never
   sends the hidden details. Change the rules there too.
   ========================================================================== */

window.FolioAnonymize = (function () {
  "use strict";

  var DURATION_SECTIONS = ["experience", "projects", "volunteering"];
  var NO_DATE_SECTIONS = ["education", "certificates"];
  var HIDDEN_SECTIONS = ["hobbies"];
  var DATE_FIELDS = ["startMonth", "startYear", "endMonth", "endYear", "current", "year"];

  function isDutch() {
    return !window.FolioLang || window.FolioLang.current !== "en";
  }

  function number(value) {
    var n = parseInt(value, 10);
    return isNaN(n) ? 0 : n;
  }

  // How long something lasted, in months. With months: Jan 2020 – Jun 2021
  // counts both ends (18 months). With years only: whole years.
  function months(item) {
    var startYear = number(item.startYear);
    if (!startYear) return null;
    var now = new Date();
    var endYear = item.current ? now.getFullYear() : number(item.endYear);
    if (!endYear) return null;
    var startMonth = number(item.startMonth);
    var endMonth = item.current ? now.getMonth() + 1 : number(item.endMonth);

    var total = startMonth && endMonth
      ? (endYear - startYear) * 12 + (endMonth - startMonth) + 1
      : (endYear - startYear) * 12;
    return total > 0 ? total : null;
  }

  function formatDuration(total) {
    if (!total) return "";
    var years = Math.floor(total / 12);
    var rest = total % 12;
    var dutch = isDutch();
    var yearText = years ? years + (dutch ? " jaar" : years === 1 ? " year" : " years") : "";
    var monthText = rest ? rest + (dutch ? (rest === 1 ? " maand" : " maanden") : rest === 1 ? " month" : " months") : "";
    if (yearText && monthText) return yearText + (dutch ? " en " : " ") + monthText;
    return yearText || monthText;
  }

  function dates(sectionId, item) {
    if (DURATION_SECTIONS.indexOf(sectionId) !== -1) {
      return formatDuration(item.durationMonths || months(item));
    }
    return "";
  }

  // A deep copy with the hidden details taken out. Durations are worked out
  // first and kept as durationMonths, so the copy has no dates left.
  function content(original) {
    var copy = JSON.parse(JSON.stringify(original || {}));
    copy.anonymous = true;
    var sections = copy.sections || {};
    var personal = sections.personal || {};
    sections.personal = personal.title ? { title: personal.title } : {};

    Object.keys(sections).forEach(function (id) {
      var items = sections[id] && sections[id].items;
      if (!Array.isArray(items)) return;
      items.forEach(function (item) {
        if (DURATION_SECTIONS.indexOf(id) !== -1) {
          var total = months(item);
          if (total) item.durationMonths = total;
        }
        if (DURATION_SECTIONS.indexOf(id) !== -1 || NO_DATE_SECTIONS.indexOf(id) !== -1) {
          DATE_FIELDS.forEach(function (field) {
            delete item[field];
          });
        }
      });
    });

    HIDDEN_SECTIONS.forEach(function (id) {
      delete sections[id];
    });
    if (Array.isArray(copy.extras)) {
      copy.extras = copy.extras.filter(function (id) {
        return HIDDEN_SECTIONS.indexOf(id) === -1;
      });
    }
    copy.sections = sections;
    return copy;
  }

  /* Own texts can't be cut automatically (the sentence would break), so we
     only point at what may give you away: your name, your city, an age or
     a year. Returns [{ section: "about", found: ["your name", "a year"] }]. */
  var TEXT_SECTIONS = ["about", "education", "experience", "projects", "volunteering", "certificates"];

  function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function wordPattern(word) {
    return new RegExp("(^|[^\\p{L}])" + escapeRegex(word) + "($|[^\\p{L}])", "iu");
  }

  function check(cv) {
    var sections = (cv && cv.sections) || {};
    var personal = sections.personal || {};
    var name = (personal.name || "").trim();
    var city = (personal.city || "").trim();
    // The full name and each part of it ("Sam", "Vries"), but no short bits like "de".
    var nameParts = name ? [name].concat(name.split(/\s+/)) : [];
    var names = nameParts.filter(function (part, index) {
      return part.length >= 3 && nameParts.indexOf(part) === index;
    }).map(wordPattern);
    var cityPattern = city.length >= 3 ? wordPattern(city) : null;
    var agePattern = /\b\d{2}\s*(-\s*)?(jaar|jarige|years?\s+old|-year-old)\b/i;
    var yearPattern = /\b(19|20)\d{2}\b/;

    var results = [];
    TEXT_SECTIONS.forEach(function (id) {
      var section = sections[id] || {};
      var text = id === "about"
        ? section.text || ""
        : (section.items || []).map(function (item) { return item.description || ""; }).join("\n");
      if (!text.trim()) return;

      var found = [];
      if (names.some(function (pattern) { return pattern.test(text); })) found.push("your name");
      if (cityPattern && cityPattern.test(text)) found.push("your city");
      if (agePattern.test(text)) found.push("an age");
      if (yearPattern.test(text)) found.push("a year");
      if (found.length) results.push({ section: id, found: found });
    });
    return results;
  }

  return {
    content: content,
    dates: dates,
    months: months,
    formatDuration: formatDuration,
    check: check,
    HIDDEN_SECTIONS: HIDDEN_SECTIONS
  };
})();

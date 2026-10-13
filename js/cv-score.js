/* ==========================================================================
   Folio — CV score (0–100) and tips

   A checklist, not a judge: it counts what is on the CV and whether it is
   complete. It doesn't read whether the text is well written.

     FolioScore.score(content, { fits: true | false })
       → { total: 82,
           level: { id: "good", label: "Good" },
           parts: [ { id: "personal", label: "Personal details", points: 13, max: 15 }, ... ],
           tips:  [ { section: "about", text: "...", gain: 6 }, ... ]  biggest gain first }

     FolioScore.fits(pageElement)   → does a drawn .cv-page fit on one A4?

   Points (100): personal details 15, about me 20, experience 25,
   education 15, skills 15, overall 10. The photo doesn't count, and the
   anonymous mode doesn't change the score (it uses the saved details).
   Texts are English here; js/translate.js shows them in the chosen language.
   ========================================================================== */

window.FolioScore = (function () {
  "use strict";

  var A4_HEIGHT = 1123;
  var PAGE_PADDING_BOTTOM = 64; // the same as the editor's measurement

  var ABOUT_SHORT = 150; // below this: write a bit more
  var ABOUT_LONG = 450;  // above this: recruiters skim (the editor's advice)

  var LEVELS = [
    { min: 85, id: "strong", label: "Strong" },
    { min: 70, id: "good", label: "Good" },
    { min: 50, id: "on-way", label: "On your way" },
    { min: 0, id: "start", label: "Just started" }
  ];

  // What each list section needs to count as filled in.
  var ENTRY_FIELDS = {
    education: ["study", "school"],
    experience: ["role", "company"],
    projects: ["name"],
    volunteering: ["role", "organisation"],
    certificates: ["name"]
  };

  function L(text) {
    return window.FolioLang ? window.FolioLang.t(text) : text;
  }

  function text(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function items(sections, id) {
    var section = sections[id];
    return section && Array.isArray(section.items) ? section.items : [];
  }

  // An entry with at least something typed in it.
  function started(item, id) {
    return ENTRY_FIELDS[id].concat(["city", "description"]).some(function (field) {
      return text(item[field]);
    }) || Boolean(item.startYear || item.endYear || item.year);
  }

  function complete(item, id) {
    return ENTRY_FIELDS[id].every(function (field) {
      return text(item[field]);
    });
  }

  function hasDates(item) {
    return Boolean(item.startYear || item.endYear || item.year);
  }

  function lines(description) {
    return text(description).split(/\n+/).filter(function (line) {
      return line.replace(/^\s*[-•*]\s*/, "").trim();
    }).length;
  }

  function titleOf(item, id) {
    return text(item[ENTRY_FIELDS[id][0]]) || text(item[ENTRY_FIELDS[id][1]]);
  }

  function score(content, options) {
    options = options || {};
    var sections = (content && content.sections) || {};
    var personal = sections.personal || {};
    var parts = [];
    var tips = [];

    function part(id, label, points, max) {
      parts.push({ id: id, label: label, points: Math.max(0, Math.min(max, Math.round(points))), max: max });
    }

    function tip(section, message, gain) {
      if (gain > 0) tips.push({ section: section, text: L(message), gain: gain });
    }

    /* Personal details (15) */
    var personalPoints = 0;
    [
      { key: "name", points: 5, tip: "Add your name. It goes at the top of your CV." },
      { key: "email", points: 4, tip: "Add your email address, so an employer can reach you." },
      { key: "phone", points: 3, tip: "Add your phone number, so an employer can call you." },
      { key: "city", points: 1, tip: "Add the city where you live." }
    ].forEach(function (check) {
      if (text(personal[check.key])) personalPoints += check.points;
      else tip("personal", check.tip, check.points);
    });
    if (text(personal.linkedin) || text(personal.website)) personalPoints += 2;
    else tip("personal", "Add your LinkedIn or a website with your work.", 2);
    part("personal", "Personal details", personalPoints, 15);

    /* About me (20) */
    var about = text((sections.about || {}).text);
    var aboutPoints = 0;
    if (!about) {
      tip("about", "Write a short introduction in About me: who you are, what you are good at and what you are looking for.", 20);
    } else {
      aboutPoints = 8;
      if (about.length >= ABOUT_SHORT) aboutPoints += 6;
      else tip("about", "Your About me is short. Write 2 to 4 sentences about who you are and what you are looking for.", 6);
      if (about.length <= ABOUT_LONG) aboutPoints += 6;
      else tip("about", "Your About me is long. Recruiters skim: keep it under 450 characters.", 6);
    }
    part("about", "About me", aboutPoints, 20);

    /* Experience (25). No jobs yet? Projects and volunteering count for up
       to 15, so a student doesn't get a low score for still studying. */
    var jobs = items(sections, "experience").filter(function (item) { return complete(item, "experience"); });
    var useOther = !jobs.length;
    var entries = jobs.map(function (item) { return { item: item, id: "experience" }; });
    if (useOther) {
      ["projects", "volunteering"].forEach(function (id) {
        items(sections, id).filter(function (item) { return complete(item, id); }).forEach(function (item) {
          entries.push({ item: item, id: id });
        });
      });
    }
    var experiencePoints = 0;
    if (!entries.length) {
      tip("experience", "Add a job, internship or side job under Experience. Projects and volunteering count too.", 25);
    } else {
      var weight = useOther ? 0.6 : 1;
      var raw = 10;
      var noDates = entries.filter(function (entry) { return !hasDates(entry.item); })[0];
      var noText = entries.filter(function (entry) { return !text(entry.item.description); })[0];
      var noList = entries.filter(function (entry) { return text(entry.item.description) && lines(entry.item.description) < 2; })[0];
      if (!noDates) raw += 5;
      else tip(noDates.id, "Add dates to “" + titleOf(noDates.item, noDates.id) + "”.", Math.round(5 * weight));
      if (!noText) raw += 5;
      else tip(noText.id, "Describe what you did at “" + titleOf(noText.item, noText.id) + "”.", Math.round(5 * weight));
      if (!noList && !noText) raw += 5;
      else if (noList) tip(noList.id, "Write the description of “" + titleOf(noList.item, noList.id) + "” as a list of 2 or 3 points.", Math.round(5 * weight));
      experiencePoints = raw * weight;
      if (useOther) tip("experience", "Add a job, internship or side job under Experience.", 25 - Math.round(experiencePoints));
    }
    part("experience", "Experience", experiencePoints, 25);

    /* Education (15) */
    var studies = items(sections, "education").filter(function (item) { return text(item.study) || text(item.school); });
    var educationPoints = 0;
    if (!studies.length) {
      tip("education", "Add your current or most recent study under Education.", 15);
    } else {
      educationPoints = 8;
      var noSchool = studies.filter(function (item) { return !text(item.school); })[0];
      var noStudyDates = studies.filter(function (item) { return !hasDates(item); })[0];
      if (!noSchool) educationPoints += 3;
      else tip("education", "Add the school to “" + titleOf(noSchool, "education") + "”.", 3);
      if (!noStudyDates) educationPoints += 4;
      else tip("education", "Add dates to “" + titleOf(noStudyDates, "education") + "”.", 4);
    }
    part("education", "Education", educationPoints, 15);

    /* Skills (15): 5 to 10 works best (the editor's advice) */
    var skills = items(sections, "skills").filter(function (item) { return text(item.name); }).length;
    var skillPoints = skills === 0 ? 0 : skills <= 2 ? 5 : skills <= 4 ? 10 : skills <= 15 ? 15 : 10;
    if (skills < 5) {
      var more = 5 - skills;
      tip("skills", more === 1 ? "Add 1 more skill. 5 to 10 works best." : "Add " + more + " more skills. 5 to 10 works best.", 15 - skillPoints);
    } else if (skills > 15) {
      tip("skills", "You have a lot of skills. Keep the 10 that matter most for the job.", 5);
    }
    part("skills", "Skills", skillPoints, 15);

    /* Overall (10): fits on one A4, languages, nothing half filled in */
    var overallPoints = 0;
    if (options.fits !== false) overallPoints += 6;
    else tip(null, "Your CV doesn't fit on one A4 page. Shorten a description, or choose compact spacing under Design.", 6);
    if (items(sections, "languages").some(function (item) { return text(item.name); })) overallPoints += 2;
    else tip("languages", "Add the languages you speak (+ Add section).", 2);
    var unfinished = null;
    Object.keys(ENTRY_FIELDS).some(function (id) {
      var item = items(sections, id).filter(function (entry) { return started(entry, id) && !complete(entry, id); })[0];
      if (item) unfinished = id;
      return Boolean(item);
    });
    if (!unfinished) overallPoints += 2;
    else tip(unfinished, "Finish or remove the half-filled entry in this section.", 2);
    // An empty CV "fits" and has nothing half filled in, but earns nothing for it.
    var anythingFilled = parts.some(function (item) { return item.points > 0; });
    part("overall", "Overall", anythingFilled ? overallPoints : 0, 10);

    var total = parts.reduce(function (sum, item) { return sum + item.points; }, 0);
    var level = LEVELS.filter(function (item) { return total >= item.min; })[0];
    tips.sort(function (a, b) { return b.gain - a.gain; });

    return {
      total: total,
      level: { id: level.id, label: L(level.label) },
      parts: parts.map(function (item) {
        return { id: item.id, label: L(item.label), points: item.points, max: item.max };
      }),
      tips: tips
    };
  }

  // Does a drawn .cv-page fit on one A4? The same measurement as the editor.
  function fits(page) {
    var bottom = 0;
    page.querySelectorAll(".cv-page__head, .cv-page__section").forEach(function (node) {
      if (node.offsetParent) bottom = Math.max(bottom, node.offsetTop + node.offsetHeight);
    });
    return bottom + PAGE_PADDING_BOTTOM <= A4_HEIGHT;
  }

  return { score: score, fits: fits };
})();

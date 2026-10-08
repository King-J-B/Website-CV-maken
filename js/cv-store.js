/* ==========================================================================
   Folio — CV storage, shared by My resumes, the template page and the editor.

   Guests keep their CVs in this browser (localStorage):
   - folio:resumes      the list of CVs shown on My resumes (title, template
                        name, last edited)
   - folio:cv:<id>      the content of one CV, as edited in the editor

   The editor opens one CV at a time: editor.html?cv=<id>.

   Older versions kept a single editor draft under folio:draft. On load, that
   draft becomes its own CV ("Mijn cv"), so nobody loses work.
   ========================================================================== */

(function () {
  "use strict";

  var RESUMES_KEY = "folio:resumes";
  var CV_PREFIX = "folio:cv:";
  var LEGACY_DRAFT_KEY = "folio:draft";

  // Shown on My resumes until the user deletes it.
  var EXAMPLE_RESUME = {
    id: 1,
    title: "Stage UX Designer",
    template: "Modern template",
    updated: "Vandaag bewerkt",
    updatedAt: 0,
    type: "existing"
  };

  // What the example CV contains when it is opened for the first time.
  var EXAMPLE_CONTENT = {
    version: 1,
    updatedAt: null,
    template: "modern",
    sections: {
      personal: {
        name: "Alex Morgan",
        title: "UX design student",
        email: "alex@example.com",
        phone: "+31 6 12345678",
        city: "Breda",
        linkedin: "linkedin.com/in/alex-morgan"
      },
      about: {
        text: "Creative UX design student who loves turning messy problems into simple screens. Looking for a graduation internship in a product team."
      },
      education: {
        items: [
          { id: "ex-edu-1", study: "Bachelor Communication and Multimedia Design", school: "Avans University", city: "Breda", startMonth: 9, startYear: 2021, current: true, description: "" }
        ]
      },
      experience: {
        items: [
          { id: "ex-exp-1", role: "UX design intern", company: "Studio Kite", city: "Eindhoven", startMonth: 2, startYear: 2024, endMonth: 7, endYear: 2024, current: false, description: "Designed the new checkout flow\nRan usability tests with 12 customers" }
        ]
      },
      skills: {
        items: [
          { id: "ex-skill-1", name: "Figma", level: "Advanced" },
          { id: "ex-skill-2", name: "User research", level: "Intermediate" },
          { id: "ex-skill-3", name: "Teamwork", level: "" }
        ]
      }
    }
  };

  function readJson(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (error) {
      return null;
    }
  }

  // Throws when the browser refuses to store (full, blocked); callers decide
  // what to show.
  function writeJson(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  /* ------------------------------------------------------------------------
     The list on My resumes
     ------------------------------------------------------------------------ */

  function loadResumes() {
    var stored = readJson(RESUMES_KEY);
    if (Array.isArray(stored)) {
      return stored.filter(function (resume) {
        return resume && resume.type === "existing";
      });
    }
    return [copy(EXAMPLE_RESUME)];
  }

  function saveResumes(resumes) {
    writeJson(RESUMES_KEY, resumes);
  }

  function findResume(id) {
    var resumes = loadResumes();
    for (var i = 0; i < resumes.length; i++) {
      if (String(resumes[i].id) === String(id)) return resumes[i];
    }
    return null;
  }

  // Adds a new, empty CV with the chosen template and returns its id.
  function createResume(template, title) {
    var now = Date.now();
    var resumes = loadResumes();
    var id = now;
    while (resumes.some(function (resume) { return String(resume.id) === String(id); })) id += 1;

    writeJson(CV_PREFIX + id, { version: 1, updatedAt: null, template: template.id, sections: {} });
    resumes.unshift({
      id: id,
      title: title || "Nieuw cv",
      template: template.name + " template",
      updated: "Net aangemaakt",
      updatedAt: now,
      type: "existing"
    });
    saveResumes(resumes);
    return id;
  }

  // After an edit: update "last edited" and the template name on the card.
  function touchResume(id, templateName) {
    var resumes = loadResumes();
    resumes.forEach(function (resume) {
      if (String(resume.id) !== String(id)) return;
      resume.updatedAt = Date.now();
      if (templateName) resume.template = templateName + " template";
    });
    saveResumes(resumes);
  }

  /* ------------------------------------------------------------------------
     The content of one CV
     ------------------------------------------------------------------------ */

  function loadCv(id) {
    var stored = readJson(CV_PREFIX + id);
    if (stored && typeof stored === "object") return stored;
    // The example CV opens with example content until it is edited.
    if (String(id) === String(EXAMPLE_RESUME.id)) return copy(EXAMPLE_CONTENT);
    return null;
  }

  function saveCv(id, content) {
    writeJson(CV_PREFIX + id, content);
  }

  function deleteCv(id) {
    try {
      window.localStorage.removeItem(CV_PREFIX + id);
    } catch (error) {
      // Nothing to remove, or storage blocked: the card is gone either way.
    }
  }

  /* ------------------------------------------------------------------------
     One-time move of the old single draft into its own CV
     ------------------------------------------------------------------------ */

  function migrateLegacyDraft() {
    var legacy = readJson(LEGACY_DRAFT_KEY);
    if (!legacy) return;
    try {
      var hasContent = legacy.sections && Object.keys(legacy.sections).some(function (key) {
        var section = legacy.sections[key];
        if (!section) return false;
        if (Array.isArray(section.items)) return section.items.length > 0;
        return Object.keys(section).some(function (field) { return section[field]; });
      });

      if (hasContent) {
        var templates = window.FOLIO_TEMPLATES || [];
        var template = templates.filter(function (item) { return item.id === legacy.template; })[0] ||
          templates[0] || { id: "modern", name: "Modern" };
        var id = createResume(template, "Mijn cv");
        legacy.template = template.id;
        saveCv(id, legacy);
      }
      window.localStorage.removeItem(LEGACY_DRAFT_KEY);
    } catch (error) {
      // Leave the old draft in place and try again next time.
    }
  }

  window.FolioStore = {
    loadResumes: loadResumes,
    saveResumes: saveResumes,
    findResume: findResume,
    createResume: createResume,
    touchResume: touchResume,
    loadCv: loadCv,
    saveCv: saveCv,
    deleteCv: deleteCv,
    exampleResume: function () {
      return copy(EXAMPLE_RESUME);
    }
  };

  migrateLegacyDraft();
})();

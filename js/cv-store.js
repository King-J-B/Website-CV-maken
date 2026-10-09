/* ==========================================================================
   Folio — CV storage, shared by My resumes, the template page, the home page
   and the editor. Every function returns a Promise:

     FolioStore.list()                         → [ {id, title, template, updatedAt, ...} ]
     FolioStore.load(id)                       → the CV's content, or null
     FolioStore.create(template, title?, content?) → the new id
     FolioStore.save(id, content, { templateName, personName })
     FolioStore.rename(id, title) / FolioStore.remove(id)

   Signed in (js/account.js says who): the CVs are in the account, through
   api/cvs.php. Guest CVs move into the account after signing in.

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
  var DEFAULT_TITLE = "Nieuw cv";

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
      title: title || DEFAULT_TITLE,
      // Without a chosen title, the card takes the name from the CV ("Sam de Vries - cv").
      titleAuto: !title,
      template: template.name + " template",
      updated: "Net aangemaakt",
      updatedAt: now,
      type: "existing"
    });
    saveResumes(resumes);
    return id;
  }

  // A title nobody chose: new CVs ("Nieuw cv"), also from before titleAuto existed.
  function hasAutoTitle(resume) {
    return resume.titleAuto === true || (resume.titleAuto === undefined && resume.title === DEFAULT_TITLE);
  }

  // After an edit: update "last edited", the template name on the card, and
  // an automatic title once the CV has a name.
  function touchResume(id, templateName, personName) {
    var resumes = loadResumes();
    resumes.forEach(function (resume) {
      if (String(resume.id) !== String(id)) return;
      resume.updatedAt = Date.now();
      if (templateName) resume.template = templateName + " template";
      if (hasAutoTitle(resume)) {
        var name = (personName || "").trim();
        resume.title = name ? name + " - cv" : DEFAULT_TITLE;
        resume.titleAuto = true;
      }
    });
    saveResumes(resumes);
  }

  // "Rename" on My resumes: from now on the title stays as chosen.
  function renameResume(id, title) {
    var resumes = loadResumes();
    resumes.forEach(function (resume) {
      if (String(resume.id) !== String(id)) return;
      resume.title = title;
      resume.titleAuto = false;
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

  /* ------------------------------------------------------------------------
     Online: signed-in users keep their CVs in their account (api/cvs.php),
     guests in this browser (the functions above). The functions below pick
     the right place themselves and always return a Promise, so the pages
     work the same for both.
     ------------------------------------------------------------------------ */

  var API = "api/cvs.php";
  var modePromise = null;
  var movedCount = 0;

  // "account" or "local". Needs js/account.js (window.FolioAccount) on the page.
  function mode() {
    if (!modePromise) {
      var ready = window.FolioAccount ? window.FolioAccount.ready : Promise.reject(new Error("No account script"));
      modePromise = ready
        .then(function (user) {
          return user ? "account" : "local";
        }, function () {
          return "local"; // no server (python http.server): this browser only
        })
        .then(function (where) {
          if (where !== "account") return where;
          return moveLocalToAccount().then(function () {
            return where;
          });
        });
    }
    return modePromise;
  }

  // One request to api/cvs.php. Rejects with the server's message; error.status
  // is the HTTP status (401 = signed out, 404 = no such CV).
  function request(method, query, body, keepalive) {
    var options = {
      method: method,
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      keepalive: Boolean(keepalive)
    };
    if (body) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
    return fetch(API + (query || ""), options).then(function (response) {
      return response
        .json()
        .catch(function () {
          return {};
        })
        .then(function (data) {
          if (response.ok) return data;
          var error = new Error(data.message || "Saving online did not work.");
          error.status = response.status;
          throw error;
        });
    });
  }

  function templateName(id) {
    var template = (window.FOLIO_TEMPLATES || []).filter(function (item) {
      return item.id === id;
    })[0];
    return (template ? template.name : "Modern") + " template";
  }

  // A CV from the server, in the same shape as the list in this browser.
  function fromServer(cv) {
    return {
      id: cv.id,
      title: cv.title,
      titleAuto: cv.titleAuto,
      template: templateName(cv.template),
      updatedAt: cv.updatedAt,
      type: "existing"
    };
  }

  // After signing in, CVs made as a guest move into the account, so nothing
  // is lost. Only CVs with saved content move (not the untouched example).
  function moveLocalToAccount() {
    var local = readJson(RESUMES_KEY);
    if (!Array.isArray(local)) return Promise.resolve();

    var left = [];
    return local
      .reduce(function (previous, resume) {
        return previous.then(function () {
          var content = resume && resume.type === "existing" ? readJson(CV_PREFIX + resume.id) : null;
          if (!content) return;
          return request("POST", "", {
            template: content.template,
            title: hasAutoTitle(resume) ? "" : resume.title,
            content: content
          }).then(function () {
            movedCount += 1;
            window.localStorage.removeItem(CV_PREFIX + resume.id);
          }, function () {
            left.push(resume); // try again next time
          });
        });
      }, Promise.resolve())
      .then(function () {
        if (left.length) writeJson(RESUMES_KEY, left);
        else if (movedCount) window.localStorage.removeItem(RESUMES_KEY);
      });
  }

  // Old saves could hold an empty list where an object belongs.
  function cleanContent(content) {
    if (content && (!content.sections || Array.isArray(content.sections))) content.sections = {};
    return content;
  }

  var online = {
    mode: mode,

    // How many guest CVs just moved into the account (for a message on My resumes).
    movedCount: function () {
      return movedCount;
    },

    list: function () {
      return mode().then(function (where) {
        if (where === "local") return loadResumes();
        return request("GET").then(function (data) {
          return data.cvs.map(fromServer);
        });
      });
    },

    // The content of one CV, or null when it doesn't exist.
    load: function (id) {
      return mode().then(function (where) {
        if (where === "local") return findResume(id) ? cleanContent(loadCv(id)) : null;
        return request("GET", "?id=" + encodeURIComponent(id)).then(function (data) {
          return cleanContent(data.cv.content);
        }, function (error) {
          if (error.status === 404) return null;
          throw error;
        });
      });
    },

    // A new CV; resolves with its id. Title and content are optional.
    create: function (template, title, content) {
      return mode().then(function (where) {
        if (where === "local") {
          var id = createResume(template, title);
          if (content) {
            content.template = template.id;
            saveCv(id, content);
            var personal = (content.sections && content.sections.personal) || {};
            touchResume(id, null, personal.name);
          }
          return id;
        }
        return request("POST", "", { template: template.id, title: title || "", content: content || null }).then(function (data) {
          return data.cv.id;
        });
      });
    },

    // info: { templateName, personName }. keepalive: still send it while the page closes.
    save: function (id, content, info, keepalive) {
      info = info || {};
      return mode().then(function (where) {
        if (where === "local") {
          saveCv(id, content);
          touchResume(id, info.templateName, info.personName);
          return;
        }
        return request("PATCH", "?id=" + encodeURIComponent(id), { content: content, personName: info.personName || "" }, keepalive);
      });
    },

    rename: function (id, title) {
      return mode().then(function (where) {
        if (where === "local") return renameResume(id, title);
        return request("PATCH", "?id=" + encodeURIComponent(id), { title: title });
      });
    },

    remove: function (id) {
      return mode().then(function (where) {
        if (where === "account") return request("DELETE", "?id=" + encodeURIComponent(id));
        saveResumes(loadResumes().filter(function (resume) {
          return String(resume.id) !== String(id);
        }));
        deleteCv(id);
      });
    }
  };

  // Guests: put the example CV back on My resumes.
  online.restoreExample = function () {
    return mode().then(function (where) {
      if (where !== "local") return;
      var resumes = loadResumes();
      if (!resumes.some(function (resume) { return String(resume.id) === String(EXAMPLE_RESUME.id); })) {
        resumes.push(copy(EXAMPLE_RESUME));
        saveResumes(resumes);
      }
    });
  };

  window.FolioStore = online;

  migrateLegacyDraft();
})();

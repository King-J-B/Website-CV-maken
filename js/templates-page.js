/* ==========================================================================
   Folio — "Choose a template" page

   Shows every template from js/templates-data.js as a live mini preview of
   an example CV. Storage goes through js/cv-store.js.

   - templates.html?cv=<id>  (from the editor): "Use" changes that CV's
     template, keeps its content, and goes back to that CV.
   - templates.html          (from My resumes): "Use" starts a new, empty CV
     with that template (flow v4: Choose template → Editor).
   ========================================================================== */

(function () {
  "use strict";

  var A4_WIDTH = 794;
  var A4_HEIGHT = 1123;

  var store = window.FolioStore;
  var templates = window.FOLIO_TEMPLATES;

  // A known ?cv= means "change this CV"; anything else starts a new CV.
  var cvParam = new URLSearchParams(window.location.search).get("cv");
  var cvId = cvParam && store.findResume(cvParam) ? cvParam : null;
  var isNewCv = !cvId;
  var grid = document.querySelector("[data-template-grid]");
  var errorBox = document.querySelector("[data-error]");

  // Example CV (same classes as the editor preview), shared in js/templates-data.js.
  var SAMPLE_CV = window.FOLIO_SAMPLE_CV;

  /* ------------------------------------------------------------------------
     Storage
     ------------------------------------------------------------------------ */

  function currentTemplateId() {
    var content = cvId ? store.loadCv(cvId) : null;
    return content && content.template ? content.template : null;
  }

  // Returns the id of the CV the editor should open next.
  function saveTemplateChoice(template) {
    if (isNewCv) return store.createResume(template);

    // Change the template only; the CV's content stays as it is.
    var content = store.loadCv(cvId) || { version: 1, updatedAt: null, sections: {} };
    content.template = template.id;
    content.updatedAt = new Date().toISOString();
    store.saveCv(cvId, content);
    store.touchResume(cvId, template.name);
    return cvId;
  }

  /* ------------------------------------------------------------------------
     Cards
     ------------------------------------------------------------------------ */

  function el(tagName, className, text) {
    var node = document.createElement(tagName);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function card(template, isCurrent) {
    var item = el("li", "tp-card" + (isCurrent ? " is-current" : ""));

    var preview = el("div", "tp-preview");
    var stage = el("div", "tp-preview__stage");
    var page = el("article", "cv-page");
    page.dataset.template = template.id;
    page.setAttribute("aria-hidden", "true");
    page.innerHTML = SAMPLE_CV;
    stage.appendChild(page);
    preview.appendChild(stage);
    item.appendChild(preview);

    var body = el("div", "tp-card__body");
    var head = el("div", "tp-card__head");
    head.appendChild(el("h2", "tp-card__name", template.name));
    if (isCurrent) head.appendChild(el("span", "tp-badge", "Current"));
    body.appendChild(head);
    body.appendChild(el("p", "tp-card__desc", template.description));

    var best = el("p", "tp-card__best");
    best.appendChild(el("strong", "", "Best for: "));
    best.appendChild(document.createTextNode(template.bestFor));
    body.appendChild(best);

    var tags = el("ul", "tp-tags");
    tags.setAttribute("aria-label", "Style");
    template.tags.forEach(function (tag) {
      tags.appendChild(el("li", "tp-tag", tag));
    });
    body.appendChild(tags);

    var use = el("button", "tp-button tp-button--primary", "Use " + template.name);
    use.type = "button";
    use.addEventListener("click", function () {
      useTemplate(template);
    });
    body.appendChild(use);
    item.appendChild(body);

    return item;
  }

  function useTemplate(template) {
    var id;
    try {
      id = saveTemplateChoice(template);
    } catch (error) {
      errorBox.textContent = "We couldn't save your choice in this browser. Please try again.";
      errorBox.hidden = false;
      return;
    }
    // Flow v4: the editor opens at Personal details.
    window.location.href = "editor.html?cv=" + encodeURIComponent(id) + "&section=personal";
  }

  // Scale an A4 preview to the width of its card.
  function fitPreview(stage) {
    var width = stage.clientWidth;
    if (!width) return;
    var scale = width / A4_WIDTH;
    stage.firstChild.style.transform = "scale(" + scale + ")";
    stage.style.height = Math.round(A4_HEIGHT * scale) + "px";
  }

  function fitPreviews() {
    document.querySelectorAll(".tp-preview__stage").forEach(fitPreview);
  }

  /* ------------------------------------------------------------------------
     Start
     ------------------------------------------------------------------------ */

  document.querySelectorAll("[data-new-only]").forEach(function (node) {
    node.hidden = !isNewCv;
  });

  var current = currentTemplateId();
  templates.forEach(function (template) {
    grid.appendChild(card(template, template.id === current));
  });

  // Watch every preview on its own: one card can change width (for example
  // when a scrollbar appears) without the grid itself changing size.
  if ("ResizeObserver" in window) {
    var observer = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        fitPreview(entry.target);
      });
    });
    document.querySelectorAll(".tp-preview__stage").forEach(function (stage) {
      observer.observe(stage);
    });
  } else {
    window.addEventListener("resize", fitPreviews);
  }
  fitPreviews();
})();

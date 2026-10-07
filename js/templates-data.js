/* ==========================================================================
   Folio — the list of CV templates, shared by the editor and the
   "Choose a template" page. The look of each template lives in
   cv-templates.css under .cv-page[data-template="<id>"].

   To add a template: add an entry here and a block in cv-templates.css.
   The first entry is the default for new CVs.
   ========================================================================== */

window.FOLIO_TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "A blue band on top, clear sections and skills as chips.",
    bestFor: "Tech, design and starters",
    tags: ["Colour", "Clean"]
  },
  {
    id: "classic",
    name: "Classic",
    description: "Serif type, a centred header and thin rules. No colour.",
    bestFor: "Law, finance and government",
    tags: ["Formal", "Serif"]
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Lots of white space, with section names in a left column.",
    bestFor: "Anyone who wants it simple",
    tags: ["Simple", "Two columns"]
  }
];

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
  },
  {
    id: "split",
    name: "Split",
    description: "A coloured header, with your skills in a tinted column on the left.",
    bestFor: "Marketing, media and creative fields",
    tags: ["Colour", "Two columns"]
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Your studies and jobs on a line with a dot for each step.",
    bestFor: "Students with internships and side jobs",
    tags: ["Colour", "Clean"]
  },
  {
    id: "concise",
    name: "Concise",
    description: "Smaller text and tight spacing, so a lot fits on one page.",
    bestFor: "Lots of experience on one page",
    tags: ["Simple", "Dense"]
  }
];

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

// Example CV used for previews (the template page and the home page). Uses the
// same classes as the editor preview, so a template looks exactly like it will
// in the editor.
window.FOLIO_SAMPLE_CV =
  '<header class="cv-page__head">' +
  '  <p class="cv-page__name">Alex Morgan</p>' +
  '  <p class="cv-page__role">UX design student</p>' +
  '  <ul class="cv-page__contact"><li>alex@example.com</li><li>+31 6 12345678</li><li>Breda</li><li>linkedin.com/in/alex-morgan</li></ul>' +
  "</header>" +
  '<section class="cv-page__section" data-cv-section="about">' +
  '  <h2 class="cv-page__heading">About me</h2>' +
  '  <p class="cv-page__about">Creative UX design student who loves turning messy problems into simple screens. Looking for a graduation internship in a product team.</p>' +
  "</section>" +
  '<section class="cv-page__section" data-cv-section="education">' +
  '  <h2 class="cv-page__heading">Education</h2>' +
  '  <div class="cv-page__entries">' +
  '    <div class="cv-entry"><div class="cv-entry__top"><p class="cv-entry__title">Bachelor Communication and Multimedia Design</p><p class="cv-entry__dates">Sep 2021 – Present</p></div><p class="cv-entry__sub">Avans University, Breda</p></div>' +
  '    <div class="cv-entry"><div class="cv-entry__top"><p class="cv-entry__title">MBO Software Development</p><p class="cv-entry__dates">Sep 2017 – Jul 2021</p></div><p class="cv-entry__sub">Curio, Breda</p></div>' +
  "  </div>" +
  "</section>" +
  '<section class="cv-page__section" data-cv-section="experience">' +
  '  <h2 class="cv-page__heading">Experience</h2>' +
  '  <div class="cv-page__entries">' +
  '    <div class="cv-entry"><div class="cv-entry__top"><p class="cv-entry__title">Junior UX designer</p><p class="cv-entry__dates">Feb 2024 – Present</p></div><p class="cv-entry__sub">Studio Kite, Eindhoven</p>' +
  '      <ul class="cv-entry__bullets"><li>Designed the new checkout flow</li><li>Ran usability tests with 12 customers</li><li>Built a component library in Figma</li></ul></div>' +
  '    <div class="cv-entry"><div class="cv-entry__top"><p class="cv-entry__title">Sales assistant</p><p class="cv-entry__dates">Jun 2019 – Aug 2023</p></div><p class="cv-entry__sub">HEMA, Breda</p>' +
  '      <p class="cv-entry__desc">Helped customers in a busy city-centre store</p></div>' +
  "  </div>" +
  "</section>" +
  '<section class="cv-page__section" data-cv-section="skills">' +
  '  <h2 class="cv-page__heading">Skills</h2>' +
  '  <ul class="cv-page__skills">' +
  '    <li class="cv-page__skill">Figma<span class="cv-page__level">Advanced</span></li>' +
  '    <li class="cv-page__skill">User research<span class="cv-page__level">Intermediate</span></li>' +
  '    <li class="cv-page__skill">HTML &amp; CSS</li>' +
  '    <li class="cv-page__skill">Teamwork</li>' +
  "  </ul>" +
  "</section>";

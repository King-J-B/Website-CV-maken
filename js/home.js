/* ==========================================================================
   Folio — home page interactions (home.html)

   - Hero: a real CV (the same templates as the editor). Type a name, pick a
     colour and a template; "Begin met dit ontwerp" starts a new CV with
     those choices (via js/cv-store.js) and opens the editor.
   - Until someone touches the demo, it slowly cycles through the templates.
   - Scroll: progress bar, sections that slide in, numbers that count up,
     "how it works" steps that light up, a sticky header with a shadow.
   - Template carousel with live mini previews.
   Everything that moves by itself stops for "reduce motion".
   ========================================================================== */

(function () {
  "use strict";

  var A4_WIDTH = 794;
  var A4_HEIGHT = 1123;
  var TEMPLATES = window.FOLIO_TEMPLATES;
  var SAMPLE_CV = window.FOLIO_SAMPLE_CV;
  var store = window.FolioStore;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Same colours as the editor's Design options (editor.js DESIGN.color).
  var COLORS = [
    { id: "", name: "Templatekleur", swatch: "#1a5ff0" },
    { id: "teal", name: "Teal", swatch: "#0f766e" },
    { id: "green", name: "Groen", swatch: "#15803d" },
    { id: "purple", name: "Paars", swatch: "#6d28d9" },
    { id: "berry", name: "Bes", swatch: "#be185d" },
    { id: "orange", name: "Oranje", swatch: "#c2410c" },
    { id: "charcoal", name: "Antraciet", swatch: "#1f2937" }
  ];

  function el(tagName, className, text) {
    var node = document.createElement(tagName);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function isEnglish() {
    var english = document.querySelector("#englishButton");
    return Boolean(english && english.classList.contains("active"));
  }

  // Scale an A4 page to the width of its box.
  function fitPage(box, page, visibleShare) {
    var width = box.clientWidth;
    if (!width) return 0;
    var scale = width / A4_WIDTH;
    box.style.height = Math.round(A4_HEIGHT * scale * (visibleShare || 1)) + "px";
    return scale;
  }

  /* ------------------------------------------------------------------------
     Hero demo
     ------------------------------------------------------------------------ */

  var heroBox = document.querySelector("[data-hero-cv]");
  var heroPage = document.querySelector("[data-hero-page]");
  var nameInput = document.querySelector("[data-try-name]");
  var colorGroup = document.querySelector("[data-try-colors]");
  var templateGroup = document.querySelector("[data-try-templates]");
  var tryForm = document.querySelector("[data-try]");
  var choice = { template: TEMPLATES[0].id, color: "" };
  var touched = false;

  heroPage.innerHTML = SAMPLE_CV;
  var heroName = heroPage.querySelector(".cv-page__name");
  var sampleName = heroName.textContent;

  function fitHero() {
    var scale = fitPage(heroBox, heroPage);
    heroPage.style.transform = "scale(" + scale + ")";
  }

  // Radio-style buttons: one checked, arrow keys move between them.
  function radioGroup(container, items, label, onPick) {
    var buttons = items.map(function (item, index) {
      var button = el("button", item.className);
      button.type = "button";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-label", label(item));
      if (item.swatch) button.style.background = item.swatch;
      if (item.text) button.textContent = item.text;
      button.addEventListener("click", function () {
        touched = true;
        onPick(item);
      });
      button.addEventListener("keydown", function (event) {
        var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        var next = buttons[(index + step + buttons.length) % buttons.length];
        next.focus();
        next.click();
      });
      container.appendChild(button);
      return button;
    });

    return function select(id) {
      buttons.forEach(function (button, index) {
        var checked = items[index].id === id;
        button.setAttribute("aria-checked", String(checked));
        button.tabIndex = checked ? 0 : -1;
      });
    };
  }

  var selectColor = radioGroup(
    colorGroup,
    COLORS.map(function (color) {
      return { id: color.id, swatch: color.swatch, name: color.name, className: "hp-swatch" };
    }),
    function (item) { return item.name; },
    function (item) { setColor(item.id); }
  );

  var selectTemplate = radioGroup(
    templateGroup,
    TEMPLATES.map(function (template) {
      return { id: template.id, text: template.name, className: "hp-chip" };
    }),
    function (item) { return item.text; },
    function (item) { setTemplate(item.id); }
  );

  function setColor(id) {
    choice.color = id;
    if (id) heroPage.dataset.color = id;
    else delete heroPage.dataset.color;
    selectColor(id);
  }

  function setTemplate(id) {
    if (choice.template === id) return;
    choice.template = id;
    selectTemplate(id);
    // A short fade so the switch is visible but not jumpy.
    heroBox.classList.add("is-switching");
    window.setTimeout(function () {
      heroPage.dataset.template = id;
      heroBox.classList.remove("is-switching");
    }, reduceMotion ? 0 : 180);
  }

  nameInput.addEventListener("input", function () {
    touched = true;
    heroName.textContent = nameInput.value.trim() || sampleName;
  });

  // Start a real CV with the choices and open the editor.
  tryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var template = TEMPLATES.filter(function (item) { return item.id === choice.template; })[0] || TEMPLATES[0];
    var name = nameInput.value.trim();
    try {
      var id = store.createResume(template, name ? name + " - cv" : undefined);
      var content = store.loadCv(id) || { version: 1, updatedAt: null, template: template.id, sections: {} };
      content.design = { color: choice.color, font: "", spacing: "" };
      if (name) content.sections.personal = { name: name };
      store.saveCv(id, content);
      window.location.href = "editor.html?cv=" + encodeURIComponent(id) + "&section=personal";
    } catch (error) {
      window.alert(isEnglish()
        ? "We couldn't start your CV in this browser. Please try again."
        : "Je cv kon niet worden gestart in deze browser. Probeer het opnieuw.");
    }
  });

  // English placeholder when the page is switched to English.
  document.addEventListener("click", function () {
    window.setTimeout(function () {
      nameInput.placeholder = isEnglish() ? "For example: Sam Jansen" : "Bijvoorbeeld: Sam de Vries";
    }, 60);
  });

  selectColor("");
  selectTemplate(choice.template);

  // Until someone uses the demo, show a new template every few seconds.
  if (!reduceMotion) {
    var cycle = window.setInterval(function () {
      if (touched || document.hidden) {
        if (touched) window.clearInterval(cycle);
        return;
      }
      var index = TEMPLATES.map(function (item) { return item.id; }).indexOf(choice.template);
      setTemplate(TEMPLATES[(index + 1) % TEMPLATES.length].id);
    }, 3200);
    ["focusin", "pointerdown"].forEach(function (type) {
      tryForm.addEventListener(type, function () { touched = true; });
    });
  }

  // A gentle 3D tilt that follows the mouse (not on touch screens).
  var tilt = document.querySelector("[data-tilt]");
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    tilt.addEventListener("pointermove", function (event) {
      var box = tilt.getBoundingClientRect();
      var x = (event.clientX - box.left) / box.width - 0.5;
      var y = (event.clientY - box.top) / box.height - 0.5;
      heroBox.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
      heroBox.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
    });
    tilt.addEventListener("pointerleave", function () {
      heroBox.style.setProperty("--ry", "0deg");
      heroBox.style.setProperty("--rx", "0deg");
    });
  }

  /* ------------------------------------------------------------------------
     Template carousel
     ------------------------------------------------------------------------ */

  var carousel = document.querySelector("[data-carousel]");
  var prevButton = document.querySelector("[data-carousel-prev]");
  var nextButton = document.querySelector("[data-carousel-next]");
  var minis = [];

  TEMPLATES.forEach(function (template) {
    var item = el("li", "hp-tpl");
    var preview = el("div", "hp-tpl__preview");
    var mini = el("div", "hp-mini");
    var page = el("article", "cv-page");
    page.dataset.template = template.id;
    page.setAttribute("aria-hidden", "true");
    page.innerHTML = SAMPLE_CV;
    mini.appendChild(page);
    preview.appendChild(mini);
    item.appendChild(preview);

    var body = el("div", "hp-tpl__body");
    body.appendChild(el("h3", "hp-tpl__name", template.name));
    var use = el("button", "hp-btn hp-btn--ghost hp-btn--small", "Kies dit template");
    use.type = "button";
    use.setAttribute("aria-label", "Kies " + template.name);
    use.addEventListener("click", function () {
      try {
        var id = store.createResume(template);
        window.location.href = "editor.html?cv=" + encodeURIComponent(id) + "&section=personal";
      } catch (error) {
        window.location.href = "templates.html";
      }
    });
    body.appendChild(use);
    item.appendChild(body);
    carousel.appendChild(item);
    minis.push({ box: mini, page: page });
  });

  // Show the top 72% of each page; hovering slides further down the CV.
  function fitMinis() {
    minis.forEach(function (mini) {
      var scale = fitPage(mini.box, mini.page, 0.72);
      mini.page.style.setProperty("--s", scale);
      mini.page.style.setProperty("--shift-to", Math.round(-A4_HEIGHT * scale * 0.28) + "px");
    });
  }

  function cardStep() {
    var card = carousel.querySelector(".hp-tpl");
    return card ? card.getBoundingClientRect().width + 20 : 300;
  }

  function updateCarouselButtons() {
    var max = carousel.scrollWidth - carousel.clientWidth - 2;
    prevButton.disabled = carousel.scrollLeft <= 2;
    nextButton.disabled = carousel.scrollLeft >= max;
  }

  prevButton.addEventListener("click", function () {
    carousel.scrollBy({ left: -cardStep(), behavior: reduceMotion ? "auto" : "smooth" });
  });
  nextButton.addEventListener("click", function () {
    carousel.scrollBy({ left: cardStep(), behavior: reduceMotion ? "auto" : "smooth" });
  });
  carousel.addEventListener("scroll", updateCarouselButtons, { passive: true });

  /* ------------------------------------------------------------------------
     Feature cards: a soft light follows the mouse
     ------------------------------------------------------------------------ */

  document.querySelectorAll(".hp-card").forEach(function (card) {
    card.addEventListener("pointermove", function (event) {
      var box = card.getBoundingClientRect();
      card.style.setProperty("--mx", event.clientX - box.left + "px");
      card.style.setProperty("--my", event.clientY - box.top + "px");
    });
  });

  /* ------------------------------------------------------------------------
     Scroll: reveal, count up, steps, progress bar, header shadow
     ------------------------------------------------------------------------ */

  function countUp(node) {
    var target = Number(node.dataset.count);
    if (reduceMotion || !target) return;
    var start = null;
    node.textContent = "0";
    function frame(time) {
      if (start === null) start = time;
      var progress = Math.min((time - start) / 900, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  var revealItems = document.querySelectorAll("[data-reveal]");

  // Items that appear together come in one after another.
  revealItems.forEach(function (item) {
    var siblings = Array.prototype.filter.call(item.parentElement.children, function (child) {
      return child.hasAttribute("data-reveal");
    });
    item.style.setProperty("--d", Math.min(siblings.indexOf(item), 5) * 90 + "ms");
  });

  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach(countUp);
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealItems.forEach(function (item) { revealer.observe(item); });

    // The step in the middle of the screen is "active".
    var steps = document.querySelectorAll("[data-step]");
    var stepper = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          steps.forEach(function (step) { step.classList.toggle("is-active", step === entry.target); });
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (step) { stepper.observe(step); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  var progressBar = document.querySelector("[data-progress]");
  var topbar = document.querySelector("[data-topbar]");
  var stepList = document.querySelector("[data-steps]");
  var ticking = false;

  function onScroll() {
    ticking = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    progressBar.style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    topbar.classList.toggle("is-scrolled", window.scrollY > 8);

    // Fill the steps rail up to the middle of the screen.
    var box = stepList.getBoundingClientRect();
    var fill = (window.innerHeight / 2 - box.top) / box.height;
    stepList.style.setProperty("--fill", Math.max(0, Math.min(1, fill)).toFixed(3));
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  /* ------------------------------------------------------------------------
     Sizes
     ------------------------------------------------------------------------ */

  function fitAll() {
    fitHero();
    fitMinis();
    updateCarouselButtons();
    onScroll();
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(fitAll).observe(document.body);
  } else {
    window.addEventListener("resize", fitAll);
  }
  fitAll();
})();

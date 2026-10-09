/* ==========================================================================
   Folio — light / dark mode on every page

   Load it as the first thing inside <body>, so the page never flashes light
   before going dark:   <body> <script src="js/theme.js"></script>

   - remembers the choice (localStorage "folio:theme"), light by default
   - every #themeButton or [data-theme-toggle] switches it
   - the Folio logo swaps to its dark version and back
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "folio:theme";
  var LOGOS = { light: "folio-logo-light.png", dark: "folio-logo-dark.png" };

  function stored() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
    } catch (error) {
      return "light";
    }
  }

  var theme = stored();

  function swapLogos() {
    var from = theme === "dark" ? LOGOS.light : LOGOS.dark;
    var to = theme === "dark" ? LOGOS.dark : LOGOS.light;
    document.querySelectorAll('img[src*="' + from + '"]').forEach(function (img) {
      img.src = img.getAttribute("src").replace(from, to);
    });
  }

  function apply() {
    // On <html> for the colours, on <body> for the styles that check it there.
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    swapLogos();

    document.querySelectorAll("#themeButton, [data-theme-toggle]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(theme === "dark"));
    });
  }

  function toggle() {
    theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Private mode: the choice lasts until the page closes.
    }
    apply();
  }

  window.FolioTheme = {
    get current() {
      return theme;
    },
    toggle: toggle
  };

  apply();

  document.addEventListener("DOMContentLoaded", function () {
    apply(); // the logos and buttons exist now
    document.querySelectorAll("#themeButton, [data-theme-toggle]").forEach(function (button) {
      button.addEventListener("click", toggle);
    });
  });
})();

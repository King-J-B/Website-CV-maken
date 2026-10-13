/* ==========================================================================
   Folio — "Share" box (shared by the editor and My resumes)

     folioShare({
       id: 7,                  // the CV's id
       title: "Sam - cv",      // shown under the heading (the user's own text)
       name: "Sam de Vries",   // optional: for the e-mail; loaded when missing
       onPdf: function () {}   // what "Download PDF" does on this page
     });

   - Download PDF: the page decides (the editor opens the print window).
   - Personal link: a switch, off at first. On = api/share.php makes a link;
     off = the link stops working for good. Anyone with the link can view
     the CV in cv.php, nobody can change it.
   - With the link on: copy it, or send it by e-mail, WhatsApp, LinkedIn or
     (phones) the phone's own share menu.
   - Guests: a link needs an account, because a guest CV only lives in this
     browser. PDF works for everyone.

   Texts are English here; js/translate.js shows them in the chosen language.
   Needs js/cv-store.js (guest or account) and js/confirm-dialog.js.
   ========================================================================== */

(function () {
  "use strict";

  var dialog = null;
  var parts = {};
  var current = null; // { id, title, name, onPdf, url }
  var copyTimer = null;

  function L(text) {
    return window.FolioLang ? window.FolioLang.t(text) : text;
  }

  function build() {
    dialog = document.createElement("dialog");
    dialog.className = "folio-share";
    dialog.setAttribute("aria-labelledby", "folio-share-title");
    dialog.innerHTML =
      '<div class="folio-share__box">' +
      '  <div class="folio-share__head">' +
      '    <div>' +
      '      <h2 class="folio-share__title" id="folio-share-title">Share your CV</h2>' +
      '      <p class="folio-share__cv" data-share-cv data-no-translate></p>' +
      "    </div>" +
      '    <button class="folio-share__close" type="button" data-share-close aria-label="Close">×</button>' +
      "  </div>" +

      '  <section class="folio-share__part">' +
      '    <div class="folio-share__row">' +
      "      <div>" +
      '        <h3 class="folio-share__label">PDF</h3>' +
      '        <p class="folio-share__text">Save your CV as a file, for example to attach it to an e-mail.</p>' +
      "      </div>" +
      '      <button class="folio-share__button" type="button" data-share-pdf>Download PDF</button>' +
      "    </div>" +
      "  </section>" +

      '  <section class="folio-share__part" data-share-account>' +
      '    <div class="folio-share__row">' +
      "      <div>" +
      '        <h3 class="folio-share__label" id="folio-share-link-label">Personal link</h3>' +
      '        <p class="folio-share__text">Anyone with the link can view your CV, including your photo, email address and phone number. They can\'t change it.</p>' +
      "      </div>" +
      '      <button class="folio-share__switch" type="button" role="switch" aria-checked="false" aria-labelledby="folio-share-link-label" data-share-switch>' +
      '        <span class="folio-share__knob" aria-hidden="true"></span>' +
      "      </button>" +
      "    </div>" +

      '    <div class="folio-share__link" data-share-link hidden>' +
      '      <label class="visually-hidden" for="folio-share-url">Your link</label>' +
      '      <input class="folio-share__url" id="folio-share-url" type="text" readonly data-share-url>' +
      '      <button class="folio-share__button folio-share__button--primary" type="button" data-share-copy>Copy link</button>' +
      "    </div>" +
      '    <p class="folio-share__note" data-share-latest hidden>Your link always shows the latest version of your CV.</p>' +

      '    <div class="folio-share__send" data-share-send hidden>' +
      '      <h3 class="folio-share__label">Send the link</h3>' +
      '      <div class="folio-share__channels">' +
      '        <a class="folio-share__channel" data-share-email>E-mail</a>' +
      '        <a class="folio-share__channel" target="_blank" rel="noopener" data-share-whatsapp>WhatsApp</a>' +
      '        <a class="folio-share__channel" target="_blank" rel="noopener" data-share-linkedin>LinkedIn</a>' +
      '        <button class="folio-share__channel" type="button" data-share-more hidden>More…</button>' +
      "      </div>" +
      "    </div>" +
      '    <p class="folio-share__note" data-share-off>Switch on your personal link to copy it or send it.</p>' +
      "  </section>" +

      '  <section class="folio-share__part" data-share-guest hidden>' +
      '    <h3 class="folio-share__label">Personal link</h3>' +
      '    <p class="folio-share__text">Create a free account to share a link to your CV. Your CV moves into your account by itself.</p>' +
      '    <div class="folio-share__guest-actions">' +
      '      <a class="folio-share__button folio-share__button--primary" href="sign-up.html">Create account</a>' +
      '      <a class="folio-share__button" href="sign-in.html">Sign in</a>' +
      "    </div>" +
      "  </section>" +

      '  <p class="folio-share__status" role="status" data-share-status></p>' +
      "</div>";
    document.body.appendChild(dialog);

    [
      "cv", "close", "pdf", "account", "switch", "link", "url", "copy", "latest",
      "send", "email", "whatsapp", "linkedin", "more", "off", "guest", "status"
    ].forEach(function (name) {
      parts[name] = dialog.querySelector("[data-share-" + name + "]");
    });

    parts.close.addEventListener("click", close);
    dialog.addEventListener("cancel", function (event) {
      event.preventDefault(); // Escape
      close();
    });
    // A click on the dimmed area outside the box closes it.
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) close();
    });

    parts.pdf.addEventListener("click", function () {
      var onPdf = current && current.onPdf;
      close();
      if (onPdf) onPdf();
    });
    parts.switch.addEventListener("click", toggleLink);
    parts.copy.addEventListener("click", copyLink);
    parts.url.addEventListener("focus", function () {
      parts.url.select();
    });
    parts.more.addEventListener("click", function () {
      navigator.share({ title: subject(), text: L("Here is my CV:"), url: current.url }).catch(function () {
        // Closed the phone's menu: nothing to do.
      });
    });
  }

  function close() {
    if (dialog && dialog.open) dialog.close();
    current = null;
  }

  function say(message) {
    parts.status.textContent = message ? L(message) : "";
  }

  // The API call: GET to read, POST to switch. Resolves with { shared, url }.
  function request(method, body) {
    return fetch("api/share.php?id=" + encodeURIComponent(current.id), {
      method: method,
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json", Accept: "application/json" } : { Accept: "application/json" },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (response) {
      return response.json().catch(function () {
        return {};
      }).then(function (data) {
        if (!response.ok) throw new Error(data.message || "");
        return data;
      });
    });
  }

  function subject() {
    return L("My CV") + (current.name ? " – " + current.name : "");
  }

  // Show the switch and the link as they are now.
  function show(state) {
    current.url = state.url || null;
    var on = Boolean(state.shared && state.url);
    parts.switch.setAttribute("aria-checked", String(on));
    parts.link.hidden = !on;
    parts.latest.hidden = !on;
    parts.send.hidden = !on;
    parts.off.hidden = on;
    if (!on) return;

    parts.url.value = state.url;
    var email = L("Hi,") + "\n\n" + L("Here is my CV:") + "\n" + state.url + "\n\n" + L("Kind regards,") + (current.name ? "\n" + current.name : "");
    parts.email.href = "mailto:?subject=" + encodeURIComponent(subject()) + "&body=" + encodeURIComponent(email);
    parts.whatsapp.href = "https://wa.me/?text=" + encodeURIComponent(L("Here is my CV:") + " " + state.url);
    parts.linkedin.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(state.url);
  }

  function toggleLink() {
    var turnOn = parts.switch.getAttribute("aria-checked") !== "true";
    var ask = turnOn
      ? Promise.resolve(true)
      : window.folioConfirm({
        title: L("Switch off your link?"),
        message: L("People who already have the link can no longer see your CV. If you switch it on again, you get a new link."),
        confirmLabel: L("Switch off"),
        cancelLabel: L("Cancel")
      });

    ask.then(function (go) {
      if (!go || !current) return;
      parts.switch.disabled = true;
      say("");
      request("POST", { shared: turnOn }).then(function (state) {
        show(state);
        say(turnOn ? "Your link is on." : "Your link is off. The old link no longer works.");
      }, function () {
        say("That didn't work. Please try again.");
      }).finally(function () {
        parts.switch.disabled = false;
      });
    });
  }

  function copyLink() {
    var done = function () {
      parts.copy.textContent = L("Copied");
      say("Link copied");
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(function () {
        parts.copy.textContent = L("Copy link");
      }, 2000);
    };
    // Older browsers (and http pages) have no clipboard API: copy the selected text.
    var fallback = function () {
      parts.url.select();
      try {
        if (document.execCommand("copy")) return done();
      } catch (error) {
        // Not allowed: the link stays selected, so the user can copy it.
      }
      say("Copy the selected link with Ctrl+C (or ⌘+C).");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(current.url).then(done, fallback);
    } else {
      fallback();
    }
  }

  function folioShare(options) {
    if (typeof window.HTMLDialogElement !== "function") return;
    if (!dialog) build();

    current = { id: options.id, title: options.title || "", name: options.name || "", onPdf: options.onPdf };
    parts.cv.textContent = current.title;
    parts.cv.hidden = !current.title;
    parts.more.hidden = typeof navigator.share !== "function";
    parts.copy.textContent = L("Copy link");
    show({ shared: false });
    say("");

    // Until we know: account or guest, link on or off.
    parts.account.hidden = true;
    parts.guest.hidden = true;
    if (!dialog.open) dialog.showModal();
    parts.close.focus();

    var opened = current;
    window.FolioStore.mode().then(function (where) {
      if (current !== opened) return;
      if (where !== "account") {
        parts.guest.hidden = false;
        return;
      }
      parts.account.hidden = false;
      parts.switch.disabled = true;
      request("GET").then(function (state) {
        if (current === opened) show(state);
      }, function () {
        if (current === opened) say("Your link could not be loaded. Please try again.");
      }).finally(function () {
        parts.switch.disabled = false;
      });

      // The name for the e-mail, from the CV itself.
      if (!opened.name) {
        window.FolioStore.load(opened.id).then(function (content) {
          var personal = (content && content.sections && content.sections.personal) || {};
          opened.name = (personal.name || "").trim();
          if (current === opened && opened.url) show({ shared: true, url: opened.url });
        }, function () {});
      }
    });
  }

  window.folioShare = folioShare;
})();
